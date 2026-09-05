import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { signAccessToken } from '../../src/utils/jwt.js';

const API_BASE = 'http://localhost:3001/api';

const customerToken = signAccessToken({
  id: 'usr_test_cust_1',
  email: 'test@foodtailor.in',
  role: 'CUSTOMER',
});

describe('API & End-to-End Flow - Integration Tests', () => {
  let dishes = [];
  let occasions = [];
  let createdOrderId;

  before(async () => {
    // Ensure catalog is seeded
    const res = await fetch(`${API_BASE}/catalog/dishes`).catch(() => null);
    const data = res ? await res.json().catch(() => ({})) : {};
    if (!data.dishes || data.dishes.length === 0) {
      const { seedDynamo } = await import('../../src/config/seedDynamo.js');
      await seedDynamo();
    }
  });

  describe('Health & Telemetry Observability', () => {
    test('GET /api/health returns 200, db connected status, and x-request-id header', async () => {
      const res = await fetch(`${API_BASE}/health`);
      assert.equal(res.status, 200);

      const reqId = res.headers.get('x-request-id');
      assert.ok(reqId, 'Response must include x-request-id header');

      const json = await res.json();
      assert.equal(json.status, 'ok');
      assert.equal(json.database, 'connected');
      assert.ok(json.timestamp);
    });
  });

  describe('Catalog & Discovery APIs', () => {
    test('GET /api/catalog/partners returns approved culinary ateliers', async () => {
      const res = await fetch(`${API_BASE}/catalog/partners`);
      assert.equal(res.status, 200);

      const data = await res.json();
      const partnersList = data.partners || data;
      assert.ok(Array.isArray(partnersList));
      assert.ok(partnersList.length > 0);
    });

    test('GET /api/catalog/dishes returns artisanal courses', async () => {
      const res = await fetch(`${API_BASE}/catalog/dishes`);
      assert.equal(res.status, 200);

      const data = await res.json();
      dishes = data.dishes || data;
      assert.ok(Array.isArray(dishes));
      assert.ok(dishes.length > 0);
    });

    test('GET /api/catalog/occasions returns curated occasions', async () => {
      const res = await fetch(`${API_BASE}/catalog/occasions`);
      assert.equal(res.status, 200);

      const data = await res.json();
      occasions = data.occasions || data;
      assert.ok(Array.isArray(occasions));
      assert.ok(occasions.length > 0);
    });
  });

  describe('Commission Creation & Payment Lifecycle', () => {
    test('POST /api/orders creates a commission with calculated subtotal + 10% fee', async () => {
      assert.ok(dishes.length >= 2, 'Requires dishes to create test order');
      const testDish1 = dishes[0];
      const testDish2 = dishes[1];
      const guestCount = 10;

      const expectedSubtotal = (testDish1.pricePerHead + testDish2.pricePerHead) * guestCount;
      const expectedCoordinationFee = Math.round(expectedSubtotal * 0.10);
      const expectedTotal = expectedSubtotal + expectedCoordinationFee;

      const orderPayload = {
        occasionId: occasions[0]?.id,
        guestCount,
        budgetPerHead: testDish1.pricePerHead + testDish2.pricePerHead,
        dietaryType: 'ALL',
        eventDate: new Date(Date.now() + 86400000 * 5).toISOString(),
        venueAddress: '100 Jubilee Hills Road 45, Hyderabad',
        contactName: 'Atelier Patron',
        contactPhone: '+91 91234 56789',
        contactEmail: 'patron@foodtailor.in',
        notes: 'Integration test automated commission',
        items: [
          { dishId: testDish1.id, quantity: guestCount },
          { dishId: testDish2.id, quantity: guestCount },
        ],
      };

      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`,
        },
        body: JSON.stringify(orderPayload),
      });

      assert.equal(res.status, 201);
      const order = await res.json();
      assert.ok(order.id);
      assert.equal(order.status, 'SUBMITTED');
      assert.equal(order.totalAmount, expectedTotal);
      createdOrderId = order.id;
    });

    test('POST /api/orders/:id/pay initiates payment session', async () => {
      assert.ok(createdOrderId);

      const res = await fetch(`${API_BASE}/orders/${createdOrderId}/pay`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${customerToken}` },
      });

      assert.equal(res.status, 200);
      const json = await res.json();
      assert.equal(json.success, true);
      assert.ok(json.data.orderId || json.data.id);
    });

    test('POST /api/orders/:id/verify-payment transitions order to PENDING_PARTNER', async () => {
      assert.ok(createdOrderId);

      const verifyRes = await fetch(`${API_BASE}/orders/${createdOrderId}/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`,
        },
        body: JSON.stringify({
          razorpay_order_id: `MOCK_ORD_${Date.now()}`,
          razorpay_payment_id: `MOCK_TXN_${Date.now()}`,
          razorpay_signature: 'valid_mock_signature',
        }),
      });

      assert.equal(verifyRes.status, 200);
      const json = await verifyRes.json();
      assert.equal(json.success, true);
      assert.equal(json.data.status, 'PENDING_PARTNER');

      // Verify statusHistory contains transition record
      const history = json.data.statusHistory || [];
      const transitionEntry = history.find(h => h.toStatus === 'PENDING_PARTNER');
      assert.ok(transitionEntry, 'Must log PENDING_PARTNER in statusHistory');
    });

    test('standardized error response structure on invalid request', async () => {
      const badRes = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`,
        },
        body: JSON.stringify({
          // Missing required fields
          guestCount: -5,
        }),
      });

      assert.equal(badRes.status, 400);
      const json = await badRes.json();
      assert.equal(json.success, false);
      assert.ok(json.error);
      assert.ok(typeof json.error.message === 'string');
    });
  });
});
