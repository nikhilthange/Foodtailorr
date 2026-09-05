// DynamoDB Partner Repository
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

export class PartnerRepository {
  /**
   * Find partner by partner ID
   */
  async findById(id) {
    if (!id) return null;
    const res = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `PARTNER#${id}`,
        SK: 'PROFILE',
      },
    }));
    if (res.Item) return res.Item;

    // Check by slug if direct ID didn't match
    try {
      const slugRes = await docClient.send(new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'SK = :sk AND (slug = :slugId OR id = :slugId)',
        ExpressionAttributeValues: {
          ':sk': 'PROFILE',
          ':slugId': id,
        },
        Limit: 1,
      }));
      return slugRes.Items?.[0] || null;
    } catch {
      return null;
    }
  }

  /**
   * Find partner by associated User ID (via GSI2)
   */
  async findByUserId(userId) {
    if (!userId) return null;
    try {
      const res = await docClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'GSI2',
        KeyConditionExpression: 'GSI2PK = :uKey AND begins_with(GSI2SK, :pPrefix)',
        ExpressionAttributeValues: {
          ':uKey': `USER#${userId}`,
          ':pPrefix': 'PARTNER#',
        },
        Limit: 1,
      }));

      if (res.Items && res.Items.length > 0) return res.Items[0];
    } catch {
      // Fallback to scan if GSI query encounters issue
    }

    // Fallback scan by userId if GSI2 is desynchronized or building
    try {
      const scanRes = await docClient.send(new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'SK = :sk AND userId = :uid',
        ExpressionAttributeValues: {
          ':sk': 'PROFILE',
          ':uid': userId,
        },
        Limit: 1,
      }));
      return scanRes.Items?.[0] || null;
    } catch {
      return null;
    }
  }

  /**
   * Create new partner
   */
  async create(data) {
    const id = data.id || generateId('ptr');
    const now = new Date().toISOString();
    const isApproved = data.isApproved === true;
    const isActive = data.isActive !== undefined ? data.isActive : true;

    const slug = data.slug || data.businessName?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || id.replace(/^ptr_/, '');
    const item = {
      PK: `PARTNER#${id}`,
      SK: 'PROFILE',
      GSI1PK: `STATUS#${isApproved ? 'APPROVED' : 'PENDING'}`,
      GSI1SK: `PARTNER#${id}`,
      GSI2PK: `USER#${data.userId}`,
      GSI2SK: `PARTNER#${id}`,
      id,
      userId: data.userId,
      businessName: data.businessName,
      slug,
      tagline: data.tagline || null,
      description: data.description || null,
      cuisine: data.cuisine || 'General',
      location: data.location || 'Hyderabad',
      whyWePicked: data.whyWePicked || null,
      established: data.established || null,
      website: data.website || null,
      logoUrl: data.logoUrl || null,
      coverImageUrl: data.coverImageUrl || null,
      serviceAreas: data.serviceAreas || ['Hyderabad', 'Secunderabad'],
      isApproved,
      isActive,
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
   * Update partner details
   */
  async update(id, updates) {
    const updateObj = { ...updates };
    if (updateObj.isApproved !== undefined) {
      updateObj.GSI1PK = `STATUS#${updateObj.isApproved ? 'APPROVED' : 'PENDING'}`;
    }
    if (updateObj.userId !== undefined) {
      updateObj.GSI2PK = `USER#${updateObj.userId}`;
      updateObj.GSI2SK = `PARTNER#${id}`;
    }

    const expr = buildUpdateExpression(updateObj);

    const res = await docClient.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `PARTNER#${id}`,
        SK: 'PROFILE',
      },
      ...expr,
      ReturnValues: 'ALL_NEW',
    }));

    return res.Attributes;
  }

  /**
   * List approved and active partners for the public catalog
   */
  async listApproved({ page = 1, limit = 50, search, cuisine, location } = {}) {
    const res = await docClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :statusKey',
      ExpressionAttributeValues: {
        ':statusKey': 'STATUS#APPROVED',
      },
    }));

    let items = (res.Items || []).filter(p => p.isActive !== false);

    if (search) {
      const s = search.toLowerCase();
      items = items.filter(p =>
        p.businessName?.toLowerCase().includes(s) ||
        p.cuisine?.toLowerCase().includes(s) ||
        p.location?.toLowerCase().includes(s) ||
        p.description?.toLowerCase().includes(s) ||
        p.tagline?.toLowerCase().includes(s)
      );
    }

    if (cuisine && cuisine !== 'ALL') {
      const c = cuisine.toLowerCase();
      items = items.filter(p => p.cuisine?.toLowerCase().includes(c));
    }

    if (location && location !== 'ALL') {
      items = items.filter(p => p.location?.toLowerCase().includes(location.toLowerCase()));
    }

    items.sort((a, b) => (a.businessName || '').localeCompare(b.businessName || ''));

    const paginated = paginateArray(items, page, limit);
    return {
      partners: paginated.items,
      total: paginated.total,
      page: paginated.page,
      totalPages: paginated.totalPages,
    };
  }

  /**
   * List all partners (admin view) with optional approval filter
   */
  async listAll({ page = 1, limit = 20, search, approved } = {}) {
    let items = [];

    if (approved !== undefined) {
      const isApp = approved === 'true' || approved === true;
      const res = await docClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :statusKey',
        ExpressionAttributeValues: {
          ':statusKey': `STATUS#${isApp ? 'APPROVED' : 'PENDING'}`,
        },
      }));
      items = res.Items || [];
    } else {
      const res = await docClient.send(new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'SK = :profileSK AND begins_with(PK, :partnerPrefix)',
        ExpressionAttributeValues: {
          ':profileSK': 'PROFILE',
          ':partnerPrefix': 'PARTNER#',
        },
      }));
      items = res.Items || [];
    }

    if (search) {
      const s = search.toLowerCase();
      items = items.filter(p =>
        p.businessName?.toLowerCase().includes(s) ||
        p.cuisine?.toLowerCase().includes(s)
      );
    }

    items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    const paginated = paginateArray(items, page, limit);
    return {
      partners: paginated.items,
      total: paginated.total,
      page: paginated.page,
      totalPages: paginated.totalPages,
    };
  }

  /**
   * Count partners with filters
   */
  async count({ isApproved, isActive } = {}) {
    const list = await this.listAll({ approved: isApproved, limit: 10000 });
    if (isActive !== undefined) {
      return list.partners.filter(p => p.isActive === isActive).length;
    }
    return list.total;
  }
}

export const partnerRepository = new PartnerRepository();
