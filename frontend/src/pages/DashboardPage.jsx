import { useOutletContext } from 'react-router-dom';
import CategorySummary from '../components/dashboard/CategorySummary.jsx';
import MenuPreviewCard from '../components/dashboard/MenuPreviewCard.jsx';
import RecentProducts from '../components/dashboard/RecentProducts.jsx';
import StatCard from '../components/dashboard/StatCard.jsx';
import { useAuth } from '../hooks/useAuth.js';

export default function DashboardPage() {
  const { user } = useAuth();
  const { stats, loading, error } = useOutletContext();

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-600">Bonjour, {user?.name || 'Admin'} 👋</p>
      </header>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Produits" value={stats.totalProducts} icon="🍔" loading={loading} />
        <StatCard label="Total Catégories" value={stats.totalCategories} icon="🏷️" loading={loading} />
        <StatCard label="Produits disponibles" value={stats.availableProducts} icon="✅" loading={loading} />
        <StatCard label="Produits indisponibles" value={stats.unavailableProducts} icon="🚫" loading={loading} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentProducts products={stats.recentProducts} loading={loading} />
        </div>
        <div className="space-y-6">
          <MenuPreviewCard cafe={stats.cafe} />
          <CategorySummary categories={stats.categories} loading={loading} />
        </div>
      </div>
    </section>
  );
}
