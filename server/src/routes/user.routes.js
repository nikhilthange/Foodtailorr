// User profile routes
import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateProfileSchema, updatePreferencesSchema } from '../validators/schemas.js';
import { prisma } from '../config/database.js';

const router = Router();

router.use(authenticate);

// GET /api/users/profile
router.get('/profile', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, email: true, firstName: true, lastName: true, phone: true,
        role: true, createdAt: true,
        preferences: true,
        addresses: true,
      },
    });
    res.json(user);
  } catch (err) { next(err); }
});

// PATCH /api/users/profile
router.patch('/profile', validate(updateProfileSchema), async (req, res, next) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: req.validated,
      select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true },
    });
    res.json(user);
  } catch (err) { next(err); }
});

// PUT /api/users/preferences
router.put('/preferences', validate(updatePreferencesSchema), async (req, res, next) => {
  try {
    const prefs = await prisma.userPreference.upsert({
      where: { userId: req.user.id },
      update: req.validated,
      create: { userId: req.user.id, ...req.validated },
    });
    res.json(prefs);
  } catch (err) { next(err); }
});

export default router;
