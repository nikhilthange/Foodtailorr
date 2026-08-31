// Deterministic fallback — generates menu recommendations without any AI model
// Enhanced version of the original aiMenuGenerator.js, operating on database dishes

/**
 * Generate deterministic menu recommendations from candidate dishes
 * Used when AI provider is unavailable or explicitly set to fallback
 */
export function generateFallbackRecommendations(context, candidates) {
  const { guestCount, budgetPerHead, dietaryType, spiceLevel } = context;

  // Group candidates by category
  const categorized = {};
  for (const dish of candidates) {
    if (!categorized[dish.category]) categorized[dish.category] = [];
    categorized[dish.category].push(dish);
  }

  const categoryOrder = ['Biryani', 'Starter', 'Main Course', 'Dessert', 'Beverage'];

  const packages = [
    buildDeterministicPackage('Curated Signature', candidates, categorized, categoryOrder, {
      guestCount, budgetPerHead, strategy: 'balanced', targetDishCount: 5,
    }),
    buildDeterministicPackage('Royal Feast', candidates, categorized, categoryOrder, {
      guestCount, budgetPerHead, strategy: 'premium', targetDishCount: 7,
    }),
    buildDeterministicPackage('Artisanal Express', candidates, categorized, categoryOrder, {
      guestCount, budgetPerHead, strategy: 'value', targetDishCount: 4,
    }),
  ];

  return { packages };
}

function buildDeterministicPackage(name, allDishes, categorized, categoryOrder, opts) {
  const { guestCount, budgetPerHead, strategy, targetDishCount } = opts;
  const priceMultiplier = strategy === 'premium' ? 1.3 : strategy === 'value' ? 0.75 : 1.0;
  const targetPerHead = budgetPerHead * priceMultiplier;

  const selected = [];
  const usedPartnerIds = new Set();
  let runningCost = 0;

  // Strategy: pick from each category in order, prioritizing partner variety
  for (const category of categoryOrder) {
    if (selected.length >= targetDishCount) break;
    const categoryDishes = categorized[category] || [];
    if (categoryDishes.length === 0) continue;

    // Sort by price fit for the strategy
    const sorted = [...categoryDishes].sort((a, b) => {
      const aFit = Math.abs(a.pricePerHead - targetPerHead * 0.25);
      const bFit = Math.abs(b.pricePerHead - targetPerHead * 0.25);
      // Prefer unused partners for variety
      const aPartnerBonus = usedPartnerIds.has(a.partnerId) ? 100 : 0;
      const bPartnerBonus = usedPartnerIds.has(b.partnerId) ? 100 : 0;
      return (aFit + aPartnerBonus) - (bFit + bPartnerBonus);
    });

    // Pick the best fit
    const pick = strategy === 'premium'
      ? sorted.reduce((best, d) => d.pricePerHead > best.pricePerHead ? d : best, sorted[0])
      : sorted[0];

    if (pick && !selected.find(s => s.dishId === pick.id)) {
      selected.push({
        dishId: pick.id,
        quantity: guestCount,
        reason: getSelectionReason(pick, category, strategy),
      });
      usedPartnerIds.add(pick.partnerId);
      runningCost += pick.pricePerHead;
    }

    // For premium, try to add a second dish from this category
    if (strategy === 'premium' && selected.length < targetDishCount && categoryDishes.length > 1) {
      const second = sorted.find(d => !selected.find(s => s.dishId === d.id));
      if (second) {
        selected.push({
          dishId: second.id,
          quantity: guestCount,
          reason: getSelectionReason(second, category, strategy),
        });
        usedPartnerIds.add(second.partnerId);
        runningCost += second.pricePerHead;
      }
    }
  }

  // Fill remaining slots with best-fit dishes from any category
  if (selected.length < targetDishCount) {
    const remaining = allDishes
      .filter(d => !selected.find(s => s.dishId === d.id))
      .sort((a, b) => Math.abs(a.pricePerHead - targetPerHead * 0.2) - Math.abs(b.pricePerHead - targetPerHead * 0.2));

    for (const dish of remaining) {
      if (selected.length >= targetDishCount) break;
      selected.push({
        dishId: dish.id,
        quantity: guestCount,
        reason: `Complements the menu with ${dish.category.toLowerCase()} variety`,
      });
      runningCost += dish.pricePerHead;
    }
  }

  const budgetMatch = 1 - Math.abs(runningCost - budgetPerHead) / budgetPerHead;
  const fitScore = Math.max(65, Math.min(98, Math.round((budgetMatch + 0.1) * 100)));

  const descriptions = {
    'Curated Signature': 'A balanced selection of signature dishes from across Hyderabad\'s finest kitchens — the perfect mix of heritage and flavor.',
    'Royal Feast': 'Premium picks for a grand occasion — heritage biryanis, royal specialties, and indulgent desserts.',
    'Artisanal Express': 'Smart, crowd-pleasing picks that deliver maximum flavor within a focused budget.',
  };

  return {
    name,
    description: descriptions[name] || 'A curated menu for your occasion',
    items: selected,
    estimatedPerHead: runningCost,
    fitScore,
    notes: strategy === 'value'
      ? ['Budget-optimized selection', 'Great value without compromising on quality']
      : strategy === 'premium'
        ? ['Premium selection with royal specialties', 'Includes signature dishes from heritage brands']
        : ['Balanced blend of flavors and cuisines'],
  };
}

function getSelectionReason(dish, category, strategy) {
  const reasons = {
    Biryani: {
      premium: `${dish.partnerName}'s premium ${dish.isVeg ? 'vegetarian' : ''} biryani — a showstopper for your feast`,
      balanced: `Authentic ${dish.partnerName} biryani — the heart of any Hyderabadi celebration`,
      value: `${dish.partnerName}'s popular biryani — crowd-pleasing at great value`,
    },
    Starter: {
      premium: `${dish.partnerName}'s signature starter to begin the feast in style`,
      balanced: `Crisp, flavorful starter from ${dish.partnerName}`,
      value: `Popular starter that gets the meal started right`,
    },
    'Main Course': {
      premium: `Royal main course from ${dish.partnerName} — rich and aromatic`,
      balanced: `Beloved ${dish.partnerName} specialty — authentic and satisfying`,
      value: `Hearty main from ${dish.partnerName} — delivers great flavor`,
    },
    Dessert: {
      premium: `Luxurious dessert from ${dish.partnerName} — a grand finale`,
      balanced: `Sweet finish from ${dish.partnerName}`,
      value: `Sweet treat to round off the meal`,
    },
    Beverage: {
      premium: `Signature beverage from ${dish.partnerName}`,
      balanced: `Refreshing ${dish.partnerName} beverage`,
      value: `Essential beverage pairing`,
    },
  };

  return reasons[category]?.[strategy] || `Selected from ${dish.partnerName} for your occasion`;
}
