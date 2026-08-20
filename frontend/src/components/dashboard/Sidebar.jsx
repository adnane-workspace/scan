import { NavLink } from 'react-router-dom';

const mainLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠', end: true },
  { to: '/dashboard/categories', label: 'Categories', icon: '🏷️' },
  { to: '/dashboard/products', label: 'Products', icon: '🍔' },
];

function navClassName({ isActive }) {
  return `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
    isActive ? 'bg-amber-50 text-amber-800' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
  }`;
}

export default function Sidebar({ cafe, onLogout, onNavigate }) {
  const menuPath = cafe?.slug ? `/menu/${cafe.slug}` : '/menu/cafe';

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b border-slate-200 px-5 py-5">
        <p className="text-lg font-semibold text-slate-900">☕ Digital Menu</p>
        {cafe?.name ? <p className="mt-1 truncate text-sm text-slate-500">{cafe.name}</p> : null}
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        <div className="space-y-1">
          {mainLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={navClassName} onClick={onNavigate}>
              <span aria-hidden="true">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div>
          <div className="mx-3 mb-3 border-t border-slate-200" />
          <NavLink to={menuPath} target="_blank" rel="noreferrer" className={navClassName} onClick={onNavigate}>
            <span aria-hidden="true">📱</span>
            Voir le menu
          </NavLink>
          <NavLink to={menuPath} className={navClassName} onClick={onNavigate}>
            <span aria-hidden="true">🔳</span>
            QR Code
          </NavLink>
        </div>

        <div>
          <div className="mx-3 mb-3 border-t border-slate-200" />
          <NavLink to="/dashboard/settings" className={navClassName} onClick={onNavigate}>
            <span aria-hidden="true">⚙️</span>
            Settings
          </NavLink>
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <span aria-hidden="true">🚪</span>
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
}
