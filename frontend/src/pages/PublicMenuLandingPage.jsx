import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import LanguageSwitcher from '../components/ui/LanguageSwitcher.jsx';
import MaterialIcon from '../components/ui/MaterialIcon.jsx';
import { setPageMeta, usePublicMenu } from '../hooks/usePublicMenu.js';
import { useLocale } from '../hooks/useLocale.js';
import { hasCoordinates, mapsHref } from '../utils/location.js';

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

function LandingShell({ children, className = '' }) {
  useLockPageScroll();

  return (
    <div
      className={`fixed inset-0 z-10 flex h-dvh max-h-dvh flex-col overflow-hidden overscroll-none bg-[#1a120e] text-white ${className}`}
    >
      {children}
    </div>
  );
}

function LandingStatus({ title, message }) {
  return (
    <LandingShell className="items-center justify-center">
      <div className="px-6 text-center">
        <h1 className="font-display text-2xl font-semibold text-white">{title}</h1>
        <p className="mt-2 max-w-md text-sm text-white/70">{message}</p>
      </div>
    </LandingShell>
  );
}

export default function PublicMenuLandingPage() {
  const { slug } = useParams();
  const { t } = useLocale();
  const { menu, loading, errorStatus } = usePublicMenu(slug);

  useEffect(() => {
    if (menu?.cafe) {
      setPageMeta({
        title: menu.cafe.name,
        description: menu.cafe.description || t('menu.welcome', { name: menu.cafe.name }),
      });
      return;
    }

    if (errorStatus) {
      setPageMeta({
        title: t('menu.missingTitle'),
        description: t('menu.missing'),
      });
    }
  }, [menu, errorStatus, t]);

  if (loading) {
    return (
      <LandingShell className="items-center justify-center">
        <div className="h-20 w-20 animate-pulse rounded-full bg-white/10" />
      </LandingShell>
    );
  }

  if (errorStatus === 403) {
    return <LandingStatus title={t('menu.unavailableTitle')} message={t('menu.unavailable')} />;
  }

  if (errorStatus || !menu?.cafe) {
    return <LandingStatus title={t('menu.missingTitle')} message={t('menu.missing')} />;
  }

  const { cafe } = menu;
  const cover = cafe.cover || '';
  const backdrop = cover || cafe.logo || '';
  const backdropIsLogo = !cover && Boolean(cafe.logo);
  const located = Boolean(cafe.address || hasCoordinates(cafe));

  return (
    <LandingShell>
      {backdrop ? (
        <img
          src={backdrop}
          alt=""
          className={`pointer-events-none absolute inset-0 h-full w-full object-cover ${
            backdropIsLogo ? 'scale-125 blur-2xl' : ''
          }`}
        />
      ) : null}
      <div className="pointer-events-none absolute inset-0 bg-black/35" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/25" />

      <div className="absolute top-0 end-0 z-20 pt-[max(0.75rem,env(safe-area-inset-top))] pe-[max(1rem,env(safe-area-inset-right))]">
        <LanguageSwitcher onDark />
      </div>

      <div className="relative z-10 mx-auto flex h-full min-h-0 w-full max-w-lg flex-col justify-end px-4 pt-16 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center min-[480px]:px-6 sm:max-w-xl sm:justify-center sm:px-8 sm:py-16">
        <div className="flex min-h-0 w-full shrink flex-col items-center">
          {cafe.logo ? (
            <img
              src={cafe.logo}
              alt=""
              className="h-[clamp(3.5rem,18vmin,9rem)] w-[clamp(3.5rem,18vmin,9rem)] shrink-0 rounded-full object-cover ring-4 ring-white/80"
            />
          ) : (
            <div className="flex h-[clamp(3.5rem,18vmin,9rem)] w-[clamp(3.5rem,18vmin,9rem)] shrink-0 items-center justify-center rounded-full bg-white/15 font-display text-[clamp(1.25rem,6vmin,2.5rem)] font-semibold ring-4 ring-white/40">
              {cafe.name.slice(0, 1)}
            </div>
          )}

          <h1 className="mt-[clamp(0.5rem,2.5vmin,1.5rem)] max-w-full shrink-0 line-clamp-2 break-words text-balance font-display text-[clamp(1.5rem,7vmin,3.5rem)] leading-tight font-semibold tracking-tight drop-shadow-sm">
            {cafe.name}
          </h1>

          {cafe.description ? (
            <p className="mt-2 hidden max-w-md shrink-0 line-clamp-2 text-sm leading-relaxed text-white/80 min-[520px]:block max-h-[500px]:hidden sm:text-base">
              {cafe.description}
            </p>
          ) : null}

          {located || cafe.phone ? (
            <div className="mt-[clamp(0.5rem,2vmin,1.5rem)] flex w-full max-w-md shrink-0 flex-col items-center gap-2">
              {located ? (
                <a
                  href={mapsHref(cafe)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center gap-2 rounded-full bg-white/15 px-3.5 py-2 text-start text-sm text-white/90 ring-1 ring-white/20 backdrop-blur-md hover:bg-white/25 sm:w-auto sm:max-w-full sm:px-4"
                >
                  <MaterialIcon name="location_on" className="shrink-0 text-[18px]" />
                  <span className="min-w-0 truncate">
                    {cafe.address || t('menu.directions')}
                  </span>
                </a>
              ) : null}
              {cafe.phone ? (
                <a
                  href={telHref(cafe.phone)}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/85 ring-1 ring-white/15 backdrop-blur-md hover:bg-white/20"
                >
                  <MaterialIcon name="call" className="text-[18px]" />
                  {cafe.phone}
                </a>
              ) : null}
            </div>
          ) : null}

          <Link
            to={`/menu/${slug}/categories`}
            className="mt-[clamp(0.75rem,3vmin,2rem)] inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-label-lg font-semibold tracking-[0.05em] text-[#1a120e] transition-transform hover:bg-white/90 active:scale-[0.98] sm:w-auto sm:min-w-56"
          >
            {t('menu.viewMenu')}
            <MaterialIcon name="arrow_forward" className="text-[20px]" />
          </Link>
        </div>
      </div>
    </LandingShell>
  );
}
