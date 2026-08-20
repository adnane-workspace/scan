import { Link } from 'react-router-dom';

export default function MenuPreviewCard({ cafe }) {
  const menuPath = cafe?.slug ? `/menu/${cafe.slug}` : '/menu/cafe';

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Votre menu</h2>
      <p className="mt-1 text-sm text-slate-500">
        {cafe?.name ? `Menu public de ${cafe.name}.` : 'Le lien public du menu sera bientôt disponible.'}
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          to={menuPath}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Voir le menu
        </Link>
        <Link
          to={menuPath}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400"
        >
          QR Code
        </Link>
      </div>
    </section>
  );
}
