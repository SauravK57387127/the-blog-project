import { Router } from 'express';
import DashboardController from '../../controllers/admin/dashboard.controller.js';

const router = Router();

/**
 * GET /api/admin/dashboard/stats
 * Dashboard overview statistics
 */
router.get('/stats', DashboardController.getStats);

/**
 * GET /api/admin/dashboard/activity
 * Recent activity feed
 */
router.get('/activity', DashboardController.getRecentActivity);

export default router;
