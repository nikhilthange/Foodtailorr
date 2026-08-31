// Admin routes — user/partner/catalog/order management
import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as adminService from '../services/admin.service.js';
import * as orderService from '../services/order.service.js';
import { adminUpdateUserSchema, adminUpdatePartnerSchema, updateOrderStatusSchema } from '../validators/schemas.js';

const router = Router();

// All admin routes require ADMIN role
router.use(authenticate, requireRole('ADMIN'));

// GET /api/admin/dashboard
router.get('/dashboard', async (req, res, next) => {
  try {
    const dashboard = await adminService.getDashboard();
    res.json(dashboard);
  } catch (err) { next(err); }
});

// GET /api/admin/users
router.get('/users', async (req, res, next) => {
  try {
    const result = await adminService.getUsers(req.query);
    res.json(result);
  } catch (err) { next(err); }
});

// PATCH /api/admin/users/:id
router.patch('/users/:id', validate(adminUpdateUserSchema), async (req, res, next) => {
  try {
    const user = await adminService.updateUser(req.params.id, req.validated);
    res.json(user);
  } catch (err) { next(err); }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res, next) => {
  try {
    const user = await adminService.deleteUser(req.params.id);
    res.json(user);
  } catch (err) { next(err); }
});

// GET /api/admin/partners
router.get('/partners', async (req, res, next) => {
  try {
    const result = await adminService.getAllPartners(req.query);
    res.json(result);
  } catch (err) { next(err); }
});

// PATCH /api/admin/partners/:id
router.patch('/partners/:id', validate(adminUpdatePartnerSchema), async (req, res, next) => {
  try {
    const partner = await adminService.updatePartner(req.params.id, req.validated);
    res.json(partner);
  } catch (err) { next(err); }
});

// GET /api/admin/orders
router.get('/orders', async (req, res, next) => {
  try {
    const result = await orderService.getAllOrders(req.query);
    res.json(result);
  } catch (err) { next(err); }
});

// PATCH /api/admin/orders/:id/status
router.patch('/orders/:id/status', validate(updateOrderStatusSchema), async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatus(
      req.params.id, req.validated.status, req.user.id, req.validated.note, 'ADMIN'
    );
    res.json(order);
  } catch (err) { next(err); }
});

// GET /api/admin/ai-logs
router.get('/ai-logs', async (req, res, next) => {
  try {
    const result = await adminService.getAILogs(req.query);
    res.json(result);
  } catch (err) { next(err); }
});

// GET /api/admin/categories
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await adminService.getCategories();
    res.json(categories);
  } catch (err) { next(err); }
});

// POST /api/admin/categories
router.post('/categories', async (req, res, next) => {
  try {
    const category = await adminService.createCategory(req.body.name, req.body.sortOrder);
    res.status(201).json(category);
  } catch (err) { next(err); }
});

// DELETE /api/admin/categories/:id
router.delete('/categories/:id', async (req, res, next) => {
  try {
    await adminService.deleteCategory(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
});

// GET /api/admin/dishes
router.get('/dishes', async (req, res, next) => {
  try {
    const result = await adminService.getDishes(req.query);
    res.json(result);
  } catch (err) { next(err); }
});

// POST /api/admin/dishes
router.post('/dishes', async (req, res, next) => {
  try {
    const dish = await adminService.createDish(req.body);
    res.status(201).json(dish);
  } catch (err) { next(err); }
});

// PATCH /api/admin/dishes/:id
router.patch('/dishes/:id', async (req, res, next) => {
  try {
    const dish = await adminService.updateDish(req.params.id, req.body);
    res.json(dish);
  } catch (err) { next(err); }
});

// DELETE /api/admin/dishes/:id
router.delete('/dishes/:id', async (req, res, next) => {
  try {
    await adminService.deleteDish(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
});

// POST /api/admin/cuisines
router.post('/cuisines', async (req, res, next) => {
  try {
    const cuisine = await adminService.createCuisine(req.body.name, req.body.description);
    res.status(201).json(cuisine);
  } catch (err) { next(err); }
});

// POST /api/admin/occasions
router.post('/occasions', async (req, res, next) => {
  try {
    const occasion = await adminService.createOccasion(req.body);
    res.status(201).json(occasion);
  } catch (err) { next(err); }
});

// GET /api/admin/analytics
router.get('/analytics', async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const data = await adminService.getAnalytics(days);
    res.json(data);
  } catch (err) { next(err); }
});

export default router;
