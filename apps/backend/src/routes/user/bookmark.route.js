import { Router } from 'express';
import BookmarkController from '../../controllers/user/bookmark.controller.js';


const router = Router();

// /api/user/bookmarks
router.get('/', BookmarkController.list);
router.post('/:blogId', BookmarkController.add);
router.delete('/:blogId', BookmarkController.remove);

export default router;
