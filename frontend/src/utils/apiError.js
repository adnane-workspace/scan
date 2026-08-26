function detailsVars(details) {
  if (details && typeof details === 'object' && !Array.isArray(details)) {
    return details;
  }

  return {};
}

export function getApiError(err, t, fallbackKey, vars) {
  const data = err?.response?.data;
  const code = data?.code;

  if (code) {
    const key = `apiErrors.${code}`;
    const translated = t(key, { ...detailsVars(data.details), ...vars });

    if (translated && translated !== key) {
      return translated;
    }
  }

  if (data?.message) {
    return data.message;
  }

  return t(fallbackKey, vars);
}
