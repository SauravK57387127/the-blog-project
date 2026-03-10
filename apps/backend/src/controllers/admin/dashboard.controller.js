import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';
import DashboardService from '../../services/admin/dashboard.service.js';

export default {
  getStats: asyncHandler(async (req, res) => {
    const result = await DashboardService.getStats();

    sendResponse({
      res,
      statusCode: result.success ? 200 : 500,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),

  getRecentActivity: asyncHandler(async (req, res) => {
    const { limit = 10 } = req.query;

    const result = await DashboardService.getRecentActivity(parseInt(limit));

    sendResponse({
      res,
      statusCode: result.success ? 200 : 500,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),
};
