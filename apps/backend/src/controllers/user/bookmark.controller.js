import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';
import BookmarkService from '../../services/user/bookmark.service.js';
import { getAuth } from '@clerk/express';

export default {
  toggleBookmark: asyncHandler(async (req, res) => {
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

    const result = await BookmarkService.toggleBookmark({ userId, blogId });

    sendResponse({
      res,
      statusCode: result.success ? 200 : 400,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),

  removeBookmark: asyncHandler(async (req, res) => {
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

    const result = await BookmarkService.removeBookmark({ userId, blogId });

    sendResponse({
      res,
      statusCode: result.success ? 200 : 404,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),

  getMyBookmarks: asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { page = 1, limit = 20 } = req.query;

    if (!userId) {
      return sendResponse({
        res,
        statusCode: 401,
        success: false,
        message: 'Unauthorized',
        data: null,
      });
    }

    const result = await BookmarkService.getMyBookmarks({
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
