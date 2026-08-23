import api from './api.js';

export async function listPlatformCafes() {
  const { data } = await api.get('/platform/cafes');
  return data.data.cafes;
}

export async function createPlatformCafe(payload) {
  const { data } = await api.post('/platform/cafes', payload);
  return data.data.cafe;
}

export async function getPlatformCafe(id) {
  const { data } = await api.get(`/platform/cafes/${id}`);
  return data.data.cafe;
}

export async function updatePlatformCafe(id, payload) {
  const { data } = await api.patch(`/platform/cafes/${id}`, payload);
  return data.data.cafe;
}

export async function resetPlatformCafePassword(id, password) {
  const { data } = await api.post(`/platform/cafes/${id}/password`, { password });
  return data.data;
}
