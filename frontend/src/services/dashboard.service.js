import api from './api.js';

export async function getDashboardStats() {
  const { data } = await api.get('/me/stats');
  return data.data;
}
