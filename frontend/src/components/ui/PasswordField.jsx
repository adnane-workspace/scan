import { useLocale } from '../../hooks/useLocale.js';
import MaterialIcon from './MaterialIcon.jsx';

export default function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggleShow,
  placeholder,
  autoComplete = 'new-password',
  required = true,
  minLength,
}) {
  const { t } = useLocale();

  return (
    <label className="block text-label-md font-medium tracking-wider text-on-surface-variant uppercase">
      {label}
      <div className="relative mt-1.5">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          minLength={minLength}
          required={required}
          autoComplete={autoComplete}
          className="w-full rounded-xl bg-surface-container-low px-4 py-3.5 pr-12 text-on-surface outline-none ring-1 ring-transparent transition-shadow focus:ring-2 focus:ring-primary"
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-on-surface-variant hover:text-on-surface"
          aria-label={show ? t('auth.hidePassword') : t('auth.showPassword')}
        >
          <MaterialIcon name={show ? 'visibility_off' : 'visibility'} className="text-[20px]" />
        </button>
      </div>
    </label>
  );
}
