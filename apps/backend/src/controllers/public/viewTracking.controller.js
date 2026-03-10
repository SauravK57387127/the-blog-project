import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';
import ViewTrackingService from '../../services/public/viewTracking.service.js';

export default {
  /**
   * POST /api/public/views/track
   */
  trackView: asyncHandler(async (req, res) => {
    const { blogId, sessionId, userId, referrer, device } = req.body;

    if (!blogId || !sessionId) {
      return sendResponse({
        res,
        statusCode: 400,
        success: false,
        message: 'blogId and sessionId required',
        data: null,
      });
    }

    const result = await ViewTrackingService.trackView({
      blogId,
      sessionId,
      userId,
      referrer,
      device,
    });

    sendResponse({
      res,
      statusCode: result.success ? 201 : 400,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),

  /**
   * POST /api/public/views/update
   */
  updateView: asyncHandler(async (req, res) => {
    const { blogId, sessionId, timeSpent, scrollDepth, completed } = req.body;

    if (!blogId || !sessionId) {
      return sendResponse({
        res,
        statusCode: 400,
        success: false,
        message: 'blogId and sessionId required',
        data: null,
      });
    }

    const result = await ViewTrackingService.updateView({
      blogId,
      sessionId,
      timeSpent,
      scrollDepth,
      completed,
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
