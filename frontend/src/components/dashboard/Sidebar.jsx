import { NavLink } from 'react-router-dom';
import { useLocale } from '../../hooks/useLocale.js';
import MaterialIcon from '../ui/MaterialIcon.jsx';

function navClassName(isSuperAdmin) {
  return ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-200 ${
      isActive
        ? isSuperAdmin
          ? 'bg-primary/15 font-semibold text-primary'
          : 'bg-primary font-semibold text-on-primary'
        : isSuperAdmin
          ? 'text-zinc-400 hover:bg-white/5 hover:text-white'
          : 'text-[#5F625E] hover:bg-[#F0E6D8] hover:text-on-surface'
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
      className={`flex h-full flex-col ${
        isSuperAdmin
          ? 'border-e border-white/10 bg-[#08080a]'
          : 'border-e border-outline-variant bg-sidebar'
      }`}
    >
      <div className="flex items-center gap-3 px-5 pt-7 pb-6">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            isSuperAdmin ? 'bg-primary/15 text-primary' : 'bg-primary/10 text-primary'
          }`}
        >
          <MaterialIcon name="restaurant_menu" className="text-[22px]" />
        </span>
        <div className="min-w-0">
          <span className={`block font-display text-xl tracking-tight ${isSuperAdmin ? 'text-white' : 'text-on-surface'}`}>
            Epicurean
          </span>
          {isSuperAdmin ? (
            <span className="text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">{t('header.platform')}</span>
          ) : (
            <span className="truncate text-xs text-on-surface-variant">{cafe?.name || t('auth.digitalMenu')}</span>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={navClassName(isSuperAdmin)}
            onClick={onNavigate}
          >
            <MaterialIcon name={link.icon} className="text-[20px]" />
            <span className="flex-1">{link.label}</span>
            {link.badge ? (
              <span className="rounded-full bg-black/10 px-2 py-0.5 text-[11px] font-bold">
                {link.badge}
              </span>
            ) : null}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-3 pb-5">
        {menuPath ? (
          <div className="mb-3 border-t border-outline-variant pt-4">
            <NavLink
              to={menuPath}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-200 ${
                isSuperAdmin
                  ? 'text-zinc-400 hover:bg-white/5 hover:text-white'
                  : 'text-[#5F625E] hover:bg-[#F0E6D8] hover:text-on-surface'
              }`}
              onClick={onNavigate}
            >
              <MaterialIcon name="open_in_new" className="text-[20px]" />
              {t('nav.viewMenu')}
            </NavLink>
          </div>
        ) : (
          <div className="mb-3 border-t border-outline-variant pt-4" />
        )}
        <button
          type="button"
          onClick={onLogout}
          className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-start text-sm font-medium transition-colors duration-200 ${
            isSuperAdmin
              ? 'text-zinc-400 hover:bg-white/5 hover:text-white'
              : 'text-[#5F625E] hover:bg-[#F0E6D8] hover:text-on-surface'
          }`}
        >
          <MaterialIcon name="logout" className="text-[20px]" />
          {t('nav.logout')}
        </button>
      </div>
    </div>
  );
}
