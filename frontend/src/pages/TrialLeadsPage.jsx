import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useLocale } from '../hooks/useLocale.js';
import { listTrialLeads } from '../services/platform.service.js';
import { getApiError } from '../utils/apiError.js';
import { formatDateTime } from '../utils/format.js';
import { getHomePath } from '../utils/paths.js';

export default function TrialLeadsPage() {
  const { user } = useAuth();
  const { t, locale } = useLocale();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role !== 'superadmin') {
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setError('');

    listTrialLeads()
      .then((items) => {
        if (!cancelled) {
          setLeads(items || []);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getApiError(err, t, 'platform.trialLeadsError'));
          setLeads([]);
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
  }, [t, user?.role]);

  if (user?.role !== 'superadmin') {
    return <Navigate to={getHomePath(user)} replace />;
  }

  return (
    <section className="space-y-5">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-on-surface">{t('platform.trialLeadsTitle')}</h1>
        <p className="mt-1 text-on-surface-variant">{t('platform.trialLeadsHint')}</p>
      </div>

      {error ? (
        <p className="rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm text-error">{error}</p>
      ) : null}

      <div className="overflow-x-auto rounded-2xl bg-surface-container-lowest shadow-sm ring-1 ring-outline-variant/20">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-outline-variant/30 text-on-surface-variant">
            <tr>
              <th className="px-4 py-3 font-semibold">{t('platform.trialLeadName')}</th>
              <th className="px-4 py-3 font-semibold">{t('platform.email')}</th>
              <th className="px-4 py-3 font-semibold">{t('platform.phone')}</th>
              <th className="px-4 py-3 font-semibold">{t('platform.cafeName')}</th>
              <th className="px-4 py-3 font-semibold">{t('auth.city')}</th>
              <th className="px-4 py-3 font-semibold">{t('platform.colRegistered')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-on-surface-variant" colSpan={6}>
                  {t('common.loading')}
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-on-surface-variant" colSpan={6}>
                  {t('platform.trialLeadsEmpty')}
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead._id} className="border-t border-outline-variant/20">
                  <td className="px-4 py-3 font-medium text-on-surface">{lead.name}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{lead.email}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{lead.phone}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{lead.cafeName}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{lead.city || '—'}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{formatDateTime(lead.createdAt, locale)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
