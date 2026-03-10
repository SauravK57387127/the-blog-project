import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';
import AnalyticsService from '../../services/admin/analytics.service.js';

export default {
  /**
   * GET /api/admin/analytics/writing-streak?period=month
   */
  getWritingStreak: asyncHandler(async (req, res) => {
    const { period = 'month' } = req.query;

    const result = await AnalyticsService.getWritingStreak({ period });

    sendResponse({
      res,
      statusCode: result.success ? 200 : 400,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),

  /**
   * GET /api/admin/analytics/sidebar-stats?period=year
   */
  getSidebarStats: asyncHandler(async (req, res) => {
    const { period = 'year' } = req.query;

    const result = await AnalyticsService.getSidebarStats({ period });

    sendResponse({
      res,
      statusCode: result.success ? 200 : 400,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),

  /**
   * GET /api/admin/analytics/recent-draft
   */
  getRecentDraft: asyncHandler(async (req, res) => {
    const result = await AnalyticsService.getRecentDraft();

    sendResponse({
      res,
      statusCode: result.success ? 200 : 404,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),

  /**
   * GET /api/admin/analytics/scheduled-upcoming?limit=5
   */
  getScheduledUpcoming: asyncHandler(async (req, res) => {
    const { limit = 5 } = req.query;

    const result = await AnalyticsService.getScheduledUpcoming({
      limit: parseInt(limit),
    });

    sendResponse({
      res,
      statusCode: result.success ? 200 : 400,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),

  /**
   * GET /api/admin/analytics/stale-drafts?limit=5
   */
  getStaleDrafts: asyncHandler(async (req, res) => {
    const { limit = 5 } = req.query;

    const result = await AnalyticsService.getStaleDrafts({
      limit: parseInt(limit),
    });

    sendResponse({
      res,
      statusCode: result.success ? 200 : 400,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),
};
