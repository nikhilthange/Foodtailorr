// AI system prompt templates for menu recommendation
export const SYSTEM_PROMPT = `You are Food Tailor's AI Menu Curator. You recommend personalized event menus from REAL dishes provided in the candidate catalog. You MUST:

1. ONLY recommend dishes from the provided candidate catalog — never invent dishes.
2. Return STRICT valid JSON in the exact schema specified.
3. Consider the customer's occasion, guest count, budget, dietary needs, allergies, and spice preference.
4. Maximize variety across categories (starters, mains, biryanis, desserts, beverages) and partners.
5. Ensure the total per-head cost stays within 20% of the stated budget.
6. Provide a brief reason for each dish selection.
7. Generate 3 distinct packages: "Curated Signature" (balanced), "Royal Feast" (premium), "Artisanal Express" (value).

IMPORTANT: You are recommending for a Hyderabadi food platform. Prioritize culinary authenticity and brand variety.`;

/**
 * Build the user prompt with candidate catalog
 */
export function buildUserPrompt(context, candidates) {
  const candidateList = candidates.map(d =>
    `- ID:${d.id} | "${d.name}" | ${d.partnerName} | ${d.category} | ₹${d.pricePerHead}/head | ${d.isVeg ? 'VEG' : 'NON-VEG'} | Spice:${d.spiceLevel}`
  ).join('\n');

  return `## Customer Request
- Occasion: ${context.occasionName || 'Event'}
- Guests: ${context.guestCount}
- Budget: ₹${context.budgetPerHead} per head
- Dietary: ${context.dietaryType}
- Spice: ${context.spiceLevel}
- Allergies: ${context.allergies?.length ? context.allergies.join(', ') : 'None'}
- Notes: ${context.notes || 'None'}

## Available Dishes (ONLY use these)
${candidateList}

## Required JSON Output Schema
Return ONLY this JSON — no markdown fences, no explanation:
{
  "packages": [
    {
      "name": "Curated Signature",
      "description": "brief description",
      "items": [
        { "dishId": "uuid", "quantity": ${context.guestCount}, "reason": "why this dish" }
      ],
      "estimatedPerHead": 0,
      "fitScore": 85,
      "notes": ["optional note"]
    },
    {
      "name": "Royal Feast",
      "description": "brief description",
      "items": [...],
      "estimatedPerHead": 0,
      "fitScore": 80,
      "notes": []
    },
    {
      "name": "Artisanal Express",
      "description": "brief description",
      "items": [...],
      "estimatedPerHead": 0,
      "fitScore": 90,
      "notes": []
    }
  ]
}`;
}
