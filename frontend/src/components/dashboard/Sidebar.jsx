import { NavLink } from 'react-router-dom';
import MaterialIcon from '../ui/MaterialIcon.jsx';

const mainLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: 'home', end: true },
  { to: '/dashboard/categories', label: 'Catégories', icon: 'grid_view' },
  { to: '/dashboard/products', label: 'Produits', icon: 'lunch_dining' },
  { to: '/dashboard/settings', label: 'Paramètres', icon: 'settings' },
];

function navClassName({ isActive }) {
  return `flex items-center rounded-xl px-4 py-3 text-label-lg font-semibold tracking-[0.05em] transition-all ${
    isActive
      ? 'bg-primary-container font-bold text-on-primary-container'
      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
  }`;
}

export default function Sidebar({ cafe, onLogout, onNavigate }) {
  const menuPath = cafe?.slug ? `/menu/${cafe.slug}` : '/menu/cafe';

  return (
    <div className="flex h-full flex-col bg-surface-container-low pt-stack-lg pb-stack-lg shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="mb-stack-lg flex items-center gap-2 px-gutter">
        <MaterialIcon name="restaurant_menu" className="text-3xl text-primary" />
        <span className="font-display text-headline-lg tracking-tight text-primary">Epicurean</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4">
        {mainLinks.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end} className={navClassName} onClick={onNavigate}>
            <MaterialIcon name={link.icon} className="mr-3" />
            {link.label}
          </NavLink>
        ))}

        <div className="mt-4 border-t border-outline-variant/30 pt-4">
          <NavLink
            to={menuPath}
            target="_blank"
            rel="noreferrer"
            className="flex items-center rounded-xl px-4 py-3 text-label-lg font-semibold tracking-[0.05em] text-on-surface-variant transition-all hover:bg-surface-container-high hover:text-on-surface"
            onClick={onNavigate}
          >
            <MaterialIcon name="open_in_new" className="mr-3" />
            Voir mon menu
          </NavLink>
        </div>
      </nav>

      <div className="px-4">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center rounded-xl px-4 py-3 text-left text-label-lg font-semibold tracking-[0.05em] text-on-surface-variant transition-all hover:bg-surface-container-high hover:text-on-surface"
        >
          <MaterialIcon name="logout" className="mr-3" />
          Déconnexion
        </button>
      </div>
    </div>
  );
}
