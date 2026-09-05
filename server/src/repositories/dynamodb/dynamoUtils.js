// DynamoDB Utility Helpers for Single-Table Design
import crypto from 'crypto';

export function generateId(prefix = '') {
  const uuid = crypto.randomUUID();
  return prefix ? `${prefix}_${uuid}` : uuid;
}

/**
 * Builds DynamoDB UpdateExpression, ExpressionAttributeNames, and ExpressionAttributeValues
 * from an updates object.
 */
export function buildUpdateExpression(updates, reservedWords = ['status', 'name', 'role', 'year', 'date', 'value']) {
  const setClauses = [];
  const removeClauses = [];
  const ExpressionAttributeNames = {};
  const ExpressionAttributeValues = {};

  for (const [key, val] of Object.entries(updates)) {
    if (key === 'PK' || key === 'SK' || key === 'id') continue;

    const isReserved = reservedWords.includes(key.toLowerCase()) || key.startsWith('#');
    const attrName = isReserved ? `#k_${key}` : `#${key}`;
    const attrVal = `:v_${key}`;

    if (val === undefined) {
      continue;
    } else if (val === null) {
      removeClauses.push(attrName);
      ExpressionAttributeNames[attrName] = key;
    } else {
      setClauses.push(`${attrName} = ${attrVal}`);
      ExpressionAttributeNames[attrName] = key;
      ExpressionAttributeValues[attrVal] = val;
    }
  }

  // Always update updatedAt if not specified
  if (!updates.updatedAt) {
    const attrName = '#updatedAt';
    const attrVal = ':updatedAt';
    setClauses.push(`${attrName} = ${attrVal}`);
    ExpressionAttributeNames[attrName] = 'updatedAt';
    ExpressionAttributeValues[attrVal] = new Date().toISOString();
  }

  let UpdateExpression = '';
  if (setClauses.length > 0) {
    UpdateExpression += `SET ${setClauses.join(', ')}`;
  }
  if (removeClauses.length > 0) {
    UpdateExpression += ` ${UpdateExpression ? ' ' : ''}REMOVE ${removeClauses.join(', ')}`;
  }

  return {
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues: Object.keys(ExpressionAttributeValues).length > 0 ? ExpressionAttributeValues : undefined,
  };
}

/**
 * Helper to paginate array results in-memory when DynamoDB Scan/Query returns filtered lists
 */
export function paginateArray(items, page = 1, limit = 20) {
  const p = Math.max(1, parseInt(page, 10));
  const l = Math.max(1, parseInt(limit, 10));
  const total = items.length;
  const start = (p - 1) * l;
  const paginated = items.slice(start, start + l);

  return {
    items: paginated,
    total,
    page: p,
    limit: l,
    totalPages: Math.ceil(total / l),
  };
}
