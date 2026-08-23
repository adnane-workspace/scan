import { useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute.jsx';
import Sidebar from '../components/dashboard/Sidebar.jsx';
import MaterialIcon from '../components/ui/MaterialIcon.jsx';
import { useAuth } from '../hooks/useAuth.js';
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

const headerSubtitles = {
  '/dashboard': 'Admin Dashboard',
  '/dashboard/categories': 'Catégories',
  '/dashboard/products': 'Produits',
  '/dashboard/settings': 'Paramètres',
  '/dashboard/cafes': 'Cafés',
  '/dashboard/cafes/new': 'Nouveau café',
};

export default function DashboardLayout() {
  const { logout, user } = useAuth();
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
      setError(err.response?.data?.message || 'Impossible de charger le dashboard');
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

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
      setError(err.response?.data?.message || 'Impossible de charger les cafés');
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isSuperAdmin) {
      loadPlatformCafes();
      return undefined;
    }

    if (hasLoadedRef.current && location.pathname !== '/dashboard') {
      return undefined;
    }

    loadStats();
  }, [isSuperAdmin, location.pathname, loadPlatformCafes, loadStats]);

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  const cafeName = isSuperAdmin ? 'Plateforme' : stats.cafe?.name || 'Digital Menu';
  const headerSubtitle =
    headerSubtitles[location.pathname] ||
    (location.pathname.startsWith('/dashboard/cafes/') ? 'Fiche café' : null) ||
    (isSuperAdmin ? 'Superadmin' : 'Admin Dashboard');
  const roleLabel = isSuperAdmin ? 'Superadmin' : user?.role === 'admin' ? 'Admin' : user?.role || 'Admin';

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-on-surface">
        {isSidebarOpen ? (
          <button
            type="button"
            aria-label="Fermer le menu"
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
            onLogout={handleLogout}
            onNavigate={() => setIsSidebarOpen(false)}
          />
        </aside>

        <div className="lg:pl-72">
          <header className="fixed top-0 right-0 left-0 z-40 flex h-[calc(5rem+env(safe-area-inset-top))] items-center justify-between bg-surface/80 px-4 pt-[env(safe-area-inset-top)] shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl sm:px-6 lg:left-72 lg:px-container">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                className="rounded-xl p-2 text-on-surface-variant hover:bg-surface-container-high lg:hidden"
                onClick={() => setIsSidebarOpen((open) => !open)}
                aria-label="Ouvrir le menu"
              >
                <MaterialIcon name="menu" />
              </button>
              <div className="min-w-0">
                <p className="truncate text-headline-md font-semibold tracking-tight text-on-surface">{cafeName}</p>
                <p className="text-label-md font-medium text-on-surface-variant">{headerSubtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <div className="text-label-lg font-semibold tracking-[0.05em] text-on-surface">
                  {user?.name || 'Admin Profile'}
                </div>
                <div className="text-label-md font-medium text-on-surface-variant">
                  {roleLabel}
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary shadow-md">
                <MaterialIcon name="person" className="text-[20px] text-on-primary" />
              </div>
            </div>
          </header>

          <main className="min-h-screen bg-background px-4 pt-[calc(6rem+env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 lg:px-container">
            <Outlet
              context={{
                stats,
                platformCafes,
                loading,
                error,
                refreshStats: () => loadStats(true),
                refreshCafes: () => loadPlatformCafes(true),
              }}
            />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
