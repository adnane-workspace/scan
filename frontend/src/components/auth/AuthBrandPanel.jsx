import MaterialIcon from '../ui/MaterialIcon.jsx';
import { useLocale } from '../../hooks/useLocale.js';

export default function AuthBrandPanel() {
  const { t } = useLocale();

  return (
    <aside className="relative hidden overflow-hidden bg-[#16110e] text-[#fff8f3] lg:flex lg:flex-col lg:justify-between lg:px-14 lg:py-14 xl:px-16">
      <div className="pointer-events-none absolute -top-24 -left-16 h-80 w-80 rounded-full bg-primary-container/40 blur-[110px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-96 w-96 translate-x-1/4 translate-y-1/4 rounded-full bg-tertiary/30 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:22px_22px]" />

      <div className="relative z-10 flex items-center gap-3">
        <img src="/epicurean-logo.png" alt="" className="h-12 w-12 rounded-xl bg-[#fff8f3] object-contain p-1.5" />
        <span className="font-display text-2xl tracking-tight">Epicurean</span>
      </div>

      <div className="relative z-10 max-w-md">
        <p className="text-label-md font-semibold tracking-[0.18em] text-primary-container uppercase">{t('auth.digitalMenu')}</p>
        <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.15] tracking-tight xl:text-6xl">
          {t('auth.headline')}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-[#fff8f3]/72">{t('auth.tagline')}</p>
      </div>

      <ul className="relative z-10 space-y-4 text-sm text-[#fff8f3]/80">
        <li className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8">
            <MaterialIcon name="qr_code_2" className="text-[20px]" />
          </span>
          {t('auth.featureQr')}
        </li>
        <li className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8">
            <MaterialIcon name="restaurant_menu" className="text-[20px]" />
          </span>
          {t('auth.featureMenu')}
        </li>
        <li className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8">
            <MaterialIcon name="dashboard" className="text-[20px]" />
          </span>
          {t('auth.featureDashboard')}
        </li>
      </ul>
    </aside>
  );
}
