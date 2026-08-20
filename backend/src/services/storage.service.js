import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const uploadsDir = path.resolve(__dirname, '../../uploads/products');

export function isCloudinaryConfigured() {
  return Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET);
}

export function normalizeImageUrl(image) {
  if (!image) {
    return '';
  }

  return image.trim();
}

function extensionFromMime(mimetype) {
  const map = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
  };

  return map[mimetype] || 'jpg';
}

async function uploadToCloudinary(file) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: env.CLOUDINARY_FOLDER,
        resource_type: 'image',
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(new ApiError(500, 'Image upload failed'));
          return;
        }

        resolve(result.secure_url);
      },
    );

    stream.end(file.buffer);
  });
}

async function uploadToLocal(file) {
  await fs.mkdir(uploadsDir, { recursive: true });

  const filename = `${Date.now()}-${crypto.randomUUID()}.${extensionFromMime(file.mimetype)}`;
  await fs.writeFile(path.join(uploadsDir, filename), file.buffer);

  return `${env.PUBLIC_BASE_URL}/uploads/products/${filename}`;
}

export async function uploadProductImage(file) {
  if (!file?.buffer) {
    throw new ApiError(400, 'Image file is required');
  }

  if (isCloudinaryConfigured()) {
    return uploadToCloudinary(file);
  }

  return uploadToLocal(file);
}
