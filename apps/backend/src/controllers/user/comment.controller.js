import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';
import CommentService from '../../services/user/comment.service.js';

export default {
  /**
 * GET /api/user/comments/my
 */
getMyComments: asyncHandler(async (req, res) => {
 const  userId  = req.userId; 
  const { page = 1, limit = 10 } = req.query;

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
 const  userId  = req.userId; 
    const { blogId } = req.params;
   const { content, parentId } = req.sanitizedBody || req.body;
   
    if (!content || content.trim().length === 0) {
      return sendResponse({
        res,
        statusCode: 400,
        success: false,
        message: 'Comment content required',
        data: null,
      });
    }

const result = await CommentService.addComment({ userId, blogId, content, parentId }); 

    sendResponse({
      res,
      statusCode: result.success ? 201 : 400,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),

  updateComment: asyncHandler(async (req, res) => {
  const  userId  = req.userId; 
    const { commentId } = req.params;
    const { content } = req.sanitizedBody || req.body;

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
  const  userId  = req.userId; 
    const { commentId } = req.params;

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
