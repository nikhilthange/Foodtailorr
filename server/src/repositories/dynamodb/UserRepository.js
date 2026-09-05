// DynamoDB User Repository
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

export class UserRepository {
  /**
   * Find user by unique ID
   */
  async findById(id) {
    if (!id) return null;
    const res = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `USER#${id}`,
        SK: 'PROFILE',
      },
    }));
    return res.Item || null;
  }

  /**
   * Find user by unique email using GSI2
   */
  async findByEmail(email) {
    if (!email) return null;
    const normalized = email.trim().toLowerCase();
    const res = await docClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'GSI2',
      KeyConditionExpression: 'GSI2PK = :emailKey',
      ExpressionAttributeValues: {
        ':emailKey': `EMAIL#${normalized}`,
      },
      Limit: 1,
    }));

    if (!res.Items || res.Items.length === 0) return null;
    return res.Items[0];
  }

  /**
   * Create a new user item
   */
  async create(data) {
    const id = data.id || generateId('usr');
    const now = new Date().toISOString();
    const normalizedEmail = data.email.trim().toLowerCase();

    const userItem = {
      PK: `USER#${id}`,
      SK: 'PROFILE',
      GSI1PK: `ROLE#${data.role || 'CUSTOMER'}`,
      GSI1SK: `CREATED#${now}`,
      GSI2PK: `EMAIL#${normalizedEmail}`,
      GSI2SK: `USER#${id}`,
      id,
      email: normalizedEmail,
      passwordHash: data.passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone || null,
      role: data.role || 'CUSTOMER',
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdAt: now,
      updatedAt: now,
    };

    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: userItem,
    }));

    return userItem;
  }

  /**
   * Update user item
   */
  async update(id, updates) {
    const expr = buildUpdateExpression(updates);

    const res = await docClient.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `USER#${id}`,
        SK: 'PROFILE',
      },
      ...expr,
      ReturnValues: 'ALL_NEW',
    }));

    return res.Attributes;
  }

  /**
   * List users with optional role, search and pagination
   */
  async listUsers({ page = 1, limit = 20, search, role } = {}) {
    let items = [];

    if (role) {
      const res = await docClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :roleKey',
        ExpressionAttributeValues: {
          ':roleKey': `ROLE#${role}`,
        },
        ScanIndexForward: false,
      }));
      items = res.Items || [];
    } else {
      const res = await docClient.send(new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'SK = :profileSK',
        ExpressionAttributeValues: {
          ':profileSK': 'PROFILE',
        },
      }));
      items = res.Items || [];
    }

    if (search) {
      const s = search.toLowerCase();
      items = items.filter(u =>
        u.email?.toLowerCase().includes(s) ||
        u.firstName?.toLowerCase().includes(s) ||
        u.lastName?.toLowerCase().includes(s)
      );
    }

    // Sort by createdAt desc
    items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    const paginated = paginateArray(items, page, limit);
    return {
      users: paginated.items,
      total: paginated.total,
      page: paginated.page,
      totalPages: paginated.totalPages,
    };
  }

  /**
   * Count users matching filter
   */
  async countUsers({ role } = {}) {
    const list = await this.listUsers({ role, limit: 10000 });
    return list.total;
  }

  /**
   * Refresh Token Management
   */
  async createRefreshToken({ userId, token, expiresAt }) {
    const id = generateId('rtk');
    const now = new Date().toISOString();
    const expiresIso = expiresAt instanceof Date ? expiresAt.toISOString() : expiresAt;

    const tokenItem = {
      PK: `USER#${userId}`,
      SK: `TOKEN#${id}`,
      GSI1PK: `TOKEN_VAL#${token}`,
      GSI1SK: `EXPIRES#${expiresIso}`,
      id,
      userId,
      token,
      expiresAt: expiresIso,
      createdAt: now,
    };

    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: tokenItem,
    }));

    return tokenItem;
  }

  async findRefreshToken(token) {
    if (!token) return null;
    const res = await docClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :tokKey',
      ExpressionAttributeValues: {
        ':tokKey': `TOKEN_VAL#${token}`,
      },
      Limit: 1,
    }));

    if (!res.Items || res.Items.length === 0) return null;
    const tokenItem = res.Items[0];

    // Fetch associated user
    const user = await this.findById(tokenItem.userId);
    return {
      ...tokenItem,
      expiresAt: new Date(tokenItem.expiresAt),
      user,
    };
  }

  async deleteRefreshToken(id, userId) {
    if (!userId || !id) return;
    await docClient.send(new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `USER#${userId}`,
        SK: `TOKEN#${id}`,
      },
    }));
  }

  async deleteRefreshTokenByToken(token) {
    const item = await this.findRefreshToken(token);
    if (item) {
      await this.deleteRefreshToken(item.id, item.userId);
    }
  }

  async deleteRefreshTokensForUser(userId, keepCount = 5) {
    const res = await docClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :userKey AND begins_with(SK, :tokPrefix)',
      ExpressionAttributeValues: {
        ':userKey': `USER#${userId}`,
        ':tokPrefix': 'TOKEN#',
      },
    }));

    const tokens = res.Items || [];
    tokens.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (tokens.length > keepCount) {
      const toDelete = tokens.slice(keepCount);
      for (const tok of toDelete) {
        await this.deleteRefreshToken(tok.id, userId);
      }
    }
  }

  /**
   * User Preferences Management
   */
  async getPreferences(userId) {
    const res = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `USER#${userId}`,
        SK: 'PREFERENCES',
      },
    }));
    return res.Item?.preferences || null;
  }

  async updatePreferences(userId, prefs) {
    const now = new Date().toISOString();
    const item = {
      PK: `USER#${userId}`,
      SK: 'PREFERENCES',
      preferences: prefs,
      updatedAt: now,
    };
    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    }));
    return prefs;
  }
}

export const userRepository = new UserRepository();
