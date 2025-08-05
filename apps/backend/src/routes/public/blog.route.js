import { Router } from 'express';
import BlogController from '../../controllers/public/blog.controller.js';


const router = Router();

// /api/blogs        → list published blogs
router.get('/', BlogController.getAllBlogs);

// /api/blogs/popular → popular (Redis cached)
router.get('/popular', BlogController.popular);

// /api/blogs/recent  → recent blogs
router.get('/recent', BlogController.recent);

// /api/blogs/:slug   → single blog by slug
router.get('/:slug', BlogController.getBySlug);

export default router;

 