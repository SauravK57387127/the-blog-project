// backend/routes/public/tag.route.js
import { Router } from 'express';
import TagController from '../../controllers/public/tag.controller.js';


const router = Router();

// /api/tags/:slug → blogs by tag
router.get('/:slug', TagController.blogsByTag);

export default router;
