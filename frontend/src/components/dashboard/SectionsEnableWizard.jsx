import { useMemo, useState } from 'react';
import MaterialIcon from '../ui/MaterialIcon.jsx';
import { useLocale } from '../../hooks/useLocale.js';
import { MENU_SECTION_KEYS } from '../../utils/menuSections.js';

const defaultSectionNames = {
  restaurant: 'Restaurant',
  cafe: 'Café',
};

export default function SectionsEnableWizard({
  open,
  categories,
  saving,
  error,
  onClose,
  onConfirm,
}) {
  const { t } = useLocale();
  const flatCategories = useMemo(
    () => categories.filter((category) => !category.parentId && !category.sectionKey),
    [categories],
  );
  const [sectionNames, setSectionNames] = useState(defaultSectionNames);
  const [assignments, setAssignments] = useState(() =>
    Object.fromEntries(flatCategories.map((category) => [category._id, 'restaurant'])),
  );

  if (!open) {
    return null;
  }

  function handleAssignmentChange(categoryId, sectionKey) {
    setAssignments((current) => ({ ...current, [categoryId]: sectionKey }));
  }

  function handleNameChange(sectionKey, value) {
    setSectionNames((current) => ({ ...current, [sectionKey]: value }));
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
      <button type="button" className="absolute inset-0 bg-on-surface/40" aria-label={t('common.close')} onClick={onClose} />
      <section className="relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-surface-container-lowest p-6 shadow-xl sm:max-w-2xl sm:rounded-2xl">
        <div className="mb-5">
          <h2 className="font-display text-headline-md font-semibold text-on-surface">{t('categories.enableSectionsTitle')}</h2>
          <p className="mt-1 text-sm text-on-surface-variant">{t('categories.enableSectionsHint')}</p>
        </div>

        {error ? (
          <p className="mb-4 rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm text-error">
            {error}
          </p>
        ) : null}

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          {MENU_SECTION_KEYS.map((sectionKey) => (
            <label key={sectionKey} className="grid gap-2">
              <span className="text-sm font-medium text-on-surface">
                {sectionKey === 'restaurant'
                  ? t('categories.sectionRestaurantLabel')
                  : t('categories.sectionCafeLabel')}
              </span>
              <input
                type="text"
                value={sectionNames[sectionKey]}
                onChange={(event) => handleNameChange(sectionKey, event.target.value)}
                className="rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface"
              />
            </label>
          ))}
        </div>

        {flatCategories.length ? (
          <div className="mb-6">
            <p className="mb-3 text-sm font-medium text-on-surface">{t('categories.assignCategories')}</p>
            <ul className="flex flex-col gap-2">
              {flatCategories.map((category) => (
                <li
                  key={category._id}
                  className="flex flex-col gap-3 rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-on-surface">{category.name}</p>
                    <p className="text-xs text-on-surface-variant">
                      {category.productCount > 1
                        ? t('categories.itemsPlural', { count: category.productCount })
                        : t('categories.items', { count: category.productCount })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {MENU_SECTION_KEYS.map((sectionKey) => (
                      <button
                        key={sectionKey}
                        type="button"
                        onClick={() => handleAssignmentChange(category._id, sectionKey)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                          assignments[category._id] === sectionKey
                            ? 'bg-primary text-on-primary'
                            : 'bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        {sectionNames[sectionKey] || sectionKey}
                      </button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mb-6 rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant">
            {t('categories.enableSectionsEmpty')}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={saving}
            onClick={() => onConfirm({ sectionNames, assignments })}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-label-lg font-semibold tracking-[0.05em] text-on-primary disabled:opacity-60"
          >
            <MaterialIcon name="check" className="text-[20px]" />
            {saving ? t('common.saving') : t('categories.enableSectionsConfirm')}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-surface-container-high px-6 py-3 text-label-lg font-semibold tracking-[0.05em] text-on-surface"
          >
            {t('common.cancel')}
          </button>
        </div>
      </section>
    </div>
  );
}
