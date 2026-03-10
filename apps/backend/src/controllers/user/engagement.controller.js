import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';
import EngagementService from '../../services/user/engagement.service.js';
import { getAuth } from '@clerk/express';

export default {
  getEngagementStatus: asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { blogId } = req.params;

    if (!userId) {
      return sendResponse({
        res,
        statusCode: 401,
        success: false,
        message: 'Unauthorized',
        data: null,
      });
    }

    const result = await EngagementService.getEngagementStatus({
      userId,
      blogId,
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
