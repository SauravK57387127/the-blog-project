import { Router } from 'express';
import LikeController from '../../controllers/user/like.controller.js';

const router = Router();

// blog like / unlike
router.get('/blog/:blogId',    LikeController.listBlog);    // list likes of blog
router.post('/blog/:blogId',    LikeController.add);    // like
router.delete('/blog/:blogId',  LikeController.remove); // unlike

// comment like / unlike
router.get('/comment/:commentId', LikeController.listComment);    // liked on a comment
router.post('/comment/:commentId',   LikeController.add);
router.delete('/comment/:commentId', LikeController.remove);

export default router;


