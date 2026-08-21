import { useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryBadgeClass, formatPrice } from '../../utils/format.js';
import MaterialIcon from '../ui/MaterialIcon.jsx';
import AvailabilityToggle from './AvailabilityToggle.jsx';

export default function RecentProducts({ products, loading, onToggleAvailable }) {
  const [pendingId, setPendingId] = useState(null);

  async function handleToggle(product) {
    if (!onToggleAvailable) {
      return;
    }

    setPendingId(product._id);

    try {
      await onToggleAvailable(product);
    } finally {
      setPendingId(null);
    }
  }

  return (
    <section className="flex flex-col gap-stack-md rounded-2xl bg-surface-container-lowest p-stack-lg shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-headline-md font-semibold text-on-surface">Produits Récents</h2>
        <Link
          to="/dashboard/products"
          className="flex items-center gap-1 text-label-md font-medium tracking-wider text-primary uppercase transition-colors hover:text-primary-container"
        >
          Voir tout <MaterialIcon name="arrow_forward" className="text-sm" />
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-on-surface-variant">Chargement...</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-on-surface-variant">Aucun produit disponible.</p>
      ) : (
        <div className="w-full overflow-x-auto pb-4">
          <table className="w-full min-w-[600px] border-collapse text-left">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant">
                <th className="rounded-l-lg p-4 text-label-md font-medium tracking-wider uppercase">
                  Nom du Produit
                </th>
                <th className="p-4 text-label-md font-medium tracking-wider uppercase">Catégorie</th>
                <th className="p-4 text-label-md font-medium tracking-wider uppercase">Prix</th>
                <th className="rounded-r-lg p-4 text-center text-label-md font-medium tracking-wider uppercase">
                  Disponibilité
                </th>
              </tr>
            </thead>
            <tbody className="text-on-surface">
              {products.map((product) => (
                <tr
                  key={product._id}
                  className={`border-b-4 border-transparent transition-colors hover:bg-surface-container-low/50 ${
                    product.available ? '' : 'opacity-60'
                  }`}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-md bg-surface-container-highest">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt=""
                            className={`h-full w-full object-cover ${product.available ? '' : 'grayscale'}`}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-on-surface-variant">
                            <MaterialIcon name="image" />
                          </div>
                        )}
                      </div>
                      <span
                        className={`text-body-lg font-medium ${product.available ? '' : 'line-through'}`}
                      >
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-label-md ${categoryBadgeClass(
                        product.categoryName,
                        product.available,
                      )}`}
                    >
                      {product.categoryName || 'Sans catégorie'}
                    </span>
                  </td>
                  <td className="p-4 text-label-lg font-semibold tracking-[0.05em]">{formatPrice(product.price)}</td>
                  <td className="p-4 text-center">
                    <AvailabilityToggle
                      checked={Boolean(product.available)}
                      disabled={pendingId === product._id}
                      label={`Disponibilité de ${product.name}`}
                      onChange={() => handleToggle(product)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
