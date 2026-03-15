import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';
import UploadService from '../../services/admin/upload.service.js';

export default {
  /**
   * POST /api/admin/upload/cover-image
   * Upload cover image (file, base64, or URL)
   */
  uploadCoverImage: asyncHandler(async (req, res) => {
    
console.log("FILE:", req.file);
console.log("BODY:", req.body);

    const { base64, url } = req.body;
    const file = req.file;

    const result = await UploadService.uploadCoverImage({ file, base64, url });

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
   * Delete cover image from Cloudinary
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
