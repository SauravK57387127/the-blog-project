import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';
import UserNewsletterService from '../../services/user/newsletter.service.js';

export default {
  getStatus: asyncHandler(async (req, res) => {
   const userId = req.userId; 

    const result = await UserNewsletterService.getStatus(userId);

    sendResponse({
      res,
      statusCode: result.success ? 200 : 400,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),

  unsubscribe: asyncHandler(async (req, res) => {
   const userId = req.userId; 

    const result = await UserNewsletterService.unsubscribe(userId);

    sendResponse({
      res,
      statusCode: result.success ? 200 : 404,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),

  resubscribe: asyncHandler(async (req, res) => {
   const userId = req.userId; 

    const result = await UserNewsletterService.resubscribe(userId);

    sendResponse({
      res,
      statusCode: result.success ? 200 : 404,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),
};
