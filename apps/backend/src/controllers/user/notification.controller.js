import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';
import NotificationService from '../../services/user/notification.service.js';
import { getAuth } from '@clerk/express';

export default {
  getNotifications: asyncHandler(async (req, res) => {
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
    const { userId } = getAuth(req);
    const { id } = req.params;

    if (!userId) {
      return sendResponse({
        res,
        statusCode: 401,
        success: false,
        message: 'Unauthorized',
        data: null,
      });
    }

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
