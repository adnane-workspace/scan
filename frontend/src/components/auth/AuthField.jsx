import MaterialIcon from '../ui/MaterialIcon.jsx';

export default function AuthField({
  id,
  label,
  type = 'text',
  icon,
  value,
  onChange,
  placeholder,
  autoComplete,
  minLength,
  maxLength,
  inputMode,
  pattern,
  autoFocus,
  required = true,
  invalid,
  errorId,
  children,
}) {
  return (
    <div className="group flex flex-col gap-1.5">
      <label htmlFor={id} className="text-label-md font-medium tracking-wider text-on-surface-variant uppercase">
        {label}
      </label>
      <div
        className={`flex items-center rounded-xl bg-surface-container-low ring-1 transition-shadow ${
          invalid
            ? 'ring-error focus-within:ring-2 focus-within:ring-error'
            : 'ring-transparent focus-within:ring-2 focus-within:ring-primary'
        }`}
      >
        <MaterialIcon
          name={icon}
          className="ml-3 pointer-events-none text-[20px] text-on-surface-variant/50 group-focus-within:text-primary"
        />
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          minLength={minLength}
          maxLength={maxLength}
          inputMode={inputMode}
          pattern={pattern}
          autoFocus={autoFocus}
          required={required}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? errorId : undefined}
          className="w-full bg-transparent px-3 py-3.5 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none"
        />
        {children}
      </div>
    </div>
  );
}
