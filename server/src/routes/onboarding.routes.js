// Partner Onboarding routes
import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import * as onboardingService from '../services/onboarding.service.js';

const router = Router();

// GET /api/onboarding/status — Get current onboarding status for logged-in partner
router.get('/status', authenticate, async (req, res, next) => {
  try {
    const status = await onboardingService.getOnboardingStatus(req.user.id);
    res.json(status);
  } catch (err) { next(err); }
});

// POST /api/onboarding/draft — Save or resume onboarding draft
router.post('/draft', authenticate, async (req, res, next) => {
  try {
    const result = await onboardingService.saveDraft(req.user.id, req.body);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

// POST /api/onboarding/submit — Final submission of onboarding application
router.post('/submit', authenticate, async (req, res, next) => {
  try {
    const result = await onboardingService.submitOnboarding(req.user.id, req.body);
    res.status(201).json(result);
  } catch (err) { next(err); }
});

// GET /api/onboarding/admin/applications — Admin list of all applications
router.get('/admin/applications', authenticate, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const result = await onboardingService.listApplications(req.query);
    res.json(result);
  } catch (err) { next(err); }
});

// Admin review approval/rejection handlers
const handleAdminReview = async (req, res, next) => {
  try {
    const result = await onboardingService.reviewApplication(req.params.id, {
      ...req.body,
      reviewerNotes: req.body.reviewNotes || req.body.reviewerNotes,
      reviewedBy: req.user.id,
    });
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

router.patch('/admin/review/:id', authenticate, requireRole('ADMIN'), handleAdminReview);
router.post('/admin/:id/status', authenticate, requireRole('ADMIN'), handleAdminReview);
router.patch('/admin/:id/status', authenticate, requireRole('ADMIN'), handleAdminReview);

export default router;
