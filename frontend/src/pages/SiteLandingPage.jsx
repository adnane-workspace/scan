import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import BrandLogo from '../components/ui/BrandLogo.jsx';
import LanguageSwitcher from '../components/ui/LanguageSwitcher.jsx';
import MaterialIcon from '../components/ui/MaterialIcon.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useLocale } from '../hooks/useLocale.js';
import { APP_NAME, DEVELOPER_NAME, DEVELOPER_URL } from '../utils/constants.js';
import { getHomePath } from '../utils/paths.js';

const FEATURES = [
  { icon: 'flash_on', titleKey: 'landing.featureFastTitle', bodyKey: 'landing.featureFastBody' },
  { icon: 'diamond', titleKey: 'landing.featureDesignTitle', bodyKey: 'landing.featureDesignBody' },
  { icon: 'update', titleKey: 'landing.featureLiveTitle', bodyKey: 'landing.featureLiveBody' },
];

export default function SiteLandingPage() {
  const { isAuthenticated, isReady, user } = useAuth();
  const { t } = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.title = APP_NAME;
  }, []);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-on-surface-variant">{t('common.loading')}</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={getHomePath(user)} replace />;
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <header className="fixed top-0 z-50 w-full border-b border-outline-variant/20 bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
          <Link to="/" className="flex min-w-0 items-center" aria-label={APP_NAME}>
            <BrandLogo className="h-10" />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#accueil" className="text-label-lg font-semibold tracking-[0.05em] text-primary uppercase">
              {t('landing.navHome')}
            </a>
            <a href="#fonctionnalites" className="text-label-lg font-semibold tracking-[0.05em] text-on-surface-variant uppercase hover:text-primary">
              {t('landing.navFeatures')}
            </a>
            <a href="#produit" className="text-label-lg font-semibold tracking-[0.05em] text-on-surface-variant uppercase hover:text-primary">
              {t('landing.navProduct')}
            </a>
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <LanguageSwitcher compact className="hidden sm:inline-flex" />
            <Link
              to="/register"
              className="hidden rounded-xl bg-primary px-5 py-2.5 text-label-lg font-semibold tracking-[0.05em] text-on-primary shadow-md transition-colors hover:bg-primary-hover sm:inline-flex"
            >
              {t('landing.ctaTrial')}
            </Link>
            <Link
              to="/login"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-on-primary"
              aria-label={t('auth.loginTitle')}
            >
              <MaterialIcon name="person" className="text-[18px]" />
            </Link>
            <button
              type="button"
              className="rounded-xl p-2 text-on-surface md:hidden"
              aria-label={t('common.openMenu')}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <MaterialIcon name={menuOpen ? 'close' : 'menu'} />
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div className="border-t border-outline-variant/20 bg-surface px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-3">
              <a href="#fonctionnalites" className="py-2 font-semibold text-on-surface" onClick={() => setMenuOpen(false)}>
                {t('landing.navFeatures')}
              </a>
              <a href="#produit" className="py-2 font-semibold text-on-surface" onClick={() => setMenuOpen(false)}>
                {t('landing.navProduct')}
              </a>
              <LanguageSwitcher compact />
              <Link to="/register" className="rounded-xl bg-primary px-4 py-3 text-center font-semibold text-on-primary" onClick={() => setMenuOpen(false)}>
                {t('landing.ctaTrial')}
              </Link>
            </nav>
          </div>
        ) : null}
      </header>

      <main id="accueil" className="pt-20">
        <section className="relative overflow-hidden bg-surface-container-lowest pt-12 pb-32 lg:pt-24 lg:pb-48">
          <div className="absolute inset-0">
            <div
              className="h-full w-full bg-cover bg-center opacity-40 mix-blend-multiply"
              style={{ backgroundImage: 'url(/landing/hero.jpg)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-surface-container-lowest/90 via-surface-container-lowest/60 to-background" />
          </div>
          <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-4 text-center sm:px-6 lg:px-10">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-outline-variant/30 bg-surface-container px-4 py-1.5 shadow-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span className="text-label-md font-medium tracking-wider text-on-surface uppercase">{t('landing.badge')}</span>
            </div>
            <h1 className="mb-6 max-w-4xl font-display text-[1.75rem] leading-tight font-semibold tracking-tight text-on-surface sm:text-4xl lg:text-5xl">
              {t('landing.heroTitle')} <span className="text-primary italic">{t('landing.heroHighlight')}</span>
            </h1>
            <p className="mb-10 max-w-2xl text-lg leading-relaxed text-on-surface-variant">{t('landing.heroBody')}</p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-label-lg font-semibold tracking-[0.05em] text-on-primary shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-primary-hover"
              >
                {t('landing.ctaStart')}
                <MaterialIcon name="arrow_forward" className="text-[20px]" />
              </Link>
              <a
                href="#produit"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-outline-variant bg-surface px-8 py-4 text-label-lg font-semibold tracking-[0.05em] text-on-surface shadow-sm hover:bg-surface-container"
              >
                {t('landing.ctaDemo')}
              </a>
            </div>
          </div>
        </section>

        <section id="fonctionnalites" className="relative z-20 -mt-16 w-full bg-background py-24">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-3 lg:px-10">
            {FEATURES.map((feature, index) => (
              <article
                key={feature.titleKey}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-8 shadow-[0_8px_30px_rgba(13,27,42,0.04)] ${index === 1 ? 'md:-mt-8' : ''}`}
              >
                <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-bl-full bg-primary/5 transition-transform group-hover:scale-110" />
                <div className="relative z-10 mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-surface-container text-primary transition-colors group-hover:bg-primary group-hover:text-on-primary">
                  <MaterialIcon name={feature.icon} className="text-[28px]" />
                </div>
                <h3 className="relative z-10 mb-3 font-display text-2xl font-semibold text-on-surface">{t(feature.titleKey)}</h3>
                <p className="relative z-10 leading-relaxed text-on-surface-variant">{t(feature.bodyKey)}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="produit" className="overflow-hidden bg-surface-container-low py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-display text-3xl font-semibold tracking-tight text-on-surface sm:text-4xl">{t('landing.showcaseTitle')}</h2>
              <p className="mx-auto max-w-2xl text-lg text-on-surface-variant">{t('landing.showcaseBody')}</p>
            </div>
            <div className="flex flex-col items-center gap-16 lg:flex-row">
              <div className="relative flex w-full justify-center lg:w-1/3">
                <div className="relative h-[600px] w-[300px] overflow-hidden rounded-[40px] border-[8px] border-surface-container-lowest bg-[#0d1b2a] shadow-2xl">
                  <div className="relative h-48 w-full">
                    <img src="/landing/dessert.jpg" alt="" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b2a] to-transparent" />
                  </div>
                  <div className="relative z-10 -mt-8 flex flex-1 flex-col gap-4 px-6 pb-6">
                    <div>
                      <h4 className="font-display text-2xl font-semibold text-[#e0e1dd]">{t('landing.phoneMenu')}</h4>
                      <p className="text-label-md text-[#778da9]">{t('landing.phoneCourse')}</p>
                    </div>
                    <div className="flex gap-2 overflow-hidden border-b border-[#1b263b] pb-2">
                      <span className="text-xs font-semibold whitespace-nowrap text-[#778da9]">{t('landing.phoneStarters')}</span>
                      <span className="text-xs whitespace-nowrap text-[#415a77]">{t('landing.phoneMains')}</span>
                      <span className="text-xs whitespace-nowrap text-[#415a77]">{t('landing.phoneDesserts')}</span>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h5 className="mb-1 text-sm font-semibold text-[#e0e1dd]">{t('landing.dishOne')}</h5>
                        <p className="line-clamp-2 text-xs text-[#778da9]">{t('landing.dishOneDesc')}</p>
                        <span className="mt-2 block text-sm font-bold text-[#e0e1dd]">18€</span>
                      </div>
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                        <img src="/landing/ceviche.jpg" alt="" className="h-full w-full object-cover" />
                      </div>
                    </div>
                    <div>
                      <h5 className="mb-1 text-sm font-semibold text-[#e0e1dd]">{t('landing.dishTwo')}</h5>
                      <p className="line-clamp-2 text-xs text-[#778da9]">{t('landing.dishTwoDesc')}</p>
                      <span className="mt-2 block text-sm font-bold text-[#e0e1dd]">22€</span>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-2 -bottom-6 flex items-center gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-4 shadow-xl sm:-right-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MaterialIcon name="qr_code_scanner" />
                  </div>
                  <div>
                    <p className="text-label-md font-medium text-on-surface">{t('landing.scanTitle')}</p>
                    <p className="text-[11px] text-on-surface-variant">{t('landing.scanHint')}</p>
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col gap-8 lg:w-2/3">
                <div>
                  <h3 className="mb-4 font-display text-2xl font-semibold text-on-surface sm:text-3xl">{t('landing.dashTitle')}</h3>
                  <p className="leading-relaxed text-on-surface-variant">{t('landing.dashBody')}</p>
                </div>
                <div className="overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-xl">
                  <div className="flex items-center justify-between border-b border-outline-variant/30 bg-surface-container-low px-6 py-4">
                    <div className="flex gap-3">
                      <div className="h-3 w-3 rounded-full bg-error/70" />
                      <div className="h-3 w-3 rounded-full bg-[#778da9]" />
                      <div className="h-3 w-3 rounded-full bg-primary/40" />
                    </div>
                    <div className="rounded-md bg-surface px-4 py-1 text-xs font-medium text-on-surface-variant">app.qtable</div>
                  </div>
                  <div className="grid grid-cols-12 gap-6 bg-[#e0e1dd] p-6">
                    <div className="col-span-3 flex flex-col gap-3">
                      <div className="mb-4 h-8 w-3/4 rounded-md bg-surface-container-high" />
                      <div className="flex h-10 w-full items-center rounded-md bg-[#0d1b2a] px-3">
                        <div className="h-4 w-4 rounded-sm bg-[#e0e1dd]" />
                      </div>
                      <div className="h-10 w-full rounded-md bg-surface-container" />
                      <div className="h-10 w-full rounded-md bg-surface-container" />
                    </div>
                    <div className="col-span-9 flex flex-col gap-6">
                      <div className="flex items-center justify-between">
                        <div className="h-8 w-1/3 rounded-md bg-surface-container-high" />
                        <div className="h-8 w-24 rounded-md bg-primary/20" />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {[0, 1, 2].map((item) => (
                          <div key={item} className="flex items-center gap-4 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-4">
                            <div className="h-12 w-12 rounded-lg bg-surface-container" />
                            <div className="flex-1">
                              <div className="mb-2 h-4 w-full rounded bg-surface-container-high" />
                              <div className="h-3 w-1/2 rounded bg-surface-container" />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex h-48 items-end gap-2 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-4">
                        <div className="h-1/4 w-full rounded-t-md bg-[#778da9]/40" />
                        <div className="h-2/4 w-full rounded-t-md bg-[#415a77]/50" />
                        <div className="h-full w-full rounded-t-md bg-primary/80" />
                        <div className="h-3/4 w-full rounded-t-md bg-[#778da9]/40" />
                        <div className="h-1/2 w-full rounded-t-md bg-[#415a77]/50" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-surface-container-high py-24">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-10">
            <h2 className="mb-6 font-display text-[1.75rem] font-semibold tracking-tight text-on-surface sm:text-4xl lg:text-5xl">
              {t('landing.bottomTitle')}
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-on-surface-variant">{t('landing.bottomBody')}</p>
            <Link
              to="/register"
              className="inline-flex items-center gap-3 rounded-xl bg-primary px-10 py-5 text-label-lg font-semibold tracking-[0.05em] text-on-primary shadow-xl transition-transform hover:-translate-y-1 hover:bg-primary-hover"
            >
              {t('landing.bottomCta')}
              <MaterialIcon name="restaurant_menu" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-surface-container-high pt-16 pb-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="mb-6">
                <BrandLogo className="h-8" />
              </div>
              <p className="max-w-sm text-on-surface-variant">{t('landing.footerBlurb')}</p>
            </div>
            <div>
              <h4 className="mb-6 text-label-lg font-semibold tracking-[0.05em] text-on-surface uppercase">{t('landing.footerProduct')}</h4>
              <ul className="flex flex-col gap-4 text-on-surface-variant">
                <li>
                  <a href="#fonctionnalites" className="hover:text-primary">{t('landing.navFeatures')}</a>
                </li>
                <li>
                  <a href="#produit" className="hover:text-primary">{t('landing.navProduct')}</a>
                </li>
                <li>
                  <Link to="/register" className="hover:text-primary">{t('landing.ctaStart')}</Link>
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
                  <Link to="/login" className="hover:text-primary">{t('auth.loginTitle')}</Link>
                </li>
                <li className="flex items-center gap-2">
                  <MaterialIcon name="person_add" className="text-[18px]" />
                  <Link to="/register" className="hover:text-primary">{t('auth.createCafe')}</Link>
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
              className="mt-1 inline-block font-display text-2xl italic tracking-tight text-primary hover:underline"
            >
              {DEVELOPER_NAME}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
