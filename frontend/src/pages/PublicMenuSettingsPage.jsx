import { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import ImageLightbox from '../components/ui/ImageLightbox.jsx';
import MaterialIcon from '../components/ui/MaterialIcon.jsx';
import MenuBackgroundEditor from '../components/settings/MenuBackgroundEditor.jsx';
import { SettingsImagePicker, SettingsSectionCard } from '../components/settings/SettingsPanels.jsx';
import { useLocale } from '../hooks/useLocale.js';
import { useToast } from '../hooks/useToast.js';
import { clearPublicMenuCache } from '../hooks/usePublicMenu.js';
import { getMyCafe, updateMyCafe, uploadCafeLogo } from '../services/cafe.service.js';
import { getPublicMenuUrl } from '../utils/constants.js';
import { getApiError } from '../utils/apiError.js';
import { DEFAULT_MENU_UI, normalizeHexColor, normalizeMenuUi, themeBackground } from '../utils/menuUi.js';

export default function PublicMenuSettingsPage() {
  const { t } = useLocale();
  const toast = useToast();
  const { refreshStats } = useOutletContext() || {};
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState('');
  const [error, setError] = useState('');
  const [slug, setSlug] = useState('');
  const [logo, setLogo] = useState('');
  const [menuUi, setMenuUi] = useState(DEFAULT_MENU_UI);
  const [colorDraft, setColorDraft] = useState('');
  const [menuUiSaving, setMenuUiSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const menuColorTimerRef = useRef(0);
  const menuUiRef = useRef(menuUi);
  menuUiRef.current = menuUi;

  useEffect(() => {
    let cancelled = false;

    getMyCafe()
      .then((cafe) => {
        if (cancelled) {
          return;
        }

        setSlug(cafe.slug || '');
        setLogo(cafe.logo || '');
        const nextUi = normalizeMenuUi(cafe.menuUi);
        setMenuUi(nextUi);
        setColorDraft(nextUi.backgroundColor);
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
  }, [t]);

  useEffect(() => () => window.clearTimeout(menuColorTimerRef.current), []);

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

      clearPublicMenuCache(cafe.slug || slug);
      toast.success(t('settings.menuUiSaved'));
    } catch (err) {
      const message = getApiError(err, t, 'settings.saveError');
      setError(message);
      toast.error(message);
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

  async function handleLogoChange(event) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    setUploading('logo');
    setError('');

    try {
      const url = await uploadCafeLogo(file, 'logo');
      const cafe = await updateMyCafe({ logo: url });
      setLogo(cafe.logo || url);
      clearPublicMenuCache(cafe.slug || slug);
      toast.success(t('settings.saved'));
      await refreshStats?.();
    } catch (err) {
      setError(getApiError(err, t, 'settings.uploadError'));
    } finally {
      setUploading('');
    }
  }

  async function handleLogoRemove() {
    setError('');

    try {
      const cafe = await updateMyCafe({ logo: '' });
      setLogo('');
      clearPublicMenuCache(cafe.slug || slug);
      toast.success(t('settings.saved'));
      await refreshStats?.();
    } catch (err) {
      setError(getApiError(err, t, 'settings.saveError'));
    }
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

  const publicUrl = getPublicMenuUrl(slug);

  return (
    <section className="mx-auto w-full max-w-3xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-on-surface sm:text-[1.75rem]">
            {t('publicMenu.title')}
          </h1>
          <p className="mt-1 text-sm text-on-surface-variant">{t('publicMenu.subtitle')}</p>
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

      {error ? (
        <p className="rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm text-error">{error}</p>
      ) : null}

      {loading ? (
        <div className="rounded-[18px] border border-outline-variant bg-surface-container-lowest px-6 py-10 text-sm text-on-surface-variant">
          {t('common.loading')}
        </div>
      ) : (
        <div className="space-y-5">
          <SettingsSectionCard icon="storefront" title={t('settings.logo')} subtitle={t('settings.logoHint')}>
            <SettingsImagePicker
              preview={logo}
              emptyClass="h-28 w-28"
              uploading={uploading === 'logo'}
              hasImage={Boolean(logo)}
              chooseLabel={t('settings.chooseLogo')}
              replaceLabel={t('settings.replaceLogo')}
              uploadingLabel={t('settings.uploading')}
              removeLabel={t('settings.removeLogo')}
              emptyHint={t('settings.logoHintEmpty')}
              viewLabel={t('settings.viewPhoto')}
              onChange={handleLogoChange}
              onRemove={handleLogoRemove}
              onPreview={() => setPreviewUrl(logo)}
              disabled={Boolean(uploading)}
            />
          </SettingsSectionCard>

          <SettingsSectionCard icon="palette" title={t('settings.menuTheme')} subtitle={t('settings.menuHint')}>
            {menuUiSaving ? <p className="text-sm font-medium text-primary">{t('settings.saving')}</p> : null}
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
          </SettingsSectionCard>

          <SettingsSectionCard icon="visibility" title={t('settings.menuVisibility')} subtitle={t('publicMenu.visibilityHint')}>
            {[
              { key: 'showPhone', label: t('settings.menuShowPhone'), hint: t('settings.menuShowPhoneHint') },
              { key: 'showAddress', label: t('settings.menuShowAddress'), hint: t('settings.menuShowAddressHint') },
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
          </SettingsSectionCard>
        </div>
      )}

      <ImageLightbox src={previewUrl} onClose={() => setPreviewUrl('')} />
    </section>
  );
}
