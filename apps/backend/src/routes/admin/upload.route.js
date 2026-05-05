import { Router } from 'express';
import { upload } from '../../middlewares/upload.middleware.js';
import UploadController from '../../controllers/admin/upload.controller.js';

const router = Router();

router.get('/test-cloudinary', async (req, res) => {
    try {
        const { cloudinary } = await import(
            '../../../../../packages/cloudinary/index.js'
        );
        const result = await cloudinary.uploader.upload(
            'https://res.cloudinary.com/demo/image/upload/sample.jpg',
            { folder: 'blog-covers-dev' },
        );
        res.json({ success: true, url: result.secure_url });
    } catch (error) {
        console.error('FULL CLOUDINARY ERROR:', error); // ← add this
        res.json({
            success: false,
            error: error.message,
            code: error.http_code,
            name: error.name,
            full: JSON.stringify(error),
        });
    }
});

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
    upload.single('image'), // Optional - for file uploads
    UploadController.uploadCoverImage,
);

router.post(
    '/content-image',
    upload.single('image'),
    UploadController.uploadContentImage,
);

/**
 * DELETE /api/admin/upload/cover-image
 * Delete cover image from Cloudinary
 *
 * Body: { publicId: "blog-covers/abc123" }
 */
router.delete('/cover-image', UploadController.deleteCoverImage);

export default router;
