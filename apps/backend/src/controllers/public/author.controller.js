import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';
import AuthorService from '../../services/public/author.service.js';

export default {
    /**
     * GET /api/public/authors/me
     * Returns the single active author — no ID needed.
     */
    getActiveAuthor: asyncHandler(async (req, res) => {
        const result = await AuthorService.getActiveAuthor();

        sendResponse({
            res,
            statusCode: result.success ? 200 : 404,
            success: result.success,
            message: result.message,
            data: result.data,
        });
    }),

    /**
     * GET /api/public/authors/:authorId
     */
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
