import { Router } from 'express';
import AdminBlogController from '../../controllers/admin/blog.controller.js';


const router = Router();

// /api/admin/blogs
router.get('/', AdminBlogController.list);
router.post('/', AdminBlogController.create);

router.get('/drafts', AdminBlogController.listDrafts);
router.put('/drafts/:draftId', AdminBlogController.updateDraft);
router.delete('/drafts/:draftId', AdminBlogController.deleteDraft);

router.put('/:blogId', AdminBlogController.update);
router.delete('/:blogId', AdminBlogController.remove);

router.post('/:blogId/publish', AdminBlogController.publishNow);
router.post('/:blogId/schedule', AdminBlogController.schedulePublish);

export default router;
 