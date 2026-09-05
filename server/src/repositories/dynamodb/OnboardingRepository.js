// DynamoDB Partner Onboarding Repository
import {
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { docClient, TABLE_NAME } from '../../config/dynamoClient.js';
import { generateId, buildUpdateExpression, paginateArray } from './dynamoUtils.js';

export class OnboardingRepository {
  /**
   * Find onboarding application by ID
   */
  async findById(id) {
    if (!id) return null;
    const res = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `ONBOARDING#${id}`,
        SK: 'APPLICATION',
      },
    }));
    return res.Item || null;
  }

  /**
   * Find onboarding application by User ID via GSI2
   */
  async findByUserId(userId) {
    if (!userId) return null;
    const res = await docClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'GSI2',
      KeyConditionExpression: 'GSI2PK = :uKey AND GSI2SK = :obSK',
      ExpressionAttributeValues: {
        ':uKey': `USER#${userId}`,
        ':obSK': 'ONBOARDING',
      },
      Limit: 1,
    }));
    return res.Items?.[0] || null;
  }

  /**
   * Save or update draft application
   */
  async saveDraft(userId, { draftStep, formData }) {
    const existing = await this.findByUserId(userId);
    const now = new Date().toISOString();

    if (existing) {
      const mergedFormData = { ...(existing.formData || {}), ...formData };
      return this.update(existing.id, {
        draftStep: draftStep ?? existing.draftStep ?? 1,
        formData: mergedFormData,
        status: existing.status === 'REJECTED' ? 'DRAFT' : existing.status,
        updatedAt: now,
      });
    }

    const id = generateId('onb');
    const item = {
      PK: `ONBOARDING#${id}`,
      SK: 'APPLICATION',
      GSI1PK: 'ONBOARDING_STATUS#DRAFT',
      GSI1SK: `SUBMITTED#${now}`,
      GSI2PK: `USER#${userId}`,
      GSI2SK: 'ONBOARDING',
      id,
      userId,
      partnerId: null,
      status: 'DRAFT',
      draftStep: draftStep || 1,
      formData: formData || {},
      submittedAt: null,
      reviewedAt: null,
      reviewedBy: null,
      reviewerNotes: null,
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
   * Submit application for admin review
   */
  async submit(userId, formData) {
    let existing = await this.findByUserId(userId);
    const now = new Date().toISOString();

    if (!existing) {
      existing = await this.saveDraft(userId, { draftStep: 4, formData });
    }

    const mergedFormData = { ...(existing.formData || {}), ...formData };

    const item = await this.update(existing.id, {
      formData: mergedFormData,
      status: 'PENDING_REVIEW',
      GSI1PK: 'ONBOARDING_STATUS#PENDING_REVIEW',
      GSI1SK: `SUBMITTED#${now}`,
      submittedAt: now,
      updatedAt: now,
    });

    return item;
  }

  /**
   * Update application fields
   */
  async update(id, updates) {
    const expr = buildUpdateExpression(updates);
    const res = await docClient.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `ONBOARDING#${id}`,
        SK: 'APPLICATION',
      },
      ...expr,
      ReturnValues: 'ALL_NEW',
    }));
    return res.Attributes;
  }

  /**
   * Admin: List onboarding applications
   */
  async listAll({ page = 1, limit = 20, status, search } = {}) {
    let items = [];

    if (status) {
      const res = await docClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :stKey',
        ExpressionAttributeValues: {
          ':stKey': `ONBOARDING_STATUS#${status}`,
        },
      }));
      items = res.Items || [];
    } else {
      const res = await docClient.send(new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'SK = :appSK AND begins_with(PK, :onbPrefix)',
        ExpressionAttributeValues: {
          ':appSK': 'APPLICATION',
          ':onbPrefix': 'ONBOARDING#',
        },
      }));
      items = res.Items || [];
    }

    if (search) {
      const s = search.toLowerCase();
      items = items.filter(a => {
        const d = a.formData || {};
        return (
          d.restaurantName?.toLowerCase().includes(s) ||
          d.applicantName?.toLowerCase().includes(s) ||
          d.contactEmail?.toLowerCase().includes(s) ||
          d.city?.toLowerCase().includes(s)
        );
      });
    }

    items.sort((a, b) => new Date(b.submittedAt || b.createdAt || 0) - new Date(a.submittedAt || a.createdAt || 0));

    const paginated = paginateArray(items, page, limit);
    return {
      applications: paginated.items,
      total: paginated.total,
      page: paginated.page,
      totalPages: paginated.totalPages,
    };
  }

  /**
   * Admin: Update application status (APPROVED / REJECTED)
   */
  async updateStatus(id, { status, reviewedBy, reviewerNotes, partnerId }) {
    const now = new Date().toISOString();
    return this.update(id, {
      status,
      GSI1PK: `ONBOARDING_STATUS#${status}`,
      reviewedAt: now,
      reviewedBy,
      reviewerNotes: reviewerNotes || null,
      ...(partnerId ? { partnerId } : {}),
      updatedAt: now,
    });
  }
}

export const onboardingRepository = new OnboardingRepository();
