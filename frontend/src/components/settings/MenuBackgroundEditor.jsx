import CloudinaryImage from '../ui/CloudinaryImage.jsx';
import MaterialIcon from '../ui/MaterialIcon.jsx';
import { normalizeHexColor, themeBackground } from '../../utils/menuUi.js';

const PRESET_COLORS = ['#0d1b2a', '#1b263b', '#415a77', '#e0e1dd', '#f4efe6', '#2a1a14', '#1c2e24', '#3a1d28'];

function previewFill(menuUi) {
  if (menuUi.bgMode === 'color' && menuUi.backgroundColor) {
    return menuUi.backgroundColor;
  }

  return themeBackground(menuUi.theme);
}

function MenuPreview({ menuUi }) {
  const isDark = menuUi.theme === 'dark';
  const fill = previewFill(menuUi);
  const card = isDark ? 'rgba(27, 38, 59, 0.88)' : 'rgba(255, 255, 255, 0.88)';
  const title = isDark ? '#e0e1dd' : '#0d1b2a';
  const muted = isDark ? '#778da9' : '#415a77';
  const showImage = menuUi.bgMode === 'image' && menuUi.backgroundImage;

  return (
    <div className="relative mx-auto aspect-[9/16] w-full max-w-[168px] overflow-hidden rounded-[1.6rem] border border-outline-variant bg-surface-container shadow-inner">
      {showImage ? (
        <CloudinaryImage src={menuUi.backgroundImage} alt="" preset="cover" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0" style={{ background: fill }} />
      )}
      {showImage ? <div className="absolute inset-0" style={{ background: isDark ? 'rgba(13,27,42,0.72)' : 'rgba(224,225,221,0.72)' }} /> : null}
      <div className="relative flex h-full flex-col px-3 pt-4 pb-3">
        <div className="mb-3 h-1.5 w-10 self-center rounded-full" style={{ background: muted }} />
        <div className="mb-2 h-2 w-16 rounded" style={{ background: title, opacity: 0.9 }} />
        <div className="grid grid-cols-2 gap-1.5">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="overflow-hidden rounded-lg" style={{ background: card }}>
              <div className="h-8" style={{ background: muted, opacity: 0.35 }} />
              <div className="space-y-1 p-1.5">
                <div className="h-1.5 w-3/4 rounded" style={{ background: title, opacity: 0.7 }} />
                <div className="h-1 w-1/2 rounded" style={{ background: muted, opacity: 0.7 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ModeCard({ active, label, hint, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`overflow-hidden rounded-2xl border text-start transition-all ${
        active
          ? 'border-primary ring-2 ring-primary/30'
          : 'border-outline-variant hover:border-primary/40 hover:bg-surface-container-high'
      }`}
    >
      <div className="relative h-20 overflow-hidden bg-surface-container">{children}</div>
      <div className="px-3 py-2.5">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-on-surface">
          {label}
          {active ? <MaterialIcon name="check_circle" className="text-[16px] text-primary" filled /> : null}
        </p>
        <p className="mt-0.5 text-xs text-on-surface-variant">{hint}</p>
      </div>
    </button>
  );
}

export default function MenuBackgroundEditor({
  menuUi,
  colorDraft,
  uploading,
  t,
  onModeChange,
  onColorChange,
  onImageChange,
  onImageRemove,
  onImagePreview,
}) {
  const activeHex = normalizeHexColor(colorDraft) || menuUi.backgroundColor || themeBackground(menuUi.theme);

  return (
    <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-low">
      <div className="grid gap-5 p-4 sm:grid-cols-[minmax(0,168px)_1fr] sm:p-5">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-[0.12em] text-on-surface-variant uppercase">
            {t('settings.menuBgPreview')}
          </p>
          <MenuPreview menuUi={{ ...menuUi, backgroundColor: activeHex }} />
        </div>

        <div className="min-w-0">
          <p className="mb-2 text-xs font-semibold tracking-[0.12em] text-on-surface-variant uppercase">
            {t('settings.menuBackground')}
          </p>
          <div className="grid grid-cols-3 gap-2">
            <ModeCard
              active={menuUi.bgMode === 'default'}
              label={t('settings.menuBgDefault')}
              hint={t('settings.menuBgDefaultHint')}
              onClick={() => onModeChange('default')}
            >
              <div className="absolute inset-0" style={{ background: themeBackground(menuUi.theme) }} />
            </ModeCard>
            <ModeCard
              active={menuUi.bgMode === 'color'}
              label={t('settings.menuBgColor')}
              hint={t('settings.menuBgColorHint')}
              onClick={() => onModeChange('color')}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${menuUi.backgroundColor || '#415a77'}, ${themeBackground(menuUi.theme)})`,
                }}
              />
            </ModeCard>
            <ModeCard
              active={menuUi.bgMode === 'image'}
              label={t('settings.menuBgImage')}
              hint={t('settings.menuBgImageHint')}
              onClick={() => onModeChange('image')}
            >
              {menuUi.backgroundImage ? (
                <CloudinaryImage src={menuUi.backgroundImage} alt="" preset="preview" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-on-surface-variant">
                  <MaterialIcon name="wallpaper" className="text-3xl" />
                </div>
              )}
            </ModeCard>
          </div>

          {menuUi.bgMode === 'color' ? (
            <div className="mt-4">
              <p className="mb-2 text-sm font-semibold text-on-surface">{t('settings.menuBgPresets')}</p>
              <div className="flex flex-wrap items-center gap-2">
                {PRESET_COLORS.map((hex) => {
                  const selected = activeHex === hex;

                  return (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => onColorChange(hex)}
                      title={hex}
                      className={`h-9 w-9 rounded-full border-2 transition-transform ${
                        selected ? 'scale-110 border-primary' : 'border-white/20 hover:scale-105'
                      }`}
                      style={{ background: hex }}
                    />
                  );
                })}
                <label className="relative flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-outline-variant bg-surface">
                  <MaterialIcon name="add" className="text-[18px] text-on-surface-variant" />
                  <input
                    type="color"
                    value={activeHex}
                    onChange={(event) => onColorChange(event.target.value)}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                </label>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-on-surface-variant">{t('settings.menuBgCustom')}</span>
                <input
                  type="text"
                  value={colorDraft}
                  onChange={(event) => onColorChange(event.target.value)}
                  maxLength={7}
                  spellCheck={false}
                  className="w-28 rounded-lg border border-outline-variant bg-surface px-2.5 py-1.5 font-mono text-sm text-on-surface"
                />
              </div>
            </div>
          ) : null}

          {menuUi.bgMode === 'image' ? (
            <div className="mt-4">
              {menuUi.backgroundImage ? (
                <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface">
                  <button type="button" onClick={onImagePreview} className="relative block h-36 w-full">
                    <CloudinaryImage src={menuUi.backgroundImage} alt="" preset="cover" className="h-full w-full object-cover" />
                    <span className="absolute inset-0 flex items-center justify-center bg-[#0d1b2a]/0 transition-colors hover:bg-[#0d1b2a]/35">
                      <MaterialIcon name="zoom_in" className="text-[28px] text-white opacity-80" />
                    </span>
                  </button>
                  <div className="flex flex-wrap gap-2 p-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-on-primary">
                      <MaterialIcon name="upload" className="text-[18px]" />
                      {uploading ? t('settings.uploading') : t('settings.replaceCover')}
                      <input type="file" accept="image/*" className="hidden" onChange={onImageChange} disabled={uploading} />
                    </label>
                    <button
                      type="button"
                      onClick={onImageRemove}
                      className="rounded-xl px-3 py-2 text-sm font-semibold text-error hover:bg-error-container"
                    >
                      {t('settings.removeCover')}
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-outline-variant bg-surface px-4 py-8 text-center hover:border-primary/50 hover:bg-surface-container-high">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container text-primary">
                    <MaterialIcon name="add_photo_alternate" className="text-2xl" />
                  </span>
                  <span className="text-sm font-semibold text-on-surface">
                    {uploading ? t('settings.uploading') : t('settings.menuBgDrop')}
                  </span>
                  <span className="text-xs text-on-surface-variant">{t('settings.menuBgImageHintEmpty')}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={onImageChange} disabled={uploading} />
                </label>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
