import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';
import ProfileService from '../../services/user/profile.service.js';

export default {
    getProfile: asyncHandler(async (req, res) => {
        const userId = req.userId;

        const result = await ProfileService.getProfile(userId);

        sendResponse({
            res,
            statusCode: result.success ? 200 : 404,
            success: result.success,
            message: result.message,
            data: result.data,
        });
    }),
};
