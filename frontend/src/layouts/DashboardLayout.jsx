import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute.jsx';
import Sidebar from '../components/dashboard/Sidebar.jsx';
import LanguageSwitcher from '../components/ui/LanguageSwitcher.jsx';
import MaterialIcon from '../components/ui/MaterialIcon.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useLocale } from '../hooks/useLocale.js';
import { getDashboardStats } from '../services/dashboard.service.js';
import { listPlatformCafes } from '../services/platform.service.js';

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
  '/dashboard': 'header.dashboard',
  '/dashboard/categories': 'header.categories',
  '/dashboard/products': 'header.products',
  '/dashboard/settings': 'header.settings',
  '/dashboard/cafes': 'header.cafes',
  '/dashboard/cafes/new': 'header.cafeNew',
  '/dashboard/qr-requests': 'header.qrRequests',
  '/dashboard/logs': 'header.logs',
  '/dashboard/storage': 'header.storage',
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
      setError(err.response?.data?.message || t('dashboard.loadError'));
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
      setError(err.response?.data?.message || t('dashboard.loadCafesError'));
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

    if (hasLoadedRef.current && location.pathname !== '/dashboard') {
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

  const cafeName = isSuperAdmin ? t('header.platform') : stats.cafe?.name || 'Digital Menu';
  const qrRequestCount = platformCafes.filter((item) => item.pendingQrChange).length;
  const subtitleKey = headerSubtitleKeys[location.pathname];
  const headerSubtitle = subtitleKey
    ? t(subtitleKey)
    : location.pathname.startsWith('/dashboard/cafes/')
      ? t('header.cafeDetail')
      : isSuperAdmin
        ? t('dashboard.roleSuper')
        : t('header.dashboard');
  const roleLabel = isSuperAdmin ? t('dashboard.roleSuper') : t('dashboard.roleAdmin');

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
          className={`fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-200 lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
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

        <div className="lg:pl-72">
          <header className={`fixed top-0 right-0 left-0 z-40 flex h-[calc(5rem+env(safe-area-inset-top))] items-center justify-between px-4 pt-[env(safe-area-inset-top)] backdrop-blur-xl sm:px-6 lg:left-72 lg:px-container ${
            isSuperAdmin
              ? 'border-b border-white/10 bg-background/80'
              : 'bg-surface/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)]'
          }`}>
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
                <p className="truncate text-headline-md font-semibold tracking-tight text-on-surface">{cafeName}</p>
                <p className="text-label-md font-medium text-on-surface-variant">{headerSubtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <LanguageSwitcher compact />
              <div className="hidden text-right sm:block">
                <div className="text-label-lg font-semibold tracking-[0.05em] text-on-surface">
                  {user?.name || t('dashboard.profile')}
                </div>
                <div className="text-label-md font-medium text-on-surface-variant">
                  {roleLabel}
                </div>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-full shadow-md ${
                isSuperAdmin ? 'bg-primary/15 text-primary ring-1 ring-primary/30' : 'bg-primary'
              }`}>
                <MaterialIcon name="person" className={`text-[20px] ${isSuperAdmin ? 'text-primary' : 'text-on-primary'}`} />
              </div>
            </div>
          </header>

          <main className="min-h-screen bg-background px-4 pt-[calc(6rem+env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 lg:px-container">
            <Outlet context={outletContext} />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
