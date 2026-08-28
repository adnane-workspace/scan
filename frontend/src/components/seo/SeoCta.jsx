import AppLink from '../common/AppLink.jsx';
import MaterialIcon from '../ui/MaterialIcon.jsx';
import { useLocale } from '../../hooks/useLocale.js';

export default function SeoCta({ title, body }) {
  const { t } = useLocale();

  return (
    <section className="mt-14 rounded-2xl bg-primary px-6 py-8 text-on-primary sm:px-10 sm:py-10">
      <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      {body ? <p className="mt-3 max-w-2xl text-on-primary/85">{body}</p> : null}
      <AppLink
        to="/register"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-surface px-5 py-3 text-sm font-semibold text-primary hover:bg-surface-container-lowest"
      >
        {t('landing.ctaStart')}
        <MaterialIcon name="arrow_forward" className="text-[18px]" />
      </AppLink>
    </section>
  );
}
