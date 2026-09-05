// DynamoDB AI Recommendation Repository
import {
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { docClient, TABLE_NAME } from '../../config/dynamoClient.js';
import { generateId, paginateArray } from './dynamoUtils.js';

export class AIRepository {
  async saveRecommendation(data) {
    const id = data.id || generateId('rec');
    const now = new Date().toISOString();

    const item = {
      PK: `AI_RECOMMENDATION#${id}`,
      SK: 'METADATA',
      GSI1PK: `USER#${data.userId || 'ANONYMOUS'}`,
      GSI1SK: `REC#${now}`,
      id,
      userId: data.userId || null,
      occasionId: data.occasionId || null,
      guestCount: data.guestCount,
      budgetPerHead: data.budgetPerHead,
      dietaryType: data.dietaryType || 'ALL',
      spiceLevel: data.spiceLevel || 'MEDIUM',
      allergies: data.allergies || [],
      provider: data.provider || 'fallback',
      model: data.model || null,
      promptSent: data.promptSent || null,
      rawResponse: data.rawResponse || null,
      isFallback: data.isFallback === true,
      status: data.status || 'completed',
      durationMs: data.durationMs || 0,
      packages: data.packages || [],
      items: data.items || [],
      createdAt: now,
    };

    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    }));

    return item;
  }

  async findById(id) {
    if (!id) return null;
    const res = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `AI_RECOMMENDATION#${id}`,
        SK: 'METADATA',
      },
    }));
    return res.Item || null;
  }

  async listLogs({ page = 1, limit = 20 } = {}) {
    const res = await docClient.send(new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'SK = :metadataSK AND begins_with(PK, :recPrefix)',
      ExpressionAttributeValues: {
        ':metadataSK': 'METADATA',
        ':recPrefix': 'AI_RECOMMENDATION#',
      },
    }));

    const items = res.Items || [];
    items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    const paginated = paginateArray(items, page, limit);
    return {
      logs: paginated.items,
      total: paginated.total,
      page: paginated.page,
      totalPages: paginated.totalPages,
    };
  }

  async count() {
    const list = await this.listLogs({ limit: 10000 });
    return list.total;
  }
}

export const aiRepository = new AIRepository();
