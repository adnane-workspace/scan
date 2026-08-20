export default function PlaceholderPage({ title, description, children }) {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-2 max-w-2xl text-slate-600">{description}</p>
      </div>
      {children}
    </section>
  );
}
