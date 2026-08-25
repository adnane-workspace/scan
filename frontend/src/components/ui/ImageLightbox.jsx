import { useEffect } from 'react';
import { useLocale } from '../../hooks/useLocale.js';
import MaterialIcon from './MaterialIcon.jsx';

export default function ImageLightbox({ src, alt = '', onClose }) {
  const { t } = useLocale();

  useEffect(() => {
    if (!src) {
      return undefined;
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKey(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', handleKey);
    };
  }, [src, onClose]);

  if (!src) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
      <button
        type="button"
        className="absolute inset-0 bg-[#1F2523]/80"
        aria-label={t('common.close')}
        onClick={onClose}
      />
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 end-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-on-surface shadow-md hover:bg-surface-container"
        aria-label={t('common.close')}
      >
        <MaterialIcon name="close" />
      </button>
      <img
        src={src}
        alt={alt}
        className="relative z-10 max-h-[90dvh] max-w-full rounded-2xl object-contain shadow-2xl"
      />
    </div>
  );
}
