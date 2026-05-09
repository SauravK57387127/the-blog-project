import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';
import HomepageService from '../../services/public/homepage.service.js';

export default {
    /**
     * GET /api/public/homepage
     * Aggregated homepage data
     */
    getHomepageData: asyncHandler(async (req, res) => {
        const result = await HomepageService.getHomepageData();

        sendResponse({
            res,
            statusCode: result.success ? 200 : 500,
            success: result.success,
            message: result.message,
            data: result.data,
        });
    }),
};
