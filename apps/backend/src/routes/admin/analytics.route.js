import { Router } from 'express';
import AnalyticsController from '../../controllers/admin/analytics.controller.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

/**
 * GET /api/admin/analytics/writing-streak?period=month|week|year
 * Get writing streak graph data
 */
router.get('/writing-streak', AnalyticsController.getWritingStreak);

/**
 * GET /api/admin/analytics/sidebar-stats?period=year|week|month
 * Get sidebar statistics
 */
router.get('/sidebar-stats', AnalyticsController.getSidebarStats);

/**
 * GET /api/admin/analytics/recent-draft
 * Get most recent draft (pickup where you left off)
 */
router.get('/recent-draft', AnalyticsController.getRecentDraft);

/**
 * GET /api/admin/analytics/scheduled-upcoming?limit=5
 * Get upcoming scheduled blogs
 */
router.get('/scheduled-upcoming', AnalyticsController.getScheduledUpcoming);

/**
 * GET /api/admin/analytics/stale-drafts?limit=5
 * Get drafts that need attention
 */
router.get('/stale-drafts', AnalyticsController.getStaleDrafts);

export default router;
