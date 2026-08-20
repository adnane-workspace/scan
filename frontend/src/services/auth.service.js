import api from './api.js';

export async function loginRequest(credentials) {
  const { data } = await api.post('/auth/login', credentials);
  return data.data;
}

export async function fetchCurrentUser() {
  const { data } = await api.get('/auth/me');
  return data.data.user;
}

export async function logoutRequest() {
  await api.post('/auth/logout');
}
