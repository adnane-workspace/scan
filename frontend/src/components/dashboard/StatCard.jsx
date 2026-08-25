import MaterialIcon from '../ui/MaterialIcon.jsx';

export default function StatCard({ label, value, icon, loading, hint }) {
  return (
    <article className="group rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-[0_1px_2px_rgba(31,37,35,0.04)] transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(31,37,35,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-on-surface-variant uppercase">
          {label}
        </p>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-container text-primary">
          <MaterialIcon name={icon} className="text-[20px]" />
        </span>
      </div>

      {loading ? (
        <div className="mt-4 h-9 w-16 animate-pulse rounded-md bg-surface-container-high" />
      ) : (
        <p className="mt-4 text-[2rem] leading-none font-semibold tracking-tight text-on-surface">{value}</p>
      )}

      {hint && !loading ? <p className="mt-2 text-sm text-on-surface-variant">{hint}</p> : null}
    </article>
  );
}
