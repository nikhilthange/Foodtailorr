// DynamoDB Audit Repository
import {
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { docClient, TABLE_NAME } from '../../config/dynamoClient.js';
import { generateId, paginateArray } from './dynamoUtils.js';

export class AuditRepository {
  async recordEvent({ eventType, entityType, entityId, actorId, actorRole, payload, ipAddress }) {
    const id = generateId('aud');
    const now = new Date().toISOString();

    const item = {
      PK: 'AUDIT',
      SK: `TIMESTAMP#${now}#${id}`,
      GSI1PK: `ENTITY#${entityType}#${entityId}`,
      GSI1SK: `TIMESTAMP#${now}`,
      id,
      eventType,
      entityType,
      entityId,
      actorId: actorId || null,
      actorRole: actorRole || null,
      payload: payload || {},
      ipAddress: ipAddress || null,
      timestamp: now,
    };

    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    }));

    return item;
  }

  async listEvents({ page = 1, limit = 50, entityType, entityId } = {}) {
    let items = [];

    if (entityType && entityId) {
      const res = await docClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :eKey',
        ExpressionAttributeValues: {
          ':eKey': `ENTITY#${entityType}#${entityId}`,
        },
        ScanIndexForward: false,
      }));
      items = res.Items || [];
    } else {
      const res = await docClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: {
          ':pk': 'AUDIT',
        },
        ScanIndexForward: false,
      }));
      items = res.Items || [];
    }

    const paginated = paginateArray(items, page, limit);
    return {
      events: paginated.items,
      total: paginated.total,
      page: paginated.page,
      totalPages: paginated.totalPages,
    };
  }
}

export const auditRepository = new AuditRepository();
