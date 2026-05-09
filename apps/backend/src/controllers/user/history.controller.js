import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';
import HistoryService from '../../services/user/history.service.js';

export default {
    getHistory: asyncHandler(async (req, res) => {
        const userId = req.userId;
        const { page = 1, limit = 10 } = req.query;

        const result = await HistoryService.getHistory({
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
