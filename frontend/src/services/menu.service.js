import api from './api.js';

export async function getPublicMenu(slug) {
  const { data } = await api.get(`/menu/${slug}`);
  return data.data;
}
