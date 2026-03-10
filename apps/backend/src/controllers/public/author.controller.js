import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';
import AuthorService from '../../services/public/author.service.js';

export default {
  getAuthor: asyncHandler(async (req, res) => {
    const { authorId } = req.params;

    const result = await AuthorService.getAuthor(authorId);

    sendResponse({
      res,
      statusCode: result.success ? 200 : 404,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),
};
