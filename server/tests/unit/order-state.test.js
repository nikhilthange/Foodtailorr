import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { VALID_TRANSITIONS } from '../../src/services/order.service.js';

describe('Order State Machine - Unit Tests', () => {
  const isTransitionAllowed = (fromStatus, toStatus) => {
    const allowed = VALID_TRANSITIONS[fromStatus] || [];
    return allowed.includes(toStatus);
  };

  describe('Valid Order Lifecycle Transitions', () => {
    test('DRAFT can transition to SUBMITTED or CANCELLED', () => {
      assert.equal(isTransitionAllowed('DRAFT', 'SUBMITTED'), true);
      assert.equal(isTransitionAllowed('DRAFT', 'CANCELLED'), true);
    });

    test('SUBMITTED can transition to PENDING_PARTNER, ACCEPTED, or CANCELLED', () => {
      assert.equal(isTransitionAllowed('SUBMITTED', 'PENDING_PARTNER'), true);
      assert.equal(isTransitionAllowed('SUBMITTED', 'ACCEPTED'), true);
      assert.equal(isTransitionAllowed('SUBMITTED', 'CANCELLED'), true);
    });

    test('PENDING_PARTNER can transition to ACCEPTED, REJECTED, or CANCELLED', () => {
      assert.equal(isTransitionAllowed('PENDING_PARTNER', 'ACCEPTED'), true);
      assert.equal(isTransitionAllowed('PENDING_PARTNER', 'REJECTED'), true);
      assert.equal(isTransitionAllowed('PENDING_PARTNER', 'CANCELLED'), true);
    });

    test('ACCEPTED can transition to PREPARING or CANCELLED', () => {
      assert.equal(isTransitionAllowed('ACCEPTED', 'PREPARING'), true);
      assert.equal(isTransitionAllowed('ACCEPTED', 'CANCELLED'), true);
    });

    test('PREPARING can transition to CONFIRMED, COMPLETED, or CANCELLED', () => {
      assert.equal(isTransitionAllowed('PREPARING', 'CONFIRMED'), true);
      assert.equal(isTransitionAllowed('PREPARING', 'COMPLETED'), true);
      assert.equal(isTransitionAllowed('PREPARING', 'CANCELLED'), true);
    });

    test('CONFIRMED can transition to COMPLETED or CANCELLED', () => {
      assert.equal(isTransitionAllowed('CONFIRMED', 'COMPLETED'), true);
      assert.equal(isTransitionAllowed('CONFIRMED', 'CANCELLED'), true);
    });
  });

  describe('Terminal Statuses & Illegal Transition Invariants', () => {
    test('COMPLETED is a terminal state with zero outbound transitions', () => {
      assert.deepEqual(VALID_TRANSITIONS['COMPLETED'], []);
      assert.equal(isTransitionAllowed('COMPLETED', 'ACCEPTED'), false);
      assert.equal(isTransitionAllowed('COMPLETED', 'CANCELLED'), false);
    });

    test('CANCELLED is a terminal state with zero outbound transitions', () => {
      assert.deepEqual(VALID_TRANSITIONS['CANCELLED'], []);
      assert.equal(isTransitionAllowed('CANCELLED', 'SUBMITTED'), false);
      assert.equal(isTransitionAllowed('CANCELLED', 'PREPARING'), false);
    });

    test('REJECTED is a terminal state with zero outbound transitions', () => {
      assert.deepEqual(VALID_TRANSITIONS['REJECTED'], []);
      assert.equal(isTransitionAllowed('REJECTED', 'ACCEPTED'), false);
    });

    test('prevents skipping directly from SUBMITTED to COMPLETED', () => {
      assert.equal(isTransitionAllowed('SUBMITTED', 'COMPLETED'), false);
    });

    test('prevents backwards transition from PREPARING to DRAFT or SUBMITTED', () => {
      assert.equal(isTransitionAllowed('PREPARING', 'DRAFT'), false);
      assert.equal(isTransitionAllowed('PREPARING', 'SUBMITTED'), false);
    });
  });
});
