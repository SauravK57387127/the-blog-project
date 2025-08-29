import { Router } from 'express';
import PublicBlogController from '../../controllers/public/blog.controller.js';


const router = Router();

// /api/blogs        → list published blogs
router.get('/', PublicBlogController.getAllBlogs);
router.get('/:slug', PublicBlogController.getBlogBySlug);

// /api/blogs/popular → popular (Redis cached)
router.get('/popular', PublicBlogController.popular);

// /api/blogs/recent  → recent blogs
router.get('/recent', PublicBlogController.recent);


export default router;


