import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import PopularProducts from '../components/dashboard/PopularProducts.jsx';
import QrChangeRequestModal from '../components/dashboard/QrChangeRequestModal.jsx';
import QrCodeModal from '../components/dashboard/QrCodeModal.jsx';
import RecentProducts from '../components/dashboard/RecentProducts.jsx';
import StatCard from '../components/dashboard/StatCard.jsx';
import MaterialIcon from '../components/ui/MaterialIcon.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useLocale } from '../hooks/useLocale.js';
import { generateCafeQr, requestQrChange } from '../services/cafe.service.js';
import { getStorageReport } from '../services/platform.service.js';
import { updateProduct } from '../services/product.service.js';
import { getPublicMenuUrl } from '../utils/constants.js';
import { firstName, formatBytes, formatDate } from '../utils/format.js';

export default function DashboardPage() {
  const { user } = useAuth();
  const { t, locale } = useLocale();
  const { stats, platformCafes = [], loading, error, refreshStats } = useOutletContext();
  const [actionError, setActionError] = useState('');
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isQrRequestOpen, setIsQrRequestOpen] = useState(false);
  const [qrIssuing, setQrIssuing] = useState(false);
  const [qrIssueError, setQrIssueError] = useState('');
  const [qrRequestError, setQrRequestError] = useState('');
  const [qrRequesting, setQrRequesting] = useState(false);
  const [qrMode, setQrMode] = useState('view');
  const [storage, setStorage] = useState(null);
  const isSuperAdmin = user?.role === 'superadmin';
  const menuUrl = getPublicMenuUrl(stats.cafe?.slug);
  const qr = stats.cafe?.qr || {
    generated: false,
    locked: false,
    canGenerate: true,
    changeAllowed: false,
    pendingRequest: null,
  };
  const greetingName = firstName(user?.name, t('dashboard.fallbackName'));
  const activeCafes = platformCafes.filter((cafe) => cafe.isActive).length;

  useEffect(() => {
    if (!isSuperAdmin) {
      return undefined;
    }

    let cancelled = false;

    getStorageReport()
      .then((report) => {
        if (!cancelled) {
          setStorage(report);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStorage(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isSuperAdmin]);

  async function handleConfirmIssue() {
    setQrIssuing(true);
    setQrIssueError('');

    try {
      await generateCafeQr();
      await refreshStats();
    } catch (err) {
      setQrIssueError(err.response?.data?.message || t('qr.issueError'));
    } finally {
      setQrIssuing(false);
    }
  }

  async function handleQrRequest(reason) {
    setQrRequesting(true);
    setQrRequestError('');

    try {
      await requestQrChange(reason);
      await refreshStats();
      setIsQrRequestOpen(false);
      return true;
    } catch (err) {
      setQrRequestError(err.response?.data?.message || t('qr.requestError'));
      return false;
    } finally {
      setQrRequesting(false);
    }
  }

  function openQr(mode) {
    setQrIssueError('');
    setQrMode(mode);
    setIsQrOpen(true);
  }

  async function handleToggleAvailable(product) {
    setActionError('');

    try {
      await updateProduct(product._id, { available: !product.available });
      await refreshStats();
    } catch (err) {
      setActionError(err.response?.data?.message || t('dashboard.availabilityError'));
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

      <div className="relative flex w-full flex-col gap-6 overflow-hidden rounded-2xl bg-surface-container-high p-stack-lg ring-1 ring-outline-variant/20 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative z-10 flex max-w-2xl flex-col gap-2">
          <p className="text-label-md font-semibold tracking-[0.18em] text-primary uppercase">
            {isSuperAdmin ? t('dashboard.roleSuper') : t('dashboard.roleAdmin')}
          </p>
          <h1 className="font-display text-display-md font-bold text-on-surface">
            {t('dashboard.hello', { name: greetingName })}
          </h1>
          <p className="text-body-lg text-on-surface-variant">
            {isSuperAdmin ? t('dashboard.subtitleSuper') : t('dashboard.subtitleAdmin')}
          </p>
        </div>
        {isSuperAdmin ? (
          <div className="relative z-10">
            <Link
              to="/dashboard/cafes/new"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-label-lg font-semibold tracking-[0.05em] text-on-primary shadow-md transition-transform hover:scale-105 hover:bg-primary/90 active:scale-95"
            >
              <MaterialIcon name="add" />
              {t('platform.createCafe')}
            </Link>
          </div>
        ) : (
          <div className="relative z-10 flex flex-col items-stretch gap-2 sm:items-end">
            <button
              type="button"
              disabled={!menuUrl}
              onClick={() => openQr(qr.canGenerate ? 'issue' : 'view')}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-label-lg font-semibold tracking-[0.05em] text-on-primary shadow-md transition-transform hover:scale-105 hover:bg-primary/90 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              <MaterialIcon name="qr_code_scanner" />
              {qr.canGenerate
                ? qr.generated
                  ? t('dashboard.generateNewQr')
                  : t('dashboard.generateQr')
                : t('dashboard.viewQr')}
            </button>
            {qr.changeAllowed ? (
              <button
                type="button"
                disabled={!menuUrl}
                onClick={() => openQr('view')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-surface-container-lowest px-5 py-2.5 text-sm font-semibold text-on-surface"
              >
                {t('dashboard.viewQr')}
              </button>
            ) : null}
            {qr.locked && !qr.pendingRequest ? (
              <button
                type="button"
                onClick={() => {
                  setQrRequestError('');
                  setIsQrRequestOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-surface-container-lowest px-5 py-2.5 text-sm font-semibold text-on-surface"
              >
                {t('dashboard.requestQrChange')}
              </button>
            ) : null}
            {qr.pendingRequest ? (
              <p className="max-w-xs text-right text-sm text-on-surface-variant">{t('dashboard.qrRequestPending')}</p>
            ) : null}
            {qr.changeAllowed ? (
              <p className="max-w-xs text-right text-sm text-on-surface-variant">{t('dashboard.qrChangeAllowed')}</p>
            ) : null}
          </div>
        )}
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-40 -bottom-20 h-48 w-48 rounded-full bg-tertiary/10 blur-2xl" />
      </div>

      <div className="grid w-full grid-cols-1 gap-gutter md:grid-cols-2 xl:grid-cols-4">
        {isSuperAdmin ? (
          <>
            <StatCard label={t('dashboard.cafes')} value={platformCafes.length} icon="storefront" loading={loading} />
            <StatCard label={t('dashboard.activeCafes')} value={activeCafes} icon="verified" tone="tertiary" loading={loading} />
            <StatCard
              label={t('storage.photos')}
              value={storage ? storage.totals.photos : '—'}
              icon="photo_library"
              loading={loading && !storage}
            />
            <Link to="/dashboard/storage" className="block">
              <StatCard
                label={t('storage.storageUsed')}
                value={storage ? formatBytes(storage.totals.bytes, locale) : '—'}
                icon="hard_drive"
                loading={loading && !storage}
              />
            </Link>
          </>
        ) : (
          <>
            <StatCard label={t('dashboard.totalProducts')} value={stats.totalProducts} icon="inventory_2" loading={loading} />
            <StatCard
              label={t('dashboard.categories')}
              value={stats.totalCategories}
              icon="category"
              tone="tertiary"
              loading={loading}
            />
            <StatCard
              label={t('dashboard.availableProducts')}
              value={stats.availableProducts}
              icon="trending_up"
              wide
              loading={loading}
              trend={loading ? undefined : `${availableRatio}%`}
            />
          </>
        )}
      </div>

      {isSuperAdmin ? (
        <>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { to: '/dashboard/cafes', icon: 'storefront', label: t('nav.cafes'), hint: t('dashboard.quickCafes') },
              { to: '/dashboard/qr-requests', icon: 'qr_code_2', label: t('nav.qrRequests'), hint: t('dashboard.quickQr') },
              { to: '/dashboard/logs', icon: 'history', label: t('nav.logs'), hint: t('dashboard.quickLogs') },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="group flex items-start gap-3 rounded-2xl bg-surface-container p-4 ring-1 ring-outline-variant/20 transition-colors hover:bg-surface-container-high"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <MaterialIcon name={item.icon} />
                </span>
                <span>
                  <span className="block font-semibold text-on-surface">{item.label}</span>
                  <span className="mt-0.5 block text-sm text-on-surface-variant">{item.hint}</span>
                </span>
                <MaterialIcon name="chevron_right" className="ms-auto text-on-surface-variant group-hover:text-primary" />
              </Link>
            ))}
          </div>

          <div className="overflow-hidden rounded-2xl bg-surface-container-lowest ring-1 ring-outline-variant/20">
            <div className="flex items-center justify-between border-b border-outline-variant/20 px-5 py-4">
              <h2 className="font-display text-xl font-semibold text-on-surface">{t('dashboard.recentCafes')}</h2>
              <Link to="/dashboard/cafes" className="text-sm font-semibold text-primary hover:underline">
                {t('dashboard.viewAllCafes')}
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-on-surface-variant">
                  <tr>
                    <th className="px-5 py-3 font-semibold">{t('platform.colCafe')}</th>
                    <th className="px-5 py-3 font-semibold">{t('platform.colOwner')}</th>
                    <th className="px-5 py-3 font-semibold">{t('platform.colMenu')}</th>
                    <th className="px-5 py-3 font-semibold">{t('platform.colRegistered')}</th>
                    <th className="px-5 py-3 font-semibold">{t('platform.colStatus')}</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td className="px-5 py-6 text-on-surface-variant" colSpan={5}>
                        {t('common.loading')}
                      </td>
                    </tr>
                  ) : platformCafes.length === 0 ? (
                    <tr>
                      <td className="px-5 py-6 text-on-surface-variant" colSpan={5}>
                        {t('platform.empty')}
                      </td>
                    </tr>
                  ) : (
                    platformCafes.slice(0, 6).map((cafe) => (
                      <tr key={cafe._id} className="border-t border-outline-variant/15 hover:bg-surface-container-high/60">
                        <td className="px-5 py-3">
                          <Link to={`/dashboard/cafes/${cafe._id}`} className="font-medium text-primary hover:underline">
                            {cafe.name}
                          </Link>
                          <p className="text-on-surface-variant">{cafe.slug}</p>
                        </td>
                        <td className="px-5 py-3 text-on-surface-variant">{cafe.ownerEmail || t('common.none')}</td>
                        <td className="px-5 py-3 text-on-surface-variant">
                          {t('platform.menuStats', { categories: cafe.categoryCount, products: cafe.productCount })}
                        </td>
                        <td className="px-5 py-3 text-on-surface-variant">{formatDate(cafe.createdAt, locale)}</td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                              cafe.isActive ? 'bg-tertiary/15 text-tertiary' : 'bg-error/15 text-error'
                            }`}
                          >
                            {cafe.isActive ? t('platform.statusActive') : t('platform.statusInactive')}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
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
      )}

      {isSuperAdmin ? null : (
      <>
      <QrCodeModal
        open={isQrOpen}
        cafeName={stats.cafe?.name}
        menuUrl={menuUrl}
        slug={stats.cafe?.slug}
        needsIssue={qrMode === 'issue' && qr.canGenerate}
        issuing={qrIssuing}
        issueError={qrIssueError}
        onConfirmIssue={handleConfirmIssue}
        locked={qr.locked}
        onClose={() => setIsQrOpen(false)}
      />
      <QrChangeRequestModal
        open={isQrRequestOpen}
        submitting={qrRequesting}
        error={qrRequestError}
        onSubmit={handleQrRequest}
        onClose={() => setIsQrRequestOpen(false)}
      />
      </>
      )}
    </div>
  );
}
