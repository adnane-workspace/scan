import { useEffect, useMemo, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import LocationPickerModal from '../components/dashboard/LocationPickerModal.jsx';
import MaterialIcon from '../components/ui/MaterialIcon.jsx';
import PasswordField from '../components/ui/PasswordField.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useLocale } from '../hooks/useLocale.js';
import { clearPublicMenuCache } from '../hooks/usePublicMenu.js';
import { LOCALES } from '../i18n/messages.js';
import { changePasswordRequest } from '../services/auth.service.js';
import { getMyCafe, updateMyCafe, uploadCafeLogo } from '../services/cafe.service.js';
import { getPublicMenuUrl } from '../utils/constants.js';
import { hasCoordinates, mapsHref } from '../utils/location.js';

const emptyForm = {
  name: '',
  slug: '',
  description: '',
  logo: '',
  address: '',
  phone: '',
  latitude: null,
  longitude: null,
};

const TABS = [
  { id: 'general', icon: 'tune', labelKey: 'settings.tabGeneral', roles: ['admin'] },
  { id: 'security', icon: 'shield', labelKey: 'settings.tabSecurity', roles: ['admin', 'superadmin'] },
  { id: 'language', icon: 'translate', labelKey: 'settings.tabLanguage', roles: ['admin', 'superadmin'] },
];

function SettingsField({ id, label, icon, hint, children }) {
  return (
    <div className="group flex flex-col gap-1.5">
      <label htmlFor={id} className="text-label-md font-medium tracking-wider text-on-surface-variant uppercase">
        {label}
      </label>
      <div className="flex items-center rounded-xl bg-surface-container-low ring-1 ring-transparent transition-shadow focus-within:ring-2 focus-within:ring-primary">
        {icon ? (
          <MaterialIcon
            name={icon}
            className="ml-3 pointer-events-none text-[20px] text-on-surface-variant/50 group-focus-within:text-primary"
          />
        ) : null}
        {children}
      </div>
      {hint ? <p className="pl-1 text-xs text-on-surface-variant">{hint}</p> : null}
    </div>
  );
}

const inputClass =
  'w-full bg-transparent px-3 py-3.5 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none';

function SectionCard({ icon, title, subtitle, children }) {
  return (
    <section className="overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm">
      <div className="flex items-start gap-3 border-b border-outline-variant/15 px-6 py-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-container-high text-primary">
          <MaterialIcon name={icon} />
        </span>
        <div>
          <h2 className="font-display text-xl font-semibold text-on-surface">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-sm text-on-surface-variant">{subtitle}</p> : null}
        </div>
      </div>
      <div className="grid gap-4 px-6 py-5">{children}</div>
    </section>
  );
}

function SettingsSkeleton() {
  return (
    <div className="grid animate-pulse gap-5">
      <div className="h-64 rounded-2xl bg-surface-container-lowest" />
      <div className="h-48 rounded-2xl bg-surface-container-lowest" />
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const { t, locale, setLocale } = useLocale();
  const { refreshStats } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [languageSaved, setLanguageSaved] = useState(false);

  const isSuperAdmin = user?.role === 'superadmin';
  const tabs = useMemo(
    () => TABS.filter((tab) => tab.roles.includes(user?.role || 'admin')),
    [user?.role],
  );
  const requestedTab = searchParams.get('tab');
  const tab = tabs.some((item) => item.id === requestedTab) ? requestedTab : tabs[0]?.id || 'general';

  useEffect(() => {
    if (isSuperAdmin) {
      setLoading(false);
      return undefined;
    }

    let cancelled = false;

    getMyCafe()
      .then((cafe) => {
        if (!cancelled) {
          setForm({
            name: cafe.name || '',
            slug: cafe.slug || '',
            description: cafe.description || '',
            logo: cafe.logo || '',
            address: cafe.address || '',
            phone: cafe.phone || '',
            latitude: cafe.latitude ?? null,
            longitude: cafe.longitude ?? null,
          });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.message || t('settings.loadError'));
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
  }, [isSuperAdmin, t]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleImageChange(event) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    setUploading(true);
    setError('');

    try {
      const url = await uploadCafeLogo(file);
      setForm((current) => ({ ...current, logo: url }));
    } catch (err) {
      setError(err.response?.data?.message || t('settings.uploadError'));
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const cafe = await updateMyCafe({
        name: form.name,
        slug: form.slug,
        description: form.description,
        logo: form.logo,
        address: form.address,
        phone: form.phone,
        latitude: form.latitude,
        longitude: form.longitude,
      });
      setForm({
        name: cafe.name || '',
        slug: cafe.slug || '',
        description: cafe.description || '',
        logo: cafe.logo || '',
        address: cafe.address || '',
        phone: cafe.phone || '',
        latitude: cafe.latitude ?? null,
        longitude: cafe.longitude ?? null,
      });
      setSuccess(t('settings.saved'));
      clearPublicMenuCache(cafe.slug);
      await refreshStats?.();
    } catch (err) {
      setError(err.response?.data?.message || t('settings.saveError'));
    } finally {
      setSaving(false);
    }
  }

  function resetPasswordFields() {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError(t('settings.passwordMismatch'));
      return;
    }

    setPasswordSaving(true);

    try {
      await changePasswordRequest({ currentPassword, newPassword });
      resetPasswordFields();
      setShowPasswordForm(false);
      setPasswordSuccess(t('settings.passwordUpdated'));
    } catch (err) {
      setPasswordError(err.response?.data?.message || t('settings.passwordError'));
    } finally {
      setPasswordSaving(false);
    }
  }

  const menuPath = form.slug ? `/menu/${form.slug}` : '';
  const publicUrl = getPublicMenuUrl(form.slug);
  const located = hasCoordinates(form);

  return (
    <section className="mx-auto w-full max-w-5xl space-y-5">
      <div className="relative overflow-hidden rounded-2xl bg-surface-container-high p-6 shadow-sm sm:p-8">
        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center">
          {form.logo ? (
            <img src={form.logo} alt="" className="h-20 w-20 rounded-2xl object-cover shadow-sm" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-container-lowest font-display text-3xl font-semibold text-primary shadow-sm">
              {(form.name || 'P').slice(0, 1)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-label-md font-semibold tracking-[0.16em] text-primary uppercase">{t('settings.badge')}</p>
            <h1 className="mt-1 font-display text-display-md font-bold tracking-tight text-on-surface">
              {form.name || t('settings.title')}
            </h1>
            <p className="mt-1 text-on-surface-variant">{form.slug ? `/${form.slug}` : t('settings.subtitle')}</p>
          </div>
          {menuPath ? (
            <a
              href={publicUrl || menuPath}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-label-lg font-semibold tracking-[0.05em] text-on-primary shadow-md hover:bg-primary/90"
            >
              <MaterialIcon name="open_in_new" className="text-[20px]" />
              {t('settings.viewMenu')}
            </a>
          ) : null}
        </div>
        <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {tabs.map((item) => {
            const active = tab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSearchParams({ tab: item.id })}
                className={`inline-flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <MaterialIcon name={item.icon} className="text-[20px]" />
                {t(item.labelKey)}
              </button>
            );
          })}
        </nav>

        <div className="min-w-0 space-y-5">
          {error && tab === 'general' ? (
            <p className="rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm text-error">{error}</p>
          ) : null}
          {success && tab === 'general' ? (
            <p className="rounded-xl border border-primary/20 bg-primary-container px-4 py-3 text-sm text-on-primary-container">
              {success}
            </p>
          ) : null}

          {tab === 'general' && loading ? <SettingsSkeleton /> : null}

          {tab === 'general' && !loading ? (
            <form onSubmit={handleSubmit} className="grid gap-5">
              <SectionCard icon="storefront" title={t('settings.identity')} subtitle={t('settings.identityHint')}>
                <SettingsField id="name" label={t('settings.cafeName')} icon="badge">
                  <input id="name" name="name" value={form.name} onChange={handleChange} className={inputClass} required />
                </SettingsField>
                <SettingsField id="slug" label={t('settings.publicLink')} icon="link" hint={t('settings.slugHint')}>
                  <input id="slug" name="slug" value={form.slug} onChange={handleChange} className={inputClass} required />
                </SettingsField>
                <div className="group flex flex-col gap-1.5">
                  <label htmlFor="description" className="text-label-md font-medium tracking-wider text-on-surface-variant uppercase">
                    {t('settings.description')}
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-xl bg-surface-container-low px-4 py-3.5 text-on-surface outline-none ring-1 ring-transparent focus:ring-2 focus:ring-primary"
                  />
                </div>
              </SectionCard>

              <SectionCard icon="place" title={t('settings.contact')} subtitle={t('settings.contactHint')}>
                <SettingsField id="phone" label={t('settings.phone')} icon="call">
                  <input id="phone" name="phone" value={form.phone} onChange={handleChange} className={inputClass} />
                </SettingsField>
                <SettingsField id="address" label={t('settings.address')} icon="home">
                  <input id="address" name="address" value={form.address} onChange={handleChange} className={inputClass} />
                </SettingsField>

                <div
                  className={`flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center ${
                    located ? 'bg-primary/10' : 'bg-surface-container-low'
                  }`}
                >
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                      located ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    <MaterialIcon name={located ? 'where_to_vote' : 'location_off'} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-on-surface">
                      {located ? t('settings.locationSet') : t('settings.locationEmpty')}
                    </p>
                    <p className="mt-0.5 text-sm text-on-surface-variant">
                      {located ? t('settings.locationSetHint') : t('settings.locationEmptyHint')}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setIsMapOpen(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary"
                    >
                      <MaterialIcon name="map" className="text-[20px]" />
                      {located ? t('settings.editLocation') : t('settings.chooseLocation')}
                    </button>
                    {located ? (
                      <>
                        <a
                          href={mapsHref(form)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl bg-surface-container-lowest px-4 py-2.5 text-sm font-semibold text-on-surface"
                        >
                          {t('settings.seeMap')}
                        </a>
                        <button
                          type="button"
                          onClick={() => setForm((current) => ({ ...current, latitude: null, longitude: null }))}
                          className="inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold text-error hover:bg-error-container"
                        >
                          {t('settings.remove')}
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              </SectionCard>

              <SectionCard icon="image" title={t('settings.logo')} subtitle={t('settings.logoHint')}>
                <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                  {form.logo ? (
                    <img src={form.logo} alt="Logo" className="h-28 w-28 rounded-2xl object-cover shadow-sm" />
                  ) : (
                    <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-surface-container-low text-on-surface-variant">
                      <MaterialIcon name="add_photo_alternate" className="text-3xl" />
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-label-lg font-semibold tracking-[0.05em] text-on-primary">
                      <MaterialIcon name="upload" className="text-[20px]" />
                      {uploading ? t('settings.uploading') : form.logo ? t('settings.replaceLogo') : t('settings.chooseLogo')}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={uploading} />
                    </label>
                    {form.logo ? (
                      <button
                        type="button"
                        onClick={() => setForm((current) => ({ ...current, logo: '' }))}
                        className="text-sm font-medium text-error hover:underline"
                      >
                        {t('settings.removeLogo')}
                      </button>
                    ) : (
                      <p className="text-sm text-on-surface-variant">{t('settings.logoHintEmpty')}</p>
                    )}
                  </div>
                </div>
              </SectionCard>

              <div className="sticky bottom-3 z-20 flex justify-end">
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-label-lg font-semibold tracking-[0.05em] text-on-primary shadow-lg disabled:opacity-60"
                >
                  <MaterialIcon name="save" className="text-[20px]" />
                  {saving ? t('settings.saving') : t('settings.save')}
                </button>
              </div>
            </form>
          ) : null}

          {tab === 'security' ? (
            <SectionCard icon="lock" title={t('settings.passwordTitle')} subtitle={t('settings.passwordHint')}>
              {passwordSuccess ? (
                <p className="rounded-xl border border-primary/20 bg-primary-container px-4 py-3 text-sm text-on-primary-container">
                  {passwordSuccess}
                </p>
              ) : null}
              {passwordError ? (
                <p className="rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm text-error">
                  {passwordError}
                </p>
              ) : null}

              {showPasswordForm ? (
                <form onSubmit={handlePasswordSubmit} className="grid gap-4">
                  <PasswordField
                    label={t('settings.currentPassword')}
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    show={showCurrent}
                    onToggleShow={() => setShowCurrent((current) => !current)}
                    autoComplete="current-password"
                    minLength={1}
                  />
                  <PasswordField
                    label={t('settings.newPassword')}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    show={showNew}
                    onToggleShow={() => setShowNew((current) => !current)}
                    placeholder={t('settings.passwordPlaceholder')}
                    minLength={8}
                  />
                  <PasswordField
                    label={t('settings.confirmPassword')}
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
                      disabled={passwordSaving}
                      className="rounded-xl bg-primary px-6 py-3 text-label-lg font-semibold tracking-[0.05em] text-on-primary shadow-md disabled:opacity-60"
                    >
                      {passwordSaving ? t('settings.saving') : t('settings.updatePassword')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        resetPasswordFields();
                        setPasswordError('');
                      }}
                      className="rounded-xl bg-surface-container-high px-5 py-2.5 text-sm font-semibold text-on-surface"
                    >
                      {t('settings.cancel')}
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(true);
                    setPasswordSuccess('');
                    setPasswordError('');
                  }}
                  className="inline-flex w-fit items-center gap-2 rounded-xl bg-surface-container-high px-5 py-3 text-sm font-semibold text-on-surface"
                >
                  <MaterialIcon name="key" className="text-[20px]" />
                  {t('settings.changePassword')}
                </button>
              )}
            </SectionCard>
          ) : null}

          {tab === 'language' ? (
            <SectionCard icon="translate" title={t('settings.languageTitle')} subtitle={t('settings.languageHint')}>
              {languageSaved ? (
                <p className="rounded-xl border border-primary/20 bg-primary-container px-4 py-3 text-sm text-on-primary-container">
                  {t('settings.languageSaved')}
                </p>
              ) : null}
              <div className="grid gap-3 sm:grid-cols-2">
                {LOCALES.map((item) => {
                  const active = locale === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setLocale(item.id);
                        setLanguageSaved(true);
                      }}
                      className={`rounded-2xl px-5 py-4 text-left ring-2 transition-colors ${
                        active
                          ? 'bg-primary/10 ring-primary'
                          : 'bg-surface-container-low ring-transparent hover:bg-surface-container-high'
                      }`}
                    >
                      <p className="font-display text-xl font-semibold text-on-surface">{item.native}</p>
                      <p className="mt-1 text-sm text-on-surface-variant">{item.name}</p>
                    </button>
                  );
                })}
              </div>
            </SectionCard>
          ) : null}
        </div>
      </div>

      <LocationPickerModal
        open={isMapOpen}
        latitude={form.latitude}
        longitude={form.longitude}
        onClose={() => setIsMapOpen(false)}
        onConfirm={({ latitude, longitude, address }) => {
          setForm((current) => ({
            ...current,
            latitude,
            longitude,
            address: address || current.address,
          }));
          setIsMapOpen(false);
        }}
      />
    </section>
  );
}
