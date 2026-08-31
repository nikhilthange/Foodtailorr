// Order routes — create, list, status management
import { Router } from 'express';
import * as orderService from '../services/order.service.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createOrderSchema, updateOrderStatusSchema, savedMenuSchema } from '../validators/schemas.js';
import { prisma } from '../config/database.js';

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
    const dishes = await prisma.dish.findMany({ where: { id: { in: dishIds } } });
    const dishMap = new Map(dishes.map(d => [d.id, d]));
    const totalPerHead = items.reduce((sum, item) => {
      const dish = dishMap.get(item.dishId);
      return sum + (dish?.pricePerHead || 0);
    }, 0);

    const savedMenu = await prisma.savedMenu.create({
      data: {
        userId: req.user.id,
        name,
        occasionId: occasionId || null,
        guestCount,
        totalPerHead,
        items: {
          create: items.map(item => ({
            dishId: item.dishId,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: { include: { dish: { include: { partner: { select: { id: true, businessName: true } } } } } } },
    });

    res.status(201).json(savedMenu);
  } catch (err) { next(err); }
});

// GET /api/saved-menus
router.get('/saved-menus', authenticate, async (req, res, next) => {
  try {
    const menus = await prisma.savedMenu.findMany({
      where: { userId: req.user.id },
      include: {
        items: { include: { dish: { include: { partner: { select: { id: true, businessName: true } }, category: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(menus);
  } catch (err) { next(err); }
});

// DELETE /api/saved-menus/:id
router.delete('/saved-menus/:id', authenticate, async (req, res, next) => {
  try {
    const menu = await prisma.savedMenu.findUnique({ where: { id: req.params.id } });
    if (!menu || menu.userId !== req.user.id) {
      return res.status(404).json({ error: 'Saved menu not found' });
    }
    await prisma.savedMenu.delete({ where: { id: req.params.id } });
    res.json({ message: 'Menu deleted' });
  } catch (err) { next(err); }
});

export default router;
