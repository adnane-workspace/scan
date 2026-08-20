import { Link } from 'react-router-dom';

export default function CategorySummary({ categories, loading }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">Catégories</h2>
        <Link
          to="/dashboard/categories"
          className="text-sm font-medium text-amber-700 transition hover:text-amber-800"
        >
          Gérer les catégories
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Chargement...</p>
      ) : categories.length === 0 ? (
        <p className="text-sm text-slate-500">Aucune catégorie pour le moment.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {categories.map((category) => (
            <li key={category._id} className="flex items-center justify-between py-3">
              <p className="font-medium text-slate-900">{category.name}</p>
              <p className="text-sm text-slate-500">
                {category.productCount} produit{category.productCount > 1 ? 's' : ''}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
