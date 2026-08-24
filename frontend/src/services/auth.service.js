import api from './api.js';

export async function registerRequest(payload) {
  const { data } = await api.post('/auth/register', payload);
  return data.data;
}

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

export async function changePasswordRequest(payload) {
  const { data } = await api.post('/auth/password', payload);
  return data;
}

export async function requestPasswordReset(payload) {
  const { data } = await api.post('/auth/forgot-password', payload, { timeout: 20000 });
  return data.data;
}

export async function verifyResetCode(payload) {
  const { data } = await api.post('/auth/verify-reset-code', payload);
  return data;
}

export async function resetPasswordWithCode(payload) {
  const { data } = await api.post('/auth/reset-password', payload, { timeout: 20000 });
  return data;
}
