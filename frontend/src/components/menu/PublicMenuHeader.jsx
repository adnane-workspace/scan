import { Link } from 'react-router-dom';
import { useLocale } from '../../hooks/useLocale.js';
import { getMenuPaths } from '../../utils/hosts.js';
import MaterialIcon from '../ui/MaterialIcon.jsx';
import CloudinaryImage from '../ui/CloudinaryImage.jsx';

export default function PublicMenuHeader({ cafe, slug, backTo, backLabel }) {
  const { t } = useLocale();
  const paths = getMenuPaths(slug);

  return (
    <header className="sticky top-0 z-40 border-b border-[#0d1b2a]/8 bg-[#f7f6f3]/92 pt-[env(safe-area-inset-top)] backdrop-blur-2xl">
      <div className="mx-auto grid h-[3.75rem] max-w-6xl grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-center gap-2 px-4 sm:h-[4.5rem] sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:px-6 lg:px-8">
        <Link
          to={backTo}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#0d1b2a] transition-colors hover:bg-[#0d1b2a]/6 sm:w-auto sm:gap-1.5 sm:px-3"
          aria-label={backLabel}
        >
          <MaterialIcon name="arrow_back" className="text-[22px] rtl:scale-x-[-1]" />
          <span className="hidden text-sm font-medium sm:inline">{backLabel}</span>
        </Link>

        <Link to={paths.home} className="flex min-w-0 justify-center" aria-label={cafe?.name || t('platform.menu')}>
          <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-white/90 px-2.5 py-1.5 ring-1 ring-[#0d1b2a]/8 sm:gap-2.5 sm:px-3">
            {cafe?.logo ? (
              <CloudinaryImage
                src={cafe.logo}
                alt=""
                preset="logo"
                width={40}
                height={40}
                className="h-7 w-7 shrink-0 rounded-full object-cover sm:h-8 sm:w-8"
              />
            ) : (
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0d1b2a] text-sm font-semibold text-[#e0e1dd] sm:h-8 sm:w-8">
                {(cafe?.name || '?').slice(0, 1)}
              </span>
            )}
            <span className="min-w-0 truncate text-sm font-semibold tracking-tight text-[#0d1b2a] sm:text-[0.95rem]">
              {cafe?.name || t('platform.menu')}
            </span>
          </span>
        </Link>

        <span className="hidden w-10 sm:block" aria-hidden />
      </div>
    </header>
  );
}
