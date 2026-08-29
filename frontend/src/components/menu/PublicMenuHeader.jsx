import { Link } from 'react-router-dom';
import { useLocale } from '../../hooks/useLocale.js';
import { getMenuPaths } from '../../utils/hosts.js';
import { normalizeMenuUi } from '../../utils/menuUi.js';
import LanguageSwitcher from '../ui/LanguageSwitcher.jsx';
import MaterialIcon from '../ui/MaterialIcon.jsx';
import CloudinaryImage from '../ui/CloudinaryImage.jsx';

export default function PublicMenuHeader({ cafe, slug, backTo, backLabel }) {
  const { t } = useLocale();
  const paths = getMenuPaths(slug);
  const ui = normalizeMenuUi(cafe?.menuUi);

  return (
    <header className="sticky top-0 z-40 border-b border-outline-variant/15 bg-background/92 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <div className="mx-auto grid h-14 max-w-7xl grid-cols-[2.75rem_minmax(0,1fr)_auto] items-center gap-2 px-3 sm:h-[4.25rem] sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:px-6 lg:px-8">
        <Link
          to={backTo}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-on-surface hover:bg-surface-container sm:w-auto sm:gap-1 sm:rounded-xl sm:px-2"
          aria-label={backLabel}
        >
          <MaterialIcon name="arrow_back" className="text-[22px]" />
          <span className="hidden text-sm font-semibold sm:inline">{backLabel}</span>
        </Link>

        <Link to={paths.home} className="flex min-w-0 justify-center" aria-label={cafe?.name || t('platform.menu')}>
          <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-surface-container px-2 py-1 shadow-sm ring-1 ring-outline-variant/25 sm:gap-2.5 sm:px-3 sm:py-1.5">
            {cafe?.logo ? (
              <CloudinaryImage
                src={cafe.logo}
                alt=""
                preset="logo"
                width={40}
                height={40}
                className="h-7 w-7 shrink-0 rounded-md object-cover sm:h-8 sm:w-8"
              />
            ) : (
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-surface-container-high font-display text-sm font-semibold text-primary sm:h-8 sm:w-8">
                {(cafe?.name || '?').slice(0, 1)}
              </span>
            )}
            <span className="min-w-0 truncate font-display text-sm font-semibold tracking-tight text-on-surface sm:text-base">
              {cafe?.name || t('platform.menu')}
            </span>
          </span>
        </Link>

        {ui.showLanguage ? (
          <LanguageSwitcher compact className="justify-self-end" />
        ) : (
          <span className="w-10" />
        )}
      </div>
    </header>
  );
}
