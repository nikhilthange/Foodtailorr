import crypto from 'crypto';

const API_BASE = 'http://localhost:3001/api';
let customerToken, partnerToken, adminToken;

async function api(path, options = {}, token = null) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(`API Error: ${JSON.stringify(data)}`);
  return data;
}

async function runTest() {
  try {
    console.log('1. Health Check');
    await api('/health');
    console.log('✅ Health check passed');

    console.log('2. Admin Login');
    // Using demo credentials seeded in the DB
    const adminRes = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email: 'admin@foodtailor.in', password: 'password123' }) });
    adminToken = adminRes.accessToken;
    console.log('✅ Admin login successful');

    console.log('3. Customer Login');
    const customerRes = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email: 'test@foodtailor.in', password: 'password123' }) });
    customerToken = customerRes.accessToken;
    console.log('✅ Customer login successful');

    console.log('4. Partner Login');
    const partnerRes = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email: 'partner1@foodtailor.in', password: 'password123' }) });
    partnerToken = partnerRes.accessToken;
    console.log('✅ Partner login successful');

    console.log('4b. Partner Guild Onboarding (Draft, Submission & Admin Approval)');
    await api('/onboarding/draft', {
      method: 'POST',
      body: JSON.stringify({
        draftStep: 2,
        formData: {
          restaurantName: 'Niloufer Grand Atelier',
          restaurantType: 'Restaurant',
          city: 'Hyderabad',
        }
      })
    }, partnerToken);
    console.log('✅ Partner saved draft step');

    const submitRes = await api('/onboarding/submit', {
      method: 'POST',
      body: JSON.stringify({
        restaurantName: 'Niloufer Grand Atelier',
        restaurantType: 'Restaurant',
        city: 'Hyderabad',
        companyAddress: 'Red Hills, Lakdikapul, Hyderabad',
        contactNumber: '+919876543210',
        noOfOutlets: '3',
        googleMapsLocation: 'https://maps.google.com/?q=niloufer',
        ownerName: 'Babu Rao',
        designation: 'Managing Partner',
        mobileNumber: '+919876543210',
        emailId: 'partner1@foodtailor.in',
        fssaiNumber: '13618015000234',
        panNumber: 'ABCDE1234F',
        signatureDishes: 'Irani Chai, Osmania Biscuits, Maska Bun',
        bulkOrderCapacity: 'Yes',
        bankAccountHolder: 'Cafe Niloufer Foods LLP',
        bankName: 'HDFC Bank',
        bankAccountNumber: '50200012345678',
        bankIfsc: 'HDFC0001234',
      })
    }, partnerToken);
    console.log(`✅ Partner submitted onboarding application (Status: ${submitRes.application.status})`);

    const adminApps = await api('/onboarding/admin/applications', {}, adminToken);
    const targetApp = adminApps.applications.find(a => a.id === submitRes.application.id);
    if (!targetApp) throw new Error('Application not visible to Admin');

    await api(`/onboarding/admin/${targetApp.id}/status`, {
      method: 'POST',
      body: JSON.stringify({
        status: 'APPROVED',
        reviewNotes: 'Compliance verified by culinary audit team'
      })
    }, adminToken);
    console.log('✅ Admin audited and approved Partner application');

    const partnerStatus = await api('/onboarding/status', {}, partnerToken);
    if (partnerStatus.status !== 'APPROVED') throw new Error('Partner status should be APPROVED');
    console.log('✅ Partner confirmed APPROVED status on guild onboarding');

    console.log('5. Customer tries Admin route (RBAC test)');
    try {
      await api('/admin/dashboard', {}, customerToken);
      throw new Error('Should have failed');
    } catch (err) {
      if (err.message.includes('Insufficient permissions')) console.log('✅ RBAC working: Customer blocked from Admin');
      else throw err;
    }

    console.log('6. AI Recommendation (Fallback)');
    const rec = await api('/ai/recommend-menu', {
      method: 'POST',
      body: JSON.stringify({ occasion: 'Birthday Party', guestCount: 10, budgetPerHead: 500, dietaryPreferences: ['Vegetarian'] })
    }, customerToken);
    
    console.log('REC:', JSON.stringify(rec, null, 2));
    const firstMenu = rec.packages[0];
    console.log(`✅ AI Recommendation generated ${firstMenu.items.length} items deterministically`);
    
    console.log('7. Customer Creates Order');
    const catalogDishes = await api('/catalog/dishes');
    const partnerProfile = await api('/partner/profile', {}, partnerToken);
    const partnerDish = catalogDishes.dishes.find(d => d.partnerId === partnerProfile.id || d.partner?.id === partnerProfile.id) || catalogDishes.dishes[0];
    const orderData = {
      occasionId: null,
      guestCount: 10,
      budgetPerHead: 500,
      eventDate: new Date(Date.now() + 86400000).toISOString(),
      contactName: 'Test User',
      items: [
        { dishId: partnerDish.id, quantity: 10 }
      ]
    };
    const order = await api('/orders', { method: 'POST', body: JSON.stringify(orderData) }, customerToken);
    console.log(`✅ Order created: ${order.orderRef} with dish "${partnerDish.name}"`);

    console.log('8. Customer Initiates Payment');
    const payment = await api(`/orders/${order.id}/pay`, { method: 'POST' }, customerToken);
    console.log(`✅ Razorpay payment initiated: ${payment.data.orderId}`);

    console.log('9. Webhook Captures Payment');
    // Simulate Razorpay Webhook
    const payload = {
      event: 'payment.captured',
      payload: { payment: { entity: { order_id: payment.data.orderId, id: 'pay_test_123' } } }
    };
    const bodyStr = JSON.stringify(payload);
    const signature = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || 'change_this_to_webhook_secret').update(bodyStr).digest('hex');
    await api('/orders/webhook/razorpay', {
      method: 'POST',
      headers: { 'x-razorpay-signature': signature },
      body: bodyStr
    });
    console.log('✅ Payment webhook processed successfully');

    console.log('10. Partner Accepts Order');
    await api(`/orders/${order.id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'ACCEPTED', note: 'We will prepare this!' })
    }, partnerToken);
    console.log('✅ Partner accepted order');

    console.log('11. Admin views Order');
    const adminOrders = await api('/admin/orders', {}, adminToken);
    const found = adminOrders.orders.find(o => o.id === order.id);
    if (!found) throw new Error('Order not found for Admin');
    console.log(`✅ Admin successfully viewed order: ${found.orderRef} with status ${found.status} and payment ${found.paymentStatus}`);

    console.log('🎉 ALL END-TO-END TESTS PASSED SUCCESSFULLY! 🎉');

  } catch (err) {
    console.error('❌ TEST FAILED:', err.message);
  }
}

runTest();
