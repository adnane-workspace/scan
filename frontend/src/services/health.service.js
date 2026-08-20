import api from './api.js';

export async function fetchHealth() {
  const { data } = await api.get('/health');
  return data;
}
