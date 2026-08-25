export default function AvailabilityToggle({ checked, disabled, onChange, label }) {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <span className="sr-only">{label}</span>
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <div className="relative h-6 w-11 rounded-full bg-outline-variant transition-colors duration-200 after:absolute after:top-[2px] after:start-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform after:duration-200 after:content-[''] peer-checked:bg-success peer-checked:after:translate-x-5 rtl:peer-checked:after:-translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" />
    </label>
  );
}
