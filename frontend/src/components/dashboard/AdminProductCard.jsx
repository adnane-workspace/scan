import { formatPrice } from '../../utils/format.js';
import MaterialIcon from '../ui/MaterialIcon.jsx';
import AvailabilityToggle from './AvailabilityToggle.jsx';

export default function AdminProductCard({ product, toggling, onEdit, onDelete, onToggleAvailable }) {
  const available = Boolean(product.available);

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-xl bg-surface-container shadow-sm transition-shadow hover:shadow-md ${
        available ? '' : 'opacity-75'
      }`}
    >
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onEdit(product)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 text-on-surface shadow-sm transition-colors hover:bg-surface"
          aria-label={`Modifier ${product.name}`}
        >
          <MaterialIcon name="edit" className="text-[18px]" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(product)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-error-container/90 text-on-error-container shadow-sm transition-colors hover:bg-error-container"
          aria-label={`Supprimer ${product.name}`}
        >
          <MaterialIcon name="delete" className="text-[18px]" />
        </button>
      </div>

      <div className={`relative h-48 w-full bg-surface-container-highest ${available ? '' : 'grayscale-[30%]'}`}>
        {product.image ? (
          <img src={product.image} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-on-surface-variant">
            <MaterialIcon name="image" className="text-4xl" />
          </div>
        )}
        <div className="absolute top-2 left-2 rounded-full bg-surface/90 px-3 py-1 shadow-sm backdrop-blur-sm">
          <span className="text-label-md font-medium tracking-wider text-on-surface-variant uppercase">
            {product.categoryName || 'Sans catégorie'}
          </span>
        </div>
        {available ? null : (
          <div className="absolute inset-0 flex items-center justify-center bg-surface/40">
            <span className="rounded-full bg-error px-4 py-1 text-label-lg font-semibold tracking-[0.05em] text-on-error shadow-sm">
              Rupture de stock
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-stack-md">
        <div className="mb-1 flex items-start justify-between gap-3">
          <h3 className="flex-1 font-display text-headline-lg-mobile font-semibold text-on-surface line-clamp-1">
            {product.name}
          </h3>
          <span
            className={`ml-3 shrink-0 text-body-lg font-bold ${
              available ? 'text-primary' : 'text-on-surface-variant'
            }`}
          >
            {formatPrice(product.price)}
          </span>
        </div>
        <p className="mb-3 flex-1 text-on-surface-variant line-clamp-2">
          {product.description || 'Aucune description.'}
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-outline-variant/30 pt-2">
          <span className="text-label-md font-medium text-on-surface-variant">Disponibilité</span>
          <AvailabilityToggle
            checked={available}
            disabled={toggling}
            label={`Disponibilité de ${product.name}`}
            onChange={() => onToggleAvailable(product)}
          />
        </div>
      </div>
    </article>
  );
}
