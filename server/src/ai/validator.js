// AI output validation using Zod
import { z } from 'zod';

const aiDishItemSchema = z.object({
  dishId: z.string(),
  quantity: z.number().int().min(1),
  reason: z.string().optional().default(''),
});

const aiPackageSchema = z.object({
  name: z.string(),
  description: z.string().optional().default(''),
  items: z.array(aiDishItemSchema).min(1),
  estimatedPerHead: z.number().optional().default(0),
  fitScore: z.number().optional().default(80),
  notes: z.array(z.string()).optional().default([]),
});

export const aiOutputSchema = z.object({
  packages: z.array(aiPackageSchema).min(1).max(5),
});

/**
 * Parse and validate AI response JSON
 * @param {string} rawResponse - Raw text from AI model
 * @returns {{ success: boolean, data?: object, error?: string }}
 */
export function parseAndValidateAIOutput(rawResponse) {
  try {
    // Try to extract JSON from the response (handles markdown fences, extra text)
    let jsonStr = rawResponse.trim();

    // Remove markdown code fences if present
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    // Try to find JSON object if surrounded by extra text
    const braceStart = jsonStr.indexOf('{');
    const braceEnd = jsonStr.lastIndexOf('}');
    if (braceStart !== -1 && braceEnd !== -1 && braceStart < braceEnd) {
      jsonStr = jsonStr.slice(braceStart, braceEnd + 1);
    }

    const parsed = JSON.parse(jsonStr);
    const result = aiOutputSchema.safeParse(parsed);

    if (!result.success) {
      return {
        success: false,
        error: `Schema validation failed: ${result.error.errors.map(e => e.message).join(', ')}`,
      };
    }

    return { success: true, data: result.data };
  } catch (err) {
    return {
      success: false,
      error: `JSON parse error: ${err.message}`,
    };
  }
}

/**
 * Verify all dish IDs in the AI output exist in the candidate list
 * @param {object} aiOutput - Validated AI output
 * @param {Map<string, object>} candidateMap - Map of dishId → dish
 * @returns {{ valid: boolean, invalidIds: string[] }}
 */
export function verifyDishIds(aiOutput, candidateMap) {
  const invalidIds = [];

  for (const pkg of aiOutput.packages) {
    for (const item of pkg.items) {
      if (!candidateMap.has(item.dishId)) {
        invalidIds.push(item.dishId);
      }
    }
  }

  return { valid: invalidIds.length === 0, invalidIds };
}
