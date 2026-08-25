import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useOutletContext } from 'react-router-dom';
import MaterialIcon from '../components/ui/MaterialIcon.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useLocale } from '../hooks/useLocale.js';
import { listQrChangeRequests, reviewQrChangeRequest } from '../services/platform.service.js';
import { formatDateTime } from '../utils/format.js';

const fieldClass =
  'w-full rounded-lg bg-surface-container-highest px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary';

export default function QrRequestsPage() {
  const { user } = useAuth();
  const { t, locale } = useLocale();
  const { refreshCafes } = useOutletContext();
  const [status, setStatus] = useState('pending');
  const [requests, setRequests] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingId, setPendingId] = useState('');
  const [note, setNote] = useState('');

  const filteredLabel = useMemo(() => {
    if (status === 'pending') {
      return t('qr.requestsPendingCount', { count: pendingCount });
    }

    return t('qr.requestsCount', { count: requests.length });
  }, [pendingCount, requests.length, status, t]);

  useEffect(() => {
    if (user?.role !== 'superadmin') {
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setError('');

    listQrChangeRequests(status)
      .then((result) => {
        if (cancelled) {
          return;
        }

        setRequests(result.requests || []);
        setPendingCount(result.pendingCount || 0);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.message || t('qr.requestsLoadError'));
          setRequests([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [status, t, user?.role]);

  if (user?.role !== 'superadmin') {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleReview(request, decision) {
    setPendingId(request._id);
    setError('');

    try {
      await reviewQrChangeRequest(request._id, { decision, note: note.trim() || undefined });
      setNote('');
      const result = await listQrChangeRequests(status);
      setRequests(result.requests || []);
      setPendingCount(result.pendingCount || 0);
      await refreshCafes?.();
    } catch (err) {
      setError(err.response?.data?.message || t('qr.reviewError'));
    } finally {
      setPendingId('');
    }
  }

  function statusClass(value) {
    if (value === 'approved') {
      return 'bg-tertiary/15 text-tertiary';
    }

    if (value === 'rejected') {
      return 'bg-error/15 text-error';
    }

    return 'bg-primary/15 text-primary';
  }

  return (
    <section className="space-y-5">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-on-surface">{t('qr.requestsTitle')}</h1>
        <p className="mt-1 text-on-surface-variant">{t('qr.requestsSubtitle')}</p>
      </div>

      <div className="grid gap-3 rounded-2xl bg-surface-container-lowest p-4 shadow-sm ring-1 ring-outline-variant/20 sm:grid-cols-2">
        <label className="text-sm font-medium text-on-surface">
          {t('qr.requestsFilter')}
          <select value={status} onChange={(event) => setStatus(event.target.value)} className={`mt-1 ${fieldClass}`}>
            <option value="pending">{t('qr.statusPending')}</option>
            <option value="approved">{t('qr.statusApproved')}</option>
            <option value="rejected">{t('qr.statusRejected')}</option>
            <option value="all">{t('qr.statusAll')}</option>
          </select>
        </label>
        <label className="text-sm font-medium text-on-surface">
          {t('qr.reviewNote')}
          <input
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className={`mt-1 ${fieldClass}`}
            placeholder={t('qr.reviewNotePlaceholder')}
            maxLength={400}
          />
        </label>
      </div>

      {error ? (
        <p className="rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm text-error">{error}</p>
      ) : null}

      <p className="text-sm text-on-surface-variant">{loading ? t('common.loading') : filteredLabel}</p>

      <div className="overflow-x-auto rounded-2xl bg-surface-container-lowest shadow-sm ring-1 ring-outline-variant/20">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-outline-variant/30 text-on-surface-variant">
            <tr>
              <th className="px-4 py-3 font-semibold">{t('platform.colCafe')}</th>
              <th className="px-4 py-3 font-semibold">{t('qr.colRequester')}</th>
              <th className="px-4 py-3 font-semibold">{t('qr.colReason')}</th>
              <th className="px-4 py-3 font-semibold">{t('qr.colWhen')}</th>
              <th className="px-4 py-3 font-semibold">{t('platform.colStatus')}</th>
              <th className="px-4 py-3 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-on-surface-variant" colSpan={6}>
                  {t('common.loading')}
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-on-surface-variant" colSpan={6}>
                  {t('qr.requestsEmpty')}
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr key={request._id} className="border-t border-outline-variant/20 align-top">
                  <td className="px-4 py-3">
                    {request.cafe?._id ? (
                      <Link to={`/dashboard/cafes/${request.cafe._id}`} className="font-medium text-primary hover:underline">
                        {request.cafe.name}
                      </Link>
                    ) : (
                      <span>{t('common.none')}</span>
                    )}
                    <p className="text-on-surface-variant">{request.cafe?.slug || ''}</p>
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant">
                    {request.requester?.name || t('common.none')}
                    <p>{request.requester?.email || ''}</p>
                  </td>
                  <td className="max-w-xs px-4 py-3 text-on-surface">{request.reason}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{formatDateTime(request.createdAt, locale)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(request.status)}`}>
                      {t(`qr.status${request.status.charAt(0).toUpperCase()}${request.status.slice(1)}`)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {request.status === 'pending' ? (
                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          type="button"
                          disabled={Boolean(pendingId)}
                          onClick={() => handleReview(request, 'approved')}
                          className="rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-on-primary disabled:opacity-60"
                        >
                          {pendingId === request._id ? t('common.saving') : t('qr.approve')}
                        </button>
                        <button
                          type="button"
                          disabled={Boolean(pendingId)}
                          onClick={() => handleReview(request, 'rejected')}
                          className="rounded-xl bg-surface-container-high px-3 py-2 text-xs font-semibold text-on-surface disabled:opacity-60"
                        >
                          {t('qr.reject')}
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-on-surface-variant">
                        {request.reviewNote || t('common.none')}
                      </p>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="flex items-center gap-2 text-sm text-on-surface-variant">
        <MaterialIcon name="info" className="text-[18px]" />
        {t('qr.requestsHelp')}
      </p>
    </section>
  );
}
