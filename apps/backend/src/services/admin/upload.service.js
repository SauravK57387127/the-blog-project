import { uploadImage, deleteImage } from '../../../../../packages/cloudinary/index.js';
import { logger } from '../../../../../packages/logger/index.js';
import { config } from '@theblogproj/config';

const coverFolderMap = {
  development: 'blog-covers-dev',
  staging:     'blog-covers-staging',
  production:  'blog-covers-production',
};

const contentFolderMap = {
  development: 'blog-content-dev',
  staging:     'blog-content-staging',
  production:  'blog-content-production',
};

export default {
  uploadCoverImage: async ({ file, base64, url, draftSlug }) => {
    try {
      let uploadSource;
      if (file)        uploadSource = file.buffer;
      else if (base64) uploadSource = base64;
      else if (url)    uploadSource = url;
      else return { success: false, message: 'No image provided', data: null };

      const base     = coverFolderMap[config.nodeEnv] || 'blog-covers-dev';
      const folder   = `${base}/${draftSlug || 'uncategorized'}`;
      const publicId = 'cover';

      const result = await uploadImage(uploadSource, folder, publicId);
      if (!result.success) {
        return { success: false, message: 'Upload failed', data: null, error: result.error };
      }

      logger.info('Cover image uploaded', { publicId: result.data.publicId, url: result.data.url });
      return {
        success: true,
        message: 'Image uploaded',
        data: { url: result.data.url, publicId: result.data.publicId },
      };
    } catch (error) {
      logger.error('Upload cover image failed', { error: error.message });
      return { success: false, message: 'Failed to upload image', data: null, error: error.message };
    }
  },

  uploadContentImage: async ({ file, draftSlug }) => {
    try {
      if (!file) return { success: false, message: 'No image provided', data: null };

      const base     = contentFolderMap[config.nodeEnv] || 'blog-content-dev';
      const folder   = `${base}/${draftSlug || 'uncategorized'}`;
      const publicId = `img-${Date.now()}`;

      const result = await uploadImage(file.buffer, folder, publicId);
      if (!result.success) {
        return { success: false, message: 'Upload failed', data: null, error: result.error };
      }

      logger.info('Content image uploaded', { publicId: result.data.publicId });
      return {
        success: true,
        message: 'Image uploaded',
        data: { url: result.data.url, publicId: result.data.publicId },
      };
    } catch (error) {
      logger.error('Upload content image failed', { error: error.message });
      return { success: false, message: 'Failed to upload image', data: null, error: error.message };
    }
  },

  deleteCoverImage: async (publicId) => {
    try {
      const result = await deleteImage(publicId);
      if (!result.success) {
        return { success: false, message: 'Delete failed', data: null };
      }
      logger.info('Cover image deleted', { publicId });
      return { success: true, message: 'Image deleted', data: { publicId } };
    } catch (error) {
      logger.error('Delete cover image failed', { error: error.message, publicId });
      return { success: false, message: 'Failed to delete image', data: null, error: error.message };
    }
  },
};
