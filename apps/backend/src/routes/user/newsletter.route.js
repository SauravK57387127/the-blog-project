import { Router } from 'express';
import UserNewsletterController from '../../controllers/user/newsletter.controller.js';

const router = Router();

/**
 * GET /api/user/newsletter/status
 * Check if user is subscribed
 */
router.get('/status', UserNewsletterController.getStatus);

/**
 * POST /api/user/newsletter/unsubscribe
 * Unsubscribe authenticated user
 */
router.post('/unsubscribe', UserNewsletterController.unsubscribe);

/**
 * POST /api/user/newsletter/resubscribe
 * Resubscribe authenticated user
 */
router.post('/resubscribe', UserNewsletterController.resubscribe);

export default router;
