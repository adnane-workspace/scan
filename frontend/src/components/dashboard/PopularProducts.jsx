import { Link } from 'react-router-dom';
import { useLocale } from '../../hooks/useLocale.js';
import MaterialIcon from '../ui/MaterialIcon.jsx';

export default function PopularProducts({ products, loading }) {
  const { t } = useLocale();
  const popular = [...products]
    .sort((a, b) => Number(b.available) - Number(a.available))
    .slice(0, 3);

  return (
    <section className="flex flex-col gap-stack-md rounded-2xl bg-surface-container p-stack-lg shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <MaterialIcon name="local_fire_department" className="text-tertiary" />
        <h2 className="text-headline-md font-semibold text-on-surface">{t('dashboard.popularTitle')}</h2>
      </div>

      {loading ? (
        <p className="text-sm text-on-surface-variant">{t('dashboard.loading')}</p>
      ) : popular.length === 0 ? (
        <p className="text-sm text-on-surface-variant">{t('dashboard.noProductsYet')}</p>
      ) : (
        popular.map((product, index) => (
          <Link
            key={product._id}
            to="/dashboard/products"
            className="flex cursor-pointer items-center gap-4 rounded-xl bg-surface-container-lowest p-3 shadow-sm transition-transform hover:scale-[1.02]"
          >
            <div className="font-display text-display-md font-bold text-primary opacity-30">{index + 1}</div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-label-lg font-semibold tracking-[0.05em] text-on-surface">
                {product.name}
              </h3>
              <p className="text-label-md text-on-surface-variant">
                {product.categoryName || t('dashboard.uncategorized')}
              </p>
            </div>
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface-container-highest">
              {product.image ? (
                <img src={product.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-on-surface-variant">
                  <MaterialIcon name="image" />
                </div>
              )}
            </div>
          </Link>
        ))
      )}

      <div className="mt-auto flex justify-center pt-stack-md">
        <div className="h-1 w-24 rounded-full bg-surface-variant" />
      </div>
    </section>
  );
}
