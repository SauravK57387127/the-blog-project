import { Router } from 'express';
import TagController from '../../controllers/admin/tag.controller.js';


const router = Router();

// /api/admin/tags
router.get('/', TagController.list);
router.post('/', TagController.create);
router.delete('/:tagId', TagController.remove);

export default router;
