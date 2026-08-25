export function isCloudinaryUrl(url) {
  return String(url || '').includes('res.cloudinary.com');
}

function isTransformationSegment(part) {
  return Boolean(part) && (part.includes(',') || /^(f_|q_|w_|h_|c_|g_|e_|fl_)/.test(part));
}

export function stripCloudinaryTransforms(url) {
  const value = String(url || '').trim();

  if (!value || !isCloudinaryUrl(value)) {
    return value;
  }

  const marker = '/upload/';
  const index = value.indexOf(marker);

  if (index < 0) {
    return value;
  }

  const after = value.slice(index + marker.length);
  const queryIndex = after.indexOf('?');
  const path = queryIndex >= 0 ? after.slice(0, queryIndex) : after;
  const query = queryIndex >= 0 ? after.slice(queryIndex) : '';
  const parts = path.split('/');
  let start = 0;

  while (start < parts.length && isTransformationSegment(parts[start])) {
    start += 1;
  }

  return `${value.slice(0, index + marker.length)}${parts.slice(start).join('/')}${query}`;
}

export function extractPublicId(url, folder) {
  const value = String(url || '').trim();

  if (!value) {
    return null;
  }

  if (folder) {
    const marker = `/${folder}/`;
    const index = value.indexOf(marker);

    if (index >= 0) {
      return value
        .slice(index + 1)
        .split('?')[0]
        .replace(/\.[a-z0-9]+$/i, '');
    }
  }

  if (!isCloudinaryUrl(value)) {
    return null;
  }

  const afterUpload = value.split('/upload/')[1];

  if (!afterUpload) {
    return null;
  }

  const parts = afterUpload.split('?')[0].split('/');
  let start = 0;

  while (start < parts.length && isTransformationSegment(parts[start])) {
    start += 1;
  }

  if (start < parts.length && /^v\d+$/.test(parts[start])) {
    start += 1;
  }

  return parts.slice(start).join('/').replace(/\.[a-z0-9]+$/i, '') || null;
}

export function isAppCloudinaryAsset(url, folder) {
  const publicId = extractPublicId(url, folder);

  if (!publicId || !folder) {
    return false;
  }

  return publicId === folder || publicId.startsWith(`${folder}/`);
}
