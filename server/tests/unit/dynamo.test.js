// DynamoDB Single-Table Repository Unit Tests
import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { startLocalDynamoIfRequested, ensureTableExists } from '../../src/config/dynamoClient.js';
import {
  userRepository,
  partnerRepository,
  dishRepository,
  orderRepository,
  categoryRepository,
  occasionRepository,
} from '../../src/repositories/dynamodb/index.js';

describe('DynamoDB Single-Table Data Access Layer', () => {
  before(async () => {
    await startLocalDynamoIfRequested();
    await ensureTableExists();
  });

  const testEmail = `test_dal_${Date.now()}@foodtailor.in`;
  let createdUserId;
  let createdPartnerId;
  let createdDishId;

  test('User Repository: creates and retrieves user via GSI2 email index', async () => {
    const user = await userRepository.create({
      email: testEmail,
      passwordHash: 'dummyHash',
      firstName: 'Test',
      lastName: 'Dynamo',
      role: 'CUSTOMER',
    });

    assert.ok(user.id);
    createdUserId = user.id;

    const fetchedByEmail = await userRepository.findByEmail(testEmail);
    assert.ok(fetchedByEmail);
    assert.equal(fetchedByEmail.id, user.id);
    assert.equal(fetchedByEmail.email, testEmail);

    const fetchedById = await userRepository.findById(user.id);
    assert.ok(fetchedById);
    assert.equal(fetchedById.id, user.id);
  });

  test('Partner Repository: creates partner and queries approved catalog via GSI1', async () => {
    const partner = await partnerRepository.create({
      userId: createdUserId,
      businessName: 'Dynamo Test Kitchen',
      cuisine: 'Hyderabadi',
      isApproved: true,
      isActive: true,
    });

    assert.ok(partner.id);
    createdPartnerId = partner.id;

    const fetched = await partnerRepository.findById(partner.id);
    assert.ok(fetched);
    assert.equal(fetched.businessName, 'Dynamo Test Kitchen');

    const list = await partnerRepository.listApproved();
    assert.ok(list.partners.length >= 1);
  });

  test('Dish Repository: creates dish and queries catalog index GSI1', async () => {
    const dish = await dishRepository.create({
      partnerId: createdPartnerId,
      name: 'Dynamo Special Kebab',
      pricePerHead: 250,
      isVeg: false,
      isSignature: true,
      categoryId: 'cat_starter',
    });

    assert.ok(dish.id);
    createdDishId = dish.id;

    const fetched = await dishRepository.findById(dish.id);
    assert.ok(fetched);
    assert.equal(fetched.name, 'Dynamo Special Kebab');
    assert.equal(fetched.pricePerHead, 250);

    const partnerDishes = await dishRepository.findByPartnerId(createdPartnerId);
    assert.ok(partnerDishes.length >= 1);
  });

  test('Order Repository: creates order, updates status history, and isolates partner pointers', async () => {
    const order = await orderRepository.create({
      orderRef: `FT-TEST-${Date.now()}`,
      userId: createdUserId,
      guestCount: 15,
      totalAmount: 4125,
      status: 'SUBMITTED',
      contactName: 'Test Diner',
      items: [
        {
          dishId: createdDishId,
          partnerId: createdPartnerId,
          quantity: 15,
          pricePerHead: 250,
          totalPrice: 3750,
        },
      ],
    });

    assert.ok(order.id);
    assert.equal(order.status, 'SUBMITTED');

    // Partner query
    const partnerOrders = await orderRepository.findByPartnerId(createdPartnerId);
    assert.ok(partnerOrders.orders.some(o => o.id === order.id));

    // Status transition
    const updated = await orderRepository.updateStatus(order.id, 'ACCEPTED', createdUserId, 'Chef accepted order');
    assert.equal(updated.status, 'ACCEPTED');
    assert.ok(updated.statusHistory.length >= 2);

    // Cleanup test records so DynamoDB stays clean
    try {
      if (createdDishId && createdPartnerId) {
        await dishRepository.delete(createdDishId, createdPartnerId);
      }
      if (createdPartnerId) {
        await partnerRepository.delete(createdPartnerId);
      }
    } catch {}
  });
});


