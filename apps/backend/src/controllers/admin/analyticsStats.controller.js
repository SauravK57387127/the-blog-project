import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';
import AnalyticsStatsService from '../../services/admin/analyticsStats.service.js';

export default {
    /**
     * GET /api/admin/analytics/overview
     */
    getOverviewStats: asyncHandler(async (req, res) => {
        const result = await AnalyticsStatsService.getOverviewStats();

        sendResponse({
            res,
            statusCode: result.success ? 200 : 500,
            success: result.success,
            message: result.message,
            data: result.data,
        });
    }),

    /**
     * GET /api/admin/analytics/views-30d
     */
    getViewsLast30Days: asyncHandler(async (req, res) => {
        const result = await AnalyticsStatsService.getViewsLast30Days();

        sendResponse({
            res,
            statusCode: result.success ? 200 : 500,
            success: result.success,
            message: result.message,
            data: result.data,
        });
    }),

    /**
     * GET /api/admin/analytics/top-posts?limit=5
     */
    getTopPerformingPosts: asyncHandler(async (req, res) => {
        const { limit = 5 } = req.query;

        const result = await AnalyticsStatsService.getTopPerformingPosts({
            limit: parseInt(limit),
        });

        sendResponse({
            res,
            statusCode: result.success ? 200 : 500,
            success: result.success,
            message: result.message,
            data: result.data,
        });
    }),

    /**
     * GET /api/admin/analytics/category-breakdown
     */
    getCategoryBreakdown: asyncHandler(async (req, res) => {
        const result = await AnalyticsStatsService.getCategoryBreakdown();

        sendResponse({
            res,
            statusCode: result.success ? 200 : 500,
            success: result.success,
            message: result.message,
            data: result.data,
        });
    }),

    /**
     * GET /api/admin/analytics/personal-best
     */
    getPersonalBest: asyncHandler(async (req, res) => {
        const result = await AnalyticsStatsService.getPersonalBest();

        sendResponse({
            res,
            statusCode: result.success ? 200 : 500,
            success: result.success,
            message: result.message,
            data: result.data,
        });
    }),
};
