import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useOutletContext } from 'react-router-dom';
import MaterialIcon from '../components/ui/MaterialIcon.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useLocale } from '../hooks/useLocale.js';
import { listActivityLogs } from '../services/platform.service.js';
import { formatDateTime } from '../utils/format.js';

const fieldClass =
  'w-full rounded-lg bg-surface-container-highest px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary';

const ACTIONS = [
  'cafe_created',
  'cafe_activated',
  'cafe_deactivated',
  'cafe_password_reset',
  'cafe_updated',
  'auth_login',
  'auth_password_changed',
];

const ACTION_ICONS = {
  cafe_created: 'add_business',
  cafe_activated: 'verified',
  cafe_deactivated: 'block',
  cafe_password_reset: 'lock_reset',
  cafe_updated: 'edit',
  auth_login: 'login',
  auth_password_changed: 'password',
};

function logDetail(item, t) {
  const meta = item.metadata || {};

  if (item.action === 'cafe_created') {
    return t('logs.detailCreated', { email: meta.ownerEmail || t('common.none') });
  }

  if (item.action === 'cafe_password_reset') {
    return t('logs.detailReset', { email: meta.ownerEmail || t('common.none') });
  }

  if (item.action === 'cafe_updated') {
    return t('logs.detailUpdated', { fields: (meta.fields || []).join(', ') || t('common.none') });
  }

  if (item.action === 'auth_login' || item.action === 'auth_password_changed') {
    return t('logs.detailLogin', { email: meta.email || item.actor?.email || t('common.none') });
  }

  return meta.slug || '';
}

export default function ActivityLogsPage() {
  const { user } = useAuth();
  const { t, locale } = useLocale();
  const { platformCafes = [] } = useOutletContext();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [action, setAction] = useState('all');
  const [cafeId, setCafeId] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError('');

    const params = {};

    if (action !== 'all') {
      params.action = action;
    }

    if (cafeId !== 'all') {
      params.cafeId = cafeId;
    }

    if (from) {
      params.from = from;
    }

    if (to) {
      params.to = to;
    }

    listActivityLogs(params)
      .then((items) => {
        if (!cancelled) {
          setLogs(items);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.message || t('logs.loadError'));
          setLogs([]);
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
  }, [action, cafeId, from, to, t]);

  const filteredLogs = useMemo(() => {
    const needle = query.trim().toLowerCase();

    if (!needle) {
      return logs;
    }

    return logs.filter((item) => {
      const haystack = [
        item.actor?.name,
        item.actor?.email,
        item.cafe?.name,
        item.cafe?.slug,
        item.metadata?.ownerEmail,
        item.metadata?.cafeName,
        item.metadata?.email,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(needle);
    });
  }, [logs, query]);

  if (user?.role !== 'superadmin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <section className="space-y-5">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-on-surface">{t('logs.title')}</h1>
        <p className="mt-1 text-on-surface-variant">{t('logs.subtitle')}</p>
      </div>

      <div className="grid gap-3 rounded-2xl bg-surface-container-lowest p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
        <label className="text-sm font-medium text-on-surface lg:col-span-1">
          {t('logs.search')}
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className={`mt-1 ${fieldClass}`}
            placeholder={t('logs.searchPlaceholder')}
          />
        </label>
        <label className="text-sm font-medium text-on-surface">
          {t('logs.action')}
          <select value={action} onChange={(event) => setAction(event.target.value)} className={`mt-1 ${fieldClass}`}>
            <option value="all">{t('logs.actionAll')}</option>
            {ACTIONS.map((item) => (
              <option key={item} value={item}>
                {t(`logs.${item}`)}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-on-surface">
          {t('logs.cafe')}
          <select value={cafeId} onChange={(event) => setCafeId(event.target.value)} className={`mt-1 ${fieldClass}`}>
            <option value="all">{t('logs.cafeAll')}</option>
            {platformCafes.map((cafe) => (
              <option key={cafe._id} value={cafe._id}>
                {cafe.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-on-surface">
          {t('logs.from')}
          <input type="date" value={from} onChange={(event) => setFrom(event.target.value)} className={`mt-1 ${fieldClass}`} />
        </label>
        <label className="text-sm font-medium text-on-surface">
          {t('logs.to')}
          <input type="date" value={to} onChange={(event) => setTo(event.target.value)} className={`mt-1 ${fieldClass}`} />
        </label>
      </div>

      {error ? (
        <p className="rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm text-error">{error}</p>
      ) : null}

      <p className="text-sm text-on-surface-variant">
        {loading ? t('common.loading') : t('logs.count', { filtered: filteredLogs.length, total: logs.length })}
      </p>

      <div className="overflow-x-auto rounded-2xl bg-surface-container-lowest shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-outline-variant/30 text-on-surface-variant">
            <tr>
              <th className="px-4 py-3 font-semibold">{t('logs.colWhen')}</th>
              <th className="px-4 py-3 font-semibold">{t('logs.colActor')}</th>
              <th className="px-4 py-3 font-semibold">{t('logs.colAction')}</th>
              <th className="px-4 py-3 font-semibold">{t('logs.colCafe')}</th>
              <th className="px-4 py-3 font-semibold">{t('logs.colDetail')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-on-surface-variant" colSpan={5}>
                  {t('common.loading')}
                </td>
              </tr>
            ) : filteredLogs.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-on-surface-variant" colSpan={5}>
                  {t('logs.empty')}
                </td>
              </tr>
            ) : (
              filteredLogs.map((item) => (
                <tr key={item._id} className="border-t border-outline-variant/20">
                  <td className="whitespace-nowrap px-4 py-3 text-on-surface-variant">
                    {formatDateTime(item.createdAt, locale)}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-on-surface">{item.actor?.name || t('logs.system')}</p>
                    <p className="text-on-surface-variant">{item.actor?.email || t('common.none')}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2 font-medium text-on-surface">
                      <MaterialIcon name={ACTION_ICONS[item.action] || 'history'} className="text-[18px] text-primary" />
                      {t(`logs.${item.action}`)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {item.cafe ? (
                      <Link to={`/dashboard/cafes/${item.cafe._id}`} className="font-medium text-primary hover:underline">
                        {item.cafe.name}
                      </Link>
                    ) : (
                      <span className="text-on-surface-variant">{item.metadata?.cafeName || t('common.none')}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant">{logDetail(item, t)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
