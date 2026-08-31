import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';

const confirm = process.argv.includes('--confirm');
const folder = String(process.env.CLOUDINARY_FOLDER || 'digital-menu').trim();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function listFolderImages(prefix) {
  const resources = [];
  let nextCursor;

  for (let page = 0; page < 50; page += 1) {
    const result = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'image',
      prefix,
      max_results: 500,
      ...(nextCursor ? { next_cursor: nextCursor } : {}),
    });

    resources.push(...(result.resources || []));
    nextCursor = result.next_cursor;

    if (!nextCursor) {
      break;
    }
  }

  return resources;
}

async function purge() {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('CLOUDINARY_* variables are required in backend/.env');
  }

  const resources = await listFolderImages(folder);
  const bytes = resources.reduce((sum, item) => sum + Number(item.bytes || 0), 0);

  console.log(`Cloudinary folder: ${folder}`);
  console.log(`Images found: ${resources.length} (${(bytes / 1024 / 1024).toFixed(2)} Mo)`);

  if (!confirm) {
    console.log('\nDry run only. To delete everything, run:');
    console.log('  npm run cloudinary:purge -- --confirm');
    console.log('\nWarning: local AND prod menus will lose photos until re-upload or re-seed.');
    return;
  }

  const publicIds = resources.map((item) => item.public_id);

  for (let index = 0; index < publicIds.length; index += 100) {
    const batch = publicIds.slice(index, index + 100);
    await cloudinary.api.delete_resources(batch, { type: 'upload', resource_type: 'image' });
    console.log(`Deleted ${Math.min(index + batch.length, publicIds.length)}/${publicIds.length}`);
  }

  console.log('\nCloudinary purge complete.');
}

purge().catch((error) => {
  console.error('Cloudinary purge failed:', error.message || error);
  process.exit(1);
});
