import axios from 'axios';
import { API_URL, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../utils/constants.js';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  const isPublicMenu = config.method === 'get' && String(config.url || '').includes('/menu/');

  if (token && !isPublicMenu) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    if (typeof config.headers.delete === 'function') {
      config.headers.delete('Content-Type');
    } else {
      delete config.headers['Content-Type'];
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isPublicAuth =
      error.config?.url?.includes('/auth/login') ||
      error.config?.url?.includes('/auth/register') ||
      error.config?.url?.includes('/auth/verify-email') ||
      error.config?.url?.includes('/auth/resend-verification') ||
      error.config?.url?.includes('/auth/forgot-password') ||
      error.config?.url?.includes('/auth/verify-reset-code') ||
      error.config?.url?.includes('/auth/reset-password');
    const isMenuRequest = error.config?.url?.includes('/menu/');

    if (error.response?.status === 401 && !isPublicAuth && !isMenuRequest) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      window.dispatchEvent(new Event('auth:unauthorized'));
    }

    return Promise.reject(error);
  },
);

export default api;
