import { NavLink, Outlet } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute.jsx';

const links = [
  { to: '/dashboard', label: 'Overview', end: true },
  { to: '/dashboard/products', label: 'Products' },
  { to: '/dashboard/categories', label: 'Categories' },
];

export default function DashboardLayout() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <p className="text-lg font-semibold text-slate-900">Digital Menu</p>
            <nav className="flex gap-4">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `text-sm font-medium ${isActive ? 'text-amber-700' : 'text-slate-600 hover:text-slate-900'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-8">
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  );
}
