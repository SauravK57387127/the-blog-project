import { Router } from 'express';
import ViewTrackingController from '../../controllers/public/viewTracking.controller.js';

const router = Router();

/**
 * POST /api/public/views/track
 * Track initial blog view
 * Body: { blogId, sessionId, userId?, referrer?, device? }
 */
router.post('/track', ViewTrackingController.trackView);

/**
 * POST /api/public/views/update
 * Update view metrics (timeSpent, scrollDepth, completed)
 * Body: { blogId, sessionId, timeSpent, scrollDepth, completed }
 */
router.post('/update', ViewTrackingController.updateView);

export default router;
