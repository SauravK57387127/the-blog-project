import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';
import SearchService from '../../services/public/search.service.js';

export default {
  /**
   * GET /api/public/search/initial
   */
  getInitialData: asyncHandler(async (req, res) => {
    const result = await SearchService.getInitialData();

    sendResponse({
      res,
      statusCode: result.success ? 200 : 500,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),
};
