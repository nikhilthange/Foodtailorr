// Catalog routes — public endpoints for partners, dishes, categories, occasions
import { Router } from 'express';
import * as catalogService from '../services/catalog.service.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// GET /api/catalog/partners
router.get('/partners', async (req, res, next) => {
  try {
    const result = await catalogService.getPartners(req.query);
    res.json(result);
  } catch (err) { next(err); }
});

// GET /api/catalog/partners/:id
router.get('/partners/:id', async (req, res, next) => {
  try {
    const partner = await catalogService.getPartnerWithDishes(req.params.id);
    if (!partner) throw new AppError('Partner not found', 404, 'NOT_FOUND');
    res.json(partner);
  } catch (err) { next(err); }
});

// GET /api/catalog/dishes
router.get('/dishes', async (req, res, next) => {
  try {
    const result = await catalogService.getDishes(req.query);
    res.json(result);
  } catch (err) { next(err); }
});

// GET /api/catalog/dishes/:id
router.get('/dishes/:id', async (req, res, next) => {
  try {
    const dish = await catalogService.getDishById(req.params.id);
    if (!dish) throw new AppError('Dish not found', 404, 'NOT_FOUND');
    res.json(dish);
  } catch (err) { next(err); }
});

// GET /api/catalog/categories
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await catalogService.getCategories();
    res.json(categories);
  } catch (err) { next(err); }
});

// GET /api/catalog/cuisines
router.get('/cuisines', async (req, res, next) => {
  try {
    const cuisines = await catalogService.getCuisines();
    res.json(cuisines);
  } catch (err) { next(err); }
});

// GET /api/catalog/occasions
router.get('/occasions', async (req, res, next) => {
  try {
    const occasions = await catalogService.getOccasions();
    res.json(occasions);
  } catch (err) { next(err); }
});

// Legacy compatibility: GET /api/brands (maps to partners)
router.get('/brands', async (req, res, next) => {
  try {
    const result = await catalogService.getPartners(req.query);
    // Map to old format for backward compatibility
    const brands = result.partners.map(p => ({
      id: p.id,
      name: p.businessName,
      tagline: p.tagline,
      cuisine: p.cuisine,
      description: p.description,
      why_we_picked: p.whyWePicked,
      established: p.established,
      dishCount: p.dishCount,
    }));
    res.json(brands);
  } catch (err) { next(err); }
});

export default router;
