// AI Recommendation Pipeline — 10-step process using DynamoDB Repositories
import {
  dishRepository,
  partnerRepository,
  categoryRepository,
  occasionRepository,
  aiRepository,
} from '../repositories/dynamodb/index.js';
import { getAIProvider } from './providers.js';
import { generateFallbackRecommendations } from './fallback.js';
import { SYSTEM_PROMPT, buildUserPrompt } from './prompts.js';
import { parseAndValidateAIOutput, verifyDishIds } from './validator.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

const MAX_RETRIES = 2;
const AI_TIMEOUT = 30000;

/**
 * Main recommendation pipeline.
 */
export async function generateRecommendation(context, userId = null) {
  const startTime = Date.now();
  let provider = null;
  let isFallback = false;
  let rawResponse = null;
  let promptSent = null;

  try {
    // STEP 2: Query eligible dishes from DynamoDB
    const [catalogResult, partnersResult, categories] = await Promise.all([
      dishRepository.listCatalog({ availableOnly: true, limit: 1000 }),
      partnerRepository.listApproved({ limit: 1000 }),
      categoryRepository.listAll(),
    ]);

    const partnerMap = new Map(partnersResult.partners.map(p => [p.id, p]));
    const categoryMap = new Map(categories.map(c => [c.id, c]));

    // STEP 3: Apply deterministic filters BEFORE calling LLM
    let eligibleDishes = catalogResult.dishes.filter(d => {
      const p = partnerMap.get(d.partnerId);
      if (!p || p.isActive === false || p.isApproved === false) return false;

      // Dietary filter
      if ((context.dietaryType === 'VEG' || context.dietaryType === 'VEGAN') && !d.isVeg) {
        return false;
      }

      // Allergy exclusion
      if (context.allergies && context.allergies.length > 0 && Array.isArray(d.allergens)) {
        const hasAllergy = context.allergies.some(a => d.allergens.includes(a));
        if (hasAllergy) return false;
      }

      // Budget range filter (allow 50% above budget for premium options)
      if (context.budgetPerHead && d.pricePerHead > Math.round(context.budgetPerHead * 1.5)) {
        return false;
      }

      return true;
    });

    if (eligibleDishes.length === 0) {
      throw new Error('No eligible dishes found matching your criteria');
    }

    // STEP 4: Build compact candidate catalog
    const candidates = eligibleDishes.map(d => {
      const p = partnerMap.get(d.partnerId);
      const c = categoryMap.get(d.categoryId);
      return {
        id: d.id,
        name: d.name,
        category: c?.name || 'General',
        description: d.description || '',
        pricePerHead: d.pricePerHead,
        isVeg: d.isVeg,
        isSignature: d.isSignature,
        spiceLevel: d.spiceLevel,
        allergens: d.allergens || [],
        tags: d.tags || [],
        partnerId: p.id,
        partnerName: p.businessName,
        cuisine: p.cuisine,
      };
    });

    const candidateMap = new Map(candidates.map(c => [c.id, c]));

    // STEP 5-8: Try AI provider, fall back to deterministic
    let aiOutput = null;
    provider = getAIProvider();

    if (provider && env.AI_PROVIDER !== 'fallback') {
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          promptSent = buildUserPrompt(context, candidates);
          rawResponse = await provider.generate(SYSTEM_PROMPT, promptSent, {
            timeout: AI_TIMEOUT,
            temperature: 0.3,
            maxTokens: 2000,
          });

          // STEP 6-7: Parse and validate
          const parseResult = parseAndValidateAIOutput(rawResponse);
          if (!parseResult.success) {
            logger.warn('AI output validation failed', { error: parseResult.error, attempt });
            if (attempt === MAX_RETRIES) break;
            continue;
          }

          // STEP 8: Verify dish IDs
          const verification = verifyDishIds(parseResult.data, candidateMap);
          if (!verification.valid) {
            logger.warn('AI returned invalid dish IDs', { invalidIds: verification.invalidIds, attempt });
            for (const pkg of parseResult.data.packages) {
              pkg.items = pkg.items.filter(item => candidateMap.has(item.dishId));
            }
            if (parseResult.data.packages.some(p => p.items.length === 0)) {
              if (attempt === MAX_RETRIES) break;
              continue;
            }
          }

          aiOutput = parseResult.data;
          break;
        } catch (err) {
          logger.warn(`AI provider attempt ${attempt + 1} failed`, { error: err.message });
          if (attempt === MAX_RETRIES) break;
        }
      }
    }

    // Use fallback if AI failed or was not configured
    if (!aiOutput) {
      isFallback = true;
      logger.info('Using deterministic fallback for menu recommendation');
      aiOutput = generateFallbackRecommendations(context, candidates);
    }

    // STEP 9: Recalculate pricing server-side — NEVER trust AI/fallback prices
    const enrichedPackages = aiOutput.packages.map(pkg => {
      let totalPerHead = 0;
      const enrichedItems = pkg.items
        .map(item => {
          const dish = candidateMap.get(item.dishId);
          if (!dish) return null;
          totalPerHead += dish.pricePerHead;
          return {
            dishId: dish.id,
            name: dish.name,
            description: dish.description,
            category: dish.category,
            pricePerHead: dish.pricePerHead, // Server-authoritative price
            isVeg: dish.isVeg,
            isSignature: dish.isSignature,
            spiceLevel: dish.spiceLevel,
            partnerId: dish.partnerId,
            partnerName: dish.partnerName,
            quantity: item.quantity || context.guestCount,
            reason: item.reason || '',
          };
        })
        .filter(Boolean);

      const brandCount = new Set(enrichedItems.map(i => i.partnerId)).size;
      const totalEstimate = totalPerHead * context.guestCount;
      const budgetMatch = 1 - Math.abs(totalPerHead - context.budgetPerHead) / context.budgetPerHead;
      const confidence = Math.max(65, Math.min(98, Math.round((budgetMatch + 0.15) * 100)));

      return {
        name: pkg.name,
        description: pkg.description,
        items: enrichedItems,
        perHead: totalPerHead,
        totalEstimate,
        brandCount,
        confidence: pkg.fitScore || confidence,
        guestCount: context.guestCount,
        notes: pkg.notes || [],
      };
    });

    // STEP 10: Persist recommendation in DynamoDB
    const durationMs = Date.now() - startTime;
    let recommendation = null;
    try {
      let occasionId = context.occasionId || null;
      if (!occasionId && context.occasionName) {
        const occasions = await occasionRepository.listAll();
        const found = occasions.find(o => o.name.toLowerCase().includes(context.occasionName.toLowerCase()));
        if (found) occasionId = found.id;
      }

      recommendation = await aiRepository.saveRecommendation({
        userId,
        occasionId,
        guestCount: context.guestCount,
        budgetPerHead: context.budgetPerHead,
        dietaryType: context.dietaryType || 'ALL',
        spiceLevel: context.spiceLevel || 'MEDIUM',
        allergies: context.allergies || [],
        provider: isFallback ? 'fallback' : (provider?.name || 'fallback'),
        model: isFallback ? null : (env.AI_MODEL_PRIMARY || null),
        promptSent: promptSent ? promptSent.substring(0, 5000) : null,
        rawResponse: rawResponse ? rawResponse.substring(0, 10000) : null,
        isFallback,
        status: 'completed',
        durationMs,
        packages: enrichedPackages,
        items: enrichedPackages.flatMap(pkg =>
          pkg.items.map(item => ({
            dishId: item.dishId,
            quantity: item.quantity,
            reason: item.reason,
            packageName: pkg.name,
          }))
        ),
      });
    } catch (err) {
      logger.warn('Failed to persist AI recommendation', { error: err.message });
    }

    return {
      recommendationId: recommendation?.id || null,
      packages: enrichedPackages,
      meta: {
        provider: isFallback ? 'fallback' : (provider?.name || 'fallback'),
        isFallback,
        durationMs,
        candidateCount: candidates.length,
      },
    };
  } catch (err) {
    logger.error('Recommendation pipeline failed', { error: err.message });
    throw err;
  }
}

/**
 * Get a saved recommendation by ID
 */
export async function getRecommendationById(recommendationId) {
  return aiRepository.findById(recommendationId);
}
