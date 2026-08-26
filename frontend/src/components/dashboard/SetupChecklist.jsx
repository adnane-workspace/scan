import { Link } from 'react-router-dom';
import { useLocale } from '../../hooks/useLocale.js';
import MaterialIcon from '../ui/MaterialIcon.jsx';

function storageKey(kind, slug) {
  return `qtable-setup-${kind}:${slug}`;
}

export function readSetupFlag(kind, slug) {
  if (!slug || typeof window === 'undefined') {
    return false;
  }

  try {
    return window.localStorage.getItem(storageKey(kind, slug)) === '1';
  } catch {
    return false;
  }
}

export function writeSetupFlag(kind, slug, value = true) {
  if (!slug || typeof window === 'undefined') {
    return;
  }

  try {
    const key = storageKey(kind, slug);
    if (value) {
      window.localStorage.setItem(key, '1');
    } else {
      window.localStorage.removeItem(key);
    }
  } catch {
    // Ignore private-mode / blocked storage.
  }
}

function cap(id) {
  return `${id.charAt(0).toUpperCase()}${id.slice(1)}`;
}

function StepAction({ step, isNext, qr, onOpenQr, onPreview, t, children }) {
  const cta = t(`dashboard.setupCta${cap(step.id)}`);

  if (step.done || step.locked || !isNext) {
    return children;
  }

  const actionClass =
    'mt-3 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary';

  if (step.id === 'qr') {
    return (
      <button type="button" className="w-full text-start" onClick={() => onOpenQr(qr?.canGenerate ? 'issue' : 'view')}>
        {children}
        <span className={actionClass}>
          {cta}
          <MaterialIcon name="arrow_forward" className="text-[18px]" />
        </span>
      </button>
    );
  }

  if (step.href) {
    return (
      <a href={step.href} target="_blank" rel="noreferrer" className="block" onClick={() => onPreview?.()}>
        {children}
        <span className={actionClass}>
          {cta}
          <MaterialIcon name="open_in_new" className="text-[18px]" />
        </span>
      </a>
    );
  }

  return (
    <Link to={step.to} className="block">
      {children}
      <span className={actionClass}>
        {cta}
        <MaterialIcon name="arrow_forward" className="text-[18px]" />
      </span>
    </Link>
  );
}

export default function SetupChecklist({
  stats,
  qr,
  menuUrl,
  previewSeen,
  dismissed,
  loading,
  onOpenQr,
  onPreview,
  onDismiss,
}) {
  const { t } = useLocale();
  const hasCategory = (stats.totalCategories || 0) > 0;
  const hasProduct = (stats.totalProducts || 0) > 0;
  const hasLogo = Boolean(stats.cafe?.logo);
  const hasQr = Boolean(qr?.generated);
  const steps = [
    { id: 'category', done: hasCategory, to: '/app/categories?new=1' },
    {
      id: 'product',
      done: hasProduct,
      to: hasCategory ? '/app/products?new=1' : '/app/categories?new=1',
      locked: !hasCategory,
    },
    { id: 'logo', done: hasLogo, to: '/app/settings?tab=general', locked: !hasProduct },
    { id: 'qr', done: hasQr, locked: !hasLogo },
    { id: 'preview', done: previewSeen, href: menuUrl, locked: !hasQr },
  ];
  const doneCount = steps.filter((step) => step.done).length;
  const nextIndex = steps.findIndex((step) => !step.done);
  const nextId = nextIndex >= 0 ? steps[nextIndex].id : null;
  const allDone = doneCount === steps.length;

  if (loading) {
    return (
      <section className="rounded-[18px] border border-outline-variant bg-surface-container-lowest p-6">
        <div className="h-5 w-48 animate-pulse rounded bg-surface-container-high" />
        <div className="mt-4 h-2 w-full animate-pulse rounded-full bg-surface-container-high" />
        <div className="mt-5 grid gap-3">
          {[0, 1, 2, 3, 4].map((item) => (
            <div key={item} className="h-20 animate-pulse rounded-xl bg-surface-container" />
          ))}
        </div>
      </section>
    );
  }

  if (allDone && dismissed) {
    return null;
  }

  if (allDone) {
    return (
      <section className="flex flex-col gap-4 rounded-[18px] border border-tertiary/25 bg-tertiary/8 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-tertiary/15 text-tertiary">
            <MaterialIcon name="check_circle" />
          </span>
          <div>
            <h2 className="font-display text-lg font-semibold text-on-surface">{t('dashboard.setupDoneTitle')}</h2>
            <p className="mt-1 text-sm text-on-surface-variant">{t('dashboard.setupDoneBody')}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {menuUrl ? (
            <a
              href={menuUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary"
            >
              {t('dashboard.setupViewMenu')}
              <MaterialIcon name="open_in_new" className="text-[18px]" />
            </a>
          ) : null}
          <button
            type="button"
            onClick={onDismiss}
            className="inline-flex items-center justify-center rounded-xl border border-outline-variant px-4 py-2.5 text-sm font-medium text-on-surface hover:bg-surface-container"
          >
            {t('dashboard.setupHide')}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[18px] border border-outline-variant bg-surface-container-lowest p-5 shadow-[0_1px_2px_rgba(31,37,35,0.04)] sm:p-7">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">{t('dashboard.setupBadge')}</p>
          <h2 className="mt-1 font-display text-xl font-semibold tracking-tight text-on-surface sm:text-2xl">
            {t('dashboard.setupTitle')}
          </h2>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-on-surface-variant">{t('dashboard.setupSubtitle')}</p>
        </div>
        <p className="text-sm font-semibold text-on-surface">
          {t('dashboard.setupProgress', { done: doneCount, total: steps.length })}
        </p>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-container">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300"
          style={{ width: `${Math.round((doneCount / steps.length) * 100)}%` }}
        />
      </div>

      <ol className="mt-6">
        {steps.map((step, index) => {
          const isNext = step.id === nextId;
          const isLast = index === steps.length - 1;
          const statusKey = step.done ? 'setupStatusDone' : isNext ? 'setupStatusNow' : 'setupStatusLater';

          return (
            <li key={step.id} className="flex gap-4">
              <div className="flex w-10 shrink-0 flex-col items-center">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                    step.done
                      ? 'bg-tertiary text-on-primary'
                      : isNext
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {step.done ? <MaterialIcon name="check" className="text-[20px]" /> : index + 1}
                </span>
                {isLast ? null : (
                  <span className={`my-1 w-0.5 flex-1 min-h-6 ${step.done ? 'bg-tertiary/50' : 'bg-outline-variant'}`} />
                )}
              </div>

              <div className={`min-w-0 flex-1 ${isLast ? 'pb-0' : 'pb-5'}`}>
                <StepAction step={step} isNext={isNext} qr={qr} onOpenQr={onOpenQr} onPreview={onPreview} t={t}>
                  <div
                    className={`rounded-2xl px-4 py-3.5 ${
                      step.done
                        ? 'bg-tertiary/8'
                        : isNext
                          ? 'bg-primary/8 ring-1 ring-primary/30'
                          : 'bg-surface-container'
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[11px] font-semibold tracking-[0.12em] text-on-surface-variant uppercase">
                        {t('dashboard.setupStepLabel', { n: index + 1 })}
                      </p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                          step.done
                            ? 'bg-tertiary/20 text-tertiary'
                            : isNext
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        {t(`dashboard.${statusKey}`)}
                      </span>
                    </div>
                    <p className="mt-1.5 font-display text-lg font-semibold text-on-surface">
                      {t(`dashboard.setup${cap(step.id)}`)}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                      {step.locked && !step.done
                        ? t(`dashboard.setup${cap(step.id)}Locked`)
                        : t(`dashboard.setup${cap(step.id)}Hint`)}
                    </p>
                  </div>
                </StepAction>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
