import { useEffect, useState } from 'react';
import { Link, Navigate, useOutletContext, useParams } from 'react-router-dom';
import PasswordField from '../components/ui/PasswordField.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useLocale } from '../hooks/useLocale.js';
import { getPlatformCafe, resetPlatformCafePassword, updatePlatformCafe } from '../services/platform.service.js';
import { formatDate } from '../utils/format.js';
import { hasCoordinates, mapsHref } from '../utils/location.js';

function Field({ label, value }) {
  return (
    <div>
      <p className="text-label-md font-medium uppercase tracking-wider text-on-surface-variant">{label}</p>
      <p className="mt-1 text-on-surface">{value || '—'}</p>
    </div>
  );
}

export default function CafeDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { t, locale } = useLocale();
  const { refreshCafes } = useOutletContext();
  const [cafe, setCafe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState('');

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError('');

    getPlatformCafe(id)
      .then((data) => {
        if (!cancelled) {
          setCafe(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.message || t('platform.notFound'));
          setCafe(null);
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
  }, [id, t]);

  if (user?.role !== 'superadmin') {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleToggle() {
    if (!cafe) {
      return;
    }

    setPending(true);
    setError('');

    try {
      const updated = await updatePlatformCafe(cafe._id, { isActive: !cafe.isActive });
      setCafe((current) => ({ ...current, ...updated }));
      await refreshCafes?.();
    } catch (err) {
      setError(err.response?.data?.message || t('platform.updateError'));
    } finally {
      setPending(false);
    }
  }

  async function handleResetPassword(event) {
    event.preventDefault();

    if (!cafe) {
      return;
    }

    if (password !== confirmPassword) {
      setError(t('platform.passwordMismatch'));
      return;
    }

    setResetting(true);
    setError('');
    setResetSuccess('');

    try {
      const result = await resetPlatformCafePassword(cafe._id, password);
      setPassword('');
      setConfirmPassword('');
      setShowNew(false);
      setShowConfirm(false);
      setShowResetForm(false);
      setResetSuccess(t('platform.passwordUpdated', { email: result.email }));
    } catch (err) {
      setError(err.response?.data?.message || t('platform.resetError'));
    } finally {
      setResetting(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-3xl space-y-5">
      <Link to="/dashboard/cafes" className="text-sm font-semibold text-primary hover:underline">
        {t('platform.backToCafes')}
      </Link>

      {error ? (
        <p className="rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm text-error">{error}</p>
      ) : null}

      {loading ? (
        <p className="text-on-surface-variant">{t('common.loading')}</p>
      ) : cafe ? (
        <div className="space-y-5 rounded-2xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant/20">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {cafe.logo ? (
                <img src={cafe.logo} alt="" className="h-16 w-16 rounded-xl object-cover" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-surface-container-high text-on-surface-variant">
                  {cafe.name.slice(0, 1)}
                </div>
              )}
              <div>
                <h1 className="font-display text-3xl font-semibold text-on-surface">{cafe.name}</h1>
                <p className="text-on-surface-variant">/{cafe.slug}</p>
              </div>
            </div>
            <span className={cafe.isActive ? 'font-semibold text-primary' : 'font-semibold text-error'}>
              {cafe.isActive ? t('platform.statusActive') : t('platform.statusInactive')}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t('platform.owner')} value={cafe.ownerName} />
            <Field label={t('platform.email')} value={cafe.ownerEmail} />
            <Field label={t('platform.phone')} value={cafe.phone} />
            <Field
              label={t('platform.address')}
              value={
                cafe.address || hasCoordinates(cafe) ? (
                  <a href={mapsHref(cafe)} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                    {cafe.address || t('platform.viewLocation')}
                  </a>
                ) : (
                  t('common.none')
                )
              }
            />
            <Field label={t('platform.categories')} value={String(cafe.categoryCount)} />
            <Field label={t('platform.products')} value={String(cafe.productCount)} />
            <Field label={t('platform.created')} value={formatDate(cafe.createdAt, locale)} />
            <Field label={t('platform.updated')} value={formatDate(cafe.updatedAt, locale)} />
          </div>

          {cafe.description ? <p className="text-on-surface-variant">{cafe.description}</p> : null}

          <div className="flex flex-wrap gap-3">
            <Link
              to={`/menu/${cafe.slug}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary"
            >
              {t('platform.viewMenu')}
            </Link>
            <button
              type="button"
              disabled={pending}
              onClick={handleToggle}
              className="rounded-xl bg-surface-container-high px-5 py-2.5 text-sm font-semibold text-on-surface disabled:opacity-60"
            >
              {cafe.isActive ? t('platform.deactivate') : t('platform.activate')}
            </button>
          </div>

          <div className="space-y-3 border-t border-outline-variant/30 pt-5">
            <h2 className="text-lg font-semibold text-on-surface">{t('platform.passwordTitle')}</h2>
            <p className="text-sm text-on-surface-variant">
              {t('platform.passwordHint', { email: cafe.ownerEmail || t('platform.owner') })}
            </p>
            {resetSuccess ? (
              <p className="rounded-xl border border-primary/20 bg-primary-container px-4 py-3 text-sm text-on-primary-container">
                {resetSuccess}
              </p>
            ) : null}
            {showResetForm ? (
              <form onSubmit={handleResetPassword} className="grid gap-3">
                <PasswordField
                  label={t('platform.newPassword')}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  show={showNew}
                  onToggleShow={() => setShowNew((current) => !current)}
                  placeholder={t('settings.passwordPlaceholder')}
                  minLength={8}
                />
                <PasswordField
                  label={t('platform.confirmPassword')}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  show={showConfirm}
                  onToggleShow={() => setShowConfirm((current) => !current)}
                  placeholder={t('settings.confirmPlaceholder')}
                  minLength={8}
                />
                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={resetting}
                    className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary disabled:opacity-60"
                  >
                    {resetting ? t('common.saving') : t('platform.reset')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowResetForm(false);
                      setPassword('');
                      setConfirmPassword('');
                      setShowNew(false);
                      setShowConfirm(false);
                    }}
                    className="rounded-xl bg-surface-container-high px-5 py-2.5 text-sm font-semibold text-on-surface"
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setShowResetForm(true);
                  setResetSuccess('');
                }}
                className="rounded-xl bg-surface-container-high px-5 py-2.5 text-sm font-semibold text-on-surface"
              >
                {t('platform.changePassword')}
              </button>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
