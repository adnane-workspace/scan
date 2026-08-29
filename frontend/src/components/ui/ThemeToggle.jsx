import { useLocale } from '../../hooks/useLocale.js';
import { useTheme } from '../../hooks/useTheme.js';
import MaterialIcon from './MaterialIcon.jsx';

export default function ThemeToggle({ compact = false, className = '' }) {
  const { t } = useLocale();
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`inline-flex items-center justify-center rounded-xl bg-surface-container text-on-surface transition-colors hover:bg-surface-container-high ${
        compact ? 'h-8 w-8' : 'h-10 w-10'
      } ${className}`}
      aria-label={isDark ? t('settings.themeToLight') : t('settings.themeToDark')}
      title={isDark ? t('settings.themeLight') : t('settings.themeDark')}
    >
      <MaterialIcon name={isDark ? 'light_mode' : 'dark_mode'} className={compact ? 'text-[18px]' : 'text-[22px]'} />
    </button>
  );
}
