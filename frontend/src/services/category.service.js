import api from './api.js';

export async function listCategories() {
  const { data } = await api.get('/categories');
  return data.data.categories;
}

export async function createCategory(payload) {
  const { data } = await api.post('/categories', payload);
  return data.data.category;
}

export async function updateCategory(id, payload) {
  const { data } = await api.put(`/categories/${id}`, payload);
  return data.data.category;
}

export async function deleteCategory(id) {
  const { data } = await api.delete(`/categories/${id}`);
  return data;
}

export async function uploadCategoryImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const { data } = await api.post('/categories/upload', formData);
  return data.data.url;
}
