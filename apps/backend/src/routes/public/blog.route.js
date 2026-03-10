import { Router } from 'express';
import { cacheMiddleware } from '../../middlewares/cache.middleware.js';
import PublicBlogController from '../../controllers/public/blog.controller.js';

const router = Router();

/**
 * GET /api/public/blogs
 * List all published blogs with filtering
 * Query params: page, limit, tags, category, sort
 */
router.get(
  '/',
  cacheMiddleware(300),  // 5 min cache
  PublicBlogController.listBlogs
);

/**
 * GET /api/public/blogs/search
 * Search blogs by title/content
 * Query params: q (search term), tags, category
 */
router.get(
  '/search',
  cacheMiddleware(300),
  PublicBlogController.searchBlogs
);

/**
 * GET /api/public/blogs/popular
 * Get popular blogs (most viewed)
 */
router.get(
  '/popular',
  cacheMiddleware(600),  // 10 min cache
  PublicBlogController.getPopularBlogs
);

/**
 * GET /api/public/blogs/:slug
 * Get single blog by slug
 */
router.get(
  '/:slug',
  cacheMiddleware(3600),  // 1 hour cache
  PublicBlogController.getBlogBySlug
);

/**
 * GET /api/public/blogs/:slug/related
 * Get related blogs (same tags)
 */
router.get(
  '/:slug/related',
  cacheMiddleware(3600),
  PublicBlogController.getRelatedBlogs
);

export default router;
