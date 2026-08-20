import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute.jsx';
import Sidebar from '../components/dashboard/Sidebar.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { getDashboardStats } from '../services/dashboard.service.js';

const emptyStats = {
  totalProducts: 0,
  totalCategories: 0,
  availableProducts: 0,
  unavailableProducts: 0,
  recentProducts: [],
  categories: [],
  cafe: null,
};

export default function DashboardLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState(emptyStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (hasLoadedRef.current && location.pathname !== '/dashboard') {
      return undefined;
    }

    let cancelled = false;
    setLoading(true);

    getDashboardStats()
      .then((data) => {
        if (!cancelled) {
          setStats(data);
          setError('');
          hasLoadedRef.current = true;
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Impossible de charger le dashboard');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        {isSidebarOpen ? (
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        ) : null}

        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 transition-transform duration-200 lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar cafe={stats.cafe} onLogout={handleLogout} onNavigate={() => setIsSidebarOpen(false)} />
        </aside>

        <div className="lg:pl-72">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <p className="font-semibold text-slate-900">☕ Digital Menu</p>
              <button
                type="button"
                onClick={() => setIsSidebarOpen((open) => !open)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
              >
                Menu
              </button>
            </div>
          </header>
          <main className="px-4 py-6 sm:px-6 lg:px-8">
            <Outlet context={{ stats, loading, error }} />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
