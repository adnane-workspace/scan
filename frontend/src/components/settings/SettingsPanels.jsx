import MaterialIcon from '../ui/MaterialIcon.jsx';
import CloudinaryImage from '../ui/CloudinaryImage.jsx';

export function SettingsSectionCard({ icon, title, subtitle, children }) {
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

export function SettingsImagePicker({
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
          <input type="file" accept="image/*" className="hidden" onChange={onChange} disabled={disabled || uploading} />
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
