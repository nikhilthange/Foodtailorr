// Partner routes — dashboard, dishes, orders
import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { AppError } from '../middleware/errorHandler.js';
import * as partnerService from '../services/partner.service.js';
import * as orderService from '../services/order.service.js';
import { updatePartnerProfileSchema, dishSchema, updateOrderStatusSchema } from '../validators/schemas.js';

const router = Router();

// All partner routes require PARTNER role
router.use(authenticate, requireRole('PARTNER'));

// GET /api/partner/dashboard
router.get('/dashboard', async (req, res, next) => {
  try {
    const dashboard = await partnerService.getPartnerDashboard(req.user.id);
    res.json(dashboard);
  } catch (err) { next(err); }
});

// GET /api/partner/profile
router.get('/profile', async (req, res, next) => {
  try {
    const profile = await partnerService.getPartnerProfile(req.user.id);
    res.json(profile);
  } catch (err) { next(err); }
});

// PATCH /api/partner/profile
router.patch('/profile', validate(updatePartnerProfileSchema), async (req, res, next) => {
  try {
    const updated = await partnerService.updatePartnerProfile(req.user.id, req.validated);
    res.json(updated);
  } catch (err) { next(err); }
});

// GET /api/partner/dishes
router.get('/dishes', async (req, res, next) => {
  try {
    const dishes = await partnerService.getPartnerDishes(req.user.id);
    res.json(dishes);
  } catch (err) { next(err); }
});

// POST /api/partner/dishes
router.post('/dishes', validate(dishSchema), async (req, res, next) => {
  try {
    const dish = await partnerService.createPartnerDish(req.user.id, req.validated);
    res.status(201).json(dish);
  } catch (err) { next(err); }
});

// PATCH /api/partner/dishes/:id
router.patch('/dishes/:id', validate(dishSchema), async (req, res, next) => {
  try {
    const dish = await partnerService.updatePartnerDish(req.user.id, req.params.id, req.validated);
    res.json(dish);
  } catch (err) { next(err); }
});

// DELETE /api/partner/dishes/:id
router.delete('/dishes/:id', async (req, res, next) => {
  try {
    await partnerService.deletePartnerDish(req.user.id, req.params.id);
    res.json({ message: 'Dish deleted' });
  } catch (err) { next(err); }
});

// GET /api/partner/orders
router.get('/orders', async (req, res, next) => {
  try {
    const { partnerRepository } = await import('../repositories/dynamodb/index.js');
    let partner = await partnerRepository.findByUserId(req.user.id);
    if (!partner && req.user.partnerId) {
      partner = await partnerRepository.findById(req.user.partnerId);
    }
    if (!partner && req.user.id) {
      partner = await partnerRepository.findById(req.user.id);
    }
    if (!partner) throw new AppError('Partner not found', 404, 'NOT_FOUND');
    const result = await orderService.getPartnerOrders(partner.id, req.query);
    res.json(result);
  } catch (err) { next(err); }
});

// PATCH /api/partner/orders/:id/status
router.patch('/orders/:id/status', validate(updateOrderStatusSchema), async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatus(
      req.params.id, req.validated.status, req.user.id, req.validated.note, 'PARTNER'
    );
    res.json(order);
  } catch (err) { next(err); }
});

// GET /api/partner/analytics
router.get('/analytics', async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const data = await partnerService.getPartnerAnalytics(req.user.id, days);
    res.json(data);
  } catch (err) { next(err); }
});

export default router;
