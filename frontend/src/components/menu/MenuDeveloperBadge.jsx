import { Link } from 'react-router-dom';
import MaterialIcon from '../ui/MaterialIcon.jsx';
import { useLocale } from '../../hooks/useLocale.js';

export default function MenuDeveloperBadge({ to }) {
  const { t } = useLocale();

  return (
    <Link
      to={to}
      className="group inline-flex items-center transition-transform duration-200 hover:scale-[1.04] active:scale-[0.97]"
      aria-label={t('menu.developer.badgeAria')}
    >
      <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.22)] ring-1 ring-[#e8d5a8]/35 transition-shadow duration-200 group-hover:shadow-[0_6px_22px_rgba(0,0,0,0.3)]">
        <MaterialIcon name="priority_high" className="text-[22px] text-[#0d1b2a]" filled />
      </span>
      <span
        className="-ml-3.5 h-8 w-6 rounded-full bg-[#0d1b2a] shadow-[0_4px_14px_rgba(13,27,42,0.38)] transition-all duration-200 group-hover:w-7"
        aria-hidden
      />
    </Link>
  );
}
