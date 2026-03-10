import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';
import CommentService from '../../services/public/comment.service.js';

export default {
  /**
   * GET /api/public/comments/:blogId?page=1&limit=5
   */
  getBlogComments: asyncHandler(async (req, res) => {
    const { blogId } = req.params;
    const { page = 1, limit = 5 } = req.query;

    const result = await CommentService.getBlogComments(
      blogId,
      parseInt(page),
      parseInt(limit)
    );

    sendResponse({
      res,
      statusCode: result.success ? 200 : 400,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),
};
