import MaterialIcon from '../ui/MaterialIcon.jsx';

const fieldClass =
  'mt-1 w-full rounded-lg bg-surface-container-highest px-3 py-2 text-on-surface outline-none transition-shadow focus:ring-2 focus:ring-primary';

export default function CategoryFormModal({
  open,
  editing,
  form,
  saving,
  error,
  onClose,
  onChange,
  onSubmit,
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
      <button type="button" className="absolute inset-0 bg-on-surface/40" aria-label="Fermer" onClick={onClose} />
      <section className="relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-surface-container-lowest p-6 shadow-xl sm:max-w-xl sm:rounded-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-headline-md font-semibold text-on-surface">
              {editing ? 'Modifier la catégorie' : 'Nouvelle Catégorie'}
            </h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              {editing
                ? 'Mettez à jour le nom, la description et l\'ordre d\'affichage.'
                : 'Ajoutez une section à la structure de votre menu.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high"
            aria-label="Fermer"
          >
            <MaterialIcon name="close" />
          </button>
        </div>

        {error ? (
          <p className="mb-4 rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm text-error">
            {error}
          </p>
        ) : null}

        <form onSubmit={onSubmit} className="grid gap-4">
          <label className="block text-sm font-medium text-on-surface">
            Nom *
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className={fieldClass}
              placeholder="Cafés"
              required
            />
          </label>
          <label className="block text-sm font-medium text-on-surface">
            Ordre
            <input name="order" type="number" value={form.order} onChange={onChange} className={fieldClass} />
          </label>
          <label className="block text-sm font-medium text-on-surface">
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              rows={3}
              className={fieldClass}
              placeholder="Servi de 7h à 11h"
            />
          </label>
          <div className="mt-2 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-primary px-6 py-3 text-label-lg font-semibold tracking-[0.05em] text-on-primary shadow-md disabled:opacity-60"
            >
              {saving ? 'Enregistrement...' : editing ? 'Mettre à jour' : 'Créer'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-surface-container-high px-6 py-3 text-label-lg font-semibold tracking-[0.05em] text-on-surface"
            >
              Annuler
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
