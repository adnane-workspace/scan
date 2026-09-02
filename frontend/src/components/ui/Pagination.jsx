import MaterialIcon from './MaterialIcon.jsx';
import { useLocale } from '../../hooks/useLocale.js';

export default function Pagination({ page, totalPages, total, onPageChange, disabled = false }) {
  const { t } = useLocale();

  if (!totalPages || totalPages <= 1) {
    return total > 0 ? (
      <p className="text-sm text-on-surface-variant">{t('pagination.total', { total })}</p>
    ) : null;
  }

  const pages = buildPageWindow(page, totalPages);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-on-surface-variant">
        {t('pagination.summary', { page, totalPages, total })}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={disabled || page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-high disabled:opacity-40"
          aria-label={t('pagination.prev')}
        >
          <MaterialIcon name="chevron_left" className="text-[20px] rtl:scale-x-[-1]" />
        </button>
        {pages.map((item, index) =>
          item === '…' ? (
            <span key={`gap-${index}`} className="px-1 text-on-surface-variant">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              disabled={disabled}
              onClick={() => onPageChange(item)}
              className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-semibold transition-colors ${
                item === page
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {item}
            </button>
          ),
        )}
        <button
          type="button"
          disabled={disabled || page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-high disabled:opacity-40"
          aria-label={t('pagination.next')}
        >
          <MaterialIcon name="chevron_right" className="text-[20px] rtl:scale-x-[-1]" />
        </button>
      </div>
    </div>
  );
}

function buildPageWindow(page, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages, page, page - 1, page + 1].filter((value) => value >= 1 && value <= totalPages));
  const sorted = [...pages].sort((a, b) => a - b);
  const result = [];

  for (let index = 0; index < sorted.length; index += 1) {
    const current = sorted[index];
    const previous = sorted[index - 1];

    if (index > 0 && current - previous > 1) {
      result.push('…');
    }

    result.push(current);
  }

  return result;
}
