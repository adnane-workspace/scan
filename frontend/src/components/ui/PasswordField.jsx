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
  return (
    <label className="block text-sm font-medium text-on-surface">
      {label}
      <div className="relative mt-1">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          minLength={minLength}
          required={required}
          autoComplete={autoComplete}
          className="w-full rounded-lg bg-surface-container-highest px-3 py-2 pr-12 text-on-surface outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-on-surface-variant hover:text-on-surface"
          aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
        >
          <MaterialIcon name={show ? 'visibility_off' : 'visibility'} className="text-[20px]" />
        </button>
      </div>
    </label>
  );
}
