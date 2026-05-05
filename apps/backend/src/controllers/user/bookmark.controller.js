import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';
import BookmarkService from '../../services/user/bookmark.service.js';

export default {
    toggleBookmark: asyncHandler(async (req, res) => {
        const userId = req.userId;

        const { blogId } = req.params;

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
        const { blogId } = req.params;
        const userId = req.userId;

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
        const { page = 1, limit = 20 } = req.query;
        const userId = req.userId;

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
