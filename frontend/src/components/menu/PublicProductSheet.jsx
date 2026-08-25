import { useEffect } from 'react';
import { useLocale } from '../../hooks/useLocale.js';
import MaterialIcon from '../ui/MaterialIcon.jsx';
import { formatPrice } from '../../utils/format.js';

export default function PublicProductSheet({ product, onClose }) {
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
      <button type="button" className="absolute inset-0 bg-on-surface/40" aria-label={t('common.close')} onClick={onClose} />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-sheet-title"
        className="relative z-10 max-h-[min(92vh,100dvh)] w-full overflow-y-auto rounded-t-3xl bg-surface-container-lowest pb-[env(safe-area-inset-bottom)] shadow-xl sm:max-w-md sm:rounded-3xl"
      >
        <div className="relative aspect-[4/3] bg-surface-container-high">
          {product.image ? (
            <img src={product.image} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-on-surface-variant">
              <MaterialIcon name="restaurant" className="text-5xl" />
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-lowest/95 text-on-surface shadow-md"
            aria-label={t('common.close')}
          >
            <MaterialIcon name="close" />
          </button>
        </div>
        <div className="px-5 py-5 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <h2 id="product-sheet-title" className="min-w-0 break-words font-display text-xl font-semibold tracking-tight text-on-surface sm:text-2xl">
              {product.name}
            </h2>
            <p className="shrink-0 text-lg font-semibold text-primary">{formatPrice(product.price, locale)}</p>
          </div>
          {product.description ? (
            <p className="mt-3 text-body-lg text-on-surface-variant">{product.description}</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
