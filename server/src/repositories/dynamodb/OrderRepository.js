// DynamoDB Order Repository
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

export class OrderRepository {
  /**
   * Find order by unique Order ID
   */
  async findById(orderId) {
    if (!orderId) return null;
    const res = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `ORDER#${orderId}`,
        SK: 'METADATA',
      },
    }));
    return res.Item || null;
  }

  /**
   * Find order by order reference string (FT-...) via GSI2
   */
  async findByRef(orderRef) {
    if (!orderRef) return null;
    const res = await docClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'GSI2',
      KeyConditionExpression: 'GSI2PK = :refKey',
      ExpressionAttributeValues: {
        ':refKey': `ORDER_REF#${orderRef}`,
      },
      Limit: 1,
    }));
    return res.Items?.[0] || null;
  }

  /**
   * Find order by payment reference (e.g. razorpay order/tx id)
   */
  async findByPaymentRef(paymentRef) {
    if (!paymentRef) return null;
    const res = await docClient.send(new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'SK = :metadataSK AND paymentRef = :pref',
      ExpressionAttributeValues: {
        ':metadataSK': 'METADATA',
        ':pref': paymentRef,
      },
      Limit: 1,
    }));
    return res.Items?.[0] || null;
  }

  /**
   * Create a new order
   */
  async create(data) {
    const id = data.id || generateId('ord');
    const now = new Date().toISOString();

    const orderItem = {
      PK: `ORDER#${id}`,
      SK: 'METADATA',
      GSI1PK: `USER#${data.userId}`,
      GSI1SK: `ORDER#${now}`,
      GSI2PK: `ORDER_REF#${data.orderRef}`,
      GSI2SK: `ORDER#${id}`,
      id,
      orderRef: data.orderRef,
      userId: data.userId,
      occasionId: data.occasionId || null,
      guestCount: data.guestCount,
      budgetPerHead: data.budgetPerHead || null,
      dietaryType: data.dietaryType || 'ALL',
      totalAmount: data.totalAmount,
      status: data.status || 'SUBMITTED',
      paymentStatus: data.paymentStatus || 'PENDING',
      paymentProvider: data.paymentProvider || 'mock',
      paymentRef: data.paymentRef || null,
      eventDate: data.eventDate ? new Date(data.eventDate).toISOString() : null,
      venueAddress: data.venueAddress || null,
      contactName: data.contactName,
      contactPhone: data.contactPhone || null,
      contactEmail: data.contactEmail || null,
      notes: data.notes || null,
      items: data.items || [],
      statusHistory: data.statusHistory || [
        {
          fromStatus: null,
          toStatus: data.status || 'SUBMITTED',
          changedBy: data.userId,
          note: 'Order submitted',
          createdAt: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    // Save order item
    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: orderItem,
    }));

    // Also write Partner Order pointer for each distinct partner in the order
    const partnerIds = new Set((data.items || []).map(i => i.partnerId || i.partner?.id).filter(Boolean));
    for (const pId of partnerIds) {
      await docClient.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          PK: `PARTNER#${pId}`,
          SK: `ORDER#${id}`,
          orderId: id,
          partnerId: pId,
          createdAt: now,
          status: orderItem.status,
        },
      }));
    }

    return orderItem;
  }

  /**
   * Update order
   */
  async update(orderId, updates) {
    const expr = buildUpdateExpression(updates);
    const res = await docClient.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `ORDER#${orderId}`,
        SK: 'METADATA',
      },
      ...expr,
      ReturnValues: 'ALL_NEW',
    }));

    // If status changed, also update partner order pointers
    if (updates.status && res.Attributes?.items) {
      const partnerIds = new Set((res.Attributes.items || []).map(i => i.partnerId || i.partner?.id).filter(Boolean));
      for (const pId of partnerIds) {
        try {
          await docClient.send(new UpdateCommand({
            TableName: TABLE_NAME,
            Key: {
              PK: `PARTNER#${pId}`,
              SK: `ORDER#${orderId}`,
            },
            UpdateExpression: 'SET #st = :st, #up = :up',
            ExpressionAttributeNames: { '#st': 'status', '#up': 'updatedAt' },
            ExpressionAttributeValues: { ':st': updates.status, ':up': new Date().toISOString() },
          }));
        } catch {
          // ignore pointer update error
        }
      }
    }

    return res.Attributes;
  }

  /**
   * Update order status with transition history
   */
  async updateStatus(orderId, newStatus, changedBy, note = '') {
    const order = await this.findById(orderId);
    if (!order) return null;

    const now = new Date().toISOString();
    const historyEntry = {
      fromStatus: order.status,
      toStatus: newStatus,
      changedBy,
      note: note || `Status changed to ${newStatus}`,
      createdAt: now,
    };

    const newHistory = [historyEntry, ...(order.statusHistory || [])].slice(0, 15);

    return this.update(orderId, {
      status: newStatus,
      statusHistory: newHistory,
      updatedAt: now,
    });
  }

  /**
   * Get customer orders via GSI1
   */
  async findByUserId(userId, { page = 1, limit = 20 } = {}) {
    const res = await docClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :userKey AND begins_with(GSI1SK, :orderPrefix)',
      ExpressionAttributeValues: {
        ':userKey': `USER#${userId}`,
        ':orderPrefix': 'ORDER#',
      },
      ScanIndexForward: false, // Newest first
    }));

    const items = res.Items || [];
    const paginated = paginateArray(items, page, limit);

    return {
      orders: paginated.items,
      total: paginated.total,
      page: paginated.page,
      totalPages: paginated.totalPages,
    };
  }

  /**
   * Get partner orders by querying Partner Order pointers
   */
  async findByPartnerId(partnerId, { page = 1, limit = 20, status } = {}) {
    const res = await docClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pKey AND begins_with(SK, :ordPrefix)',
      ExpressionAttributeValues: {
        ':pKey': `PARTNER#${partnerId}`,
        ':ordPrefix': 'ORDER#',
      },
    }));

    const pointers = res.Items || [];
    const orderIds = pointers.map(p => p.orderId || p.SK.replace('ORDER#', ''));

    // Fetch full order objects
    const orders = (await Promise.all(orderIds.map(id => this.findById(id)))).filter(Boolean);

    let filtered = orders;
    if (status) {
      filtered = filtered.filter(o => o.status === status);
    }

    filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    const paginated = paginateArray(filtered, page, limit);

    return {
      orders: paginated.items,
      total: paginated.total,
      page: paginated.page,
      totalPages: paginated.totalPages,
    };
  }

  /**
   * Admin: List all orders
   */
  async listAll({ page = 1, limit = 20, status, search } = {}) {
    const res = await docClient.send(new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'SK = :metadataSK AND begins_with(PK, :ordPrefix)',
      ExpressionAttributeValues: {
        ':metadataSK': 'METADATA',
        ':ordPrefix': 'ORDER#',
      },
    }));

    let items = res.Items || [];

    if (status) {
      items = items.filter(o => o.status === status);
    }
    if (search) {
      const s = search.toLowerCase();
      items = items.filter(o =>
        o.orderRef?.toLowerCase().includes(s) ||
        o.contactName?.toLowerCase().includes(s) ||
        o.contactEmail?.toLowerCase().includes(s)
      );
    }

    items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    const paginated = paginateArray(items, page, limit);
    return {
      orders: paginated.items,
      total: paginated.total,
      page: paginated.page,
      totalPages: paginated.totalPages,
    };
  }

  /**
   * Count orders with filter
   */
  async count({ status } = {}) {
    const list = await this.listAll({ status, limit: 10000 });
    return list.total;
  }

  /**
   * Aggregate total revenue from COMPLETED orders
   */
  async aggregateCompletedRevenue(partnerId = null) {
    if (partnerId) {
      const orders = await this.findByPartnerId(partnerId, { limit: 10000 });
      return orders.orders
        .filter(o => o.status === 'COMPLETED')
        .reduce((sum, o) => {
          // Sum only the partner's items
          const partnerItems = (o.items || []).filter(i => (i.partnerId || i.partner?.id) === partnerId);
          return sum + partnerItems.reduce((s, it) => s + (it.totalPrice || it.pricePerHead * it.quantity), 0);
        }, 0);
    }

    const res = await this.listAll({ status: 'COMPLETED', limit: 10000 });
    return res.orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  }

  /**
   * Saved Menus
   */
  async createSavedMenu(data) {
    const id = data.id || generateId('smn');
    const now = new Date().toISOString();

    const item = {
      PK: `USER#${data.userId}`,
      SK: `SAVED_MENU#${id}`,
      id,
      userId: data.userId,
      name: data.name,
      occasionId: data.occasionId || null,
      guestCount: data.guestCount,
      totalPerHead: data.totalPerHead,
      items: data.items || [],
      createdAt: now,
    };

    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    }));

    return item;
  }

  async listSavedMenus(userId) {
    const res = await docClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :userKey AND begins_with(SK, :menuPrefix)',
      ExpressionAttributeValues: {
        ':userKey': `USER#${userId}`,
        ':menuPrefix': 'SAVED_MENU#',
      },
    }));
    const items = res.Items || [];
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return items;
  }

  async deleteSavedMenu(id, userId) {
    await docClient.send(new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `USER#${userId}`,
        SK: `SAVED_MENU#${id}`,
      },
    }));
  }
}

export const orderRepository = new OrderRepository();
