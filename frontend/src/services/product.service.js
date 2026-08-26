import api from './api.js';

export async function getProducts() {
  const { data } = await api.get('/me/products');
  return data.data.products;
}

export async function createProduct(payload) {
  const { data } = await api.post('/me/products', payload);
  return data.data.product;
}

export async function updateProduct(id, payload) {
  const { data } = await api.put(`/me/products/${id}`, payload);
  return data.data.product;
}

export async function deleteProduct(id) {
  const { data } = await api.delete(`/me/products/${id}`);
  return data;
}

export async function uploadProductImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const { data } = await api.post('/me/products/upload', formData);
  return data.data.url;
}
