import { useMemo, useState } from 'react';
import { Link, Navigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { updatePlatformCafe } from '../services/platform.service.js';
import { formatDate } from '../utils/format.js';

const fieldClass =
  'w-full rounded-lg bg-surface-container-highest px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary';

function matchesDateRange(createdAt, from, to) {
  const time = new Date(createdAt).setHours(0, 0, 0, 0);

  if (from) {
    const start = new Date(from).setHours(0, 0, 0, 0);
    if (time < start) {
      return false;
    }
  }

  if (to) {
    const end = new Date(to).setHours(0, 0, 0, 0);
    if (time > end) {
      return false;
    }
  }

  return true;
}

export default function CafesPage() {
  const { user } = useAuth();
  const { platformCafes = [], loading, error, refreshCafes } = useOutletContext();
  const [actionError, setActionError] = useState('');
  const [pendingId, setPendingId] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const filteredCafes = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return platformCafes.filter((cafe) => {
      const matchesQuery =
        !needle ||
        cafe.name.toLowerCase().includes(needle) ||
        cafe.slug.toLowerCase().includes(needle) ||
        (cafe.ownerEmail || '').toLowerCase().includes(needle);

      const matchesStatus =
        status === 'all' || (status === 'active' ? cafe.isActive : !cafe.isActive);

      return matchesQuery && matchesStatus && matchesDateRange(cafe.createdAt, from, to);
    });
  }, [platformCafes, query, status, from, to]);

  if (user?.role !== 'superadmin') {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleToggle(cafe) {
    setActionError('');
    setPendingId(cafe._id);

    try {
      await updatePlatformCafe(cafe._id, { isActive: !cafe.isActive });
      await refreshCafes?.();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Impossible de mettre à jour le café');
    } finally {
      setPendingId('');
    }
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-on-surface">Cafés</h1>
          <p className="mt-1 text-on-surface-variant">
            Recherche, filtres et fiche. Désactiver cache le menu et le login du gérant.
          </p>
        </div>
        <Link
          to="/dashboard/cafes/new"
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary shadow-md"
        >
          Créer un café
        </Link>
      </div>

      <div className="grid gap-3 rounded-2xl bg-surface-container-lowest p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-sm font-medium text-on-surface">
          Recherche
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className={`mt-1 ${fieldClass}`}
            placeholder="Nom, slug ou email"
          />
        </label>
        <label className="text-sm font-medium text-on-surface">
          Statut
          <select value={status} onChange={(event) => setStatus(event.target.value)} className={`mt-1 ${fieldClass}`}>
            <option value="all">Tous</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
          </select>
        </label>
        <label className="text-sm font-medium text-on-surface">
          Inscrit depuis
          <input type="date" value={from} onChange={(event) => setFrom(event.target.value)} className={`mt-1 ${fieldClass}`} />
        </label>
        <label className="text-sm font-medium text-on-surface">
          Inscrit jusqu’au
          <input type="date" value={to} onChange={(event) => setTo(event.target.value)} className={`mt-1 ${fieldClass}`} />
        </label>
      </div>

      {error || actionError ? (
        <p className="rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm text-error">
          {actionError || error}
        </p>
      ) : null}

      <p className="text-sm text-on-surface-variant">
        {loading ? 'Chargement...' : `${filteredCafes.length} / ${platformCafes.length} café(s)`}
      </p>

      <div className="overflow-x-auto rounded-2xl bg-surface-container-lowest shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-outline-variant/30 text-on-surface-variant">
            <tr>
              <th className="px-4 py-3 font-semibold">Café</th>
              <th className="px-4 py-3 font-semibold">Gérant</th>
              <th className="px-4 py-3 font-semibold">Menu</th>
              <th className="px-4 py-3 font-semibold">Inscrit</th>
              <th className="px-4 py-3 font-semibold">Statut</th>
              <th className="px-4 py-3 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-on-surface-variant" colSpan={6}>
                  Chargement...
                </td>
              </tr>
            ) : filteredCafes.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-on-surface-variant" colSpan={6}>
                  Aucun café pour ces filtres.
                </td>
              </tr>
            ) : (
              filteredCafes.map((cafe) => (
                <tr key={cafe._id} className="border-t border-outline-variant/20">
                  <td className="px-4 py-3">
                    <Link to={`/dashboard/cafes/${cafe._id}`} className="font-medium text-primary hover:underline">
                      {cafe.name}
                    </Link>
                    <p className="text-on-surface-variant">{cafe.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant">{cafe.ownerEmail || '—'}</td>
                  <td className="px-4 py-3 text-on-surface-variant">
                    {cafe.categoryCount} cat. · {cafe.productCount} prod.
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant">{formatDate(cafe.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className={cafe.isActive ? 'text-primary' : 'text-error'}>
                      {cafe.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/menu/${cafe.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg px-3 py-1.5 text-sm font-semibold text-primary hover:underline"
                      >
                        Menu
                      </Link>
                      <button
                        type="button"
                        disabled={pendingId === cafe._id}
                        onClick={() => handleToggle(cafe)}
                        className="rounded-lg bg-surface-container-high px-3 py-1.5 text-sm font-semibold text-on-surface disabled:opacity-60"
                      >
                        {cafe.isActive ? 'Désactiver' : 'Activer'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
