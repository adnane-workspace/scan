import AppLink from '../components/common/AppLink.jsx';
import LandingSeo from '../components/seo/LandingSeo.jsx';
import MaterialIcon from '../components/ui/MaterialIcon.jsx';
import { useLocale } from '../hooks/useLocale.js';
import MarketingLayout from '../layouts/MarketingLayout.jsx';

const STEPS = [
  { num: '01', titleKey: 'landing.stepOneTitle', bodyKey: 'landing.stepOneBody' },
  { num: '02', titleKey: 'landing.stepTwoTitle', bodyKey: 'landing.stepTwoBody' },
  { num: '03', titleKey: 'landing.stepThreeTitle', bodyKey: 'landing.stepThreeBody' },
];

export default function SiteLandingPage() {
  const { t } = useLocale();

  return (
    <MarketingLayout>
      <LandingSeo />
      <main id="accueil">
        <section className="relative flex min-h-[100svh] items-end overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/landing/hero.jpg"
              alt=""
              className="landing-hero-media h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b2a] via-[#0d1b2a]/72 to-[#0d1b2a]/35" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d1b2a]/55 via-transparent to-transparent rtl:bg-gradient-to-l" />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 pt-24 sm:px-6 sm:pb-20 sm:pt-28 lg:px-10 lg:pb-28">
            <p className="landing-fade-up font-display text-[2rem] font-semibold tracking-tight text-[#e0e1dd] sm:text-5xl lg:text-6xl">
              {t('landing.brandName')}
            </p>
            <h1 className="landing-fade-up landing-fade-up-delay-1 mt-4 max-w-3xl font-display text-[1.5rem] leading-[1.2] font-semibold tracking-tight text-[#e0e1dd] sm:mt-6 sm:text-4xl lg:text-5xl">
              {t('landing.heroTitle')}
            </h1>
            <p className="landing-fade-up landing-fade-up-delay-2 mt-3 max-w-xl text-[0.95rem] leading-relaxed text-[#e0e1dd]/85 sm:mt-5 sm:text-lg">
              {t('landing.heroBody')}
            </p>
            <div className="landing-fade-up landing-fade-up-delay-3 mt-7 flex w-full flex-col gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:items-center sm:gap-4">
              <AppLink
                to="/register"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#e0e1dd] px-6 py-3.5 text-sm font-semibold tracking-[0.04em] text-[#0d1b2a] shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-white sm:w-auto sm:px-8 sm:py-4 sm:text-label-lg"
              >
                {t('landing.ctaStart')}
                <MaterialIcon name="arrow_forward" className="text-[20px]" />
              </AppLink>
              <AppLink
                to="/essai"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#e0e1dd]/35 bg-transparent px-6 py-3.5 text-center text-sm font-semibold tracking-[0.04em] text-[#e0e1dd] transition-colors hover:border-[#e0e1dd]/70 hover:bg-[#e0e1dd]/10 sm:w-auto sm:px-8 sm:py-4 sm:text-label-lg"
              >
                {t('landing.ctaFilledTrial')}
              </AppLink>
            </div>
          </div>
        </section>

        <section className="border-b border-outline-variant/30 bg-[#0d1b2a] py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-10">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-[#e0e1dd] sm:text-3xl">
              {t('landing.proofTitle')}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#e0e1dd]/75 sm:text-lg">{t('landing.proofBody')}</p>
          </div>
        </section>

        <section id="fonctionnalites" className="bg-background py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-on-surface sm:text-4xl">
                {t('landing.howTitle')}
              </h2>
              <p className="mt-3 text-base text-on-surface-variant sm:text-lg">{t('landing.howBody')}</p>
            </div>

            <ol className="mt-12 grid grid-cols-1 gap-10 border-t border-outline-variant/40 pt-10 sm:mt-16 sm:gap-12 sm:pt-14 lg:grid-cols-3">
              {STEPS.map((step) => (
                <li key={step.num} className="min-w-0">
                  <p className="font-display text-3xl font-semibold tracking-tight text-primary/25 sm:text-4xl">{step.num}</p>
                  <h3 className="mt-3 font-display text-xl font-semibold text-on-surface sm:text-2xl">{t(step.titleKey)}</h3>
                  <p className="mt-2 leading-relaxed text-on-surface-variant">{t(step.bodyKey)}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="produit" className="overflow-hidden bg-surface-container-low py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="mb-10 max-w-2xl sm:mb-14">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-on-surface sm:text-4xl">
                {t('landing.showcaseTitle')}
              </h2>
              <p className="mt-3 text-base text-on-surface-variant sm:text-lg">{t('landing.showcaseBody')}</p>
            </div>

            <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-16">
              <div className="relative flex w-full max-w-sm justify-center lg:w-1/3 lg:max-w-none">
                <div className="relative h-[420px] w-full max-w-[220px] overflow-hidden rounded-[28px] border-[5px] border-[#0d1b2a] bg-[#0d1b2a] shadow-2xl sm:h-[560px] sm:max-w-[280px] sm:rounded-[40px] sm:border-[8px]">
                  <div className="relative h-36 w-full sm:h-44">
                    <img src="/landing/dessert.jpg" alt="" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b2a] to-transparent" />
                  </div>
                  <div className="relative z-10 -mt-8 flex flex-1 flex-col gap-3 px-4 pb-5 sm:gap-4 sm:px-5 sm:pb-6">
                    <div>
                      <h4 className="font-display text-xl font-semibold text-[#e0e1dd] sm:text-2xl">{t('landing.phoneMenu')}</h4>
                      <p className="text-label-md text-[#778da9]">{t('landing.phoneCourse')}</p>
                    </div>
                    <div className="flex gap-3 overflow-hidden border-b border-[#1b263b] pb-2">
                      <span className="text-xs font-semibold whitespace-nowrap text-[#e0e1dd]">{t('landing.phoneStarters')}</span>
                      <span className="text-xs whitespace-nowrap text-[#415a77]">{t('landing.phoneMains')}</span>
                      <span className="text-xs whitespace-nowrap text-[#415a77]">{t('landing.phoneDesserts')}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <h5 className="mb-1 text-sm font-semibold text-[#e0e1dd]">{t('landing.dishOne')}</h5>
                        <p className="line-clamp-2 text-xs text-[#778da9]">{t('landing.dishOneDesc')}</p>
                        <span className="mt-2 block text-sm font-bold text-[#e0e1dd]">85 DH</span>
                      </div>
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                        <img src="/landing/ceviche.jpg" alt="" className="h-full w-full object-cover" />
                      </div>
                    </div>
                    <div>
                      <h5 className="mb-1 text-sm font-semibold text-[#e0e1dd]">{t('landing.dishTwo')}</h5>
                      <p className="line-clamp-2 text-xs text-[#778da9]">{t('landing.dishTwoDesc')}</p>
                      <span className="mt-2 block text-sm font-bold text-[#e0e1dd]">120 DH</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex w-full min-w-0 flex-col gap-6 sm:gap-8 lg:w-2/3">
                <div>
                  <h3 className="mb-3 font-display text-xl font-semibold text-on-surface sm:text-3xl">{t('landing.dashTitle')}</h3>
                  <p className="text-base leading-relaxed text-on-surface-variant sm:text-[1.05rem]">{t('landing.dashBody')}</p>
                </div>
                <div className="overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-xl">
                  <div className="flex items-center justify-between border-b border-outline-variant/30 bg-surface-container-low px-4 py-3 sm:px-6">
                    <div className="flex gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-[#415a77]/60" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#778da9]/60" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#0d1b2a]/40" />
                    </div>
                    <div className="rounded-md bg-surface px-3 py-1 text-[11px] font-medium text-on-surface-variant">
                      app.scanosh.com
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-3 bg-[#e0e1dd] p-3 sm:gap-5 sm:p-5">
                    <div className="col-span-3 hidden flex-col gap-2 md:flex">
                      <div className="mb-3 h-7 w-3/4 rounded-md bg-surface-container-high" />
                      <div className="flex h-9 w-full items-center rounded-md bg-[#0d1b2a] px-3">
                        <div className="h-3.5 w-3.5 rounded-sm bg-[#e0e1dd]" />
                      </div>
                      <div className="h-9 w-full rounded-md bg-surface-container" />
                      <div className="h-9 w-full rounded-md bg-surface-container" />
                    </div>
                    <div className="col-span-12 flex flex-col gap-4 md:col-span-9">
                      <div className="flex items-center justify-between gap-3">
                        <div className="h-6 w-1/3 rounded-md bg-surface-container-high sm:h-7" />
                        <div className="h-6 w-16 rounded-md bg-[#0d1b2a]/15 sm:h-7 sm:w-20" />
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {[0, 1, 2].map((item) => (
                          <div key={item} className="flex items-center gap-3 rounded-xl bg-surface-container-lowest p-3">
                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface-container">
                              {item === 0 ? (
                                <img src="/landing/ceviche.jpg" alt="" className="h-full w-full object-cover" />
                              ) : item === 1 ? (
                                <img src="/landing/dessert.jpg" alt="" className="h-full w-full object-cover" />
                              ) : null}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="mb-2 h-3 w-full rounded bg-surface-container-high" />
                              <div className="h-2.5 w-1/2 rounded bg-surface-container" />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex h-28 items-end gap-1.5 rounded-xl bg-surface-container-lowest p-3 sm:h-40 sm:gap-2 sm:p-4">
                        <div className="h-1/4 w-full rounded-t-md bg-[#778da9]/40" />
                        <div className="h-2/4 w-full rounded-t-md bg-[#415a77]/50" />
                        <div className="h-full w-full rounded-t-md bg-[#0d1b2a]/75" />
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

        <section className="relative overflow-hidden bg-[#0d1b2a] py-16 sm:py-24">
          <div
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{
              backgroundImage: 'url(/landing/hero.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-[#0d1b2a]/85" />
          <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-10">
            <h2 className="font-display text-[1.75rem] font-semibold tracking-tight text-[#e0e1dd] sm:text-4xl lg:text-5xl">
              {t('landing.bottomTitle')}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-[#e0e1dd]/75 sm:mt-5 sm:text-lg">{t('landing.bottomBody')}</p>
            <AppLink
              to="/register"
              className="mt-8 inline-flex w-full max-w-md items-center justify-center gap-3 rounded-xl bg-[#e0e1dd] px-6 py-4 text-label-lg font-semibold tracking-[0.05em] text-[#0d1b2a] shadow-xl transition-transform hover:-translate-y-0.5 hover:bg-white sm:mt-10 sm:w-auto sm:max-w-none sm:px-10 sm:py-5"
            >
              {t('landing.bottomCta')}
              <MaterialIcon name="arrow_forward" className="text-[20px]" />
            </AppLink>
          </div>
        </section>
      </main>
    </MarketingLayout>
  );
}
