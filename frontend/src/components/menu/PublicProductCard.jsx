import { useLocale } from '../../hooks/useLocale.js';
import MaterialIcon from '../ui/MaterialIcon.jsx';
import CloudinaryImage from '../ui/CloudinaryImage.jsx';
import { formatPrice } from '../../utils/format.js';

export default function PublicProductCard({ product, onSelect }) {
  const { locale } = useLocale();

  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      className="flex h-full flex-col overflow-hidden rounded-2xl bg-white text-start shadow-[0_8px_24px_rgba(13,27,42,0.05)] ring-1 ring-[#0d1b2a]/6 transition-transform active:scale-[0.985] sm:rounded-[1.35rem]"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-[#ebe8e2] sm:aspect-square">
        {product.image ? (
          <CloudinaryImage src={product.image} alt="" preset="productCard" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#0d1b2a]/30">
            <MaterialIcon name="restaurant" className="text-3xl" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col px-3 py-3 sm:px-3.5 sm:py-3.5">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug tracking-tight text-[#0d1b2a] sm:text-[0.95rem]">
          {product.name}
        </h3>
        {product.description ? (
          <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[#5c6570] sm:text-xs">{product.description}</p>
        ) : null}
        <p className="mt-auto pt-2.5 text-sm font-semibold tracking-tight text-[#0d1b2a]">
          {formatPrice(product.price, locale)}
        </p>
      </div>
    </button>
  );
}
