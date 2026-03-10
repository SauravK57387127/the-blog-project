import { Router } from 'express';
import { upload } from '../../middlewares/upload.middleware.js';
import UploadController from '../../controllers/admin/upload.controller.js';

const router = Router();

/**
 * POST /api/admin/upload/cover-image
 * Upload cover image
 * 
 * Accepts:
 * - multipart/form-data with 'image' field
 * - JSON with { base64: "data:image/..." }
 * - JSON with { url: "https://..." }
 */
router.post(
  '/cover-image',
  upload.single('image'),  // Optional - for file uploads
  UploadController.uploadCoverImage
);

/**
 * DELETE /api/admin/upload/cover-image
 * Delete cover image from Cloudinary
 * 
 * Body: { publicId: "blog-covers/abc123" }
 */
router.delete(
  '/cover-image',
  UploadController.deleteCoverImage
);

export default router;
