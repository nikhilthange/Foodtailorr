// DynamoDB Metadata Repositories (Occasions, Categories, Cuisines)
import {
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { docClient, TABLE_NAME } from '../../config/dynamoClient.js';
import { generateId, buildUpdateExpression } from './dynamoUtils.js';

export class OccasionRepository {
  async listAll() {
    const res = await docClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': 'OCCASION',
      },
    }));
    const items = res.Items || [];
    items.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    return items;
  }

  async findById(id) {
    if (!id) return null;
    const res = await docClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'GSI2',
      KeyConditionExpression: 'GSI2PK = :oKey',
      ExpressionAttributeValues: {
        ':oKey': `OCCASION#${id}`,
      },
      Limit: 1,
    }));
    return res.Items?.[0] || null;
  }

  async findBySlug(slug) {
    if (!slug) return null;
    const res = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: 'OCCASION',
        SK: `SLUG#${slug}`,
      },
    }));
    return res.Item || null;
  }

  async create(data) {
    const id = data.id || generateId('occ');
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const item = {
      PK: 'OCCASION',
      SK: `SLUG#${slug}`,
      GSI2PK: `OCCASION#${id}`,
      GSI2SK: 'METADATA',
      id,
      slug,
      name: data.name,
      tagline: data.tagline || '',
      description: data.description || '',
      bannerUrl: data.bannerUrl || null,
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdAt: new Date().toISOString(),
    };

    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    }));
    return item;
  }

  async update(id, updates) {
    const existing = await this.findById(id);
    if (!existing) return null;

    const expr = buildUpdateExpression(updates);
    const res = await docClient.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: 'OCCASION',
        SK: existing.SK,
      },
      ...expr,
      ReturnValues: 'ALL_NEW',
    }));
    return res.Attributes;
  }
}

export class CategoryRepository {
  async listAll() {
    const res = await docClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': 'CATEGORY',
      },
    }));
    const items = res.Items || [];
    items.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    return items;
  }

  async findById(id) {
    if (!id) return null;
    const res = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: 'CATEGORY',
        SK: `ID#${id}`,
      },
    }));
    return res.Item || null;
  }

  async create(data) {
    const id = data.id || generateId('cat');
    const item = {
      PK: 'CATEGORY',
      SK: `ID#${id}`,
      id,
      name: data.name,
      sortOrder: data.sortOrder ?? 0,
      iconUrl: data.iconUrl || null,
      createdAt: new Date().toISOString(),
    };

    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    }));
    return item;
  }

  async update(id, updates) {
    const expr = buildUpdateExpression(updates);
    const res = await docClient.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: 'CATEGORY',
        SK: `ID#${id}`,
      },
      ...expr,
      ReturnValues: 'ALL_NEW',
    }));
    return res.Attributes;
  }

  async delete(id) {
    await docClient.send(new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: 'CATEGORY',
        SK: `ID#${id}`,
      },
    }));
  }
}

export class CuisineRepository {
  async listAll() {
    const res = await docClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': 'CUISINE',
      },
    }));
    const items = res.Items || [];
    items.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    return items;
  }

  async create(data) {
    const id = data.id || generateId('csn');
    const item = {
      PK: 'CUISINE',
      SK: `ID#${id}`,
      id,
      name: data.name,
      description: data.description || '',
      createdAt: new Date().toISOString(),
    };

    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    }));
    return item;
  }
}

export const occasionRepository = new OccasionRepository();
export const categoryRepository = new CategoryRepository();
export const cuisineRepository = new CuisineRepository();
