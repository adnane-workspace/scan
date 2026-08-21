import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export function normalizeImageUrl(image) {
  if (!image) {
    return '';
  }

  return image.trim();
}

export async function uploadProductImage(file, options = {}) {
  if (!file?.buffer) {
    throw new ApiError(400, 'Image file is required');
  }

  const uploadOptions = {
    folder: env.CLOUDINARY_FOLDER,
    resource_type: 'image',
  };

  if (options.publicId) {
    uploadOptions.public_id = options.publicId;
    uploadOptions.overwrite = true;
    uploadOptions.invalidate = true;
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error || !result?.secure_url) {
        const reason = error?.message || error?.error?.message || 'Image upload failed';
        reject(new ApiError(500, `Image upload failed: ${reason}`));
        return;
      }

      resolve(result.secure_url);
    });

    stream.end(file.buffer);
  });
}
