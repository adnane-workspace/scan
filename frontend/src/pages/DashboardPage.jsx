import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import PopularProducts from '../components/dashboard/PopularProducts.jsx';
import QrCodeModal from '../components/dashboard/QrCodeModal.jsx';
import RecentProducts from '../components/dashboard/RecentProducts.jsx';
import StatCard from '../components/dashboard/StatCard.jsx';
import MaterialIcon from '../components/ui/MaterialIcon.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { updateProduct } from '../services/product.service.js';
import { getPublicMenuUrl } from '../utils/constants.js';
import { firstName } from '../utils/format.js';

export default function DashboardPage() {
  const { user } = useAuth();
  const { stats, loading, error, refreshStats } = useOutletContext();
  const [actionError, setActionError] = useState('');
  const [isQrOpen, setIsQrOpen] = useState(false);
  const menuUrl = getPublicMenuUrl(stats.cafe?.slug);
  const greetingName = firstName(user?.name);

  async function handleToggleAvailable(product) {
    setActionError('');

    try {
      await updateProduct(product._id, { available: !product.available });
      await refreshStats();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Impossible de mettre à jour la disponibilité');
    }
  }

  const availableRatio =
    stats.totalProducts > 0 ? Math.round((stats.availableProducts / stats.totalProducts) * 100) : 0;

  return (
    <div className="flex w-full flex-col space-y-stack-lg">
      {error || actionError ? (
        <p className="rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm text-error">
          {actionError || error}
        </p>
      ) : null}

      <div className="relative flex w-full flex-col gap-6 overflow-hidden rounded-2xl bg-surface-container-high p-stack-lg shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative z-10 flex max-w-2xl flex-col gap-2">
          <h1 className="font-display text-display-md font-bold text-on-surface">Bonjour, {greetingName}.</h1>
          <p className="text-body-lg text-on-surface-variant">Voici l&apos;état de votre menu aujourd&apos;hui.</p>
        </div>
        <div className="relative z-10">
          <button
            type="button"
            disabled={!menuUrl}
            onClick={() => setIsQrOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-label-lg font-semibold tracking-[0.05em] text-on-primary shadow-md transition-transform hover:scale-105 hover:bg-primary/90 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          >
            <MaterialIcon name="qr_code_scanner" />
            Générer le QR Code
          </button>
        </div>
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-40 -bottom-20 h-48 w-48 rounded-full bg-tertiary/10 blur-2xl" />
      </div>

      <div className="grid w-full grid-cols-1 gap-gutter md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Produits" value={stats.totalProducts} icon="inventory_2" loading={loading} />
        <StatCard
          label="Catégories"
          value={stats.totalCategories}
          icon="category"
          tone="tertiary"
          loading={loading}
        />
        <StatCard
          label="Produits disponibles"
          value={stats.availableProducts}
          icon="trending_up"
          wide
          loading={loading}
          trend={loading ? undefined : `${availableRatio}%`}
        />
      </div>

      <div className="grid w-full grid-cols-1 gap-gutter xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentProducts
            products={stats.recentProducts}
            loading={loading}
            onToggleAvailable={handleToggleAvailable}
          />
        </div>
        <PopularProducts products={stats.recentProducts} loading={loading} />
      </div>

      <QrCodeModal
        open={isQrOpen}
        cafeName={stats.cafe?.name}
        menuUrl={menuUrl}
        slug={stats.cafe?.slug}
        onClose={() => setIsQrOpen(false)}
      />
    </div>
  );
}
