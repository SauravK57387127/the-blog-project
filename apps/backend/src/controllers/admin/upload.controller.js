import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';
import UploadService from '../../services/admin/upload.service.js';

export default {
    /**
     * POST /api/admin/upload/cover-image
     */
    uploadCoverImage: asyncHandler(async (req, res) => {
        const { base64, url, draftSlug } = req.body;
        const file = req.file;

        const result = await UploadService.uploadCoverImage({
            file,
            base64,
            url,
            draftSlug,
        });

        sendResponse({
            res,
            statusCode: result.success ? 200 : 400,
            success: result.success,
            message: result.message,
            data: result.data,
        });
    }),

    /**
     * POST /api/admin/upload/content-image
     */
    uploadContentImage: asyncHandler(async (req, res) => {
        const { draftSlug } = req.body;
        const file = req.file;

        const result = await UploadService.uploadContentImage({
            file,
            draftSlug,
        });

        sendResponse({
            res,
            statusCode: result.success ? 200 : 400,
            success: result.success,
            message: result.message,
            data: result.data,
        });
    }),

    /**
     * DELETE /api/admin/upload/cover-image
     */
    deleteCoverImage: asyncHandler(async (req, res) => {
        const { publicId } = req.body;

        if (!publicId) {
            return sendResponse({
                res,
                statusCode: 400,
                success: false,
                message: 'publicId required',
                data: null,
            });
        }

        const result = await UploadService.deleteCoverImage(publicId);

        sendResponse({
            res,
            statusCode: result.success ? 200 : 400,
            success: result.success,
            message: result.message,
            data: result.data,
        });
    }),
};
