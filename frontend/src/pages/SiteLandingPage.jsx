import { Link, Navigate } from 'react-router-dom';
import AppLink from '../components/common/AppLink.jsx';
import LandingSeo from '../components/seo/LandingSeo.jsx';
import MaterialIcon from '../components/ui/MaterialIcon.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useLocale } from '../hooks/useLocale.js';
import MarketingLayout from '../layouts/MarketingLayout.jsx';
import { LANDING_PRODUCT, getHomePath } from '../utils/paths.js';

const FEATURES = [
  { icon: 'flash_on', titleKey: 'landing.featureFastTitle', bodyKey: 'landing.featureFastBody' },
  { icon: 'diamond', titleKey: 'landing.featureDesignTitle', bodyKey: 'landing.featureDesignBody' },
  { icon: 'update', titleKey: 'landing.featureLiveTitle', bodyKey: 'landing.featureLiveBody' },
];

export default function SiteLandingPage() {
  const { isAuthenticated, isReady, user } = useAuth();
  const { t } = useLocale();

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
    <MarketingLayout>
      <LandingSeo />
      <main id="accueil">
        <section className="relative overflow-hidden bg-surface-container-lowest pt-10 pb-20 sm:pt-16 sm:pb-32 lg:pt-24 lg:pb-48">
          <div className="absolute inset-0">
            <div
              className="h-full w-full bg-cover bg-center opacity-40 mix-blend-multiply"
              style={{ backgroundImage: 'url(/landing/hero.jpg)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-surface-container-lowest/90 via-surface-container-lowest/60 to-background" />
          </div>
          <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-4 text-center sm:px-6 lg:px-10">
            <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-outline-variant/30 bg-surface-container px-3 py-1.5 shadow-sm sm:mb-8 sm:px-4">
              <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-primary" />
              <span className="text-[11px] font-medium tracking-wide text-on-surface uppercase sm:text-label-md sm:tracking-wider">{t('landing.badge')}</span>
            </div>
            <h1 className="mb-5 max-w-4xl font-display text-[1.5rem] leading-snug font-semibold tracking-tight text-on-surface sm:mb-6 sm:text-4xl sm:leading-tight lg:text-5xl">
              {t('landing.heroTitle')} <span className="text-primary">{t('landing.heroHighlight')}</span>
            </h1>
            <p className="mb-8 max-w-2xl text-base leading-relaxed text-on-surface-variant sm:mb-10 sm:text-lg">{t('landing.heroBody')}</p>
            <div className="flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
              <AppLink
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-label-lg font-semibold tracking-[0.05em] text-on-primary shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-primary-hover sm:px-8 sm:py-4"
              >
                {t('landing.ctaStart')}
                <MaterialIcon name="arrow_forward" className="text-[20px]" />
              </AppLink>
              <Link
                to={LANDING_PRODUCT}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-outline-variant bg-surface px-6 py-3.5 text-label-lg font-semibold tracking-[0.05em] text-on-surface shadow-sm hover:bg-surface-container sm:px-8 sm:py-4"
              >
                {t('landing.ctaDemo')}
              </Link>
            </div>
          </div>
        </section>

        <section id="fonctionnalites" className="relative z-20 -mt-10 w-full bg-background py-16 sm:-mt-16 sm:py-24">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 sm:gap-8 sm:px-6 lg:grid-cols-3 lg:px-10">
            {FEATURES.map((feature, index) => (
              <article
                key={feature.titleKey}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-[0_8px_30px_rgba(13,27,42,0.04)] sm:p-8 ${index === 1 ? 'lg:-mt-8' : ''}`}
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

        <section id="produit" className="overflow-hidden bg-surface-container-low py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="mb-10 text-center sm:mb-16">
              <h2 className="mb-3 font-display text-2xl font-semibold tracking-tight text-on-surface sm:mb-4 sm:text-4xl">{t('landing.showcaseTitle')}</h2>
              <p className="mx-auto max-w-2xl text-base text-on-surface-variant sm:text-lg">{t('landing.showcaseBody')}</p>
            </div>
            <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
              <div className="relative flex w-full max-w-sm justify-center pb-12 lg:w-1/3 lg:max-w-none lg:pb-8">
                <div className="relative h-[480px] w-full max-w-[240px] overflow-hidden rounded-[32px] border-[6px] border-surface-container-lowest bg-[#0d1b2a] shadow-2xl sm:h-[600px] sm:max-w-[300px] sm:rounded-[40px] sm:border-[8px]">
                  <div className="relative h-36 w-full sm:h-48">
                    <img src="/landing/dessert.jpg" alt="" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b2a] to-transparent" />
                  </div>
                  <div className="relative z-10 -mt-8 flex flex-1 flex-col gap-3 px-4 pb-5 sm:gap-4 sm:px-6 sm:pb-6">
                    <div>
                      <h4 className="font-display text-xl font-semibold text-[#e0e1dd] sm:text-2xl">{t('landing.phoneMenu')}</h4>
                      <p className="text-label-md text-[#778da9]">{t('landing.phoneCourse')}</p>
                    </div>
                    <div className="flex gap-2 overflow-hidden border-b border-[#1b263b] pb-2">
                      <span className="text-xs font-semibold whitespace-nowrap text-[#778da9]">{t('landing.phoneStarters')}</span>
                      <span className="text-xs whitespace-nowrap text-[#415a77]">{t('landing.phoneMains')}</span>
                      <span className="text-xs whitespace-nowrap text-[#415a77]">{t('landing.phoneDesserts')}</span>
                    </div>
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="min-w-0 flex-1">
                        <h5 className="mb-1 text-sm font-semibold text-[#e0e1dd]">{t('landing.dishOne')}</h5>
                        <p className="line-clamp-2 text-xs text-[#778da9]">{t('landing.dishOneDesc')}</p>
                        <span className="mt-2 block text-sm font-bold text-[#e0e1dd]">18€</span>
                      </div>
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg sm:h-20 sm:w-20">
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
                <div className="absolute bottom-0 start-1/2 flex -translate-x-1/2 items-center gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-3 shadow-xl sm:p-4 lg:bottom-2 lg:start-auto lg:end-0 lg:translate-x-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MaterialIcon name="qr_code_scanner" />
                  </div>
                  <div>
                    <p className="text-label-md font-medium text-on-surface">{t('landing.scanTitle')}</p>
                    <p className="text-[11px] text-on-surface-variant">{t('landing.scanHint')}</p>
                  </div>
                </div>
              </div>

              <div className="flex w-full min-w-0 flex-col gap-6 sm:gap-8 lg:w-2/3">
                <div>
                  <h3 className="mb-3 font-display text-xl font-semibold text-on-surface sm:mb-4 sm:text-3xl">{t('landing.dashTitle')}</h3>
                  <p className="text-base leading-relaxed text-on-surface-variant sm:text-[1.05rem]">{t('landing.dashBody')}</p>
                </div>
                <div className="overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-xl">
                  <div className="flex items-center justify-between border-b border-outline-variant/30 bg-surface-container-low px-4 py-3 sm:px-6 sm:py-4">
                    <div className="flex gap-2 sm:gap-3">
                      <div className="h-2.5 w-2.5 rounded-full bg-error/70 sm:h-3 sm:w-3" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#778da9] sm:h-3 sm:w-3" />
                      <div className="h-2.5 w-2.5 rounded-full bg-primary/40 sm:h-3 sm:w-3" />
                    </div>
                    <div className="rounded-md bg-surface px-3 py-1 text-[11px] font-medium text-on-surface-variant sm:px-4 sm:text-xs">app.scanosh.com</div>
                  </div>
                  <div className="grid grid-cols-12 gap-3 bg-[#e0e1dd] p-3 sm:gap-6 sm:p-6">
                    <div className="col-span-3 hidden flex-col gap-3 md:flex">
                      <div className="mb-4 h-8 w-3/4 rounded-md bg-surface-container-high" />
                      <div className="flex h-10 w-full items-center rounded-md bg-[#0d1b2a] px-3">
                        <div className="h-4 w-4 rounded-sm bg-[#e0e1dd]" />
                      </div>
                      <div className="h-10 w-full rounded-md bg-surface-container" />
                      <div className="h-10 w-full rounded-md bg-surface-container" />
                    </div>
                    <div className="col-span-12 flex flex-col gap-4 md:col-span-9 sm:gap-6">
                      <div className="flex items-center justify-between gap-3">
                        <div className="h-6 w-1/3 rounded-md bg-surface-container-high sm:h-8" />
                        <div className="h-6 w-16 rounded-md bg-primary/20 sm:h-8 sm:w-24" />
                      </div>
                      <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-3 sm:gap-4">
                        {[0, 1, 2].map((item) => (
                          <div key={item} className="flex items-center gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-3 sm:gap-4 sm:p-4">
                            <div className="h-10 w-10 shrink-0 rounded-lg bg-surface-container sm:h-12 sm:w-12" />
                            <div className="min-w-0 flex-1">
                              <div className="mb-2 h-3 w-full rounded bg-surface-container-high sm:h-4" />
                              <div className="h-2.5 w-1/2 rounded bg-surface-container sm:h-3" />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex h-32 items-end gap-1.5 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-3 sm:h-48 sm:gap-2 sm:p-4">
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

        <section className="relative overflow-hidden bg-surface-container-high py-16 sm:py-24">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl sm:h-96 sm:w-96" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-secondary/20 blur-3xl sm:h-96 sm:w-96" />
          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-10">
            <h2 className="mb-4 font-display text-[1.5rem] font-semibold tracking-tight text-on-surface sm:mb-6 sm:text-4xl lg:text-5xl">
              {t('landing.bottomTitle')}
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-base text-on-surface-variant sm:mb-10 sm:text-lg">{t('landing.bottomBody')}</p>
            <AppLink
              to="/register"
              className="inline-flex w-full max-w-md items-center justify-center gap-3 rounded-xl bg-primary px-6 py-4 text-label-lg font-semibold tracking-[0.05em] text-on-primary shadow-xl transition-transform hover:-translate-y-1 hover:bg-primary-hover sm:w-auto sm:max-w-none sm:px-10 sm:py-5"
            >
              {t('landing.bottomCta')}
              <MaterialIcon name="restaurant_menu" />
            </AppLink>
          </div>
        </section>
      </main>
    </MarketingLayout>
  );
}
