import { Router } from 'express';
import { cacheMiddleware } from '../../middlewares/cache.middleware.js';
import AuthorController from '../../controllers/public/author.controller.js';

const router = Router();

/**
 * GET /api/public/authors/me
 * Get the single active author — used by about page and blog detail page.
 * No ID needed.
 */
router.get(
  '/me',
  cacheMiddleware(3600),
  AuthorController.getActiveAuthor
);

/**
 * GET /api/public/authors/:authorId
 * Get author by ID
 */
router.get(
  '/:authorId',
  cacheMiddleware(3600),  // 1 hour cache
  AuthorController.getAuthor
);

export default router;
