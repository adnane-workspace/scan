import { LOCALES } from '../../i18n/messages.js';
import { useLocale } from '../../hooks/useLocale.js';

export default function LanguageSwitcher({ compact = false, className = '' }) {
  const { locale, setLocale } = useLocale();

  return (
    <div className={`inline-flex rounded-xl bg-surface-container-high p-1 ${compact ? '' : ''} ${className}`}>
      {LOCALES.map((item) => {
        const active = locale === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setLocale(item.id)}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${
              active ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant'
            }`}
            aria-pressed={active}
          >
            {item.id}
          </button>
        );
      })}
    </div>
  );
}
