import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';
import EngagementService from '../../services/user/engagement.service.js';

export default {
  getEngagementStatus: asyncHandler(async (req, res) => {
   const  userId  = req.userId;
 
    const { blogId } = req.params;

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
