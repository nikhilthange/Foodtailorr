// Order routes — create, list, status management using DynamoDB Repositories
import { Router } from 'express';
import * as orderService from '../services/order.service.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createOrderSchema, updateOrderStatusSchema, savedMenuSchema } from '../validators/schemas.js';
import { orderRepository, dishRepository } from '../repositories/dynamodb/index.js';
import { paymentProvider } from '../services/payment.service.js';
import crypto from 'crypto';
import { env } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// POST /api/orders — create order (authenticated customers)
router.post('/', authenticate, validate(createOrderSchema), async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.user.id, req.validated);
    res.status(201).json(order);
  } catch (err) { next(err); }
});

// GET /api/orders — list user's orders
router.get('/', authenticate, async (req, res, next) => {
  try {
    const result = await orderService.getUserOrders(req.user.id, req.query);
    res.json(result);
  } catch (err) { next(err); }
});

// GET /api/orders/:id — get single order
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id, req.user.id, req.user.role);
    res.json(order);
  } catch (err) { next(err); }
});

// PATCH /api/orders/:id/status — update order status
router.patch('/:id/status', authenticate, validate(updateOrderStatusSchema), async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatus(
      req.params.id, req.validated.status, req.user.id, req.validated.note, req.user.role
    );
    res.json(order);
  } catch (err) { next(err); }
});

// ─── Saved Menus ─────────────────────────────────────

// POST /api/saved-menus
router.post('/saved-menus', authenticate, validate(savedMenuSchema), async (req, res, next) => {
  try {
    const { name, occasionId, guestCount, items } = req.validated;

    // Calculate total per head from server-side prices
    const dishIds = items.map(i => i.dishId);
    const dishes = await dishRepository.findManyByIds(dishIds);
    const dishMap = new Map(dishes.map(d => [d.id, d]));
    const totalPerHead = items.reduce((sum, item) => {
      const dish = dishMap.get(item.dishId);
      return sum + (dish?.pricePerHead || 0);
    }, 0);

    const savedMenu = await orderRepository.createSavedMenu({
      userId: req.user.id,
      name,
      occasionId: occasionId || null,
      guestCount,
      totalPerHead,
      items: items.map(item => ({
        dishId: item.dishId,
        quantity: item.quantity,
        dish: dishMap.get(item.dishId) || null,
      })),
    });

    res.status(201).json(savedMenu);
  } catch (err) { next(err); }
});

// GET /api/saved-menus
router.get('/saved-menus', authenticate, async (req, res, next) => {
  try {
    const menus = await orderRepository.listSavedMenus(req.user.id);
    res.json(menus);
  } catch (err) { next(err); }
});

// DELETE /api/saved-menus/:id
router.delete('/saved-menus/:id', authenticate, async (req, res, next) => {
  try {
    await orderRepository.deleteSavedMenu(req.params.id, req.user.id);
    res.json({ message: 'Menu deleted' });
  } catch (err) { next(err); }
});

// ─── Payment Routes ─────────────────────────────────────

// POST /api/orders/:id/pay — Initiate payment
router.post('/:id/pay', authenticate, async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id, req.user.id, req.user.role);
    
    if (order.paymentStatus === 'COMPLETED') {
      throw new AppError('Order is already paid', 400, 'ALREADY_PAID');
    }

    const paymentResponse = await paymentProvider.initiatePayment(order.id, order.totalAmount);
    
    await orderRepository.update(order.id, {
      paymentProvider: env.PAYMENT_PROVIDER,
      paymentRef: paymentResponse.paymentId,
    });

    res.json({
      success: true,
      data: {
        orderId: paymentResponse.paymentId,
        amount: order.totalAmount,
        currency: 'INR',
        keyId: env.RAZORPAY_KEY_ID,
      },
    });
  } catch (err) { next(err); }
});

// POST /api/orders/:id/verify-payment — Verify payment from frontend success callback
router.post('/:id/verify-payment', authenticate, async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id, req.user.id, req.user.role);

    // Idempotency: if already paid, return safely
    if (order.paymentStatus === 'COMPLETED') {
      return res.json({ success: true, data: order, message: 'Payment already completed' });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const verification = await paymentProvider.verifyPayment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    const newStatus = order.status === 'SUBMITTED' ? 'PENDING_PARTNER' : order.status;
    const now = new Date().toISOString();

    const historyEntry = {
      fromStatus: order.status,
      toStatus: newStatus,
      changedBy: req.user.id,
      note: `Payment verified via ${env.PAYMENT_PROVIDER}`,
      createdAt: now,
    };

    const newHistory = [historyEntry, ...(order.statusHistory || [])].slice(0, 15);

    const updatedOrder = await orderRepository.update(order.id, {
      status: newStatus,
      paymentStatus: verification.status,
      paymentRef: verification.transactionId,
      statusHistory: newHistory,
      updatedAt: now,
    });

    res.json({ success: true, data: updatedOrder });
  } catch (err) { next(err); }
});

// POST /api/orders/webhook/razorpay — Razorpay asynchronous webhook
router.post('/webhook/razorpay', async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const bodyText = JSON.stringify(req.body);
    const webhookSecret = env.RAZORPAY_WEBHOOK_SECRET || 'change_this_to_webhook_secret';
    
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(bodyText)
      .digest('hex');

    if (env.PAYMENT_PROVIDER !== 'mock' && expectedSignature !== signature) {
      return res.status(400).json({ success: false, error: 'Invalid webhook signature' });
    }

    const event = req.body;
    if (event.event === 'payment.captured') {
      const paymentEntity = event.payload.payment.entity;
      const razorpayOrderId = paymentEntity.order_id;
      const transactionId = paymentEntity.id;

      const order = await orderRepository.findByPaymentRef(razorpayOrderId);
      if (order) {
        await orderRepository.update(order.id, {
          paymentStatus: 'COMPLETED',
          paymentRef: transactionId,
        });
      }
    }
    
    res.json({ success: true, received: true });
  } catch (err) { next(err); }
});

export default router;
