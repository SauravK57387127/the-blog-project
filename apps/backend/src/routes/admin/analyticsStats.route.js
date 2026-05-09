import { Router } from 'express';
import AnalyticsStatsController from '../../controllers/admin/analyticsStats.controller.js';

const router = Router();

// ... existing routes

/**
 * Analytics page stats endpoints
 */

/**
 * GET /api/admin/analytics/overview
 * Total views, posts, avg read time, subscribers
 */
router.get('/overview', AnalyticsStatsController.getOverviewStats);

/**
 * GET /api/admin/analytics/views-30d
 * Daily views for last 30 days
 */
router.get('/views-30d', AnalyticsStatsController.getViewsLast30Days);

/**
 * GET /api/admin/analytics/top-posts?limit=5
 * Top performing posts (6 months)
 */
router.get('/top-posts', AnalyticsStatsController.getTopPerformingPosts);

/**
 * GET /api/admin/analytics/category-breakdown
 * Views by category
 */
router.get(
    '/category-breakdown',
    AnalyticsStatsController.getCategoryBreakdown,
);

/**
 * GET /api/admin/analytics/personal-best
 * Best day + best month
 */
router.get('/personal-best', AnalyticsStatsController.getPersonalBest);

export default router;
