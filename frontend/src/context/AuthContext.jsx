import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchCurrentUser, loginRequest, logoutRequest, registerRequest } from '../services/auth.service.js';
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../utils/constants.js';
import { AuthContext } from './auth-context.js';

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || 'null');
  } catch {
    return null;
  }
}

function persistSession(token, user) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState(readStoredUser);
  const [isReady, setIsReady] = useState(!localStorage.getItem(TOKEN_STORAGE_KEY));

  const logout = useCallback(async () => {
    try {
      if (localStorage.getItem(TOKEN_STORAGE_KEY)) {
        await logoutRequest();
      }
    } catch {
      // Token is cleared locally even if the API call fails.
    }

    clearSession();
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(async (email, password) => {
    const { token: nextToken, user: nextUser } = await loginRequest({ email, password });
    persistSession(nextToken, nextUser);
    setToken(nextToken);
    setUser(nextUser);
    return nextUser;
  }, []);

  const register = useCallback(async (payload) => {
    const { token: nextToken, user: nextUser } = await registerRequest(payload);
    persistSession(nextToken, nextUser);
    setToken(nextToken);
    setUser(nextUser);
    return nextUser;
  }, []);

  useEffect(() => {
    if (!token) {
      setIsReady(true);
      return undefined;
    }

    let cancelled = false;

    fetchCurrentUser()
      .then((nextUser) => {
        if (!cancelled) {
          persistSession(token, nextUser);
          setUser(nextUser);
        }
      })
      .catch(() => {
        if (!cancelled) {
          clearSession();
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsReady(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    const onUnauthorized = () => {
      clearSession();
      setToken(null);
      setUser(null);
    };

    window.addEventListener('auth:unauthorized', onUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', onUnauthorized);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isReady,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [token, user, isReady, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
