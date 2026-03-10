import { Router } from 'express';
import EngagementController from '../../controllers/user/engagement.controller.js';

const router = Router();

/**
 * GET /api/user/engagement/:blogId
 * Check if current user has liked/bookmarked this blog
 * Returns: { isLiked: boolean, isBookmarked: boolean }
 */
router.get('/:blogId', EngagementController.getEngagementStatus);

export default router;
