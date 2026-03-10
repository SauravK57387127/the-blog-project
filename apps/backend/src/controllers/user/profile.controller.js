import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';
import ProfileService from '../../services/user/profile.service.js';
import { getAuth } from '@clerk/express';

export default {
  getProfile: asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);

    if (!userId) {
      return sendResponse({
        res,
        statusCode: 401,
        success: false,
        message: 'Unauthorized',
        data: null,
      });
    }

    const result = await ProfileService.getProfile(userId);

    sendResponse({
      res,
      statusCode: result.success ? 200 : 404,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),
};
