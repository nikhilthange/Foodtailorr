// AI routes — menu recommendation and refinement
import { Router } from 'express';
import { generateRecommendation, getRecommendationById } from '../ai/pipeline.js';
import { validate } from '../middleware/validate.js';
import { optionalAuth } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import { menuRecommendationSchema } from '../validators/schemas.js';

const router = Router();

// POST /api/ai/recommend-menu
router.post('/recommend-menu', aiLimiter, optionalAuth, validate(menuRecommendationSchema), async (req, res, next) => {
  try {
    const result = await generateRecommendation(req.validated, req.user?.id || null);
    res.json(result);
  } catch (err) { next(err); }
});

// GET /api/ai/recommendations/:id
router.get('/recommendations/:id', async (req, res, next) => {
  try {
    const recommendation = await getRecommendationById(req.params.id);
    if (!recommendation) return res.status(404).json({ error: 'Recommendation not found' });
    res.json(recommendation);
  } catch (err) { next(err); }
});

export default router;
