import api from './api.js';

export async function listCategories() {
  const { data } = await api.get('/me/categories');
  return data.data.categories;
}

export async function createCategory(payload) {
  const { data } = await api.post('/me/categories', payload);
  return data.data.category;
}

export async function updateCategory(id, payload) {
  const { data } = await api.put(`/me/categories/${id}`, payload);
  return data.data.category;
}

export async function deleteCategory(id) {
  const { data } = await api.delete(`/me/categories/${id}`);
  return data;
}

export async function uploadCategoryImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const { data } = await api.post('/me/categories/upload', formData);
  return data.data.url;
}
