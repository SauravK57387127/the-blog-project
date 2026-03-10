import { Router } from 'express';
import LikeController from '../../controllers/user/like.controller.js';

const router = Router();

/**
 * POST /api/user/likes/:blogId
 * Like a blog (toggle: if already liked, unlike)
 */
router.post('/:blogId', LikeController.toggleLike);

/**
 * DELETE /api/user/likes/:blogId
 * Unlike a blog
 */
router.delete('/:blogId', LikeController.unlikeBlog);

/**
 * GET /api/user/likes
 * Get all my liked blogs
 */
router.get('/', LikeController.getMyLikes);

export default router;
