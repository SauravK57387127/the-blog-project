import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';
import NotificationService from '../../services/user/notification.service.js';

export default {
  getNotifications: asyncHandler(async (req, res) => {
   const userId = req.userId; 
    const { page = 1, limit = 10 } = req.query;

    const result = await NotificationService.getNotifications({
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

  markAsRead: asyncHandler(async (req, res) => {
   const userId = req.userId; 
    const { id } = req.params;

    const result = await NotificationService.markAsRead(userId, id);

    sendResponse({
      res,
      statusCode: result.success ? 200 : 403,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),

  markAllAsRead: asyncHandler(async (req, res) => {
   const userId = req.userId; 

    const result = await NotificationService.markAllAsRead(userId);

    sendResponse({
      res,
      statusCode: result.success ? 200 : 400,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),
};
