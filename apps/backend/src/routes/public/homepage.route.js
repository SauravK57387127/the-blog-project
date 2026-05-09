import { Router } from 'express';
import { cacheMiddleware } from '../../middlewares/cache.middleware.js';
import HomepageController from '../../controllers/public/homepage.controller.js';

const router = Router();

/**
 * GET /api/public/homepage
 * Get all homepage data in one request
 * Returns: hero, recentHighlights, latestStories, popularMonthly, featuredTags
 */
router.get(
    '/',
    cacheMiddleware(300), // 5 min cache
    HomepageController.getHomepageData,
);

export default router;
