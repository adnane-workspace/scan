import { useEffect, useMemo, useState } from 'react';
import { listCategories } from '../services/category.service.js';
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  uploadProductImage,
} from '../services/product.service.js';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  categoryId: '',
  image: '',
  available: true,
  order: 0,
};

function formatPrice(value) {
  return Number(value).toFixed(2);
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  async function loadData() {
    setLoading(true);
    setError('');

    try {
      const [productItems, categoryItems] = await Promise.all([getProducts(), listCategories()]);
      setProducts(productItems);
      setCategories(categoryItems);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load products');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesName = product.name.toLowerCase().includes(query);
      const matchesCategory =
        categoryFilter === 'all' || String(product.categoryId) === categoryFilter;
      const matchesAvailability =
        availabilityFilter === 'all' ||
        (availabilityFilter === 'available' && product.available) ||
        (availabilityFilter === 'unavailable' && !product.available);

      return matchesName && matchesCategory && matchesAvailability;
    });
  }, [products, search, categoryFilter, availabilityFilter]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : name === 'order' ? Number(value) : value,
    }));
  }

  function startEdit(product) {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      categoryId: String(product.categoryId),
      image: product.image || '',
      available: product.available,
      order: product.order ?? 0,
    });
    setError('');
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleImageChange(event) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    setUploading(true);
    setError('');

    try {
      const url = await uploadProductImage(file);
      setForm((current) => ({ ...current, image: url }));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to upload image');
    } finally {
      setUploading(false);
    }
  }

  function validateForm() {
    if (!form.name.trim()) {
      return 'Name is required';
    }

    if (form.price === '' || Number.isNaN(Number(form.price))) {
      return 'Price is required';
    }

    if (Number(form.price) < 0) {
      return 'Price cannot be negative';
    }

    if (!form.categoryId) {
      return 'Category is required';
    }

    return '';
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationMessage = validateForm();

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      categoryId: form.categoryId,
      image: form.image.trim(),
      available: form.available,
      order: Number.isNaN(form.order) ? 0 : form.order,
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save product');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product) {
    const confirmed = window.confirm(`Delete product "${product.name}"?`);

    if (!confirmed) {
      return;
    }

    setError('');

    try {
      await deleteProduct(product._id);

      if (editingId === product._id) {
        resetForm();
      }

      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete product');
    }
  }

  async function handleToggleAvailable(product) {
    setError('');

    try {
      await updateProduct(product._id, { available: !product.available });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update availability');
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Products</h1>
        <p className="mt-2 text-slate-600">Manage the products of your cafe menu.</p>
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-slate-900">{editingId ? 'Edit product' : 'New product'}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Name *
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
              placeholder="Espresso"
              required
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Price *
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
              placeholder="2.50"
              required
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Category *
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
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
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-slate-700">Photo</p>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              {form.image ? (
                <img src={form.image} alt="Aperçu produit" className="h-24 w-24 rounded-lg object-cover" />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                  Aucune
                </div>
              )}
              <div className="flex flex-col gap-2">
                <label className="inline-flex cursor-pointer rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                  {uploading ? 'Envoi...' : 'Choisir une photo'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={uploading}
                  />
                </label>
                {form.image ? (
                  <button
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, image: '' }))}
                    className="text-sm font-medium text-red-600 hover:underline"
                  >
                    Retirer la photo
                  </button>
                ) : null}
              </div>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              name="available"
              type="checkbox"
              checked={form.available}
              onChange={handleChange}
              className="size-4 rounded border-slate-300"
            />
            Available
          </label>
        </div>
        <div className="mt-4 flex gap-3">
          <button
            type="submit"
            disabled={saving || uploading || categories.length === 0}
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
        {categories.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">Create a category before adding products.</p>
        ) : null}
      </form>

      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          placeholder="Search by name"
        />
        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
        >
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          value={availabilityFilter}
          onChange={(event) => setAvailabilityFilter(event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
        >
          <option value="all">All availability</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <p className="px-6 py-8 text-sm text-slate-500">Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="px-6 py-8 text-sm text-slate-500">No products found.</p>
        ) : (
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-6 py-3 font-medium">Image</th>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium">Available</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id} className="border-b border-slate-100 last:border-0">
                  <td className="px-6 py-3">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-3 font-medium text-slate-900">{product.name}</td>
                  <td className="px-6 py-3 text-slate-600">{product.categoryName || '—'}</td>
                  <td className="px-6 py-3 text-slate-700">{formatPrice(product.price)} €</td>
                  <td className="px-6 py-3">
                    <button
                      type="button"
                      onClick={() => handleToggleAvailable(product)}
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        product.available ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {product.available ? 'Available' : 'Unavailable'}
                    </button>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => startEdit(product)}
                      className="mr-3 font-medium text-amber-700 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product)}
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
