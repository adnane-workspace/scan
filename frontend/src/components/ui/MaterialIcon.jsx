const RTL_FLIP = new Set(['arrow_forward', 'arrow_back', 'chevron_right', 'chevron_left']);

export default function MaterialIcon({ name, className = "", filled = false }) {
  return (
    <span
      className={`material-symbols-outlined ${RTL_FLIP.has(name) ? 'rtl:rotate-180' : ''} ${className}`}
      style={filled ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" } : undefined}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
