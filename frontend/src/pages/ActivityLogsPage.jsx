import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useOutletContext } from 'react-router-dom';
import MaterialIcon from '../components/ui/MaterialIcon.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useLocale } from '../hooks/useLocale.js';
import { listActivityLogs } from '../services/platform.service.js';
import { getApiError } from '../utils/apiError.js';
import { formatDateTime, formatRelativeTime } from '../utils/format.js';
import { getHomePath } from '../utils/paths.js';
import Field from '../components/ui/Field.jsx';

const ACTION_GROUPS = [
  {
    id: 'groupCafe',
    actions: ['cafe_created', 'cafe_activated', 'cafe_deactivated', 'cafe_deleted', 'cafe_password_reset', 'cafe_email_updated', 'cafe_updated', 'qr_generated', 'qr_change_requested', 'qr_change_approved', 'qr_change_rejected', 'trial_started', 'trial_reset'],
  },
  {
    id: 'groupMenu',
    actions: ['product_deleted', 'category_deleted'],
  },
  {
    id: 'groupAuth',
    actions: ['auth_login_failed', 'auth_password_changed'],
  },
];

const ACTION_META = {
  cafe_created: { icon: 'add_business', tone: 'ok' },
  cafe_activated: { icon: 'verified', tone: 'ok' },
  cafe_deactivated: { icon: 'block', tone: 'bad' },
  cafe_deleted: { icon: 'delete', tone: 'bad' },
  cafe_password_reset: { icon: 'lock_reset', tone: 'warn' },
  cafe_email_updated: { icon: 'mail', tone: 'warn' },
  cafe_updated: { icon: 'storefront', tone: 'warn' },
  qr_generated: { icon: 'qr_code_2', tone: 'ok' },
  qr_change_requested: { icon: 'outgoing_mail', tone: 'warn' },
  qr_change_approved: { icon: 'verified', tone: 'ok' },
  qr_change_rejected: { icon: 'block', tone: 'bad' },
  trial_started: { icon: 'science', tone: 'ok' },
  trial_reset: { icon: 'restart_alt', tone: 'warn' },
  auth_login_failed: { icon: 'gpp_maybe', tone: 'bad' },
  auth_password_changed: { icon: 'password', tone: 'warn' },
  product_deleted: { icon: 'delete', tone: 'bad' },
  category_deleted: { icon: 'folder_off', tone: 'bad' },
};

const TONE_CLASS = {
  ok: 'bg-tertiary/15 text-tertiary',
  warn: 'bg-primary/15 text-primary',
  bad: 'bg-error/15 text-error',
};

function failReason(reason, t) {
  if (reason === 'cafe_disabled') {
    return t('logs.reasonDisabled');
  }

  if (reason === 'forbidden_role') {
    return t('logs.reasonForbidden');
  }

  if (reason === 'no_cafe') {
    return t('logs.reasonNoCafe');
  }

  if (reason === 'email_unverified') {
    return t('logs.reasonUnverified');
  }

  return t('logs.reasonInvalid');
}

function logDetail(item, t) {
  const meta = item.metadata || {};

  if (item.action === 'cafe_created') {
    return t('logs.detailCreated', { email: meta.ownerEmail || t('common.none') });
  }

  if (item.action === 'cafe_deleted') {
    return t('logs.detailDeleted', {
      name: meta.cafeName || t('common.none'),
      slug: meta.slug || t('common.none'),
    });
  }

  if (item.action === 'cafe_password_reset') {
    return t('logs.detailReset', { email: meta.ownerEmail || t('common.none') });
  }

  if (item.action === 'cafe_email_updated') {
    return t('logs.detailEmailUpdated', {
      previous: meta.previousEmail || t('common.none'),
      next: meta.ownerEmail || t('common.none'),
    });
  }

  if (item.action === 'cafe_updated') {
    return t('logs.detailUpdated', { fields: (meta.fields || []).join(', ') || t('common.none') });
  }

  if (item.action === 'auth_password_changed') {
    return t('logs.detailLogin', { email: meta.email || item.actor?.email || t('common.none') });
  }

  if (item.action === 'auth_login_failed') {
    return t('logs.detailFailed', {
      email: meta.email || t('common.none'),
      reason: failReason(meta.reason, t),
    });
  }

  if (item.action === 'trial_started') {
    return t('logs.detailTrialStart', {
      email: meta.leadEmail || t('common.none'),
      cafe: meta.leadCafeName || t('common.none'),
    });
  }

  if (item.action === 'trial_reset') {
    return t('logs.detailTrialReset', { name: meta.templateName || t('common.none') });
  }

  if (item.action === 'product_deleted') {
    return t('logs.detailProduct', { name: meta.productName || t('common.none') });
  }

  if (item.action === 'category_deleted') {
    return t('logs.detailCategory', { name: meta.categoryName || t('common.none') });
  }

  if (item.action === 'qr_generated') {
    return meta.regenerated ? t('logs.detailQrRegen', { slug: meta.slug || t('common.none') }) : t('logs.detailQr', { slug: meta.slug || t('common.none') });
  }

  if (item.action === 'qr_change_requested') {
    return meta.reason || '';
  }

  if (item.action === 'qr_change_approved' || item.action === 'qr_change_rejected') {
    return meta.note || meta.reason || '';
  }
}

function SummaryCard({ icon, label, value, tone = 'warn' }) {
  return (
    <article className="rounded-2xl bg-surface-container-lowest p-4 ring-1 ring-outline-variant/20">
      <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${TONE_CLASS[tone]}`}>
        <MaterialIcon name={icon} className="text-[18px]" />
      </div>
      <p className="text-sm text-on-surface-variant">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-on-surface">{value}</p>
    </article>
  );
}

export default function ActivityLogsPage() {
  const { user } = useAuth();
  const { t, locale } = useLocale();
  const { platformCafes = [] } = useOutletContext();
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState({ today: 0, cafes: 0, security: 0, deletions: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [action, setAction] = useState('all');
  const [cafeId, setCafeId] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const fetchLogs = useCallback(
    ({ silent = false } = {}) => {
      if (!silent) {
        setLoading(true);
        setError('');
      }

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

      return listActivityLogs(params)
        .then((result) => {
          setLogs(result.logs || []);
          setSummary(result.summary || { today: 0, cafes: 0, security: 0, deletions: 0, total: 0 });
          setError('');
        })
        .catch((err) => {
          if (!silent) {
            setError(getApiError(err, t, 'logs.loadError'));
            setLogs([]);
          }
        })
        .finally(() => {
          if (!silent) {
            setLoading(false);
          }
        });
    },
    [action, cafeId, from, to, t],
  );

  const skipFilterDebounceRef = useRef(true);

  useEffect(() => {
    if (skipFilterDebounceRef.current) {
      skipFilterDebounceRef.current = false;
      fetchLogs({ silent: false });
      return undefined;
    }

    const timer = window.setTimeout(() => {
      fetchLogs({ silent: false });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [fetchLogs]);

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
        item.metadata?.slug,
        item.metadata?.email,
        item.metadata?.productName,
        item.metadata?.categoryName,
        t(`logs.${item.action}`),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(needle);
    });
  }, [logs, query, t]);

  if (user?.role !== 'superadmin') {
    return <Navigate to={getHomePath(user)} replace />;
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-on-surface">{t('logs.title')}</h1>
          <p className="mt-1 text-on-surface-variant">{t('logs.subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={() => fetchLogs({ silent: true })}
          className="inline-flex items-center gap-2 rounded-lg bg-surface-container-highest px-3 py-2 text-sm font-medium text-on-surface hover:bg-surface-container-high"
        >
          <MaterialIcon name="refresh" className="text-[18px]" />
          {t('logs.refresh')}
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard icon="today" label={t('logs.statToday')} value={summary.today} tone="warn" />
        <SummaryCard icon="storefront" label={t('logs.statCafes')} value={summary.cafes} tone="ok" />
        <SummaryCard icon="gpp_maybe" label={t('logs.statSecurity')} value={summary.security} tone="bad" />
        <SummaryCard icon="delete" label={t('logs.statDeleted')} value={summary.deletions} tone="warn" />
      </div>

      <div className="grid gap-3 rounded-2xl bg-surface-container-lowest p-4 shadow-sm ring-1 ring-outline-variant/20 sm:grid-cols-2 lg:grid-cols-5">
        <Field
          size="compact"
          icon="search"
          label={t('logs.search')}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('logs.searchPlaceholder')}
        />
        <Field as="select" size="compact" label={t('logs.action')} value={action} onChange={(event) => setAction(event.target.value)}>
          <option value="all">{t('logs.actionAll')}</option>
          {ACTION_GROUPS.map((group) => (
            <optgroup key={group.id} label={t(`logs.${group.id}`)}>
              {group.actions.map((item) => (
                <option key={item} value={item}>
                  {t(`logs.${item}`)}
                </option>
              ))}
            </optgroup>
          ))}
        </Field>
        <Field as="select" size="compact" label={t('logs.cafe')} value={cafeId} onChange={(event) => setCafeId(event.target.value)}>
          <option value="all">{t('logs.cafeAll')}</option>
          {platformCafes.map((cafe) => (
            <option key={cafe._id} value={cafe._id}>
              {cafe.name}
            </option>
          ))}
        </Field>
        <Field size="compact" type="date" label={t('logs.from')} value={from} onChange={(event) => setFrom(event.target.value)} />
        <Field size="compact" type="date" label={t('logs.to')} value={to} onChange={(event) => setTo(event.target.value)} />
      </div>

      {error ? (
        <p className="rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm text-error">{error}</p>
      ) : null}

      <p className="text-sm text-on-surface-variant">
        {loading ? t('common.loading') : t('logs.count', { filtered: filteredLogs.length, total: summary.total })}
      </p>

      <div className="overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm ring-1 ring-outline-variant/20">
        {loading ? (
          <p className="px-5 py-8 text-on-surface-variant">{t('common.loading')}</p>
        ) : filteredLogs.length === 0 ? (
          <p className="px-5 py-8 text-on-surface-variant">{t('logs.empty')}</p>
        ) : (
          <ul className="divide-y divide-outline-variant/15">
            {filteredLogs.map((item) => {
              const meta = ACTION_META[item.action] || { icon: 'history', tone: 'warn' };
              const detail = logDetail(item, t);

              return (
                <li key={item._id} className="flex gap-4 px-5 py-4 hover:bg-surface-container-high/40">
                  <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${TONE_CLASS[meta.tone]}`}>
                    <MaterialIcon name={meta.icon} className="text-[20px]" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <p className="font-semibold text-on-surface">{t(`logs.${item.action}`)}</p>
                      {item.actor?.role ? (
                        <span className="rounded-full bg-surface-container-high px-2 py-0.5 text-[11px] font-semibold tracking-wider text-on-surface-variant uppercase">
                          {item.actor.role === 'superadmin' ? t('dashboard.roleSuper') : t('dashboard.roleAdmin')}
                        </span>
                      ) : null}
                    </div>
                    {detail ? <p className="mt-0.5 text-sm text-on-surface-variant">{detail}</p> : null}
                    <p className="mt-1 text-sm text-on-surface-variant">
                      {item.actor?.name || t('logs.system')}
                      {item.actor?.email ? ` · ${item.actor.email}` : ''}
                      {item.cafe ? (
                        <>
                          {' · '}
                          <Link to={`/platform/cafes/${item.cafe._id}`} className="font-medium text-primary hover:underline">
                            {item.cafe.name}
                          </Link>
                        </>
                      ) : item.metadata?.cafeName ? (
                        <>
                          {' · '}
                          <span>{item.metadata.cafeName}</span>
                        </>
                      ) : null}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-medium text-on-surface">{formatRelativeTime(item.createdAt, locale)}</p>
                    <p className="text-xs text-on-surface-variant">{formatDateTime(item.createdAt, locale)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
