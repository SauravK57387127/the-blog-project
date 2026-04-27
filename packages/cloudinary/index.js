import { v2 as cloudinary } from 'cloudinary';
import { config } from '@theblogproj/config';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
  secure: true,
  //upload_prefix: "https://api.cloudinary.com",
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
  ...(publicId && { public_id: publicId }), // ← add this line
  transformation: [
    { width: 1200, height: 630, crop: 'limit' },
    { quality: 'auto:good' },
    { fetch_format: 'auto' },
  ],
}; 

    let uploadSource = file;

   if (typeof file === 'string' && file.startsWith('http')) {
  try {
    const response = await fetch(file, { signal: AbortSignal.timeout(10000) }); // 10s timeout
    if (!response.ok) throw new Error(`Failed to fetch URL: ${response.status}`);
    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    uploadSource = `data:${contentType};base64,${Buffer.from(buffer).toString('base64')}`;
  } catch (error) {
    return {
      success: false,
      error: `Failed to fetch image URL: ${error.message}`,
    };
  }
} 

if (Buffer.isBuffer(file)) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        console.error("Cloudinary stream error:", error);
        return resolve({
          success: false,
          error: error.message,
        });
      }

      if (!result) {
        return resolve({
          success: false,
          error: "No result from Cloudinary",
        });
      }

      resolve({
        success: true,
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
        },
      });
    });

    stream.end(file);
  });
}

const result = await cloudinary.uploader.upload(uploadSource, options);


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
