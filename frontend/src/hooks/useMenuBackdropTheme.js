import { useEffect, useMemo, useState } from 'react';
import { getOptimizedCloudinaryUrl } from '../utils/cloudinary.js';
import { DEFAULT_MENU_BACKGROUND, normalizeMenuUi } from '../utils/menuUi.js';
import { deriveMenuThemeTokens, relativeLuminance, sampleImageLuminance } from '../utils/menuTheme.js';

export function useMenuBackdropTheme(cafe) {
  const ui = normalizeMenuUi(cafe?.menuUi);
  const customColor = ui.bgMode === 'color' ? ui.backgroundColor : '';
  const customImage = ui.bgMode === 'image' && ui.backgroundImage ? ui.backgroundImage : '';
  const [imageLuminance, setImageLuminance] = useState(null);

  useEffect(() => {
    if (!customImage) {
      setImageLuminance(null);
      return undefined;
    }

    let cancelled = false;
    const sampleUrl = getOptimizedCloudinaryUrl(customImage, { width: 64, height: 64, crop: 'fill' });

    sampleImageLuminance(sampleUrl || customImage).then((value) => {
      if (!cancelled) {
        setImageLuminance(value);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [customImage]);

  const theme = useMemo(() => {
    if (customImage) {
      return deriveMenuThemeTokens({
        luminance: imageLuminance ?? 0.3,
        hasImage: true,
        backgroundColor: '',
      });
    }

    return deriveMenuThemeTokens({
      luminance: relativeLuminance(customColor || DEFAULT_MENU_BACKGROUND),
      hasImage: false,
      backgroundColor: customColor || DEFAULT_MENU_BACKGROUND,
    });
  }, [customColor, customImage, imageLuminance]);

  return {
    ui,
    customColor,
    customImage,
    theme,
    isDark: theme.colorScheme === 'dark',
    imageReady: !customImage || imageLuminance !== null,
  };
}
