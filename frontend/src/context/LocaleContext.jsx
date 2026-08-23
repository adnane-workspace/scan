import { useCallback, useMemo, useState } from 'react';
import { messages } from '../i18n/messages.js';
import { LocaleContext } from './locale-context.js';

export const LOCALE_STORAGE_KEY = 'digital-menu-locale';

function readLocale() {
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return stored === 'en' || stored === 'fr' ? stored : 'fr';
}

function lookup(locale, key) {
  const parts = key.split('.');
  let node = messages[locale] || messages.fr;

  for (const part of parts) {
    node = node?.[part];
  }

  if (typeof node === 'string') {
    return node;
  }

  node = messages.fr;

  for (const part of parts) {
    node = node?.[part];
  }

  return typeof node === 'string' ? node : key;
}

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(readLocale);

  const setLocale = useCallback((next) => {
    const value = next === 'en' ? 'en' : 'fr';
    window.localStorage.setItem(LOCALE_STORAGE_KEY, value);
    document.documentElement.lang = value;
    setLocaleState(value);
  }, []);

  const t = useCallback((key) => lookup(locale, key), [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  document.documentElement.lang = locale;

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
