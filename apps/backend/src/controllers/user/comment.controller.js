import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';
import CommentService from '../../services/user/comment.service.js';
import { getAuth } from '@clerk/express';

export default {
  /**
 * GET /api/user/comments/my
 */
getMyComments: asyncHandler(async (req, res) => {
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

  const result = await CommentService.getMyComments({
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

  addComment: asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { blogId } = req.params;
    const { content } = req.sanitizedBody || req.body;

    if (!userId) {
      return sendResponse({
        res,
        statusCode: 401,
        success: false,
        message: 'Unauthorized',
        data: null,
      });
    }

    if (!content || content.trim().length === 0) {
      return sendResponse({
        res,
        statusCode: 400,
        success: false,
        message: 'Comment content required',
        data: null,
      });
    }

    const result = await CommentService.addComment({
      userId,
      blogId,
      content,
    });

    sendResponse({
      res,
      statusCode: result.success ? 201 : 400,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),

  updateComment: asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { commentId } = req.params;
    const { content } = req.sanitizedBody || req.body;

    if (!userId) {
      return sendResponse({
        res,
        statusCode: 401,
        success: false,
        message: 'Unauthorized',
        data: null,
      });
    }

    const result = await CommentService.updateComment({
      userId,
      commentId,
      content,
    });

    sendResponse({
      res,
      statusCode: result.success ? 200 : 403,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),

  deleteComment: asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { commentId } = req.params;

    if (!userId) {
      return sendResponse({
        res,
        statusCode: 401,
        success: false,
        message: 'Unauthorized',
        data: null,
      });
    }

    const result = await CommentService.deleteComment({
      userId,
      commentId,
    });

    sendResponse({
      res,
      statusCode: result.success ? 200 : 403,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),
};
