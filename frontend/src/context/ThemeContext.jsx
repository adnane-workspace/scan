import { useCallback, useEffect, useMemo, useState } from 'react';
import { THEME_STORAGE_KEY } from '../utils/constants.js';
import { ThemeContext } from './theme-context.js';

export const THEMES = ['light', 'dark'];

function readTheme() {
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return THEMES.includes(stored) ? stored : 'light';
}

export function applyDocumentTheme(theme) {
  const value = THEMES.includes(theme) ? theme : 'light';
  document.documentElement.classList.toggle('theme-dark', value === 'dark');
  document.documentElement.style.colorScheme = value;
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readTheme);

  const setTheme = useCallback((next) => {
    const value = THEMES.includes(next) ? next : 'light';
    window.localStorage.setItem(THEME_STORAGE_KEY, value);
    applyDocumentTheme(value);
    setThemeState(value);
  }, []);

  useEffect(() => {
    applyDocumentTheme(theme);
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme, isDark: theme === 'dark' }), [theme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
