import api from './api.js';

export async function getProducts() {
  const { data } = await api.get('/products');
  return data.data.products;
}

export async function getProduct(id) {
  const { data } = await api.get(`/products/${id}`);
  return data.data.product;
}

export async function createProduct(payload) {
  const { data } = await api.post('/products', payload);
  return data.data.product;
}

export async function updateProduct(id, payload) {
  const { data } = await api.put(`/products/${id}`, payload);
  return data.data.product;
}

export async function deleteProduct(id) {
  const { data } = await api.delete(`/products/${id}`);
  return data;
}

export async function uploadProductImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const { data } = await api.post('/products/upload', formData);
  return data.data.url;
}
