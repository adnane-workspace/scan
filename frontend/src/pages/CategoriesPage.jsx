import { useEffect, useState } from 'react';
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from '../services/category.service.js';

const emptyForm = {
  name: '',
  description: '',
  order: 0,
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function loadCategories() {
    setLoading(true);
    setError('');

    try {
      const items = await listCategories();
      setCategories(items);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load categories');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: name === 'order' ? Number(value) : value,
    }));
  }

  function startEdit(category) {
    setEditingId(category._id);
    setForm({
      name: category.name,
      description: category.description || '',
      order: category.order ?? 0,
    });
    setError('');
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');

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

      resetForm();
      await loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save category');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(category) {
    const confirmed = window.confirm(`Delete category "${category.name}"?`);

    if (!confirmed) {
      return;
    }

    setError('');

    try {
      await deleteCategory(category._id);

      if (editingId === category._id) {
        resetForm();
      }

      await loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete category');
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Categories</h1>
        <p className="mt-2 text-slate-600">Manage the categories of your cafe menu.</p>
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-slate-900">
          {editingId ? 'Edit category' : 'New category'}
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
              placeholder="Cafés"
              required
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Order
            <input
              name="order"
              type="number"
              value={form.order}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700 md:col-span-2">
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
              placeholder="Optional"
            />
          </label>
        </div>
        <div className="mt-4 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <p className="px-6 py-8 text-sm text-slate-500">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="px-6 py-8 text-sm text-slate-500">No categories yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-6 py-3 font-medium">Order</th>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Description</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id} className="border-b border-slate-100 last:border-0">
                  <td className="px-6 py-3 text-slate-500">{category.order}</td>
                  <td className="px-6 py-3 font-medium text-slate-900">{category.name}</td>
                  <td className="px-6 py-3 text-slate-600">{category.description || '—'}</td>
                  <td className="px-6 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => startEdit(category)}
                      className="mr-3 font-medium text-amber-700 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(category)}
                      className="font-medium text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
