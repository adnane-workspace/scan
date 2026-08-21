import MaterialIcon from '../ui/MaterialIcon.jsx';

function Sparkline() {
  return (
    <svg className="h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 30">
      <path
        className="drop-shadow-md"
        d="M0,25 L10,20 L20,22 L30,15 L40,18 L50,10 L60,12 L70,5 L80,8 L90,2 L100,0"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <path
        d="M0,25 L10,20 L20,22 L30,15 L40,18 L50,10 L60,12 L70,5 L80,8 L90,2 L100,0 L100,30 L0,30 Z"
        fill="url(#sparkline-gradient)"
        opacity="0.2"
      />
      <defs>
        <linearGradient id="sparkline-gradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function StatCard({
  label,
  value,
  icon,
  tone = 'primary',
  loading,
  wide = false,
  trend,
}) {
  const iconTone =
    tone === 'tertiary'
      ? 'text-tertiary bg-tertiary-container/20'
      : 'text-primary bg-primary-container/20';
  const blobTone = tone === 'tertiary' ? 'bg-tertiary/5' : 'bg-primary/5';

  return (
    <article
      className={`group relative flex flex-col gap-stack-sm overflow-hidden rounded-xl bg-surface-container p-stack-md shadow-sm transition-shadow hover:shadow-md ${
        wide ? 'md:col-span-2 xl:col-span-2' : ''
      }`}
    >
      <div className="z-10 mb-2 flex items-center justify-between">
        <span className="text-label-md tracking-wider text-on-surface-variant uppercase">
          {label}
        </span>
        {trend ? (
          <div className="flex items-center gap-1 text-primary">
            <MaterialIcon name="trending_up" className="text-sm" />
            <span className="text-label-md">{trend}</span>
          </div>
        ) : (
          <MaterialIcon name={icon} className={`rounded-lg p-2 ${iconTone}`} />
        )}
      </div>

      {loading ? (
        <div className="z-10 h-10 w-20 animate-pulse rounded-md bg-surface-container-high" />
      ) : wide ? (
        <div className="z-10 flex items-end justify-between">
          <div className="font-display text-display-md font-bold text-on-surface">{value}</div>
          <div className="h-12 w-32 text-primary">
            <Sparkline />
          </div>
        </div>
      ) : (
        <div className="z-10 font-display text-display-md font-bold text-on-surface">{value}</div>
      )}

      <div
        className={`absolute right-0 bottom-0 -mr-16 -mb-16 h-32 w-32 rounded-full transition-transform group-hover:scale-110 ${blobTone}`}
      />
    </article>
  );
}
