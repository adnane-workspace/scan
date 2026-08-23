import { useLocale } from '../../hooks/useLocale.js';
import MaterialIcon from '../ui/MaterialIcon.jsx';
import AvailabilityToggle from './AvailabilityToggle.jsx';

const fieldClass =
  'mt-1 w-full rounded-lg bg-surface-container-highest px-3 py-2 text-on-surface outline-none transition-shadow focus:ring-2 focus:ring-primary';

export default function ProductFormModal({
  open,
  editing,
  form,
  categories,
  saving,
  uploading,
  error,
  onClose,
  onChange,
  onSubmit,
  onImageChange,
  onClearImage,
}) {
  const { t } = useLocale();

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-on-surface/40"
        aria-label={t('common.close')}
        onClick={onClose}
      />
      <section className="relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-surface-container-lowest p-6 shadow-xl sm:max-w-2xl sm:rounded-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-headline-md font-semibold text-on-surface">
              {editing ? t('productForm.editTitle') : t('productForm.addTitle')}
            </h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              {editing ? t('productForm.editHint') : t('productForm.addHint')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high"
            aria-label={t('common.close')}
          >
            <MaterialIcon name="close" />
          </button>
        </div>

        {error ? (
          <p className="mb-4 rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm text-error">
            {error}
          </p>
        ) : null}

        <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-on-surface">
            {t('productForm.name')}
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className={fieldClass}
              placeholder="Espresso"
              required
            />
          </label>
          <label className="block text-sm font-medium text-on-surface">
            {t('productForm.price')}
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={onChange}
              className={fieldClass}
              placeholder="18"
              required
            />
          </label>
          <label className="block text-sm font-medium text-on-surface">
            {t('productForm.category')}
            <select name="categoryId" value={form.categoryId} onChange={onChange} className={fieldClass} required>
              <option value="">{t('productForm.selectCategory')}</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-on-surface">
            {t('productForm.order')}
            <input name="order" type="number" value={form.order} onChange={onChange} className={fieldClass} />
          </label>
          <label className="block text-sm font-medium text-on-surface md:col-span-2">
            {t('productForm.description')}
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              rows={3}
              className={fieldClass}
              placeholder={t('productForm.descriptionPlaceholder')}
            />
          </label>
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-on-surface">{t('productForm.photo')}</p>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              {form.image ? (
                <img src={form.image} alt="Aperçu produit" className="h-24 w-24 rounded-lg object-cover" />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-surface-container-highest text-on-surface-variant">
                  <MaterialIcon name="image" />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <label className="inline-flex cursor-pointer rounded-full bg-primary px-4 py-2 text-label-lg font-semibold tracking-[0.05em] text-on-primary">
                  {uploading ? t('settings.uploading') : t('productForm.choosePhoto')}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onImageChange}
                    disabled={uploading}
                  />
                </label>
                {form.image ? (
                  <button
                    type="button"
                    onClick={onClearImage}
                    className="text-sm font-medium text-error hover:underline"
                  >
                    {t('productForm.removePhoto')}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-surface-container px-4 py-3 md:col-span-2">
            <span className="text-sm font-medium text-on-surface">{t('productForm.availability')}</span>
            <AvailabilityToggle
              checked={Boolean(form.available)}
              label={t('productForm.availableLabel')}
              onChange={() =>
                onChange({
                  target: { name: 'available', type: 'checkbox', checked: !form.available },
                })
              }
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-3 md:col-span-2">
            <button
              type="submit"
              disabled={saving || uploading || categories.length === 0}
              className="rounded-full bg-primary px-6 py-3 text-label-lg font-semibold tracking-[0.05em] text-on-primary shadow-md disabled:opacity-60"
            >
              {saving ? t('common.saving') : editing ? t('productForm.update') : t('productForm.create')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-surface-container-high px-6 py-3 text-label-lg font-semibold tracking-[0.05em] text-on-surface"
            >
              {t('common.cancel')}
            </button>
          </div>
          {categories.length === 0 ? (
            <p className="text-sm text-on-surface-variant md:col-span-2">
              {t('productForm.needCategory')}
            </p>
          ) : null}
        </form>
      </section>
    </div>
  );
}
