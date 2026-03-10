import { v2 as cloudinary } from 'cloudinary';
import { config } from '@theblogproj/config';
import { config } from '@theblogproj/config';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
  secure: true,
});

/**
 * Upload image to Cloudinary
 * 
 * @param {Buffer|string} file - File buffer or base64 string
 * @param {string} folder - Cloudinary folder (e.g., 'blog-covers')
 * @param {string} publicId - Optional custom public ID
 * @returns {Promise<Object>} - Upload result
 */
const folderMap = {
  development: 'blog-covers-dev',
  staging: 'blog-covers-staging',
  production: 'blog-covers-production',
};

export async function uploadImage(file, folder = folderMap[config.nodeEnv] || 'blog-covers-dev', publicId = null) {
  try {
    const options = {
      folder,
      resource_type: 'image',
      transformation: [
        { width: 1200, height: 630, crop: 'limit' },  // Max dimensions
        { quality: 'auto:good' },  // Auto quality
        { fetch_format: 'auto' },  // Auto format (WebP, etc)
      ],
    };

    if (publicId) {
      options.public_id = publicId;
      options.overwrite = true;
    }

    const result = await cloudinary.uploader.upload(file, options);

    return {
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      },
    };
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Delete image from Cloudinary
 * 
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>}
 */
export async function deleteImage(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    
    return {
      success: result.result === 'ok',
      result: result.result,
    };
  } catch (error) {
    console.error('Cloudinary delete failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get optimized URL for existing image
 * 
 * @param {string} publicId - Cloudinary public ID
 * @param {Object} options - Transformation options
 * @returns {string} - Optimized URL
 */
export function getOptimizedUrl(publicId, options = {}) {
  const defaultTransform = {
    width: options.width || 1200,
    crop: 'limit',
    quality: 'auto:good',
    fetch_format: 'auto',
  };

  return cloudinary.url(publicId, defaultTransform);
}

export { cloudinary };
