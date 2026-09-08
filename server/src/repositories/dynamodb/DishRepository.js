// DynamoDB Dish Repository
import {
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { docClient, TABLE_NAME } from '../../config/dynamoClient.js';
import { generateId, buildUpdateExpression, paginateArray } from './dynamoUtils.js';

export class DishRepository {
  /**
   * Find dish by dish ID (via GSI2 lookup)
   */
  async findById(id) {
    if (!id) return null;
    const res = await docClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'GSI2',
      KeyConditionExpression: 'GSI2PK = :dKey',
      ExpressionAttributeValues: {
        ':dKey': `DISH#${id}`,
      },
      Limit: 1,
    }));

    if (!res.Items || res.Items.length === 0) return null;
    return res.Items[0];
  }

  /**
   * Find multiple dishes by IDs
   */
  async findManyByIds(ids) {
    if (!ids || ids.length === 0) return [];
    // Perform parallel lookups or BatchGet
    const results = await Promise.all(ids.map(id => this.findById(id)));
    return results.filter(Boolean);
  }

  /**
   * Find all dishes by Partner ID
   */
  async findByPartnerId(partnerId, { availableOnly = false } = {}) {
    if (!partnerId) return [];
    const res = await docClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pKey AND begins_with(SK, :dPrefix)',
      ExpressionAttributeValues: {
        ':pKey': `PARTNER#${partnerId}`,
        ':dPrefix': 'DISH#',
      },
    }));

    let items = res.Items || [];
    if (availableOnly) {
      items = items.filter(d => d.isAvailable !== false);
    }
    return items;
  }

  /**
   * Create a new dish
   */
  async create(data) {
    const id = data.id || generateId('dsh');
    const now = new Date().toISOString();
    const isAvailable = data.isAvailable !== undefined ? data.isAvailable : true;
    const isVeg = data.isVeg === true;
    const isSignature = data.isSignature === true;

    const item = {
      PK: `PARTNER#${data.partnerId}`,
      SK: `DISH#${id}`,
      GSI1PK: 'CATALOG',
      GSI1SK: `CATEGORY#${data.categoryId || 'GENERAL'}#NAME#${data.name}`,
      GSI2PK: `DISH#${id}`,
      GSI2SK: 'METADATA',
      id,
      partnerId: data.partnerId,
      categoryId: data.categoryId || null,
      name: data.name,
      description: data.description || '',
      pricePerHead: Number(data.pricePerHead),
      isVeg,
      isSignature,
      isAvailable,
      spiceLevel: data.spiceLevel || 'MEDIUM',
      allergens: data.allergens || [],
      tags: data.tags || [],
      imageUrl: data.imageUrl || null,
      createdAt: now,
      updatedAt: now,
    };

    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    }));

    return item;
  }

  /**
   * Update a dish
   */
  async update(id, updates, partnerId = null) {
    let pId = partnerId;
    if (!pId) {
      const existing = await this.findById(id);
      if (!existing) return null;
      pId = existing.partnerId;
    }

    const updateObj = { ...updates };
    if (updateObj.name || updateObj.categoryId) {
      updateObj.GSI1SK = `CATEGORY#${updateObj.categoryId || 'GENERAL'}#NAME#${updateObj.name || 'Dish'}`;
    }

    const expr = buildUpdateExpression(updateObj);

    const res = await docClient.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `PARTNER#${pId}`,
        SK: `DISH#${id}`,
      },
      ...expr,
      ReturnValues: 'ALL_NEW',
    }));

    return res.Attributes;
  }

  /**
   * Delete a dish
   */
  async delete(id, partnerId = null) {
    let pId = partnerId;
    if (!pId) {
      const existing = await this.findById(id);
      if (!existing) return;
      pId = existing.partnerId;
    }

    await docClient.send(new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `PARTNER#${pId}`,
        SK: `DISH#${id}`,
      },
    }));
  }

  /**
   * List dishes across catalog with filtering and pagination
   */
  async listCatalog({
    page = 1,
    limit = 50,
    categoryId,
    partnerId,
    isVeg,
    search,
    minPrice,
    maxPrice,
    availableOnly = true,
  } = {}) {
    let items = [];

    if (partnerId) {
      items = await this.findByPartnerId(partnerId, { availableOnly });
    } else {
      const res = await docClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :catKey',
        ExpressionAttributeValues: {
          ':catKey': 'CATALOG',
        },
      }));
      items = res.Items || [];
    }

    const APPROVED_POSTER_BRANDS = new Set([
      'ptr_niloufer',
      'ptr_shadab',
      'ptr_samosasingh',
      'ptr_thickshake',
      'ptr_iceberg',
      'ptr_maharaja',
      'ptr_dimmy',
      'ptr_chocolateroom',
      'ptr_almondhouse',
      'ptr_manam',
      'ptr_karachi'
    ]);

    items = items.filter(d => APPROVED_POSTER_BRANDS.has(d.partnerId));

    if (availableOnly) {
      items = items.filter(d => d.isAvailable !== false);
    }
    if (categoryId) {
      items = items.filter(d => d.categoryId === categoryId);
    }
    if (isVeg !== undefined) {
      const isVegBool = isVeg === 'true' || isVeg === true;
      items = items.filter(d => d.isVeg === isVegBool);
    }
    if (minPrice !== undefined) {
      items = items.filter(d => d.pricePerHead >= Number(minPrice));
    }
    if (maxPrice !== undefined) {
      items = items.filter(d => d.pricePerHead <= Number(maxPrice));
    }
    if (search) {
      const s = search.toLowerCase();
      items = items.filter(d =>
        d.name?.toLowerCase().includes(s) ||
        d.description?.toLowerCase().includes(s)
      );
    }

    const paginated = paginateArray(items, page, limit);
    return {
      dishes: paginated.items,
      total: paginated.total,
      page: paginated.page,
      totalPages: paginated.totalPages,
    };
  }

  /**
   * Count dishes
   */
  async count(filter = {}) {
    const res = await this.listCatalog({ ...filter, limit: 10000 });
    return res.total;
  }
}

export const dishRepository = new DishRepository();
