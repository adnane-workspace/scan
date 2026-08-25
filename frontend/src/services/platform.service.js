import api from './api.js';

export async function getStorageReport(refresh = false) {
  const { data } = await api.get('/platform/storage', {
    params: refresh ? { refresh: '1' } : undefined,
  });
  return data.data.report;
}

export async function listActivityLogs(params = {}) {
  const { data } = await api.get('/platform/logs', { params });
  return data.data;
}

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

export async function listQrChangeRequests(status = 'pending') {
  const { data } = await api.get('/platform/qr-requests', {
    params: status && status !== 'all' ? { status } : undefined,
  });
  return data.data;
}

export async function reviewQrChangeRequest(id, payload) {
  const { data } = await api.post(`/platform/qr-requests/${id}/review`, payload);
  return data.data.request;
}

export async function unlockCafeQr(id) {
  const { data } = await api.post(`/platform/cafes/${id}/qr/unlock`);
  return data.data.qr;
}
