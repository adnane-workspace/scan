import { LOCALES } from '../../i18n/messages.js';
import { useLocale } from '../../hooks/useLocale.js';

export default function LanguageSwitcher({ compact = false, className = '', onDark = false }) {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className={`inline-flex rounded-xl p-1 ${
        onDark ? 'bg-[#e0e1dd]/15 ring-1 ring-[#e0e1dd]/25 backdrop-blur-md' : 'bg-surface-container'
      } ${className}`}
    >
      {LOCALES.map((item) => {
        const active = locale === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setLocale(item.id)}
            className={`rounded-lg font-semibold uppercase tracking-wider transition-colors duration-200 ${
              compact ? 'px-1.5 py-0.5 text-[10px] sm:px-2 sm:text-[11px]' : 'px-2 py-1 text-[11px] sm:px-2.5 sm:text-xs'
            } ${
              active
                ? onDark
                  ? 'bg-[#e0e1dd] text-[#0d1b2a]'
                  : 'bg-surface-container-lowest text-primary'
                : onDark
                  ? 'text-[#e0e1dd]/80 hover:text-[#e0e1dd]'
                  : 'text-on-surface-variant hover:text-on-surface'
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
