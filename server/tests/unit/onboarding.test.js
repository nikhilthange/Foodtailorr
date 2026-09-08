// Partner Onboarding Unit & Workflow Tests
import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { startLocalDynamoIfRequested, ensureTableExists } from '../../src/config/dynamoClient.js';
import { onboardingRepository, partnerRepository, userRepository } from '../../src/repositories/dynamodb/index.js';
import * as onboardingService from '../../src/services/onboarding.service.js';

describe('Partner Onboarding Flow', () => {
  before(async () => {
    await startLocalDynamoIfRequested();
    await ensureTableExists();
  });

  const testUserId = `usr_test_onboard_${Date.now()}`;
  let applicationId;

  test('creates a draft onboarding application with step tracking', async () => {
    const draft = await onboardingService.saveDraft(testUserId, {
      draftStep: 2,
      formData: {
        restaurantName: 'Test Culinary Atelier',
        restaurantType: 'Restaurant',
        city: 'Hyderabad',
      },
    });

    assert.ok(draft.id);
    assert.equal(draft.status, 'DRAFT');
    assert.equal(draft.draftStep, 2);
    assert.equal(draft.formData.restaurantName, 'Test Culinary Atelier');
    applicationId = draft.id;
  });

  test('resumes and merges draft data across steps', async () => {
    const updatedDraft = await onboardingService.saveDraft(testUserId, {
      draftStep: 3,
      formData: {
        ownerName: 'Chef Antoine',
        designation: 'Executive Chef',
        contactNumber: '9123456780',
      },
    });

    assert.equal(updatedDraft.id, applicationId);
    assert.equal(updatedDraft.draftStep, 3);
    assert.equal(updatedDraft.formData.restaurantName, 'Test Culinary Atelier');
    assert.equal(updatedDraft.formData.ownerName, 'Chef Antoine');
  });

  test('validates required fields on final submission', async () => {
    await assert.rejects(
      async () => {
        await onboardingService.submitOnboarding(testUserId, {
          restaurantName: 'Test Incomplete',
        });
      },
      { message: /Missing required onboarding fields/ }
    );
  });

  test('submits completed onboarding application and transitions status to PENDING_REVIEW', async () => {
    const fullForm = {
      restaurantName: 'Chef Antoine Heritage Kitchen',
      restaurantType: 'Restaurant',
      city: 'Hyderabad',
      companyAddress: 'Jubilee Hills Road 36, Hyderabad',
      contactNumber: '9123456780',
      noOfOutlets: '2',
      googleMapsLocation: 'https://maps.google.com/antoine',
      ownerName: 'Chef Antoine',
      designation: 'Managing Partner',
      mobileNumber: '9123456780',
      emailId: 'antoine@foodtailor.in',
      fssaiNumber: '13622011000123',
      panNumber: 'AAAPA1234F',
      signatureDishes: 'Truffle Dum Biryani, Saffron Haleem',
    };

    const res = await onboardingService.submitOnboarding(testUserId, fullForm);
    assert.equal(res.success, true);
    assert.equal(res.status, 'PENDING_REVIEW');
    assert.equal(res.application.status, 'PENDING_REVIEW');
    assert.ok(res.partner);
  });

  test('admin reviews and approves application, updating partner approval status', async () => {
    const reviewRes = await onboardingService.reviewApplication(applicationId, {
      status: 'APPROVED',
      reviewerNotes: 'Verified FSSAI and legal documents',
      reviewedBy: 'admin-user',
    });

    assert.equal(reviewRes.status, 'APPROVED');

    const partner = await partnerRepository.findByUserId(testUserId);
    assert.equal(partner.isApproved, true);

    // Cleanup test partner
    try {
      if (partner && partner.id) {
        await partnerRepository.delete(partner.id);
      }
    } catch {}
  });
});


