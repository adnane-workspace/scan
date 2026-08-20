import { Link } from 'react-router-dom';

function formatPrice(value) {
  return `${Number(value).toFixed(2)} €`;
}

export default function RecentProducts({ products, loading }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">Produits récents</h2>
        <Link to="/dashboard/products" className="text-sm font-medium text-amber-700 transition hover:text-amber-800">
          Voir tous les produits
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Chargement...</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-slate-500">Aucun produit disponible.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {products.map((product) => (
            <li key={product._id} className="flex items-center gap-3 py-3">
              {product.image ? (
                <img src={product.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                  N/A
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-slate-900">{product.name}</p>
                <p className="truncate text-sm text-slate-500">{product.categoryName || 'Sans catégorie'}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{formatPrice(product.price)}</p>
                <p className={`text-xs ${product.available ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {product.available ? 'Disponible' : 'Indisponible'}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
