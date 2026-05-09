import {
    uploadImage,
    deleteImage,
} from '../../../../../packages/cloudinary/index.js';
import { logger } from '../../../../../packages/logger/index.js';
import { config } from '@theblogproj/config';

// Environment prefix — top-level folder in Cloudinary
const envPrefix =
    config.nodeEnv === 'production'
        ? 'production'
        : config.nodeEnv === 'staging'
          ? 'staging'
          : 'dev';

export default {
    /**
     * Upload cover image
     * Stored at: {env}/{draftSlug}/cover/cover
     * Same publicId always — Cloudinary overwrites on re-upload, no orphans
     */
    uploadCoverImage: async ({ file, base64, url, draftSlug }) => {
        try {
            let uploadSource;
            if (file) uploadSource = file.buffer;
            else if (base64) uploadSource = base64;
            else if (url) uploadSource = url;
            else
                return {
                    success: false,
                    message: 'No image provided',
                    data: null,
                };

            const folder = `${envPrefix}/${draftSlug || 'uncategorized'}/cover`;
            const publicId = 'cover';

            const result = await uploadImage(uploadSource, folder, publicId);
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
                data: { url: result.data.url, publicId: result.data.publicId },
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
     * Upload content image
     * Stored at: {env}/{draftSlug}/content/img-{timestamp}
     */
    uploadContentImage: async ({ file, draftSlug }) => {
        try {
            if (!file)
                return {
                    success: false,
                    message: 'No image provided',
                    data: null,
                };

            const folder = `${envPrefix}/${draftSlug || 'uncategorized'}/content`;
            const publicId = `img-${Date.now()}`;

            const result = await uploadImage(file.buffer, folder, publicId);
            if (!result.success) {
                return {
                    success: false,
                    message: 'Upload failed',
                    data: null,
                    error: result.error,
                };
            }

            logger.info('Content image uploaded', {
                publicId: result.data.publicId,
            });
            return {
                success: true,
                message: 'Image uploaded',
                data: { url: result.data.url, publicId: result.data.publicId },
            };
        } catch (error) {
            logger.error('Upload content image failed', {
                error: error.message,
            });
            return {
                success: false,
                message: 'Failed to upload image',
                data: null,
                error: error.message,
            };
        }
    },

    /**
     * Delete image from Cloudinary
     */
    deleteCoverImage: async (publicId) => {
        try {
            const result = await deleteImage(publicId);
            if (!result.success) {
                return { success: false, message: 'Delete failed', data: null };
            }
            logger.info('Cover image deleted', { publicId });
            return {
                success: true,
                message: 'Image deleted',
                data: { publicId },
            };
        } catch (error) {
            logger.error('Delete cover image failed', {
                error: error.message,
                publicId,
            });
            return {
                success: false,
                message: 'Failed to delete image',
                data: null,
                error: error.message,
            };
        }
    },
};
