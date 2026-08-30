import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import MaterialIcon from '../components/ui/MaterialIcon.jsx';
import CloudinaryImage from '../components/ui/CloudinaryImage.jsx';
import DocumentHead from '../components/seo/DocumentHead.jsx';
import { useMenuSlug } from '../context/MenuSlugContext.jsx';
import { countPublicProducts, setPageMeta, usePublicMenu } from '../hooks/usePublicMenu.js';
import { restaurantJsonLd } from '../utils/seoJsonLd.js';
import PublicMenuFrame from '../components/menu/PublicMenuFrame.jsx';
import { useLocale } from '../hooks/useLocale.js';
import { getMenuPaths } from '../utils/hosts.js';
import { hasCoordinates, mapsHref } from '../utils/location.js';
import { normalizeMenuUi, resolveMenuBackdrop } from '../utils/menuUi.js';

function telHref(phone) {
  return `tel:${String(phone).replace(/[^\d+]/g, '')}`;
}

function useLockPageScroll() {
  useEffect(() => {
    const html = document.documentElement;
    const { body } = document;
    const previousHtml = html.style.overflow;
    const previousBody = body.style.overflow;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    return () => {
      html.style.overflow = previousHtml;
      body.style.overflow = previousBody;
    };
  }, []);
}

function LandingShell({ cafe, children, className = '' }) {
  useLockPageScroll();

  return (
    <PublicMenuFrame cafe={cafe} className="fixed inset-0 z-10 flex h-dvh max-h-dvh flex-col overflow-hidden overscroll-none">
      <div className={`relative flex h-full min-h-0 flex-col ${className}`}>{children}</div>
    </PublicMenuFrame>
  );
}

function LandingStatus({ title, message, cafe }) {
  return (
    <LandingShell cafe={cafe} className="items-center justify-center">
      <div className="px-6 text-center">
        <h1 className="font-display text-2xl font-semibold text-on-surface">{title}</h1>
        <p className="mt-2 max-w-md text-sm text-on-surface-variant">{message}</p>
      </div>
    </LandingShell>
  );
}

export default function PublicMenuLandingPage() {
  const slug = useMenuSlug();
  const { t } = useLocale();
  const { menu, loading, errorStatus } = usePublicMenu(slug);
  const paths = getMenuPaths(slug);

  const productCount = countPublicProducts(menu?.categories);
  const indexable = Boolean(menu?.cafe && productCount > 0);

  useEffect(() => {
    if (menu?.cafe) {
      setPageMeta({
        title: menu.cafe.name,
        description: menu.cafe.description || t('menu.welcome', { name: menu.cafe.name }),
        robots: indexable ? 'index,follow' : 'noindex,follow',
      });
      return;
    }

    if (errorStatus) {
      setPageMeta({
        title: t('menu.missingTitle'),
        description: t('menu.missing'),
        robots: 'noindex,follow',
      });
    }
  }, [menu, errorStatus, indexable, t]);

  if (loading) {
    return (
      <LandingShell className="items-center justify-center">
        <div className="h-20 w-20 animate-pulse rounded-full bg-on-surface/10" />
      </LandingShell>
    );
  }

  if (errorStatus === 403) {
    return <LandingStatus title={t('menu.unavailableTitle')} message={t('menu.unavailable')} />;
  }

  if (errorStatus && errorStatus !== 404) {
    return <LandingStatus title={t('menu.loadErrorTitle')} message={t('menu.loadError')} />;
  }

  if (errorStatus || !menu?.cafe) {
    return <LandingStatus title={t('menu.missingTitle')} message={t('menu.missing')} />;
  }

  const { cafe } = menu;
  const ui = normalizeMenuUi(cafe.menuUi);
  const isDark = ui.theme === 'dark';
  const backdrop = resolveMenuBackdrop(cafe);
  const located = Boolean(cafe.address || hasCoordinates(cafe));
  const showAddress = ui.showAddress && located;
  const showPhone = ui.showPhone && Boolean(cafe.phone);

  return (
    <LandingShell cafe={cafe}>
      <DocumentHead
        title={`${cafe.name}`}
        description={cafe.description || t('menu.welcome', { name: cafe.name })}
        path={paths.home}
        robots={indexable ? 'index,follow' : 'noindex,follow'}
        jsonLd={indexable ? restaurantJsonLd(cafe, slug) : undefined}
      />
      {backdrop.image ? (
        <CloudinaryImage
          src={backdrop.image}
          alt=""
          preset="cover"
          fetchPriority="high"
          className={`pointer-events-none absolute inset-0 h-full w-full object-cover ${
            backdrop.blur ? 'scale-125 blur-2xl' : ''
          }`}
        />
      ) : backdrop.color ? (
        <div className="pointer-events-none absolute inset-0" style={{ background: backdrop.color }} />
      ) : null}
      <div className={`pointer-events-none absolute inset-0 ${isDark ? 'bg-black/35' : 'bg-background/25'}`} />
      <div
        className={`pointer-events-none absolute inset-0 ${
          isDark
            ? 'bg-gradient-to-t from-black/90 via-black/40 to-black/25'
            : 'bg-gradient-to-t from-background via-background/70 to-background/20'
        }`}
      />

      <div className="relative z-10 mx-auto flex h-full min-h-0 w-full max-w-lg flex-col justify-end px-4 pt-16 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center min-[480px]:px-6 sm:max-w-xl sm:justify-center sm:px-8 sm:py-16">
        <div className="flex min-h-0 w-full shrink flex-col items-center">
          {cafe.logo ? (
            <CloudinaryImage
              src={cafe.logo}
              alt=""
              preset="logoHero"
              width={144}
              height={144}
              className="h-[clamp(3.5rem,18vmin,9rem)] w-[clamp(3.5rem,18vmin,9rem)] shrink-0 rounded-full object-cover ring-4 ring-on-surface/80"
            />
          ) : (
            <div className="flex h-[clamp(3.5rem,18vmin,9rem)] w-[clamp(3.5rem,18vmin,9rem)] shrink-0 items-center justify-center rounded-full bg-on-surface/15 font-display text-[clamp(1.25rem,6vmin,2.5rem)] font-semibold ring-4 ring-on-surface/40">
              {cafe.name.slice(0, 1)}
            </div>
          )}

          <h1 className="mt-[clamp(0.5rem,2.5vmin,1.5rem)] max-w-full shrink-0 line-clamp-2 break-words text-balance font-display text-[clamp(1.5rem,7vmin,3.5rem)] leading-tight font-semibold tracking-tight drop-shadow-sm">
            {cafe.name}
          </h1>

          {cafe.description ? (
            <p className="mt-2 hidden max-w-md shrink-0 line-clamp-2 text-sm leading-relaxed text-on-surface/80 min-[520px]:block max-h-[500px]:hidden sm:text-base">
              {cafe.description}
            </p>
          ) : null}

          {showAddress || showPhone ? (
            <div className="mt-[clamp(0.5rem,2vmin,1.5rem)] flex w-full max-w-md shrink-0 flex-col items-center gap-2">
              {showAddress ? (
                <a
                  href={mapsHref(cafe)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center gap-2 rounded-full bg-on-surface/15 px-3.5 py-2 text-start text-sm text-on-surface/90 ring-1 ring-on-surface/20 backdrop-blur-md hover:bg-on-surface/25 sm:w-auto sm:max-w-full sm:px-4"
                >
                  <MaterialIcon name="location_on" className="shrink-0 text-[18px]" />
                  <span className="min-w-0 truncate">
                    {cafe.address || t('menu.directions')}
                  </span>
                </a>
              ) : null}
              {showPhone ? (
                <a
                  href={telHref(cafe.phone)}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full bg-on-surface/10 px-4 py-1.5 text-sm text-on-surface/85 ring-1 ring-on-surface/15 backdrop-blur-md hover:bg-on-surface/20"
                >
                  <MaterialIcon name="call" className="text-[18px]" />
                  {cafe.phone}
                </a>
              ) : null}
            </div>
          ) : null}

          <Link
            to={paths.categories}
            className="mt-[clamp(0.75rem,3vmin,2rem)] inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-label-lg font-semibold tracking-[0.05em] text-on-primary transition-transform hover:bg-primary-hover active:scale-[0.98] sm:w-auto sm:min-w-56"
          >
            {t('menu.viewMenu')}
            <MaterialIcon name="arrow_forward" className="text-[20px]" />
          </Link>
        </div>
      </div>
    </LandingShell>
  );
}
