import {
  extractPublicId,
  isAppCloudinaryAsset,
  isCloudinaryUrl,
  stripCloudinaryTransforms,
} from '../../src/utils/cloudinaryUrl.js';

const original =
  'https://res.cloudinary.com/demo/image/upload/v1710000000/digital-menu/latte.jpg';
const transformed =
  'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,c_fill,w_600,h_400,g_auto/v1710000000/digital-menu/products/latte.jpg';

describe('cloudinaryUrl', () => {
  it('detects Cloudinary URLs', () => {
    expect(isCloudinaryUrl(original)).toBe(true);
    expect(isCloudinaryUrl('/logosombre.svg')).toBe(false);
    expect(isCloudinaryUrl('')).toBe(false);
  });

  it('strips delivery transforms so stored URLs stay canonical', () => {
    expect(stripCloudinaryTransforms(transformed)).toBe(
      'https://res.cloudinary.com/demo/image/upload/v1710000000/digital-menu/products/latte.jpg',
    );
    expect(stripCloudinaryTransforms(original)).toBe(original);
    expect(stripCloudinaryTransforms('/local.png')).toBe('/local.png');
  });

  it('extracts public_id from original and transformed URLs', () => {
    expect(extractPublicId(original, 'digital-menu')).toBe('digital-menu/latte');
    expect(extractPublicId(transformed, 'digital-menu')).toBe('digital-menu/products/latte');
  });

  it('only treats assets under the app folder as owned', () => {
    expect(isAppCloudinaryAsset(original, 'digital-menu')).toBe(true);
    expect(isAppCloudinaryAsset(transformed, 'digital-menu')).toBe(true);
    expect(
      isAppCloudinaryAsset(
        'https://res.cloudinary.com/demo/image/upload/v1/other-app/photo.jpg',
        'digital-menu',
      ),
    ).toBe(false);
    expect(isAppCloudinaryAsset('https://example.com/photo.jpg', 'digital-menu')).toBe(false);
  });
});
