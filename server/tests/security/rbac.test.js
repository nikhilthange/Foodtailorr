import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { signAccessToken } from '../../src/utils/jwt.js';

const API_BASE = 'http://localhost:3001/api';

let partner1Token;
let partner2Token;

const customerToken = signAccessToken({ id: 'test_cust_id', email: 'test@foodtailor.in', role: 'CUSTOMER' });
const adminToken = signAccessToken({ id: 'test_admin_id', email: 'admin@foodtailor.in', role: 'ADMIN' });

async function loginAs(email) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'password123' }),
    });
    const data = await res.json();
    return data.accessToken;
  } catch {
    return null;
  }
}

describe('Security & RBAC Isolation - Security Tests', () => {
  before(async () => {
    // Ensure DB seeded and fetch partner tokens
    const { seedDynamo } = await import('../../src/config/seedDynamo.js');
    await seedDynamo();

    partner1Token = await loginAs('partner1@foodtailor.in') ||
      signAccessToken({ id: 'test_partner1_user', email: 'partner1@foodtailor.in', role: 'PARTNER', partnerId: 'ptr_niloufer' });

    partner2Token = await loginAs('partner2@foodtailor.in') ||
      signAccessToken({ id: 'test_partner2_user', email: 'partner2@foodtailor.in', role: 'PARTNER', partnerId: 'ptr_shadab' });
  });

  describe('Unauthenticated Access Control', () => {
    test('rejects unauthenticated requests to protected endpoints with 401', async () => {
      const res = await fetch(`${API_BASE}/orders`);
      assert.equal(res.status, 401);

      const json = await res.json();
      assert.equal(json.success, false);
      assert.ok(json.error);
    });

    test('rejects requests with malformed Bearer tokens with 401', async () => {
      const res = await fetch(`${API_BASE}/orders`, {
        headers: { Authorization: 'Bearer totally-invalid-token-xyz' },
      });
      assert.equal(res.status, 401);
    });
  });

  describe('Role-Based Access Control (RBAC) Enforcement', () => {
    test('denies Customer access to Admin dashboard with 403', async () => {
      const res = await fetch(`${API_BASE}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${customerToken}` },
      });
      assert.equal(res.status, 403);
      const json = await res.json();
      assert.equal(json.success, false);
    });

    test('denies Customer access to Admin user management with 403', async () => {
      const res = await fetch(`${API_BASE}/admin/users`, {
        headers: { Authorization: `Bearer ${customerToken}` },
      });
      assert.equal(res.status, 403);
    });

    test('denies Customer access to Partner dashboard with 403', async () => {
      const res = await fetch(`${API_BASE}/partner/dashboard`, {
        headers: { Authorization: `Bearer ${customerToken}` },
      });
      assert.equal(res.status, 403);
    });

    test('denies Partner access to Admin dashboard with 403', async () => {
      const res = await fetch(`${API_BASE}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${partner1Token}` },
      });
      assert.equal(res.status, 403);
    });

    test('grants Admin access to Admin dashboard with 200', async () => {
      const res = await fetch(`${API_BASE}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      assert.equal(res.status, 200);
    });
  });

  describe('Multi-Tenant Cross-Partner Isolation', () => {
    test('enforces cross-partner tenant isolation on orders', async () => {
      // Partner 1 checks their orders
      const p1OrdersRes = await fetch(`${API_BASE}/partner/orders`, {
        headers: { Authorization: `Bearer ${partner1Token}` },
      });
      assert.equal(p1OrdersRes.status, 200);
      const p1Orders = await p1OrdersRes.json();

      // Partner 2 checks their orders
      const p2OrdersRes = await fetch(`${API_BASE}/partner/orders`, {
        headers: { Authorization: `Bearer ${partner2Token}` },
      });
      assert.equal(p2OrdersRes.status, 200);
      const p2Orders = await p2OrdersRes.json();

      // If Partner 1 has an order not containing any items from Partner 2,
      // Partner 2 trying to update Partner 1's order must be blocked with 403
      const p1ExclusiveOrder = (p1Orders.orders || []).find(o1 => 
        !(p2Orders.orders || []).some(o2 => o2.id === o1.id)
      );

      if (p1ExclusiveOrder) {
        const forbiddenTransition = await fetch(`${API_BASE}/partner/orders/${p1ExclusiveOrder.id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${partner2Token}`,
          },
          body: JSON.stringify({ status: 'ACCEPTED', note: 'Cross-tenant illegal hijack attempt' }),
        });

        assert.equal(forbiddenTransition.status, 403);
        const errJson = await forbiddenTransition.json();
        assert.equal(errJson.success, false);
      }
    });
  });
});
