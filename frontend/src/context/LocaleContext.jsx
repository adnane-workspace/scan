import { useCallback, useEffect, useMemo, useState } from 'react';
import { LOCALES, messages } from '../i18n/messages.js';
import { LocaleContext } from './locale-context.js';

export const LOCALE_STORAGE_KEY = 'digital-menu-locale';

const SUPPORTED = new Set(LOCALES.map((item) => item.id));

function localeMeta(id) {
  return LOCALES.find((item) => item.id === id) || LOCALES[0];
}

function readLocale() {
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return SUPPORTED.has(stored) ? stored : 'fr';
}

function applyDocumentLocale(id) {
  const meta = localeMeta(id);
  document.documentElement.lang = meta.id;
  document.documentElement.dir = meta.dir;
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

function interpolate(text, vars) {
  if (!vars) {
    return text;
  }

  return text.replace(/\{(\w+)\}/g, (_, name) => (vars[name] == null ? '' : String(vars[name])));
}

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(readLocale);

  const setLocale = useCallback((next) => {
    const value = SUPPORTED.has(next) ? next : 'fr';
    window.localStorage.setItem(LOCALE_STORAGE_KEY, value);
    applyDocumentLocale(value);
    setLocaleState(value);
  }, []);

  const t = useCallback((key, vars) => interpolate(lookup(locale, key), vars), [locale]);

  const value = useMemo(() => ({ locale, setLocale, t, dir: localeMeta(locale).dir }), [locale, setLocale, t]);

  useEffect(() => {
    applyDocumentLocale(locale);
  }, [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
