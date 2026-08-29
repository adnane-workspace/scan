import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryFormModal from '../components/dashboard/CategoryFormModal.jsx';
import MaterialIcon from '../components/ui/MaterialIcon.jsx';
import CloudinaryImage from '../components/ui/CloudinaryImage.jsx';
import { clearPublicMenuCache } from '../hooks/usePublicMenu.js';
import { useLocale } from '../hooks/useLocale.js';
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
  uploadCategoryImage,
} from '../services/category.service.js';
import { getApiError } from '../utils/apiError.js';
import {
  descendantIdSet,
  siblingCategories,
  walkPreOrder,
} from '../utils/categoryTree.js';
import { categoryIcon } from '../utils/format.js';

const emptyForm = {
  name: '',
  description: '',
  image: '',
  order: 0,
  parentId: '',
};

function CategoryIdentity({ category, parentName, t }) {
  const isChild = category.depth > 0;

  return (
    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
      <div
        className={`relative flex shrink-0 items-center justify-center overflow-hidden bg-surface-container text-primary ${
          isChild ? 'h-10 w-10 rounded-lg' : 'h-12 w-12 rounded-xl shadow-sm'
        }`}
      >
        {category.image ? (
          <CloudinaryImage src={category.image} alt="" preset="thumb" className="h-full w-full object-cover" />
        ) : (
          <MaterialIcon name={categoryIcon(category.name)} className={isChild ? 'text-[20px]' : 'text-[24px]'} />
        )}
      </div>
      <div className="min-w-0">
        {isChild ? (
          <p className="mb-0.5 text-[11px] font-semibold tracking-[0.08em] text-primary uppercase">
            {t('categories.subcategory')}
            {parentName ? ` · ${t('categories.inside', { name: parentName })}` : ''}
          </p>
        ) : (
          <p className="mb-0.5 text-[11px] font-semibold tracking-[0.08em] text-on-surface-variant uppercase">
            {t('categories.rootLabel')}
          </p>
        )}
        <h3 className={`truncate font-semibold tracking-tight text-on-surface ${isChild ? 'text-base' : 'text-lg'}`}>
          {category.name}
        </h3>
        <p className="mt-0.5 truncate text-sm text-on-surface-variant">
          {category.description || t('categories.noDescription')}
        </p>
      </div>
    </div>
  );
}

function CategoryActions({ category, canAddChild, onEdit, onDelete, onAddChild, t }) {
  return (
    <div className="flex items-center justify-end gap-2">
      {canAddChild ? (
        <button
          type="button"
          title={t('categories.addChild', { name: category.name })}
          onClick={() => onAddChild(category)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
        >
          <MaterialIcon name="subdirectory_arrow_right" className="text-[20px]" />
        </button>
      ) : null}
      <button
        type="button"
        title={t('common.edit')}
        onClick={() => onEdit(category)}
        className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
      >
        <MaterialIcon name="edit" className="text-[20px]" />
      </button>
      <button
        type="button"
        title={t('common.delete')}
        onClick={() => onDelete(category)}
        className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-error-container hover:text-on-error-container"
      >
        <MaterialIcon name="delete" className="text-[20px]" />
      </button>
    </div>
  );
}

export default function CategoriesPage() {
  const { t } = useLocale();
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [dragId, setDragId] = useState(null);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  const loadData = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }
    setError('');

    try {
      const categoryItems = await listCategories();
      setCategories(categoryItems);
    } catch (err) {
      setError(getApiError(err, t, 'categories.loadError'));
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const rows = useMemo(() => walkPreOrder(categories), [categories]);
  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category._id, category])),
    [categories],
  );

  const parentOptions = useMemo(() => {
    const blocked = editingId ? descendantIdSet(categories, editingId) : new Set();

    if (editingId) {
      blocked.add(editingId);
    }

    return walkPreOrder(categories).filter((category) => !blocked.has(category._id));
  }, [categories, editingId]);

  function nextSiblingOrder(parentId) {
    const siblings = siblingCategories(categories, parentId || null);
    return siblings.reduce((max, category) => Math.max(max, Number(category.order) || 0), 0) + 1;
  }

  function canAddChild(category) {
    return category.childCount > 0 || !category.productCount;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: name === 'order' ? Number(value) : value,
    }));
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
  }

  function openCreateForm(parentId = '') {
    setEditingId(null);
    setForm({ ...emptyForm, parentId: parentId || '', order: nextSiblingOrder(parentId || null) });
    setFormError('');
    setError('');
    setIsFormOpen(true);
  }

  useEffect(() => {
    if (loading || searchParams.get('new') !== '1') {
      return;
    }

    openCreateForm();
    const next = new URLSearchParams(searchParams);
    next.delete('new');
    setSearchParams(next, { replace: true });
  }, [loading, searchParams, setSearchParams]);

  function startEdit(category) {
    setEditingId(category._id);
    setForm({
      name: category.name,
      description: category.description || '',
      image: category.image || '',
      order: category.order ?? 0,
      parentId: category.parentId || '',
    });
    setFormError('');
    setError('');
    setIsFormOpen(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      setFormError(t('validation.nameRequired'));
      return;
    }

    setSaving(true);
    setFormError('');

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      order: Number.isNaN(form.order) ? 0 : form.order,
      parentId: form.parentId || null,
    };

    try {
      if (editingId) {
        await updateCategory(editingId, payload);
      } else {
        await createCategory(payload);
      }

      closeForm();
      clearPublicMenuCache();
      await loadData(true);
    } catch (err) {
      setFormError(getApiError(err, t, 'validation.saveCategory'));
    } finally {
      setSaving(false);
    }
  }

  async function handleImageChange(event) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    setUploading(true);
    setFormError('');

    try {
      const url = await uploadCategoryImage(file);
      setForm((current) => ({ ...current, image: url }));
    } catch (err) {
      setFormError(getApiError(err, t, 'validation.uploadImage'));
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(category) {
    const confirmed = window.confirm(t('categories.deleteConfirm', { name: category.name }));

    if (!confirmed) {
      return;
    }

    setError('');

    try {
      await deleteCategory(category._id);
      clearPublicMenuCache();

      if (editingId === category._id) {
        closeForm();
      }

      await loadData(true);
    } catch (err) {
      setError(getApiError(err, t, 'categories.deleteError'));
    }
  }

  async function persistSiblingOrder(parentId, nextSiblings) {
    const updates = nextSiblings
      .map((category, index) => ({ category, order: index + 1 }))
      .filter(({ category, order }) => category.order !== order);

    if (updates.length === 0) {
      return;
    }

    setReordering(true);
    setError('');

    try {
      await Promise.all(updates.map(({ category, order }) => updateCategory(category._id, { order })));
      const ordered = new Map(nextSiblings.map((category, index) => [category._id, index + 1]));
      setCategories((current) =>
        current.map((category) =>
          ordered.has(category._id) ? { ...category, order: ordered.get(category._id) } : category,
        ),
      );
    } catch (err) {
      setError(getApiError(err, t, 'categories.reorderError'));
      await loadData(true);
    } finally {
      setReordering(false);
    }
  }

  function handleDragStart(event, category) {
    if (reordering || event.target.closest('button')) {
      event.preventDefault();
      return;
    }

    setDragId(category._id);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', category._id);
  }

  function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }

  async function handleDrop(event, dropCategory) {
    event.preventDefault();
    const fromId = dragId || event.dataTransfer.getData('text/plain');
    setDragId(null);

    const fromCategory = categories.find((category) => category._id === fromId);

    if (!fromCategory || fromCategory._id === dropCategory._id) {
      return;
    }

    if ((fromCategory.parentId || null) !== (dropCategory.parentId || null)) {
      return;
    }

    const siblings = siblingCategories(categories, fromCategory.parentId);
    const fromIndex = siblings.findIndex((category) => category._id === fromId);
    const dropIndex = siblings.findIndex((category) => category._id === dropCategory._id);

    if (fromIndex < 0 || dropIndex < 0) {
      return;
    }

    const next = [...siblings];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(dropIndex, 0, moved);
    await persistSiblingOrder(fromCategory.parentId, next);
  }

  function handleDragEnd() {
    setDragId(null);
  }

  async function moveCategory(category, delta) {
    const siblings = siblingCategories(categories, category.parentId);
    const index = siblings.findIndex((item) => item._id === category._id);
    const nextIndex = index + delta;

    if (reordering || index < 0 || nextIndex < 0 || nextIndex >= siblings.length) {
      return;
    }

    const next = [...siblings];
    const [moved] = next.splice(index, 1);
    next.splice(nextIndex, 0, moved);
    await persistSiblingOrder(category.parentId, next);
  }

  return (
    <div className="relative flex w-full flex-col">
      <div className="relative z-10 mb-stack-lg flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-1 font-display text-display-md font-bold tracking-tight text-on-surface lg:text-display-lg">
            {t('categories.title')}
          </h1>
          <p className="max-w-2xl text-on-surface-variant">{t('categories.subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={() => openCreateForm()}
          className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-on-primary transition-all duration-300 hover:bg-surface-tint hover:shadow-lg"
        >
          <MaterialIcon name="add" className="text-[20px] transition-transform duration-300 group-hover:rotate-90" />
          <span className="text-label-lg font-semibold tracking-[0.05em]">{t('categories.add')}</span>
        </button>
      </div>

      {error ? (
        <p className="mb-stack-lg rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm text-error">
          {error}
        </p>
      ) : null}

      <div className="relative">
          {loading ? (
            <p className="rounded-2xl border border-outline-variant bg-surface-container-lowest px-6 py-8 text-sm text-on-surface-variant">
              {t('categories.loading')}
            </p>
          ) : categories.length === 0 ? (
            <p className="rounded-2xl border border-outline-variant bg-surface-container-lowest px-6 py-8 text-sm text-on-surface-variant">
              {t('categories.empty')}
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {rows.map((category) => {
                const count = category.productCount || 0;
                const childCount = category.childCount || 0;
                const siblings = siblingCategories(categories, category.parentId);
                const siblingIndex = siblings.findIndex((item) => item._id === category._id);
                const isChild = category.depth > 0;
                const parentName = category.parentId ? categoryById.get(category.parentId)?.name : '';

                return (
                  <li
                    key={category._id}
                    draggable={!reordering}
                    onDragStart={(event) => handleDragStart(event, category)}
                    onDragOver={handleDragOver}
                    onDrop={(event) => handleDrop(event, category)}
                    onDragEnd={handleDragEnd}
                    style={{ marginInlineStart: `${category.depth * 1.5}rem` }}
                    className={`group rounded-2xl border transition-colors duration-200 ${
                      isChild
                        ? 'border-primary/20 bg-surface-container-low/70'
                        : 'border-outline-variant bg-surface-container-lowest'
                    } ${
                      dragId === category._id ? 'opacity-50 shadow-lg' : 'hover:border-outline'
                    }`}
                  >
                    <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <span className="hidden cursor-grab text-on-surface-variant md:inline-flex active:cursor-grabbing">
                          <MaterialIcon name="drag_handle" className="text-[20px]" />
                        </span>
                        {isChild ? (
                          <MaterialIcon name="subdirectory_arrow_right" className="hidden shrink-0 text-primary sm:inline-flex" />
                        ) : null}
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                            isChild
                              ? 'bg-primary/12 text-primary'
                              : 'bg-surface-container-high text-on-surface'
                          }`}
                        >
                          {siblingIndex + 1}
                        </span>
                        <CategoryIdentity category={category} parentName={parentName} t={t} />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 sm:justify-end sm:gap-3">
                        <div className="flex flex-wrap gap-2">
                          {childCount > 0 ? (
                            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                              {childCount === 1
                                ? t('categories.childrenOne')
                                : t('categories.children', { count: childCount })}
                            </span>
                          ) : null}
                          <span className="rounded-full bg-surface-container px-3 py-1 text-xs font-semibold text-on-surface">
                            {count > 1 ? t('categories.itemsPlural', { count }) : t('categories.items', { count })}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="flex md:hidden">
                            <button
                              type="button"
                              aria-label={t('categories.moveUp', { name: category.name })}
                              disabled={reordering || siblingIndex === 0}
                              onClick={() => moveCategory(category, -1)}
                              className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant disabled:opacity-30"
                            >
                              <MaterialIcon name="keyboard_arrow_up" />
                            </button>
                            <button
                              type="button"
                              aria-label={t('categories.moveDown', { name: category.name })}
                              disabled={reordering || siblingIndex === siblings.length - 1}
                              onClick={() => moveCategory(category, 1)}
                              className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant disabled:opacity-30"
                            >
                              <MaterialIcon name="keyboard_arrow_down" />
                            </button>
                          </div>
                          <CategoryActions
                            category={category}
                            canAddChild={canAddChild(category)}
                            onEdit={startEdit}
                            onDelete={handleDelete}
                            onAddChild={(item) => openCreateForm(item._id)}
                            t={t}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
      </div>

      <CategoryFormModal
        open={isFormOpen}
        editing={Boolean(editingId)}
        form={form}
        parentOptions={parentOptions}
        saving={saving}
        uploading={uploading}
        error={formError}
        onClose={closeForm}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onImageChange={handleImageChange}
        onClearImage={() => setForm((current) => ({ ...current, image: '' }))}
      />
    </div>
  );
}
