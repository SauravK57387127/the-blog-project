import { Router } from 'express';
import { sanitizeFields } from '../../middlewares/sanitize.middleware.js';
import { sanitizeHTML } from '../../utils/sanitize.js';
import CommentController from '../../controllers/user/comment.controller.js';

const router = Router();

/**
 * GET /api/user/comments/my?page=1&limit=10
 * Get all my comments
 */
router.get('/my', CommentController.getMyComments);

/**
 * POST /api/user/comments/:blogId
 * Add comment to blog
 */
router.post(
    '/:blogId',
    sanitizeFields({ content: sanitizeHTML, parentId: (val) => val || null }),
    CommentController.addComment,
);

/**
 * PUT /api/user/comments/:commentId
 * Update my comment
 */
router.put(
    '/:commentId',
    sanitizeFields({ content: sanitizeHTML }),
    CommentController.updateComment,
);

/**
 * DELETE /api/user/comments/:commentId
 * Delete my comment
 */
router.delete('/:commentId', CommentController.deleteComment);

export default router;
