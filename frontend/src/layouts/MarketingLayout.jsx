import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppLink from '../components/common/AppLink.jsx';
import MarketingLink from '../components/common/MarketingLink.jsx';
import BrandLogo from '../components/ui/BrandLogo.jsx';
import LanguageSwitcher from '../components/ui/LanguageSwitcher.jsx';
import MaterialIcon from '../components/ui/MaterialIcon.jsx';
import { useLocale } from '../hooks/useLocale.js';
import { APP_NAME, DEVELOPER_NAME, DEVELOPER_URL } from '../utils/constants.js';
import {
  LANDING_BLOG,
  LANDING_CONTACT,
  LANDING_FEATURES,
  LANDING_HOME,
  LANDING_PRICING,
  LANDING_PRODUCT,
} from '../utils/paths.js';

function navLinkClass(active) {
  return `relative rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors ${
    active
      ? 'text-on-surface after:absolute after:inset-x-2.5 after:bottom-0.5 after:h-px after:bg-on-surface'
      : 'text-on-surface-variant hover:text-on-surface'
  }`;
}

export default function MarketingLayout({ children }) {
  const { t } = useLocale();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = location.pathname;
  const isHome = path === '/';

  const links = [
    { to: LANDING_HOME, label: t('landing.navHome'), match: (value) => value === '/' },
    { to: LANDING_PRODUCT, label: t('landing.navMenuDigital'), match: (value) => value.startsWith('/menu-digital') || value.startsWith('/menu-qr') || value.startsWith('/qr-code') },
    { to: LANDING_FEATURES, label: t('landing.navFeatures'), match: (value) => value.startsWith('/fonctionnalites') || value.startsWith('/dashboard-restaurant') || value.startsWith('/gestion-') || value === '/menu-multilingue' || value === '/statistiques-menu' },
    { to: LANDING_PRICING, label: t('landing.navPricing'), match: (value) => value === '/tarifs' },
    { to: LANDING_BLOG, label: t('landing.navBlog'), match: (value) => value.startsWith('/blog') },
  ];

  useEffect(() => {
    setMenuOpen(false);
  }, [path]);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const overHero = isHome && !scrolled;
  const floating = overHero && !menuOpen;

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-on-surface">
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)]">
        <div
          className={`pointer-events-auto mx-auto max-w-7xl px-3 transition-[padding] duration-300 sm:px-4 lg:px-6 ${
            floating ? 'pt-3 sm:pt-4' : 'pt-0 sm:pt-3'
          }`}
        >
          <div
            className={`transition-[border-radius,box-shadow,background-color,border-color] duration-300 ${
              overHero
                ? 'rounded-2xl border border-white/15 bg-[#0d1b2a]/55 shadow-[0_12px_40px_rgba(13,27,42,0.28)] backdrop-blur-xl'
                : 'rounded-none border-b border-outline-variant/25 bg-surface/90 shadow-sm backdrop-blur-xl sm:rounded-2xl sm:border sm:border-outline-variant/30 sm:bg-surface/95 sm:shadow-[0_8px_30px_rgba(13,27,42,0.06)]'
            }`}
          >
            <div className="flex h-14 items-center justify-between gap-3 px-3 sm:h-16 sm:px-5 lg:px-6">
              <MarketingLink
                to="/"
                className="relative z-20 flex min-w-0 shrink items-center"
                aria-label={APP_NAME}
                onClick={() => {
                  if (path === '/') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
              >
                <BrandLogo onDark={overHero} className="h-7 max-w-[10rem] sm:h-8 sm:max-w-[12rem]" />
              </MarketingLink>

              <nav className="hidden items-center gap-0.5 lg:flex">
                {links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={
                      overHero
                        ? `relative rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors ${
                            link.match(path)
                              ? 'text-[#e0e1dd] after:absolute after:inset-x-2.5 after:bottom-0.5 after:h-px after:bg-[#e0e1dd]'
                              : 'text-[#e0e1dd]/70 hover:text-[#e0e1dd]'
                          }`
                        : navLinkClass(link.match(path))
                    }
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <LanguageSwitcher compact onDark={overHero} className="hidden md:inline-flex" />
                <AppLink
                  to="/login"
                  className={`hidden items-center rounded-xl px-3 py-2 text-sm font-medium transition-colors sm:inline-flex ${
                    overHero
                      ? 'text-[#e0e1dd]/85 hover:bg-white/10 hover:text-[#e0e1dd]'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  {t('landing.ctaLogin')}
                </AppLink>
                <AppLink
                  to="/essai"
                  className={`inline-flex h-9 items-center rounded-xl px-3.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 sm:h-10 sm:px-4 ${
                    overHero
                      ? 'bg-[#e0e1dd] text-[#0d1b2a] hover:bg-white'
                      : 'bg-primary text-on-primary hover:bg-primary-hover'
                  }`}
                >
                  {t('landing.ctaTrial')}
                </AppLink>
                <button
                  type="button"
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-xl transition-colors lg:hidden ${
                    overHero
                      ? 'text-[#e0e1dd] hover:bg-white/10'
                      : 'text-on-surface hover:bg-surface-container'
                  }`}
                  aria-label={t('common.openMenu')}
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((open) => !open)}
                >
                  <MaterialIcon name={menuOpen ? 'close' : 'menu'} />
                </button>
              </div>
            </div>

            {menuOpen ? (
              <div
                className={`border-t px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden ${
                  overHero ? 'border-white/10' : 'border-outline-variant/25'
                }`}
              >
                <nav className="flex flex-col gap-0.5">
                  {links.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`rounded-xl px-3 py-2.5 text-sm font-medium ${
                        overHero
                          ? link.match(path)
                            ? 'bg-white/10 text-[#e0e1dd]'
                            : 'text-[#e0e1dd]/80 hover:bg-white/5'
                          : link.match(path)
                            ? 'bg-surface-container text-on-surface'
                            : 'text-on-surface-variant hover:bg-surface-container/70 hover:text-on-surface'
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    to={LANDING_CONTACT}
                    className={`rounded-xl px-3 py-2.5 text-sm font-medium ${
                      overHero
                        ? 'text-[#e0e1dd]/80 hover:bg-white/5'
                        : 'text-on-surface-variant hover:bg-surface-container/70 hover:text-on-surface'
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {t('landing.navContact')}
                  </Link>
                  <div className="px-1 py-2 md:hidden">
                    <LanguageSwitcher compact onDark={overHero} />
                  </div>
                  <AppLink
                    to="/login"
                    className={`rounded-xl px-3 py-2.5 text-sm font-medium sm:hidden ${
                      overHero ? 'text-[#e0e1dd]/80' : 'text-on-surface-variant'
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {t('auth.loginTitle')}
                  </AppLink>
                </nav>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div
        className={
          isHome
            ? ''
            : 'pt-[calc(3.5rem+env(safe-area-inset-top))] sm:pt-[calc(5.5rem+env(safe-area-inset-top))]'
        }
      >
        {children}
      </div>

      <footer className="bg-surface-container-high pt-12 pb-[max(2rem,env(safe-area-inset-bottom))] sm:pt-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:gap-12 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div className="sm:col-span-2 md:col-span-1">
              <div className="mb-6">
                <MarketingLink to="/" aria-label={APP_NAME} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  <BrandLogo className="h-8" />
                </MarketingLink>
              </div>
              <p className="max-w-sm text-on-surface-variant">{t('landing.footerBlurb')}</p>
            </div>
            <div>
              <h4 className="mb-6 text-sm font-semibold tracking-wide text-on-surface uppercase">{t('landing.footerProduct')}</h4>
              <ul className="flex flex-col gap-4 text-on-surface-variant">
                <li>
                  <Link to={LANDING_PRODUCT} className="hover:text-primary">
                    {t('landing.navMenuDigital')}
                  </Link>
                </li>
                <li>
                  <Link to="/menu-qr-code" className="hover:text-primary">
                    {t('landing.navQrMenu')}
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard-restaurant" className="hover:text-primary">
                    {t('landing.navDashboard')}
                  </Link>
                </li>
                <li>
                  <Link to={LANDING_PRICING} className="hover:text-primary">
                    {t('landing.navPricing')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-6 text-sm font-semibold tracking-wide text-on-surface uppercase">{t('landing.footerResources')}</h4>
              <ul className="flex flex-col gap-4 text-on-surface-variant">
                <li>
                  <Link to={LANDING_FEATURES} className="hover:text-primary">
                    {t('landing.navFeatures')}
                  </Link>
                </li>
                <li>
                  <Link to={LANDING_BLOG} className="hover:text-primary">
                    {t('landing.navBlog')}
                  </Link>
                </li>
                <li>
                  <Link to="/maroc/menu-digital" className="hover:text-primary">
                    {t('landing.navMorocco')}
                  </Link>
                </li>
                <li>
                  <Link to={LANDING_CONTACT} className="hover:text-primary">
                    {t('landing.navContact')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-6 text-sm font-semibold tracking-wide text-on-surface uppercase">{t('landing.footerContact')}</h4>
              <ul className="flex flex-col gap-4 text-on-surface-variant">
                <li className="flex items-center gap-2">
                  <MaterialIcon name="alternate_email" className="text-[18px]" />
                  <a href={DEVELOPER_URL} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                    {t('landing.contactMe')}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MaterialIcon name="login" className="text-[18px]" />
                  <AppLink to="/login" className="hover:text-primary">
                    {t('auth.loginTitle')}
                  </AppLink>
                </li>
                <li className="flex items-center gap-2">
                  <MaterialIcon name="person_add" className="text-[18px]" />
                  <AppLink to="/register" className="hover:text-primary">
                    {t('auth.createCafe')}
                  </AppLink>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-outline-variant/30 pt-8 text-center">
            <p className="text-label-md text-on-surface-variant">{t('landing.copyright', { year: new Date().getFullYear(), name: APP_NAME })}</p>
            <p className="mt-3 text-label-md text-on-surface-variant">{t('landing.developedBy')}</p>
            <a
              href={DEVELOPER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-2xl tracking-tight text-primary hover:underline"
            >
              {DEVELOPER_NAME}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
