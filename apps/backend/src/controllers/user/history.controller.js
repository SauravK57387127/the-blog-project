import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';
import HistoryService from '../../services/user/history.service.js';
import { getAuth } from '@clerk/express';

export default {
  getHistory: asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { page = 1, limit = 10 } = req.query;

    if (!userId) {
      return sendResponse({
        res,
        statusCode: 401,
        success: false,
        message: 'Unauthorized',
        data: null,
      });
    }

    const result = await HistoryService.getHistory({
      userId,
      page: parseInt(page),
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
