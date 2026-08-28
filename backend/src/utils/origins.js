const TENANT_LABEL_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isAllowedBrowserOrigin(origin, { clientOrigins = [], rootDomain = 'scanosh.com', nodeEnv = 'production' } = {}) {
  const requestOrigin = String(origin || '')
    .trim()
    .replace(/\/+$/, '');

  if (!requestOrigin) {
    return true;
  }

  if (clientOrigins.includes(requestOrigin)) {
    return true;
  }

  let url;

  try {
    url = new URL(requestOrigin);
  } catch {
    return false;
  }

  const hostname = url.hostname.toLowerCase();
  const protocol = url.protocol;
  const root = String(rootDomain || 'scanosh.com')
    .trim()
    .replace(/^\./, '')
    .toLowerCase();

  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.localhost')) {
    if (nodeEnv === 'production') {
      return false;
    }

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return protocol === 'http:' || protocol === 'https:';
    }

    const label = hostname.slice(0, -'.localhost'.length);
    return (
      (protocol === 'http:' || protocol === 'https:') &&
      Boolean(label) &&
      !label.includes('.') &&
      TENANT_LABEL_RE.test(label)
    );
  }

  if (protocol !== 'https:') {
    return false;
  }

  if (hostname === root || hostname === `www.${root}` || hostname === `app.${root}` || hostname === `platform.${root}`) {
    return true;
  }

  const suffix = `.${root}`;

  if (!hostname.endsWith(suffix)) {
    return false;
  }

  const label = hostname.slice(0, -suffix.length);
  return Boolean(label) && !label.includes('.') && TENANT_LABEL_RE.test(label);
}
