import { Router } from 'express';
import AnalyticsController from '../../controllers/admin/analytics.controller.js';


const router = Router();

// /api/admin/analytics/overview
router.get('/overview', AnalyticsController.overview);

// /api/admin/analytics/blog/:id
router.get('/blog/:id', AnalyticsController.blogStats);

export default router;
