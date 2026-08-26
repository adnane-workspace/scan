export const APP_HOME = '/app';
export const PLATFORM_HOME = '/platform';

export function getHomePath(user) {
  return user?.role === 'superadmin' ? PLATFORM_HOME : APP_HOME;
}

const PLATFORM_PREFIXES = ['cafes', 'qr-requests', 'logs', 'storage'];
const APP_PREFIXES = ['products', 'categories'];

export function mapLegacyDashboardPath(pathname, user) {
  const rest = String(pathname || '').replace(/^\/dashboard\/?/, '');

  if (!rest) {
    return getHomePath(user);
  }

  if (PLATFORM_PREFIXES.some((prefix) => rest === prefix || rest.startsWith(`${prefix}/`))) {
    return `/platform/${rest}`;
  }

  if (APP_PREFIXES.some((prefix) => rest === prefix || rest.startsWith(`${prefix}/`))) {
    return `/app/${rest}`;
  }

  if (rest === 'settings') {
    return user?.role === 'superadmin' ? `${PLATFORM_HOME}/settings` : `${APP_HOME}/settings`;
  }

  return getHomePath(user);
}
