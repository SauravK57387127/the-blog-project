import { Router } from 'express';
import NewsletterController from '../../controllers/public/newsletter.controller.js';

const router = Router();

/**
 * POST /api/public/newsletter/subscribe
 * Subscribe to newsletter (anonymous or authenticated)
 */
router.post('/subscribe', NewsletterController.subscribe);

/**
 * GET /api/public/newsletter/unsubscribe/:token
 * Unsubscribe via email link
 */
router.get('/unsubscribe/:token', NewsletterController.unsubscribeByToken);

export default router;
