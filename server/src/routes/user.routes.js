// User profile routes using DynamoDB Repositories
import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateProfileSchema, updatePreferencesSchema } from '../validators/schemas.js';
import { userRepository } from '../repositories/dynamodb/index.js';

const router = Router();

router.use(authenticate);

// GET /api/users/profile
router.get('/profile', async (req, res, next) => {
  try {
    const user = await userRepository.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const preferences = await userRepository.getPreferences(req.user.id);

    const safeUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      preferences: preferences || {},
      addresses: user.addresses || [],
    };

    res.json(safeUser);
  } catch (err) { next(err); }
});

// PATCH /api/users/profile
router.patch('/profile', validate(updateProfileSchema), async (req, res, next) => {
  try {
    const user = await userRepository.update(req.user.id, req.validated);
    const safeUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
    };
    res.json(safeUser);
  } catch (err) { next(err); }
});

// PUT /api/users/preferences
router.put('/preferences', validate(updatePreferencesSchema), async (req, res, next) => {
  try {
    const prefs = await userRepository.updatePreferences(req.user.id, req.validated);
    res.json(prefs);
  } catch (err) { next(err); }
});

export default router;
