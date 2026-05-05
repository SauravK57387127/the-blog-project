import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';
import LikeService from '../../services/user/like.service.js';

export default {
    /**
     * POST /api/user/likes/:blogId
     */
    toggleLike: asyncHandler(async (req, res) => {
        const { blogId } = req.params;
        const userId = req.userId;

        if (!userId) {
            return sendResponse({
                res,
                statusCode: 401,
                success: false,
                message: 'Unauthorized',
                data: null,
            });
        }

        const result = await LikeService.toggleLike({ userId, blogId });

        sendResponse({
            res,
            statusCode: result.success ? 200 : 400,
            success: result.success,
            message: result.message,
            data: result.data,
        });
    }),

    /**
     * DELETE /api/user/likes/:blogId
     */
    unlikeBlog: asyncHandler(async (req, res) => {
        const { blogId } = req.params;
        const userId = req.userId;

        const result = await LikeService.unlikeBlog({ userId, blogId });

        sendResponse({
            res,
            statusCode: result.success ? 200 : 404,
            success: result.success,
            message: result.message,
            data: result.data,
        });
    }),

    /**
     * GET /api/user/likes
     */
    getMyLikes: asyncHandler(async (req, res) => {
        const userId = req.userId;
        const { page = 1, limit = 20 } = req.query;

        const result = await LikeService.getMyLikes({
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
