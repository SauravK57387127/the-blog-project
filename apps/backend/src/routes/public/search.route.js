// backend/routes/public/search.route.js
import { Router } from 'express';
import SearchController from '../../controllers/public/search.controller.js';


const router = Router();

// /api/blogs/search?q=query
router.get('/blogs/search', SearchController.searchBlogs);

export default router;

