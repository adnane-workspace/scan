export default function StatCard({ label, value, icon, loading }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className="text-lg" aria-hidden="true">
          {icon}
        </span>
      </div>
      {loading ? (
        <div className="mt-3 h-8 w-16 animate-pulse rounded-md bg-slate-100" />
      ) : (
        <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
      )}
    </article>
  );
}
