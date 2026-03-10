import { Router } from 'express';
import BookmarkController from '../../controllers/user/bookmark.controller.js';

const router = Router();

/**
 * POST /api/user/bookmarks/:blogId
 * Bookmark a blog (toggle)
 */
router.post('/:blogId', BookmarkController.toggleBookmark);

/**
 * DELETE /api/user/bookmarks/:blogId
 * Remove bookmark
 */
router.delete('/:blogId', BookmarkController.removeBookmark);

/**
 * GET /api/user/bookmarks
 * Get all my bookmarks
 */
router.get('/', BookmarkController.getMyBookmarks);

export default router;
