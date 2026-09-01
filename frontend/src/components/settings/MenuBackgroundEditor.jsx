import CloudinaryImage from '../ui/CloudinaryImage.jsx';
import MaterialIcon from '../ui/MaterialIcon.jsx';
import { DEFAULT_MENU_BACKGROUND, normalizeHexColor } from '../../utils/menuUi.js';

const DARK_PRESETS = ['#0d1b2a', '#1b263b', '#415a77', '#2a1a14', '#1c2e24', '#3a1d28', '#1a1a1a', '#3d2b1f'];
const LIGHT_PRESETS = ['#f4f2ee', '#e0e1dd', '#f4efe6', '#f7f3ee', '#ece8e1', '#dce3ea', '#f3ece4'];

function isLightHex(hex) {
  const value = normalizeHexColor(hex);

  if (!value) {
    return false;
  }

  const red = Number.parseInt(value.slice(1, 3), 16);
  const green = Number.parseInt(value.slice(3, 5), 16);
  const blue = Number.parseInt(value.slice(5, 7), 16);

  return (red * 299 + green * 587 + blue * 114) / 1000 > 148;
}

function ColorSwatch({ hex, selected, onSelect }) {
  const light = isLightHex(hex);

  return (
    <button
      type="button"
      onClick={() => onSelect(hex)}
      title={hex}
      aria-pressed={selected}
      className={`relative h-11 w-11 overflow-hidden rounded-2xl shadow-sm transition-transform hover:scale-105 ${
        selected ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface-container-low' : 'ring-1 ring-black/10'
      }`}
      style={{ background: hex }}
    >
      {selected ? (
        <span
          className={`absolute inset-0 flex items-center justify-center ${light ? 'text-[#0d1b2a]' : 'text-white'}`}
        >
          <MaterialIcon name="check" className="text-[20px]" filled />
        </span>
      ) : null}
    </button>
  );
}

function MenuPreview({ menuUi, activeHex }) {
  const showImage = menuUi.bgMode === 'image' && menuUi.backgroundImage;
  const fill = activeHex || DEFAULT_MENU_BACKGROUND;

  return (
    <div className="relative mx-auto aspect-[9/16] w-full max-w-[168px] overflow-hidden rounded-[1.6rem] border border-outline-variant bg-surface-container shadow-inner">
      {showImage ? (
        <CloudinaryImage src={menuUi.backgroundImage} alt="" preset="cover" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0" style={{ background: fill }} />
      )}
      {showImage ? <div className="absolute inset-0 bg-[#0d1b2a]/40" /> : null}
      <div className="relative flex h-full flex-col px-3 pt-4 pb-3">
        <div className="mb-3 h-1.5 w-10 self-center rounded-full bg-[#0d1b2a]/25" />
        <div className="mb-2 h-2 w-16 rounded bg-[#0d1b2a]/80" />
        <div className="grid grid-cols-2 gap-1.5">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="overflow-hidden rounded-lg bg-white/90 ring-1 ring-[#0d1b2a]/8">
              <div className="h-8 bg-[#ebe8e2]" />
              <div className="space-y-1 p-1.5">
                <div className="h-1.5 w-3/4 rounded bg-[#0d1b2a]/60" />
                <div className="h-1 w-1/2 rounded bg-[#0d1b2a]/30" />
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
  const activeHex = normalizeHexColor(colorDraft) || menuUi.backgroundColor || DEFAULT_MENU_BACKGROUND;

  return (
    <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-low">
      <div className="grid gap-5 p-4 sm:grid-cols-[minmax(0,168px)_1fr] sm:p-5">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-[0.12em] text-on-surface-variant uppercase">
            {t('settings.menuBgPreview')}
          </p>
          <MenuPreview menuUi={menuUi} activeHex={activeHex} />
        </div>

        <div className="min-w-0">
          <p className="mb-2 text-xs font-semibold tracking-[0.12em] text-on-surface-variant uppercase">
            {t('settings.menuBackground')}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <ModeCard
              active={menuUi.bgMode === 'color'}
              label={t('settings.menuBgColor')}
              hint={t('settings.menuBgColorHint')}
              onClick={() => onModeChange('color')}
            >
              <div className="absolute inset-0" style={{ background: activeHex }} />
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
            <div className="mt-4 space-y-4 rounded-2xl border border-outline-variant bg-surface p-4">
              <div className="flex items-center gap-3">
                <div
                  className="h-16 w-16 shrink-0 rounded-2xl shadow-inner ring-1 ring-black/10"
                  style={{ background: activeHex }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold tracking-[0.12em] text-on-surface-variant uppercase">
                    {t('settings.menuBgSelected')}
                  </p>
                  <p className="mt-0.5 font-mono text-lg font-semibold tracking-tight text-on-surface">{activeHex}</p>
                  <p className="mt-1 text-xs text-on-surface-variant">
                    {isLightHex(activeHex) ? t('settings.menuBgContrastLight') : t('settings.menuBgContrastDark')}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold text-on-surface-variant">{t('settings.menuBgDarkTones')}</p>
                <div className="flex flex-wrap gap-2">
                  {DARK_PRESETS.map((hex) => (
                    <ColorSwatch key={hex} hex={hex} selected={activeHex === hex} onSelect={onColorChange} />
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold text-on-surface-variant">{t('settings.menuBgLightTones')}</p>
                <div className="flex flex-wrap gap-2">
                  {LIGHT_PRESETS.map((hex) => (
                    <ColorSwatch key={hex} hex={hex} selected={activeHex === hex} onSelect={onColorChange} />
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-end gap-3 border-t border-outline-variant pt-3">
                <label className="flex cursor-pointer flex-col gap-1.5">
                  <span className="text-xs font-semibold text-on-surface-variant">{t('settings.menuBgPick')}</span>
                  <span className="relative flex h-11 w-16 overflow-hidden rounded-xl ring-1 ring-outline-variant">
                    <span className="absolute inset-0" style={{ background: activeHex }} />
                    <input
                      type="color"
                      value={activeHex}
                      onChange={(event) => onColorChange(event.target.value)}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                  </span>
                </label>
                <label className="flex min-w-[8rem] flex-1 flex-col gap-1.5">
                  <span className="text-xs font-semibold text-on-surface-variant">{t('settings.menuBgCustom')}</span>
                  <input
                    type="text"
                    value={colorDraft}
                    onChange={(event) => onColorChange(event.target.value)}
                    maxLength={7}
                    spellCheck={false}
                    className="rounded-xl border border-outline-variant bg-surface-container-low px-3 py-2.5 font-mono text-sm text-on-surface"
                  />
                </label>
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
