export default function DashboardCard({ children, className = '' }) {
  return (
    <section
      className={`rounded-[18px] border border-outline-variant bg-surface-container-lowest p-5 shadow-[0_1px_2px_rgba(31,37,35,0.04)] sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}
