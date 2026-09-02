import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import MaterialIcon from '../components/ui/MaterialIcon.jsx';
import Pagination from '../components/ui/Pagination.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useLocale } from '../hooks/useLocale.js';
import { getStorageReport } from '../services/platform.service.js';
import { getApiError } from '../utils/apiError.js';
import { formatBytes, formatCount } from '../utils/format.js';
import { getHomePath } from '../utils/paths.js';

function SummaryCard({ icon, label, value, hint }) {
  return (
    <article className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm ring-1 ring-outline-variant/20">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container/20 text-primary">
        <MaterialIcon name={icon} />
      </div>
      <p className="text-sm font-medium text-on-surface-variant">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold tracking-tight text-on-surface">{value}</p>
      {hint ? <p className="mt-1 text-sm text-on-surface-variant">{hint}</p> : null}
    </article>
  );
}

export default function StoragePage() {
  const { user } = useAuth();
  const { t, locale } = useLocale();
  const [report, setReport] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    async (force = false, nextPage = page) => {
      if (force) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      try {
        const data = await getStorageReport({ refresh: force, page: nextPage, limit: 20 });
        setReport(data);
        setPagination(data.pagination || { page: nextPage, totalPages: 1, total: 0 });
      } catch (err) {
        setError(getApiError(err, t, 'storage.loadError'));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, t],
  );

  useEffect(() => {
    load(false, page);
  }, [load, page]);

  const totalBytes = report?.totals.bytes || 1;
  const cafes = useMemo(() => report?.cafes || [], [report]);

  if (user?.role !== 'superadmin') {
    return <Navigate to={getHomePath(user)} replace />;
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-on-surface">{t('storage.title')}</h1>
          <p className="mt-1 max-w-2xl text-on-surface-variant">{t('storage.subtitle')}</p>
          {report?.source === 'production' ? (
            <p className="mt-2 text-sm font-medium text-primary">{t('storage.sourceProd')}</p>
          ) : null}
        </div>
        <button
          type="button"
          disabled={loading || refreshing}
          onClick={() => load(true, page)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary shadow-md disabled:opacity-60"
        >
          <MaterialIcon name="refresh" className="text-[18px]" />
          {t('storage.refresh')}
        </button>
      </div>

      {error ? (
        <p className="rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm text-error">{error}</p>
      ) : null}

      {report?.cloudinaryError ? (
        <p className="rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm text-error">
          {t('storage.cloudinaryError', { message: report.cloudinaryError })}
        </p>
      ) : null}

      {loading && !report ? (
        <p className="text-sm text-on-surface-variant">{t('common.loading')}</p>
      ) : report ? (
        <>
          <div className="grid gap-3 md:grid-cols-2">
            <SummaryCard
              icon="photo_library"
              label={t('storage.photos')}
              value={formatCount(report.totals.photos, locale)}
              hint={t('storage.photosHint', {
                logos: formatCount(report.totals.logos, locale),
                covers: formatCount(report.totals.covers || 0, locale),
                menuBackgrounds: formatCount(report.totals.menuBackgrounds || 0, locale),
                products: formatCount(report.totals.productImages, locale),
                categories: formatCount(report.totals.categoryImages, locale),
              })}
            />
            <SummaryCard
              icon="hard_drive"
              label={t('storage.storageUsed')}
              value={formatBytes(report.totals.bytes, locale)}
              hint={t('storage.storageHint')}
            />
          </div>

          {report.totals.orphanCount > 0 ? (
            <p className="text-sm text-on-surface-variant">
              {t('storage.orphansHint', {
                count: formatCount(report.totals.orphanCount, locale),
                size: formatBytes(report.totals.orphanBytes, locale),
              })}
            </p>
          ) : null}

          <div className="overflow-x-auto rounded-2xl bg-surface-container-lowest shadow-sm ring-1 ring-outline-variant/20">
            <div className="border-b border-outline-variant/30 px-4 py-3">
              <h2 className="text-lg font-semibold text-on-surface">{t('storage.cafesTitle')}</h2>
            </div>
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-outline-variant/30 text-on-surface-variant">
                <tr>
                  <th className="px-4 py-3 font-semibold">{t('storage.colCafe')}</th>
                  <th className="px-4 py-3 font-semibold">{t('storage.colPhotos')}</th>
                  <th className="px-4 py-3 font-semibold">{t('storage.colLogos')}</th>
                  <th className="px-4 py-3 font-semibold">{t('storage.colCovers')}</th>
                  <th className="px-4 py-3 font-semibold">{t('storage.colMenuBg')}</th>
                  <th className="px-4 py-3 font-semibold">{t('storage.colProducts')}</th>
                  <th className="px-4 py-3 font-semibold">{t('storage.colCategories')}</th>
                  <th className="px-4 py-3 font-semibold">{t('storage.colSize')}</th>
                  <th className="px-4 py-3 font-semibold">{t('storage.colShare')}</th>
                </tr>
              </thead>
              <tbody>
                {cafes.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-on-surface-variant" colSpan={9}>
                      {t('storage.empty')}
                    </td>
                  </tr>
                ) : (
                  cafes.map((cafe) => {
                    const share = report.totals.bytes ? Math.round((cafe.bytes / totalBytes) * 100) : 0;

                    return (
                      <tr key={cafe._id} className="border-t border-outline-variant/20">
                        <td className="px-4 py-3">
                          {/^[0-9a-f-]{36}$/i.test(cafe._id) ? (
                            <Link to={`/platform/cafes/${cafe._id}`} className="font-medium text-primary hover:underline">
                              {cafe.name}
                            </Link>
                          ) : (
                            <p className="font-medium text-on-surface">{cafe.name}</p>
                          )}
                          <p className="text-on-surface-variant">{cafe.slug}</p>
                        </td>
                        <td className="px-4 py-3 font-medium text-on-surface">{cafe.photoCount}</td>
                        <td className="px-4 py-3 text-on-surface-variant">{cafe.logos}</td>
                        <td className="px-4 py-3 text-on-surface-variant">{cafe.covers || 0}</td>
                        <td className="px-4 py-3 text-on-surface-variant">{cafe.menuBackgrounds || 0}</td>
                        <td className="px-4 py-3 text-on-surface-variant">{cafe.productImages}</td>
                        <td className="px-4 py-3 text-on-surface-variant">{cafe.categoryImages}</td>
                        <td className="px-4 py-3 font-medium text-on-surface">{formatBytes(cafe.bytes, locale)}</td>
                        <td className="px-4 py-3">
                          <div className="flex min-w-28 items-center gap-2">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-container-high">
                              <div className="h-full rounded-full bg-primary" style={{ width: `${share}%` }} />
                            </div>
                            <span className="w-10 text-right text-on-surface-variant">{share}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            onPageChange={setPage}
            disabled={loading || refreshing}
          />
        </>
      ) : null}
    </section>
  );
}
