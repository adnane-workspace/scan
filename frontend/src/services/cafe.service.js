import api from './api.js';

export async function getMyCafe() {
  const { data } = await api.get('/cafe');
  return data.data.cafe;
}

export async function updateMyCafe(payload) {
  const { data } = await api.put('/cafe', payload);
  return data.data.cafe;
}

export async function generateCafeQr() {
  const { data } = await api.post('/cafe/qr/generate');
  return data.data.qr;
}

export async function requestQrChange(reason) {
  const { data } = await api.post('/cafe/qr/change-requests', { reason });
  return data.data.qr;
}

export async function uploadCafeLogo(file, kind = 'logo') {
  const formData = new FormData();
  formData.append('image', file);

  const query = kind === 'cover' ? '?kind=cover' : '';
  const { data } = await api.post(`/cafe/upload${query}`, formData);
  return data.data.url;
}
