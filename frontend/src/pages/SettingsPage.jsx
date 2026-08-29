import { useEffect, useMemo, useRef, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import ImageLightbox from '../components/ui/ImageLightbox.jsx';
import CloudinaryImage from '../components/ui/CloudinaryImage.jsx';
import LocationPickerModal from '../components/dashboard/LocationPickerModal.jsx';
import MaterialIcon from '../components/ui/MaterialIcon.jsx';
import PasswordField from '../components/ui/PasswordField.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useLocale } from '../hooks/useLocale.js';
import { clearPublicMenuCache } from '../hooks/usePublicMenu.js';
import { LOCALES } from '../i18n/messages.js';
import { useTheme } from '../hooks/useTheme.js';
import { changePasswordRequest } from '../services/auth.service.js';
import { getMyCafe, updateMyCafe, uploadCafeLogo } from '../services/cafe.service.js';
import { getPublicMenuUrl } from '../utils/constants.js';
import { getApiError } from '../utils/apiError.js';
import { hasCoordinates, mapsHref } from '../utils/location.js';
import MenuBackgroundEditor from '../components/settings/MenuBackgroundEditor.jsx';
import { DEFAULT_MENU_UI, normalizeHexColor, normalizeMenuUi, themeBackground } from '../utils/menuUi.js';

function toCafeForm(cafe = {}) {
  return {
    name: cafe.name || '',
    slug: cafe.slug || '',
    description: cafe.description || '',
    logo: cafe.logo || '',
    address: cafe.address || '',
    phone: cafe.phone || '',
    latitude: cafe.latitude ?? null,
    longitude: cafe.longitude ?? null,
  };
}

function cafeSnapshot(data) {
  return JSON.stringify(toCafeForm(data));
}

const emptyForm = toCafeForm();

const TABS = [
  { id: 'general', icon: 'tune', labelKey: 'settings.tabGeneral', hintKey: 'settings.tabGeneralHint', roles: ['admin'] },
  { id: 'security', icon: 'shield', labelKey: 'settings.tabSecurity', hintKey: 'settings.tabSecurityHint', roles: ['admin', 'superadmin'] },
  { id: 'language', icon: 'translate', labelKey: 'settings.tabLanguage', hintKey: 'settings.tabLanguageHint', roles: ['admin', 'superadmin'] },
  { id: 'appearance', icon: 'contrast', labelKey: 'settings.tabAppearance', hintKey: 'settings.tabAppearanceHint', roles: ['admin', 'superadmin'] },
  { id: 'menu', icon: 'menu_book', labelKey: 'settings.tabMenu', hintKey: 'settings.tabMenuHint', roles: ['admin'] },
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
            className="ms-3 pointer-events-none text-[20px] text-on-surface-variant/50 group-focus-within:text-primary"
          />
        ) : null}
        {children}
      </div>
      {hint ? <p className="ps-1 text-xs text-on-surface-variant">{hint}</p> : null}
    </div>
  );
}

const inputClass =
  'w-full bg-transparent px-3 py-3.5 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none';

function SectionCard({ icon, title, subtitle, children }) {
  return (
    <section className="overflow-hidden rounded-[18px] border border-outline-variant bg-surface-container-lowest shadow-[0_1px_2px_rgba(31,37,35,0.04)]">
      <div className="flex items-start gap-3 border-b border-outline-variant px-5 py-4 sm:px-6">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-container text-primary">
          <MaterialIcon name={icon} />
        </span>
        <div>
          <h2 className="font-display text-lg font-semibold text-on-surface sm:text-xl">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-sm text-on-surface-variant">{subtitle}</p> : null}
        </div>
      </div>
      <div className="grid gap-5 px-5 py-5 sm:px-6">{children}</div>
    </section>
  );
}

function ImagePicker({
  preview,
  emptyClass,
  uploading,
  hasImage,
  chooseLabel,
  replaceLabel,
  uploadingLabel,
  removeLabel,
  emptyHint,
  viewLabel,
  onChange,
  onRemove,
  onPreview,
  disabled,
}) {
  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      {hasImage ? (
        <button
          type="button"
          onClick={onPreview}
          className={`group relative overflow-hidden rounded-2xl ${emptyClass}`}
          aria-label={viewLabel}
        >
          <CloudinaryImage src={preview} alt="" preset="preview" className="h-full w-full object-cover" />
          <span className="absolute inset-0 flex items-center justify-center bg-[#0d1b2a]/0 transition-colors group-hover:bg-[#0d1b2a]/40">
            <MaterialIcon name="zoom_in" className="text-[28px] text-white opacity-0 transition-opacity group-hover:opacity-100" />
          </span>
        </button>
      ) : (
        <div className={`flex items-center justify-center rounded-2xl bg-surface-container text-on-surface-variant ${emptyClass}`}>
          <MaterialIcon name="add_photo_alternate" className="text-3xl" />
        </div>
      )}
      <div className="flex flex-col gap-2">
        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover">
          <MaterialIcon name="upload" className="text-[20px]" />
          {uploading ? uploadingLabel : hasImage ? replaceLabel : chooseLabel}
          <input type="file" accept="image/*" className="hidden" onChange={onChange} disabled={disabled} />
        </label>
        {hasImage ? (
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={onPreview} className="text-sm font-medium text-primary hover:underline">
              {viewLabel}
            </button>
            <button type="button" onClick={onRemove} className="text-sm font-medium text-error hover:underline">
              {removeLabel}
            </button>
          </div>
        ) : (
          <p className="text-sm text-on-surface-variant">{emptyHint}</p>
        )}
      </div>
    </div>
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
  const { theme, setTheme } = useTheme();
  const { refreshStats } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [form, setForm] = useState(emptyForm);
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState('');
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
  const [previewUrl, setPreviewUrl] = useState('');
  const [languageSaved, setLanguageSaved] = useState(false);
  const [menuUi, setMenuUi] = useState(DEFAULT_MENU_UI);
  const [colorDraft, setColorDraft] = useState('');
  const [menuUiSaving, setMenuUiSaving] = useState(false);
  const lastSavedRef = useRef(cafeSnapshot(emptyForm));
  const menuColorTimerRef = useRef(0);
  const menuUiRef = useRef(menuUi);
  menuUiRef.current = menuUi;

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
          const next = toCafeForm(cafe);
          lastSavedRef.current = cafeSnapshot(next);
          setForm(next);
          setQr(cafe.qr || null);
          const nextUi = normalizeMenuUi(cafe.menuUi);
          setMenuUi(nextUi);
          setColorDraft(nextUi.backgroundColor);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getApiError(err, t, 'settings.loadError'));
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

  useEffect(() => () => window.clearTimeout(menuColorTimerRef.current), []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function applyCafe(cafe) {
    const next = toCafeForm(cafe);
    lastSavedRef.current = cafeSnapshot(next);
    setForm(next);
    setQr(cafe.qr || null);
    clearPublicMenuCache(cafe.slug);
  }

  function cafePayload(overrides = {}) {
    return {
      ...toCafeForm(form),
      ...overrides,
    };
  }

  async function handleLogoChange(event) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    setUploading('logo');
    setError('');
    setSuccess('');

    try {
      const url = await uploadCafeLogo(file, 'logo');
      const cafe = await updateMyCafe(cafePayload({ logo: url }));
      applyCafe(cafe);
      setSuccess(t('settings.saved'));
      await refreshStats?.();
    } catch (err) {
      setError(getApiError(err, t, 'settings.uploadError'));
    } finally {
      setUploading('');
    }
  }

  useEffect(() => {
    if (isSuperAdmin || loading) {
      return undefined;
    }

    const snapshot = cafeSnapshot(form);

    if (snapshot === lastSavedRef.current || !form.name.trim() || !form.slug.trim()) {
      return undefined;
    }

    const timer = window.setTimeout(async () => {
      setSaving(true);
      setError('');
      setSuccess('');

      try {
        const cafe = await updateMyCafe(toCafeForm(form));
        applyCafe(cafe);
        setSuccess(t('settings.saved'));
        await refreshStats?.();
      } catch (err) {
        setError(getApiError(err, t, 'settings.saveError'));
      } finally {
        setSaving(false);
      }
    }, 700);

    return () => window.clearTimeout(timer);
  }, [form, isSuperAdmin, loading, t, refreshStats]);

  function resetPasswordFields() {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
  }

  async function persistMenuUi(partial) {
    const merged = { ...menuUiRef.current, ...partial };

    if (partial.bgMode === 'color' && !normalizeHexColor(merged.backgroundColor)) {
      merged.backgroundColor = themeBackground(merged.theme);
    }

    const next = normalizeMenuUi(merged);
    setMenuUi(next);
    if (next.bgMode === 'color' && next.backgroundColor) {
      setColorDraft(next.backgroundColor);
    }
    setMenuUiSaving(true);
    setError('');

    try {
      const cafe = await updateMyCafe({ menuUi: next });
      const saved = normalizeMenuUi(cafe.menuUi);
      setMenuUi(saved);
      if (saved.bgMode === 'color' && saved.backgroundColor) {
        setColorDraft(saved.backgroundColor);
      }
      clearPublicMenuCache(cafe.slug || form.slug);
    } catch (err) {
      setError(getApiError(err, t, 'settings.saveError'));
    } finally {
      setMenuUiSaving(false);
    }
  }

  function persistMenuBackgroundColor(value) {
    setColorDraft(value);
    const hex = normalizeHexColor(value);

    if (!hex) {
      return;
    }

    const next = normalizeMenuUi({ ...menuUiRef.current, bgMode: 'color', backgroundColor: hex });
    setMenuUi(next);

    window.clearTimeout(menuColorTimerRef.current);
    menuColorTimerRef.current = window.setTimeout(() => {
      persistMenuUi({ bgMode: 'color', backgroundColor: hex });
    }, 400);
  }

  async function handleMenuBackgroundImage(event) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    setUploading('menuBg');
    setError('');

    try {
      const url = await uploadCafeLogo(file, 'menuBg');
      await persistMenuUi({ bgMode: 'image', backgroundImage: url });
    } catch (err) {
      setError(getApiError(err, t, 'settings.uploadError'));
    } finally {
      setUploading('');
    }
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
      setPasswordError(getApiError(err, t, 'settings.passwordError'));
    } finally {
      setPasswordSaving(false);
    }
  }

  const publicUrl = getPublicMenuUrl(form.slug);
  const located = hasCoordinates(form);

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-on-surface sm:text-[1.75rem]">
            {t('settings.title')}
          </h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            {t('settings.subtitle')}
            {tab === 'general' && !isSuperAdmin && (saving || success) ? (
              <span className="ms-2 font-medium text-primary">
                {saving ? t('settings.saving') : t('settings.saved')}
              </span>
            ) : null}
          </p>
        </div>
        {publicUrl ? (
          <a
            href={publicUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container"
          >
            <MaterialIcon name="open_in_new" className="text-[18px]" />
            {t('settings.viewMenu')}
          </a>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {tabs.map((item) => {
            const active = tab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSearchParams({ tab: item.id })}
                className={`inline-flex min-w-[11rem] shrink-0 items-center gap-3 rounded-2xl border px-4 py-3 text-start transition-colors duration-200 lg:min-w-0 ${
                  active
                    ? 'border-primary bg-primary text-on-primary'
                    : 'border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container'
                }`}
              >
                <MaterialIcon name={item.icon} className="text-[22px]" />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{t(item.labelKey)}</span>
                  <span className={`mt-0.5 block truncate text-xs ${active ? 'text-on-primary/80' : 'text-on-surface-variant'}`}>
                    {t(item.hintKey)}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>

        <div className="min-w-0 space-y-5">
          {error && (tab === 'general' || tab === 'menu') ? (
            <p className="rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm text-error">{error}</p>
          ) : null}
          {tab === 'general' && loading ? <SettingsSkeleton /> : null}

          {tab === 'general' && !loading ? (
            <div className="grid gap-5">
              <SectionCard icon="storefront" title={t('settings.identity')} subtitle={t('settings.identityHint')}>
                <SettingsField id="name" label={t('settings.cafeName')} icon="badge">
                  <input id="name" name="name" value={form.name} onChange={handleChange} className={inputClass} required />
                </SettingsField>
                <SettingsField
                  id="slug"
                  label={t('settings.publicLink')}
                  icon="link"
                  hint={qr?.locked ? t('settings.slugLockedHint') : t('settings.slugHint')}
                >
                  <input
                    id="slug"
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-60`}
                    required
                    disabled={Boolean(qr?.locked)}
                  />
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
                <div className="grid gap-5 sm:grid-cols-2">
                  <SettingsField id="phone" label={t('settings.phone')} icon="call">
                    <input id="phone" name="phone" value={form.phone} onChange={handleChange} className={inputClass} />
                  </SettingsField>
                  <SettingsField id="address" label={t('settings.address')} icon="home">
                    <input id="address" name="address" value={form.address} onChange={handleChange} className={inputClass} />
                  </SettingsField>
                </div>

                <div
                  className={`flex flex-col gap-4 rounded-2xl border border-outline-variant p-4 sm:flex-row sm:items-center ${
                    located ? 'bg-primary/5' : 'bg-surface-container-low'
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
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
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
                          className="inline-flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-sm font-semibold text-on-surface"
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

              <SectionCard icon="photo_library" title={t('settings.media')} subtitle={t('settings.mediaHint')}>
                <p className="mb-3 text-xs font-semibold tracking-[0.12em] text-on-surface-variant uppercase">
                  {t('settings.logo')}
                </p>
                <ImagePicker
                  preview={form.logo}
                  emptyClass="h-28 w-28"
                  uploading={uploading === 'logo'}
                  hasImage={Boolean(form.logo)}
                  chooseLabel={t('settings.chooseLogo')}
                  replaceLabel={t('settings.replaceLogo')}
                  uploadingLabel={t('settings.uploading')}
                  removeLabel={t('settings.removeLogo')}
                  emptyHint={t('settings.logoHintEmpty')}
                  viewLabel={t('settings.viewPhoto')}
                  onChange={handleLogoChange}
                  onRemove={() => setForm((current) => ({ ...current, logo: '' }))}
                  onPreview={() => setPreviewUrl(form.logo)}
                  disabled={Boolean(uploading)}
                />
              </SectionCard>
            </div>
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
                <form onSubmit={handlePasswordSubmit} className="grid max-w-md gap-4">
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
                      className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60"
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
                      className="rounded-xl border border-outline-variant px-5 py-2.5 text-sm font-semibold text-on-surface hover:bg-surface-container"
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
                  className="inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
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
                      className={`rounded-2xl border px-5 py-4 text-start transition-colors ${
                        active
                          ? 'border-primary bg-primary/5 ring-1 ring-primary'
                          : 'border-outline-variant bg-surface-container-low hover:bg-surface-container-high'
                      }`}
                    >
                      <p className="text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">{item.id}</p>
                      <p className="mt-1 font-display text-xl font-semibold text-on-surface">{item.native}</p>
                      <p className="mt-1 text-sm text-on-surface-variant">{item.name}</p>
                    </button>
                  );
                })}
              </div>
            </SectionCard>
          ) : null}

          {tab === 'appearance' ? (
            <SectionCard icon="contrast" title={t('settings.appearanceTitle')} subtitle={t('settings.appearanceHint')}>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { id: 'light', icon: 'light_mode', title: t('settings.themeLight'), hint: t('settings.themeLightHint') },
                  { id: 'dark', icon: 'dark_mode', title: t('settings.themeDark'), hint: t('settings.themeDarkHint') },
                ].map((item) => {
                  const active = theme === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTheme(item.id)}
                      className={`rounded-2xl border px-5 py-4 text-start transition-colors ${
                        active
                          ? 'border-primary bg-primary/5 ring-1 ring-primary'
                          : 'border-outline-variant bg-surface-container-low hover:bg-surface-container-high'
                      }`}
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container text-primary">
                        <MaterialIcon name={item.icon} />
                      </span>
                      <p className="mt-3 font-display text-xl font-semibold text-on-surface">{item.title}</p>
                      <p className="mt-1 text-sm text-on-surface-variant">{item.hint}</p>
                    </button>
                  );
                })}
              </div>
            </SectionCard>
          ) : null}

          {tab === 'menu' ? (
            <SectionCard icon="menu_book" title={t('settings.menuTitle')} subtitle={t('settings.menuHint')}>
              {menuUiSaving ? (
                <p className="text-sm font-medium text-primary">{t('settings.saving')}</p>
              ) : null}
              <div>
                <p className="mb-3 text-xs font-semibold tracking-[0.12em] text-on-surface-variant uppercase">
                  {t('settings.menuTheme')}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { id: 'light', icon: 'light_mode', title: t('settings.themeLight'), hint: t('settings.menuThemeLightHint') },
                    { id: 'dark', icon: 'dark_mode', title: t('settings.themeDark'), hint: t('settings.menuThemeDarkHint') },
                  ].map((item) => {
                    const active = menuUi.theme === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => persistMenuUi({ theme: item.id })}
                        className={`rounded-2xl border px-5 py-4 text-start transition-colors ${
                          active
                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                            : 'border-outline-variant bg-surface-container-low hover:bg-surface-container-high'
                        }`}
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container text-primary">
                          <MaterialIcon name={item.icon} />
                        </span>
                        <p className="mt-3 font-display text-xl font-semibold text-on-surface">{item.title}</p>
                        <p className="mt-1 text-sm text-on-surface-variant">{item.hint}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
              <MenuBackgroundEditor
                menuUi={menuUi}
                colorDraft={colorDraft}
                uploading={uploading === 'menuBg'}
                t={t}
                onModeChange={(bgMode) => persistMenuUi({ bgMode })}
                onColorChange={persistMenuBackgroundColor}
                onImageChange={handleMenuBackgroundImage}
                onImageRemove={() => persistMenuUi({ backgroundImage: '', bgMode: 'default' })}
                onImagePreview={() => setPreviewUrl(menuUi.backgroundImage)}
              />
              <div className="grid gap-3">
                <p className="text-xs font-semibold tracking-[0.12em] text-on-surface-variant uppercase">
                  {t('settings.menuVisibility')}
                </p>
                {[
                  { key: 'showPhone', label: t('settings.menuShowPhone'), hint: t('settings.menuShowPhoneHint') },
                  { key: 'showAddress', label: t('settings.menuShowAddress'), hint: t('settings.menuShowAddressHint') },
                  { key: 'showLanguage', label: t('settings.menuShowLanguage'), hint: t('settings.menuShowLanguageHint') },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-4"
                  >
                    <span>
                      <span className="block font-semibold text-on-surface">{item.label}</span>
                      <span className="mt-0.5 block text-sm text-on-surface-variant">{item.hint}</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={Boolean(menuUi[item.key])}
                      onChange={(event) => persistMenuUi({ [item.key]: event.target.checked })}
                      className="mt-1 h-5 w-5 accent-primary"
                    />
                  </label>
                ))}
              </div>
              {publicUrl ? (
                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  <MaterialIcon name="open_in_new" className="text-[18px]" />
                  {t('settings.menuPreview')}
                </a>
              ) : null}
            </SectionCard>
          ) : null}
        </div>
      </div>

      <ImageLightbox src={previewUrl} onClose={() => setPreviewUrl('')} />
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
