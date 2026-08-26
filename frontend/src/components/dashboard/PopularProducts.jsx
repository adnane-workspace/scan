import { Link } from 'react-router-dom';
import { useLocale } from '../../hooks/useLocale.js';
import MaterialIcon from '../ui/MaterialIcon.jsx';
import CloudinaryImage from '../ui/CloudinaryImage.jsx';
import DashboardCard from './DashboardCard.jsx';
import SectionHeader from './SectionHeader.jsx';

export default function PopularProducts({ products, loading }) {
  const { t } = useLocale();
  const popular = [...products]
    .sort((a, b) => Number(b.available) - Number(a.available))
    .slice(0, 3);

  return (
    <DashboardCard className="h-full">
      <SectionHeader title={t('dashboard.popularTitle')} />

      {loading ? (
        <p className="text-sm text-on-surface-variant">{t('dashboard.loading')}</p>
      ) : popular.length === 0 ? (
        <p className="text-sm text-on-surface-variant">{t('dashboard.noProductsYet')}</p>
      ) : (
        <ol className="flex flex-col gap-4">
          {popular.map((product, index) => {
            const rank = String(index + 1).padStart(2, '0');
            const barWidth = `${Math.max(34, 100 - index * 28)}%`;

            return (
              <li key={product._id}>
                <Link
                  to="/dashboard/products"
                  className="group flex items-center gap-4 rounded-xl p-1 transition-colors duration-150 hover:bg-surface-container-low"
                >
                  <span className="w-8 shrink-0 font-display text-xl font-semibold text-primary/35">
                    {rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-medium text-on-surface">{product.name}</h3>
                    <p className="mt-0.5 text-sm text-on-surface-variant">
                      {product.categoryName || t('dashboard.uncategorized')}
                    </p>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-outline-variant">
                      <div className="h-full rounded-full bg-primary/70" style={{ width: barWidth }} />
                    </div>
                  </div>
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-[10px] bg-surface-container">
                    {product.image ? (
                      <CloudinaryImage
                        src={product.image}
                        alt=""
                        preset="thumb"
                        width={44}
                        height={44}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-on-surface-variant">
                        <MaterialIcon name="image" className="text-[18px]" />
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </DashboardCard>
  );
}
