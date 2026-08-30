import { useEffect } from 'react';
import { useLocale } from '../../hooks/useLocale.js';
import MaterialIcon from '../ui/MaterialIcon.jsx';
import CloudinaryImage from '../ui/CloudinaryImage.jsx';
import { formatPrice } from '../../utils/format.js';
import ShareButton from './ShareButton.jsx';

export default function PublicProductSheet({ product, onClose, shareTitle, shareText, shareUrl }) {
  const { t, locale } = useLocale();
  useEffect(() => {
    if (!product) {
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
  }, [product, onClose]);

  if (!product) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-[#0d1b2a]/45 backdrop-blur-md"
        aria-label={t('common.close')}
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-sheet-title"
        className="relative z-10 flex max-h-[min(90dvh,100svh)] w-full max-w-full flex-col overflow-hidden rounded-t-[1.75rem] bg-white shadow-[0_-18px_50px_rgba(13,27,42,0.22)] sm:max-w-md sm:rounded-[1.75rem]"
      >
        <div className="flex justify-center pt-2.5 sm:hidden">
          <span className="h-1 w-11 rounded-full bg-[#c4a574]/70" />
        </div>

        <div className="relative aspect-[16/10] max-h-[36dvh] w-full shrink-0 overflow-hidden bg-[#ebe8e2] sm:aspect-[4/3] sm:max-h-none">
          {product.image ? (
            <CloudinaryImage src={product.image} alt="" preset="productSheet" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="flex h-full min-h-[9rem] w-full items-center justify-center text-[#0d1b2a]/30">
              <MaterialIcon name="restaurant" className="text-5xl" />
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-[max(0.65rem,env(safe-area-inset-top))] end-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#0d1b2a] shadow-md backdrop-blur-sm"
            aria-label={t('common.close')}
          >
            <MaterialIcon name="close" className="text-[22px]" />
          </button>
        </div>

        <div className="flex flex-col px-6 pt-5 pb-[max(1.35rem,env(safe-area-inset-bottom))] sm:px-7 sm:pt-6">
          <div className="flex items-start justify-between gap-4">
            <h2
              id="product-sheet-title"
              className="min-w-0 break-words font-display text-[1.35rem] leading-snug font-semibold tracking-tight text-[#0d1b2a] sm:text-2xl"
            >
              {product.name}
            </h2>
            <p className="shrink-0 rounded-full bg-[#f3ead8] px-3 py-1 text-sm font-semibold tracking-tight text-[#8d6b32] sm:text-base">
              {formatPrice(product.price, locale)}
            </p>
          </div>

          {product.description ? (
            <p className="mt-2.5 text-sm leading-relaxed text-[#5c6570] sm:text-base">{product.description}</p>
          ) : null}

          {shareUrl ? (
            <ShareButton
              title={shareTitle}
              text={shareText}
              url={shareUrl}
              variant="primary"
              showLabel
              className="mt-6"
            />
          ) : null}
        </div>
      </section>
    </div>
  );
}
