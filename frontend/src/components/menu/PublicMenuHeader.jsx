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
    <header className="sticky top-0 z-40 border-b border-outline-variant/20 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-3 sm:h-[4.25rem] sm:px-6 lg:px-8">
        <Link
          to={backTo}
          className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1 rounded-xl px-2 text-on-surface hover:bg-surface-container-high"
        >
          <MaterialIcon name="arrow_back" className="text-[22px]" />
          <span className="hidden pr-1 text-sm font-semibold sm:inline">{backLabel}</span>
          <span className="sr-only sm:hidden">{backLabel}</span>
        </Link>

        <Link
          to={paths.home}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-1 py-1 hover:bg-surface-container-high"
        >
          {cafe?.logo ? (
            <CloudinaryImage
              src={cafe.logo}
              alt=""
              preset="logo"
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container-high font-display text-lg font-semibold text-primary">
              {(cafe?.name || '?').slice(0, 1)}
            </div>
          )}
          <span className="truncate font-display text-lg font-semibold tracking-tight text-on-surface sm:text-xl">
            {cafe?.name || t('platform.menu')}
          </span>
        </Link>
        {ui.showLanguage ? <LanguageSwitcher compact /> : null}
      </div>
    </header>
  );
}
