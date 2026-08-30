import { useState } from 'react';
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
  return `text-label-lg font-semibold tracking-[0.05em] uppercase ${
    active ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
  }`;
}

export default function MarketingLayout({ children }) {
  const { t } = useLocale();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const path = location.pathname;

  const links = [
    { to: LANDING_HOME, label: t('landing.navHome'), match: (value) => value === '/' },
    { to: LANDING_PRODUCT, label: t('landing.navMenuDigital'), match: (value) => value.startsWith('/menu-digital') || value.startsWith('/menu-qr') || value.startsWith('/qr-code') },
    { to: LANDING_FEATURES, label: t('landing.navFeatures'), match: (value) => value.startsWith('/fonctionnalites') || value.startsWith('/dashboard-restaurant') || value.startsWith('/gestion-') || value === '/menu-multilingue' || value === '/statistiques-menu' },
    { to: LANDING_PRICING, label: t('landing.navPricing'), match: (value) => value === '/tarifs' },
    { to: LANDING_BLOG, label: t('landing.navBlog'), match: (value) => value.startsWith('/blog') },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-on-surface">
      <header className="fixed top-0 z-50 w-full border-b border-outline-variant/20 bg-surface/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6 lg:px-10">
          <MarketingLink
            to="/"
            className="relative z-20 flex min-w-0 shrink items-center"
            aria-label={APP_NAME}
            onClick={() => {
              if (path === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }

              setMenuOpen(false);
            }}
          >
            <BrandLogo className="h-8 max-w-[11rem] sm:h-10 sm:max-w-[14rem]" />
          </MarketingLink>

          <nav className="hidden items-center gap-5 xl:flex xl:gap-7">
            {links.map((link) => (
              <Link key={link.to} to={link.to} className={navLinkClass(link.match(path))}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <LanguageSwitcher compact className="hidden md:inline-flex" />
            <AppLink
              to="/essai"
              className="hidden h-10 items-center rounded-xl bg-primary px-4 text-label-lg font-semibold tracking-[0.05em] text-on-primary shadow-md transition-colors hover:bg-primary-hover md:inline-flex lg:px-5"
            >
              {t('landing.ctaTrial')}
            </AppLink>
            <AppLink
              to="/login"
              className="inline-flex h-10 w-10 items-center justify-center gap-2 rounded-xl bg-primary text-on-primary shadow-md transition-colors hover:bg-primary-hover md:w-auto md:px-4 lg:px-5"
              aria-label={t('auth.loginTitle')}
            >
              <MaterialIcon name="person" className="text-[18px]" />
              <span className="hidden text-label-lg font-semibold tracking-[0.05em] md:inline">{t('landing.ctaLogin')}</span>
            </AppLink>
            <button
              type="button"
              className="rounded-xl p-2 text-on-surface xl:hidden"
              aria-label={t('common.openMenu')}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <MaterialIcon name={menuOpen ? 'close' : 'menu'} />
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div className="border-t border-outline-variant/20 bg-surface px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] xl:hidden">
            <nav className="flex flex-col gap-1">
              {links.map((link) => (
                <Link key={link.to} to={link.to} className="py-2.5 font-semibold text-on-surface" onClick={() => setMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <Link to={LANDING_CONTACT} className="py-2.5 font-semibold text-on-surface" onClick={() => setMenuOpen(false)}>
                {t('landing.navContact')}
              </Link>
              <div className="py-2 md:hidden">
                <LanguageSwitcher compact />
              </div>
              <AppLink to="/login" className="py-2.5 font-semibold text-on-surface md:hidden" onClick={() => setMenuOpen(false)}>
                {t('auth.loginTitle')}
              </AppLink>
              <AppLink to="/essai" className="mt-1 rounded-xl bg-primary px-4 py-3 text-center font-semibold text-on-primary md:hidden" onClick={() => setMenuOpen(false)}>
                {t('landing.ctaTrial')}
              </AppLink>
            </nav>
          </div>
        ) : null}
      </header>

      <div className="pt-[calc(4rem+env(safe-area-inset-top))] sm:pt-[calc(5rem+env(safe-area-inset-top))]">{children}</div>

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
              <h4 className="mb-6 text-label-lg font-semibold tracking-[0.05em] text-on-surface uppercase">{t('landing.footerProduct')}</h4>
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
              <h4 className="mb-6 text-label-lg font-semibold tracking-[0.05em] text-on-surface uppercase">{t('landing.footerResources')}</h4>
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
              <h4 className="mb-6 text-label-lg font-semibold tracking-[0.05em] text-on-surface uppercase">{t('landing.footerContact')}</h4>
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
              className="mt-1 inline-block font-display text-2xl tracking-tight text-primary hover:underline"
            >
              {DEVELOPER_NAME}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
