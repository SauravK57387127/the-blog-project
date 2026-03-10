import { Router } from 'express';
import { cacheMiddleware } from '../../middlewares/cache.middleware.js';
import SearchController from '../../controllers/public/search.controller.js';

const router = Router();

/**
 * GET /api/public/search/initial
 * Get initial search page data (categories, tags, popular reads)
 */
router.get(
  '/initial',
  cacheMiddleware(300),  // 5 min cache
  SearchController.getInitialData
);

export default router;
