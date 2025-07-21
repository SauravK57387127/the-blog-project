import { Router } from 'express';
import CommentController from '../../controllers/user/comment.controller.js';


const router = Router();

// /api/user/comments
router.get('/:blogId', CommentController.list)
router.post('/:blogId', CommentController.add);
router.put('/:commentId', CommentController.update);
router.delete('/:commentId', CommentController.remove);
router.post('/:commentId/like', CommentController.like);

export default router;


