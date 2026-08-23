import MaterialIcon from '../ui/MaterialIcon.jsx';
import { formatPrice } from '../../utils/format.js';

export default function PublicProductCard({ product, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      className="flex h-full flex-col overflow-hidden rounded-2xl bg-surface-container-lowest text-left shadow-sm transition-transform active:scale-[0.98]"
    >
      <div className="aspect-square w-full bg-surface-container-high">
        {product.image ? (
          <img src={product.image} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-on-surface-variant">
            <MaterialIcon name="restaurant" className="text-3xl" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col px-3 py-3 sm:px-4 sm:py-4">
        <h3 className="line-clamp-2 text-sm font-semibold tracking-tight text-on-surface sm:text-base">{product.name}</h3>
        {product.description ? (
          <p className="mt-1 line-clamp-2 text-xs text-on-surface-variant sm:text-sm">{product.description}</p>
        ) : null}
        <p className="mt-auto pt-2 text-sm font-semibold text-primary">{formatPrice(product.price)}</p>
      </div>
    </button>
  );
}
