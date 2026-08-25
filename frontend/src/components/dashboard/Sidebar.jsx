import { NavLink } from 'react-router-dom';
import { useLocale } from '../../hooks/useLocale.js';
import MaterialIcon from '../ui/MaterialIcon.jsx';

function navClassName(isSuperAdmin) {
  return ({ isActive }) =>
    `flex items-center rounded-xl px-4 py-3 text-label-lg font-semibold tracking-[0.05em] transition-all ${
      isActive
        ? isSuperAdmin
          ? 'bg-primary/15 font-bold text-primary ring-1 ring-primary/20'
          : 'bg-primary-container font-bold text-on-primary-container'
        : isSuperAdmin
          ? 'text-zinc-400 hover:bg-white/5 hover:text-white'
          : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
    }`;
}

export default function Sidebar({ cafe, role, onLogout, onNavigate, qrRequestCount = 0 }) {
  const { t } = useLocale();
  const isSuperAdmin = role === 'superadmin';
  const links = isSuperAdmin
    ? [
        { to: '/dashboard', label: t('nav.dashboard'), icon: 'home', end: true },
        { to: '/dashboard/cafes', label: t('nav.cafes'), icon: 'storefront' },
        { to: '/dashboard/qr-requests', label: t('nav.qrRequests'), icon: 'qr_code_2', badge: qrRequestCount },
        { to: '/dashboard/logs', label: t('nav.logs'), icon: 'history' },
        { to: '/dashboard/storage', label: t('nav.storage'), icon: 'cloud' },
        { to: '/dashboard/settings', label: t('nav.settings'), icon: 'settings' },
      ]
    : [
        { to: '/dashboard', label: t('nav.dashboard'), icon: 'home', end: true },
        { to: '/dashboard/categories', label: t('nav.categories'), icon: 'grid_view' },
        { to: '/dashboard/products', label: t('nav.products'), icon: 'lunch_dining' },
        { to: '/dashboard/settings', label: t('nav.settings'), icon: 'settings' },
      ];
  const menuPath = cafe?.slug ? `/menu/${cafe.slug}` : '';

  return (
    <div
      className={`flex h-full flex-col pt-stack-lg pb-stack-lg ${
        isSuperAdmin
          ? 'border-e border-white/10 bg-[#08080a]'
          : 'bg-surface-container-low shadow-[0_1px_8px_rgba(0,0,0,0.04)]'
      }`}
    >
      <div className="mb-stack-lg flex items-center gap-3 px-gutter">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            isSuperAdmin ? 'bg-primary/15 text-primary' : 'text-primary'
          }`}
        >
          <MaterialIcon name="restaurant_menu" className="text-2xl" />
        </span>
        <div className="min-w-0">
          <span className={`block font-display text-headline-md tracking-tight ${isSuperAdmin ? 'text-white' : 'text-primary'}`}>
            Epicurean
          </span>
          {isSuperAdmin ? (
            <span className="text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">{t('header.platform')}</span>
          ) : null}
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={navClassName(isSuperAdmin)}
            onClick={onNavigate}
          >
            <MaterialIcon name={link.icon} className="me-3" />
            <span className="flex-1">{link.label}</span>
            {link.badge ? (
              <span className="ms-2 rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-on-primary">
                {link.badge}
              </span>
            ) : null}
          </NavLink>
        ))}

        {menuPath ? (
          <div className="mt-4 border-t border-outline-variant/30 pt-4">
            <NavLink
              to={menuPath}
              target="_blank"
              rel="noreferrer"
              className="flex items-center rounded-xl px-4 py-3 text-label-lg font-semibold tracking-[0.05em] text-on-surface-variant transition-all hover:bg-surface-container-high hover:text-on-surface"
              onClick={onNavigate}
            >
              <MaterialIcon name="open_in_new" className="me-3" />
              {t('nav.viewMenu')}
            </NavLink>
          </div>
        ) : null}
      </nav>

      <div className="px-4">
        <button
          type="button"
          onClick={onLogout}
          className={`flex w-full items-center rounded-xl px-4 py-3 text-start text-label-lg font-semibold tracking-[0.05em] transition-all ${
            isSuperAdmin
              ? 'text-zinc-400 hover:bg-white/5 hover:text-white'
              : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
          }`}
        >
          <MaterialIcon name="logout" className="me-3" />
          {t('nav.logout')}
        </button>
      </div>
    </div>
  );
}
