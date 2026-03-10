import { uploadImage, deleteImage } from '../../../../../packages/cloudinary/index.js';
import { logger } from '../../../../../packages/logger/index.js';

export default {
  /**
   * Upload cover image to Cloudinary
   * 
   * Accepts:
   * - File upload (multipart/form-data)
   * - Base64 string
   * - URL (will download and upload)
   */
  uploadCoverImage: async ({ file, base64, url }) => {
    try {
      let uploadSource;

      if (file) {
        // Multer file object
        uploadSource = file.path || file.buffer;
      } else if (base64) {
        // Base64 string
        uploadSource = base64;
      } else if (url) {
        // External URL - Cloudinary can fetch directly
        uploadSource = url;
      } else {
        return {
          success: false,
          message: 'No image provided',
          data: null,
        };
      }

      const result = await uploadImage(uploadSource, 'blog-covers');

      if (!result.success) {
        return {
          success: false,
          message: 'Upload failed',
          data: null,
          error: result.error,
        };
      }

      logger.info('Cover image uploaded', { 
        publicId: result.data.publicId,
        url: result.data.url,
      });

      return {
        success: true,
        message: 'Image uploaded',
        data: {
          url: result.data.url,
          publicId: result.data.publicId,
        },
      };
    } catch (error) {
      logger.error('Upload cover image failed', { error: error.message });
      return {
        success: false,
        message: 'Failed to upload image',
        data: null,
        error: error.message,
      };
    }
  },

  /**
   * Delete cover image from Cloudinary
   */
  deleteCoverImage: async (publicId) => {
    try {
      const result = await deleteImage(publicId);

      if (!result.success) {
        return {
          success: false,
          message: 'Delete failed',
          data: null,
          error: result.error,
        };
      }

      logger.info('Cover image deleted', { publicId });

      return {
        success: true,
        message: 'Image deleted',
        data: { publicId },
      };
    } catch (error) {
      logger.error('Delete cover image failed', { error: error.message, publicId });
      return {
        success: false,
        message: 'Failed to delete image',
        data: null,
        error: error.message,
      };
    }
  },
};
