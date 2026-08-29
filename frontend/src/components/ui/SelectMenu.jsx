import { Children, isValidElement, useEffect, useId, useMemo, useRef, useState } from 'react';
import MaterialIcon from './MaterialIcon.jsx';

const SIZE_CLASS = {
  default: 'px-3 py-3.5',
  compact: 'px-3 py-2.5 text-sm',
};

function parseOptions(children) {
  const items = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }

    if (child.type === 'optgroup') {
      items.push({ type: 'heading', label: child.props.label });
      items.push(...parseOptions(child.props.children));
      return;
    }

    if (child.type !== 'option') {
      return;
    }

    let label = String(child.props.children ?? '');
    let depth = Number(child.props.depth ?? 0);
    const dashes = label.match(/^(— )+/);

    if (dashes && !child.props.depth) {
      depth = dashes[0].length / 2;
      label = label.slice(dashes[0].length);
    }

    items.push({
      type: 'option',
      value: String(child.props.value ?? ''),
      label,
      depth,
      disabled: Boolean(child.props.disabled),
    });
  });

  return items;
}

export default function SelectMenu({
  id,
  name,
  icon,
  size = 'default',
  invalid = false,
  value,
  onChange,
  required,
  disabled,
  children,
}) {
  const listId = useId();
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const items = useMemo(() => parseOptions(children), [children]);
  const options = items.filter((item) => item.type === 'option');
  const selected = options.find((item) => item.value === String(value ?? '')) || options[0];
  const padding = SIZE_CLASS[size] || SIZE_CLASS.default;

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handlePointer(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKey(event) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  function choose(option) {
    if (option.disabled) {
      return;
    }

    onChange?.({ target: { name, value: option.value } });
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative w-full">
      <select id={id} name={name} value={value ?? ''} required={required} disabled={disabled} tabIndex={-1} onChange={onChange} className="sr-only">
        {options.map((option) => (
          <option key={option.value || 'empty'} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((current) => !current)}
        className={`flex w-full items-center rounded-xl bg-surface-container-low text-start ring-1 transition-shadow ${
          invalid ? 'ring-error' : open ? 'ring-2 ring-primary' : 'ring-transparent hover:ring-outline-variant'
        } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
      >
        {icon ? (
          <MaterialIcon name={icon} className="pointer-events-none ms-3 shrink-0 text-[20px] text-on-surface-variant/50" />
        ) : null}
        <span className={`min-w-0 flex-1 truncate text-on-surface ${padding}`}>{selected?.label || '—'}</span>
        <MaterialIcon
          name="expand_more"
          className={`me-3 shrink-0 text-[20px] text-on-surface-variant/50 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute inset-x-0 z-[80] mt-1.5 max-h-64 overflow-auto rounded-2xl border border-outline-variant bg-surface-container-lowest py-1.5 shadow-lg"
        >
          {items.map((item, index) => {
            if (item.type === 'heading') {
              return (
                <li
                  key={`heading-${item.label}-${index}`}
                  className="px-3 pt-2 pb-1 text-[11px] font-semibold tracking-[0.12em] text-on-surface-variant uppercase"
                >
                  {item.label}
                </li>
              );
            }

            const active = String(value ?? '') === item.value;

            return (
              <li key={`${item.value}-${index}`} role="option" aria-selected={active}>
                <button
                  type="button"
                  disabled={item.disabled}
                  onClick={() => choose(item)}
                  style={{ paddingInlineStart: `${0.75 + item.depth * 0.85}rem` }}
                  className={`flex w-full items-center gap-2 py-2.5 pe-3 text-start text-sm transition-colors disabled:opacity-40 ${
                    active
                      ? 'bg-primary/10 font-semibold text-primary'
                      : 'text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {item.depth > 0 ? (
                    <span className="h-px w-2.5 shrink-0 bg-outline-variant" aria-hidden />
                  ) : null}
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  {active ? <MaterialIcon name="check" className="shrink-0 text-[18px]" /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
