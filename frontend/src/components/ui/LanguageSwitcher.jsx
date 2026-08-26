import { LOCALES } from '../../i18n/messages.js';
import { useLocale } from '../../hooks/useLocale.js';

export default function LanguageSwitcher({ compact = false, className = '', onDark = false }) {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className={`inline-flex rounded-xl p-1 ${
        onDark ? 'bg-[#b8f7e4]/15 ring-1 ring-[#b8f7e4]/25 backdrop-blur-md' : 'bg-surface-container'
      } ${className}`}
    >
      {LOCALES.map((item) => {
        const active = locale === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setLocale(item.id)}
            className={`rounded-lg px-2 py-1 text-[11px] font-semibold uppercase tracking-wider transition-colors duration-200 sm:px-2.5 sm:text-xs ${
              active
                ? onDark
                  ? 'bg-[#b8f7e4] text-[#25272c]'
                  : 'bg-surface-container-lowest text-primary'
                : onDark
                  ? 'text-[#b8f7e4]/80 hover:text-[#b8f7e4]'
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
