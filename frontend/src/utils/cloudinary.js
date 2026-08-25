const CLOUDINARY_HOST = 'res.cloudinary.com';

export function isCloudinaryUrl(url) {
  return typeof url === 'string' && url.includes(CLOUDINARY_HOST) && url.includes('/upload/');
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

export function getOptimizedCloudinaryUrl(url, options = {}) {
  if (!url) {
    return '';
  }

  if (!isCloudinaryUrl(url)) {
    return url;
  }

  const canonical = stripCloudinaryTransforms(url);
  const {
    width,
    height,
    crop,
    gravity,
    quality = 'auto',
    format = 'auto',
  } = options;

  const parts = [`f_${format}`, `q_${quality}`];

  if (crop) {
    parts.push(`c_${crop}`);
  }

  if (gravity) {
    parts.push(`g_${gravity}`);
  }

  if (width) {
    parts.push(`w_${Math.round(width)}`);
  }

  if (height) {
    parts.push(`h_${Math.round(height)}`);
  }

  const marker = '/upload/';
  const index = canonical.indexOf(marker);

  return `${canonical.slice(0, index + marker.length)}${parts.join(',')}/${canonical.slice(index + marker.length)}`;
}

export function cloudinarySrcSet(url, widths, options = {}) {
  if (!isCloudinaryUrl(url) || !Array.isArray(widths) || widths.length === 0) {
    return undefined;
  }

  return widths
    .map((width) => `${getOptimizedCloudinaryUrl(url, { ...options, width })} ${width}w`)
    .join(', ');
}

export const IMAGE_PRESETS = {
  productCard: {
    widths: [400, 600, 800],
    crop: 'fill',
    gravity: 'auto',
    sizes: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px',
    lazy: true,
  },
  productSheet: {
    widths: [600, 900, 1200],
    crop: 'fill',
    gravity: 'auto',
    sizes: '(max-width: 640px) 100vw, 480px',
    lazy: false,
  },
  categoryCover: {
    widths: [400, 600, 800],
    crop: 'fill',
    gravity: 'auto',
    sizes: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px',
    lazy: true,
  },
  logo: {
    widths: [80, 160, 240],
    crop: 'fill',
    gravity: 'auto',
    sizes: '40px',
    lazy: false,
  },
  logoHero: {
    widths: [160, 240, 360],
    crop: 'fill',
    gravity: 'auto',
    sizes: '(max-width: 640px) 18vmin, 144px',
    lazy: false,
  },
  cover: {
    widths: [800, 1200, 1600],
    crop: 'fill',
    gravity: 'auto',
    sizes: '100vw',
    lazy: false,
  },
  thumb: {
    widths: [80, 160],
    crop: 'fill',
    gravity: 'auto',
    sizes: '44px',
    lazy: true,
  },
  preview: {
    widths: [200, 400],
    crop: 'fill',
    gravity: 'auto',
    sizes: '112px',
    lazy: false,
  },
  lightbox: {
    widths: [1200, 1600, 2000],
    sizes: '90vw',
    lazy: false,
  },
};
