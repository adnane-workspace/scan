import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute.jsx';
import Sidebar from '../components/dashboard/Sidebar.jsx';
import LanguageSwitcher from '../components/ui/LanguageSwitcher.jsx';
import MaterialIcon from '../components/ui/MaterialIcon.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useLocale } from '../hooks/useLocale.js';
import { APP_NAME } from '../utils/constants.js';
import { getDashboardStats } from '../services/dashboard.service.js';
import { listPlatformCafes } from '../services/platform.service.js';
import { getApiError } from '../utils/apiError.js';

const emptyStats = {
  totalProducts: 0,
  totalCategories: 0,
  availableProducts: 0,
  unavailableProducts: 0,
  recentProducts: [],
  categories: [],
  cafe: null,
};

const headerSubtitleKeys = {
  '/app': 'header.dashboard',
  '/app/categories': 'header.categories',
  '/app/products': 'header.products',
  '/app/settings': 'header.settings',
  '/platform': 'header.dashboard',
  '/platform/settings': 'header.settings',
  '/platform/cafes': 'header.cafes',
  '/platform/cafes/new': 'header.cafeNew',
  '/platform/qr-requests': 'header.qrRequests',
  '/platform/logs': 'header.logs',
  '/platform/storage': 'header.storage',
};

export default function DashboardLayout() {
  const { logout, user } = useAuth();
  const { t } = useLocale();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState(emptyStats);
  const [platformCafes, setPlatformCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const hasLoadedRef = useRef(false);
  const isSuperAdmin = user?.role === 'superadmin';

  const loadStats = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }

    try {
      const data = await getDashboardStats();
      setStats(data);
      setError('');
      hasLoadedRef.current = true;
    } catch (err) {
      setError(getApiError(err, t, 'dashboard.loadError'));
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [t]);

  const loadPlatformCafes = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }

    try {
      const cafes = await listPlatformCafes();
      setPlatformCafes(cafes);
      setError('');
      hasLoadedRef.current = true;
    } catch (err) {
      setError(getApiError(err, t, 'dashboard.loadCafesError'));
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [t]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isSuperAdmin) {
      return undefined;
    }

    loadPlatformCafes();
  }, [isSuperAdmin, loadPlatformCafes]);

  useEffect(() => {
    if (isSuperAdmin) {
      return undefined;
    }

    if (hasLoadedRef.current && location.pathname !== '/app') {
      return undefined;
    }

    loadStats();
  }, [isSuperAdmin, location.pathname, loadStats]);

  const refreshStats = useCallback(() => loadStats(true), [loadStats]);
  const refreshCafes = useCallback(() => loadPlatformCafes(true), [loadPlatformCafes]);

  const outletContext = useMemo(
    () => ({
      stats,
      platformCafes,
      loading,
      error,
      refreshStats,
      refreshCafes,
    }),
    [stats, platformCafes, loading, error, refreshStats, refreshCafes],
  );

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  const cafeName = isSuperAdmin ? t('header.platform') : stats.cafe?.name || APP_NAME;
  const qrRequestCount = platformCafes.filter((item) => item.pendingQrChange).length;
  const subtitleKey = headerSubtitleKeys[location.pathname];
  const headerSubtitle = subtitleKey
    ? t(subtitleKey)
    : location.pathname.startsWith('/platform/cafes/')
      ? t('header.cafeDetail')
      : isSuperAdmin
        ? t('dashboard.roleSuper')
        : t('header.dashboard');
  const roleLabel = isSuperAdmin ? t('dashboard.roleSuper') : t('dashboard.roleAdmin');

  useEffect(() => {
    document.title = `${headerSubtitle} · ${APP_NAME}`;
  }, [headerSubtitle]);

  return (
    <ProtectedRoute>
      <div className={`min-h-screen bg-background text-on-surface ${isSuperAdmin ? 'theme-superadmin' : ''}`}>
        {isSidebarOpen ? (
          <button
            type="button"
            aria-label={t('common.closeMenu')}
            className="fixed inset-0 z-30 bg-on-surface/40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        ) : null}

        <aside
          className={`fixed inset-y-0 start-0 z-50 w-72 transition-transform duration-200 lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full lg:rtl:translate-x-0'
          }`}
        >
          <Sidebar
            cafe={stats.cafe}
            role={user?.role}
            qrRequestCount={qrRequestCount}
            onLogout={handleLogout}
            onNavigate={() => setIsSidebarOpen(false)}
          />
        </aside>

        <div className="lg:ps-72">
          <header
            className={`fixed top-0 inset-x-0 z-40 flex h-[calc(4.25rem+env(safe-area-inset-top))] items-center justify-between gap-3 border-b px-4 pt-[env(safe-area-inset-top)] sm:px-6 lg:start-72 lg:inset-e-0 lg:px-8 ${
              isSuperAdmin
                ? 'border-white/10 bg-background/90 backdrop-blur-md'
                : 'border-outline-variant bg-background/90 backdrop-blur-md'
            }`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                className="rounded-xl p-2 text-on-surface-variant hover:bg-surface-container-high lg:hidden"
                onClick={() => setIsSidebarOpen((open) => !open)}
                aria-label={t('common.openMenu')}
              >
                <MaterialIcon name="menu" />
              </button>
              <div className="min-w-0">
                <p className="truncate font-display text-lg font-semibold tracking-tight text-on-surface sm:text-xl">
                  {cafeName}
                </p>
                <p className="text-xs font-medium text-on-surface-variant sm:text-sm">{headerSubtitle}</p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <LanguageSwitcher compact />
              <div className="hidden text-end sm:block">
                <div className="text-sm font-semibold text-on-surface">
                  {user?.name || t('dashboard.profile')}
                </div>
                <div className="text-xs text-on-surface-variant">{roleLabel}</div>
              </div>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full ${
                  isSuperAdmin ? 'bg-primary/15 text-primary ring-1 ring-primary/30' : 'bg-primary text-on-primary'
                }`}
              >
                <MaterialIcon name="person" className="text-[18px]" />
              </div>
            </div>
          </header>

          <main className="min-h-screen bg-background px-4 pt-[calc(5.25rem+env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 lg:px-8">
            <Outlet context={outletContext} />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
