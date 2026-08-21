import { useEffect, useMemo, useState } from 'react';
import CategoryFormModal from '../components/dashboard/CategoryFormModal.jsx';
import MaterialIcon from '../components/ui/MaterialIcon.jsx';
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from '../services/category.service.js';
import { getProducts } from '../services/product.service.js';
import { categoryIcon } from '../utils/format.js';

const emptyForm = {
  name: '',
  description: '',
  order: 0,
};

function countByCategory(products) {
  const counts = new Map();

  products.forEach((product) => {
    const key = String(product.categoryId);
    counts.set(key, (counts.get(key) || 0) + 1);
  });

  return counts;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [productCounts, setProductCounts] = useState(new Map());
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  async function loadData(silent = false) {
    if (!silent) {
      setLoading(true);
    }
    setError('');

    try {
      const [categoryItems, productItems] = await Promise.all([listCategories(), getProducts()]);
      setCategories(categoryItems);
      setProductCounts(countByCategory(productItems));
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de charger les catégories');
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const nextOrder = useMemo(
    () => categories.reduce((max, category) => Math.max(max, Number(category.order) || 0), 0) + 1,
    [categories],
  );

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

  function openCreateForm() {
    setEditingId(null);
    setForm({ ...emptyForm, order: nextOrder });
    setFormError('');
    setError('');
    setIsFormOpen(true);
  }

  function startEdit(category) {
    setEditingId(category._id);
    setForm({
      name: category.name,
      description: category.description || '',
      order: category.order ?? 0,
    });
    setFormError('');
    setError('');
    setIsFormOpen(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      setFormError('Le nom est requis');
      return;
    }

    setSaving(true);
    setFormError('');

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      order: Number.isNaN(form.order) ? 0 : form.order,
    };

    try {
      if (editingId) {
        await updateCategory(editingId, payload);
      } else {
        await createCategory(payload);
      }

      closeForm();
      await loadData(true);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Impossible d\'enregistrer la catégorie');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(category) {
    const confirmed = window.confirm(`Supprimer la catégorie « ${category.name} » ?`);

    if (!confirmed) {
      return;
    }

    setError('');

    try {
      await deleteCategory(category._id);

      if (editingId === category._id) {
        closeForm();
      }

      await loadData(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de supprimer la catégorie');
    }
  }

  async function persistOrder(nextCategories) {
    const updates = nextCategories
      .map((category, index) => ({ category, order: index + 1 }))
      .filter(({ category, order }) => category.order !== order);

    if (updates.length === 0) {
      return;
    }

    setReordering(true);
    setError('');

    try {
      await Promise.all(updates.map(({ category, order }) => updateCategory(category._id, { order })));
      setCategories(nextCategories.map((category, index) => ({ ...category, order: index + 1 })));
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de réordonner les catégories');
      await loadData(true);
    } finally {
      setReordering(false);
    }
  }

  function handleDragStart(event, index) {
    if (reordering || event.target.closest('button')) {
      event.preventDefault();
      return;
    }

    setDragIndex(index);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(index));
  }

  function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }

  async function handleDrop(event, dropIndex) {
    event.preventDefault();

    const fromIndex = dragIndex;
    setDragIndex(null);

    if (fromIndex === null || fromIndex === dropIndex) {
      return;
    }

    const next = [...categories];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(dropIndex, 0, moved);
    setCategories(next);
    await persistOrder(next);
  }

  function handleDragEnd() {
    setDragIndex(null);
  }

  return (
    <div className="relative flex w-full flex-col">
      <div className="relative z-10 mb-stack-lg flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-1 font-display text-display-md font-bold tracking-tight text-on-surface sm:text-display-lg">
            Catégories
          </h1>
          <p className="max-w-2xl text-on-surface-variant">
            Organisez la structure de votre menu. L&apos;ordre défini ici sera celui affiché à vos clients.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-on-primary transition-all duration-300 hover:bg-surface-tint hover:shadow-lg"
        >
          <MaterialIcon name="add" className="text-[20px] transition-transform duration-300 group-hover:rotate-90" />
          <span className="text-label-lg font-semibold tracking-[0.05em]">Nouvelle Catégorie</span>
        </button>
      </div>

      {error ? (
        <p className="mb-stack-lg rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm text-error">
          {error}
        </p>
      ) : null}

      <div className="relative overflow-hidden rounded-2xl bg-surface shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-surface-bright/50 via-transparent to-surface-bright/50" />
        <div className="relative z-10 overflow-x-auto">
          {loading ? (
            <p className="px-6 py-8 text-sm text-on-surface-variant">Chargement des catégories...</p>
          ) : categories.length === 0 ? (
            <p className="px-6 py-8 text-sm text-on-surface-variant">Aucune catégorie pour le moment.</p>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-surface-container-lowest/50 text-label-md font-medium tracking-wider text-on-surface-variant uppercase">
                  <th className="w-16 rounded-tl-2xl px-6 py-4 text-center">
                    <MaterialIcon name="drag_indicator" className="text-[18px] text-outline" />
                  </th>
                  <th className="px-6 py-4">Ordre</th>
                  <th className="px-6 py-4">Catégorie</th>
                  <th className="px-6 py-4 text-right">Produits</th>
                  <th className="rounded-tr-2xl px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => {
                  const count = productCounts.get(String(category._id)) || 0;

                  return (
                    <tr
                      key={category._id}
                      draggable={!reordering}
                      onDragStart={(event) => handleDragStart(event, index)}
                      onDragOver={handleDragOver}
                      onDrop={(event) => handleDrop(event, index)}
                      onDragEnd={handleDragEnd}
                      className={`group cursor-grab border-b-0 transition-colors duration-200 hover:bg-surface-container-lowest/80 active:cursor-grabbing ${
                        dragIndex === index ? 'relative z-50 scale-[1.01] bg-surface-container-highest opacity-50 shadow-lg' : ''
                      }`}
                    >
                      <td className="px-6 py-5 text-center align-middle">
                        <MaterialIcon
                          name="drag_handle"
                          className="text-[20px] text-outline-variant transition-colors group-hover:text-primary/70"
                        />
                      </td>
                      <td className="w-24 px-6 py-5 align-middle">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-high text-label-lg font-semibold tracking-[0.05em] text-on-surface-variant">
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-5 align-middle">
                        <div className="flex items-center gap-4">
                          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-container text-primary shadow-sm">
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10" />
                            <MaterialIcon name={categoryIcon(category.name)} className="relative z-10 text-[24px]" />
                          </div>
                          <div>
                            <h3 className="text-headline-md font-semibold tracking-tight text-on-surface">
                              {category.name}
                            </h3>
                            <p className="mt-1 text-label-md font-medium text-on-surface-variant">
                              {category.description || 'Aucune description'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right align-middle">
                        <div className="inline-flex items-center rounded-full bg-tertiary-container/10 px-3 py-1 text-label-md font-medium text-tertiary-container">
                          {count} article{count > 1 ? 's' : ''}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right align-middle">
                        <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity duration-200 md:opacity-0 md:group-hover:opacity-100">
                          <button
                            type="button"
                            title="Modifier"
                            onClick={() => startEdit(category)}
                            className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
                          >
                            <MaterialIcon name="edit" className="text-[20px]" />
                          </button>
                          <button
                            type="button"
                            title="Supprimer"
                            onClick={() => handleDelete(category)}
                            className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-error-container hover:text-on-error-container"
                          >
                            <MaterialIcon name="delete" className="text-[20px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <CategoryFormModal
        open={isFormOpen}
        editing={Boolean(editingId)}
        form={form}
        saving={saving}
        error={formError}
        onClose={closeForm}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
