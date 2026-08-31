// test_runner.js
import fs from 'fs';

async function runTests() {
  const API_BASE = 'http://localhost:3001/api';
  const results = {};

  try {
    // 1. Health & Database
    const health = await fetch(`${API_BASE}/health`).then(r => r.json());
    results.health = health;

    // 2. Catalog
    const catalog = await fetch(`${API_BASE}/catalog/partners`).then(r => r.json());
    results.catalog = !!catalog.partners;

    // 3. Auth (Login)
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@foodtailor.in', password: 'password123' })
    });
    const auth = await loginRes.json();
    results.auth = !!auth.accessToken;
    const token = auth.accessToken;

    // 4. Auth (Me)
    const meRes = await fetch(`${API_BASE}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    results.me = await meRes.json();

    // 5. RBAC (Customer trying to access Admin route)
    const adminRes = await fetch(`${API_BASE}/admin/dashboard`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    results.rbacAdmin = adminRes.status === 403 || adminRes.status === 401;

    // 6. RBAC (Customer trying to access Partner route)
    const partnerRes = await fetch(`${API_BASE}/partner/dashboard`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    results.rbacPartner = partnerRes.status === 403 || partnerRes.status === 401;

    // 7. AI Recommendation
    const aiRes = await fetch(`${API_BASE}/ai/recommend-menu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ occasion: 'Birthday Celebration', guestCount: 50, budgetPerHead: 1000 })
    });
    results.ai = await aiRes.json();

    // 8. Orders (Create & Fetch)
    // Fetch a real occasion ID first
    const occasions = await fetch(`${API_BASE}/catalog/occasions`).then(r => r.json());
    const orderRes = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        occasionId: occasions[0].id,
        guestCount: 20,
        budgetPerHead: 500,
        dietaryType: 'ALL',
        eventDate: new Date().toISOString(),
        venueAddress: '123 Test St',
        contactName: 'Test User',
        contactPhone: '9999999999',
        contactEmail: 'test@foodtailor.in',
        dishes: []
      })
    });
    const orderCreated = await orderRes.json();
    results.orderCreate = !!orderCreated.order;

    if (orderCreated.order) {
      const fetchOrderRes = await fetch(`${API_BASE}/orders/${orderCreated.order.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const fetchedOrder = await fetchOrderRes.json();
      results.orderFetch = !!fetchedOrder.id;
    }

    // 9. CORS (OPTIONS request)
    const corsRes = await fetch(`${API_BASE}/health`, {
      method: 'OPTIONS',
      headers: { 'Origin': 'http://localhost:5174' }
    });
    results.cors = corsRes.headers.get('access-control-allow-origin') === 'http://localhost:5174' || corsRes.headers.get('access-control-allow-origin') === '*';

    console.log(JSON.stringify(results, null, 2));

  } catch (err) {
    console.error("Test failed:", err);
  }
}

runTests();
