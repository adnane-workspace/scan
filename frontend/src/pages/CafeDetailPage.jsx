import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import PasswordField from '../components/ui/PasswordField.jsx';
import CloudinaryImage from '../components/ui/CloudinaryImage.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useLocale } from '../hooks/useLocale.js';
import { deletePlatformCafe, getPlatformCafe, resetPlatformCafePassword, reviewQrChangeRequest, unlockCafeQr, updatePlatformCafe } from '../services/platform.service.js';
import { getApiError } from '../utils/apiError.js';
import { formatDate } from '../utils/format.js';
import { hasCoordinates, mapsHref } from '../utils/location.js';
import { getPublicMenuUrl } from '../utils/constants.js';
import { getHomePath } from '../utils/paths.js';

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
  const navigate = useNavigate();
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
  const [qrBusy, setQrBusy] = useState(false);
  const [reviewNote, setReviewNote] = useState('');
  const [deleteName, setDeleteName] = useState('');
  const [deleting, setDeleting] = useState(false);

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
          setError(getApiError(err, t, 'platform.notFound'));
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
    return <Navigate to={getHomePath(user)} replace />;
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
      setError(getApiError(err, t, 'platform.updateError'));
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
      setError(getApiError(err, t, 'platform.resetError'));
    } finally {
      setResetting(false);
    }
  }

  async function handleUnlockQr() {
    if (!cafe) {
      return;
    }

    setQrBusy(true);
    setError('');

    try {
      const qr = await unlockCafeQr(cafe._id);
      setCafe((current) => ({ ...current, qr, qrChangeAllowed: true, pendingQrChange: false }));
      await refreshCafes?.();
    } catch (err) {
      setError(getApiError(err, t, 'qr.unlockError'));
    } finally {
      setQrBusy(false);
    }
  }

  async function handleReviewQr(decision) {
    const requestId = cafe?.qr?.pendingRequest?._id;

    if (!requestId) {
      return;
    }

    setQrBusy(true);
    setError('');

    try {
      await reviewQrChangeRequest(requestId, { decision, note: reviewNote.trim() || undefined });
      const data = await getPlatformCafe(id);
      setCafe(data);
      setReviewNote('');
      await refreshCafes?.();
    } catch (err) {
      setError(getApiError(err, t, 'qr.reviewError'));
    } finally {
      setQrBusy(false);
    }
  }

  async function handleDelete() {
    if (!cafe) {
      return;
    }

    setDeleting(true);
    setError('');

    try {
      await deletePlatformCafe(cafe._id);
      await refreshCafes?.();
      navigate('/platform/cafes', { replace: true });
    } catch (err) {
      setError(getApiError(err, t, 'platform.deleteError'));
      setDeleting(false);
    }
  }

  function qrStatusLabel() {
    if (cafe?.qr?.pendingRequest) {
      return t('qr.statusPending');
    }

    if (cafe?.qr?.changeAllowed) {
      return t('qr.statusUnlocked');
    }

    if (cafe?.qr?.generated) {
      return t('qr.statusGenerated');
    }

    return t('qr.statusNotGenerated');
  }

  return (
    <section className="mx-auto w-full max-w-3xl space-y-5">
      <Link to="/platform/cafes" className="text-sm font-semibold text-primary hover:underline">
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
                <CloudinaryImage
                  src={cafe.logo}
                  alt=""
                  preset="logo"
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-xl object-cover"
                />
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
            <a
              href={getPublicMenuUrl(cafe.slug)}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary"
            >
              {t('platform.viewMenu')}
            </a>
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
            <h2 className="text-lg font-semibold text-on-surface">{t('qr.platformTitle')}</h2>
            <p className="text-sm text-on-surface-variant">{t('qr.platformHint')}</p>
            <p className="font-semibold text-on-surface">{qrStatusLabel()}</p>
            {cafe.qr?.pendingRequest ? (
              <div className="rounded-xl bg-surface-container-high px-4 py-3 text-sm text-on-surface">
                <p className="font-medium">{t('qr.colReason')}</p>
                <p className="mt-1 text-on-surface-variant">{cafe.qr.pendingRequest.reason}</p>
              </div>
            ) : null}
            {cafe.qr?.pendingRequest ? (
              <div className="grid gap-3">
                <input
                  value={reviewNote}
                  onChange={(event) => setReviewNote(event.target.value)}
                  className="w-full rounded-xl bg-surface-container-high px-3 py-2.5 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('qr.reviewNotePlaceholder')}
                  maxLength={400}
                />
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={qrBusy}
                    onClick={() => handleReviewQr('approved')}
                    className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary disabled:opacity-60"
                  >
                    {t('qr.approve')}
                  </button>
                  <button
                    type="button"
                    disabled={qrBusy}
                    onClick={() => handleReviewQr('rejected')}
                    className="rounded-xl bg-surface-container-high px-5 py-2.5 text-sm font-semibold text-on-surface disabled:opacity-60"
                  >
                    {t('qr.reject')}
                  </button>
                </div>
              </div>
            ) : cafe.qr?.generated && !cafe.qr?.changeAllowed ? (
              <button
                type="button"
                disabled={qrBusy}
                onClick={handleUnlockQr}
                className="rounded-xl bg-surface-container-high px-5 py-2.5 text-sm font-semibold text-on-surface disabled:opacity-60"
              >
                {t('qr.unlock')}
              </button>
            ) : null}
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

          <div className="space-y-3 border-t border-error/20 pt-5">
            <h2 className="text-lg font-semibold text-error">{t('platform.deleteTitle')}</h2>
            <p className="text-sm text-on-surface-variant">{t('platform.deleteHint')}</p>
            <label className="block text-sm font-medium text-on-surface">
              {t('platform.deleteConfirm', { name: cafe.name })}
              <input
                value={deleteName}
                onChange={(event) => setDeleteName(event.target.value)}
                className="mt-1 w-full rounded-xl bg-surface-container-high px-3 py-2.5 text-sm text-on-surface outline-none focus:ring-2 focus:ring-error"
                autoComplete="off"
              />
            </label>
            <button
              type="button"
              disabled={deleting || deleteName.trim() !== cafe.name}
              onClick={handleDelete}
              className="rounded-xl bg-error px-5 py-2.5 text-sm font-semibold text-on-error disabled:opacity-60"
            >
              {deleting ? t('platform.deleting') : t('platform.delete')}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
