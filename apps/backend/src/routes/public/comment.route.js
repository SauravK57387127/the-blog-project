import { Router } from 'express';
import CommentController from '../../controllers/public/comment.controller.js';

const router = Router();

/**
 * GET /api/public/comments/:blogId?page=1&limit=5
 * Get comments with nested replies
 */
router.get('/:blogId', CommentController.getBlogComments);

export default router;
