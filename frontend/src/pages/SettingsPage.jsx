import { useEffect, useState } from 'react';
import { Navigate, useOutletContext } from 'react-router-dom';
import MaterialIcon from '../components/ui/MaterialIcon.jsx';
import PasswordField from '../components/ui/PasswordField.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { changePasswordRequest } from '../services/auth.service.js';
import { getMyCafe, updateMyCafe, uploadCafeLogo } from '../services/cafe.service.js';

const fieldClass =
  'mt-1 w-full rounded-lg bg-surface-container-highest px-3 py-2 text-on-surface outline-none transition-shadow focus:ring-2 focus:ring-primary';

const emptyForm = {
  name: '',
  slug: '',
  description: '',
  logo: '',
  address: '',
  phone: '',
};

export default function SettingsPage() {
  const { user } = useAuth();
  const { refreshStats } = useOutletContext();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    if (user?.role === 'superadmin') {
      setLoading(false);
      return undefined;
    }

    let cancelled = false;

    getMyCafe()
      .then((cafe) => {
        if (!cancelled) {
          setForm({
            name: cafe.name || '',
            slug: cafe.slug || '',
            description: cafe.description || '',
            logo: cafe.logo || '',
            address: cafe.address || '',
            phone: cafe.phone || '',
          });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Impossible de charger le café');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user?.role]);

  if (user?.role === 'superadmin') {
    return <Navigate to="/dashboard" replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleImageChange(event) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    setUploading(true);
    setError('');

    try {
      const url = await uploadCafeLogo(file);
      setForm((current) => ({ ...current, logo: url }));
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible d’envoyer le logo');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const cafe = await updateMyCafe({
        name: form.name,
        slug: form.slug,
        description: form.description,
        logo: form.logo,
        address: form.address,
        phone: form.phone,
      });
      setForm({
        name: cafe.name || '',
        slug: cafe.slug || '',
        description: cafe.description || '',
        logo: cafe.logo || '',
        address: cafe.address || '',
        phone: cafe.phone || '',
      });
      setSuccess('Café mis à jour');
      await refreshStats?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible d’enregistrer');
    } finally {
      setSaving(false);
    }
  }

  function resetPasswordFields() {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('Les deux nouveaux mots de passe ne correspondent pas');
      return;
    }

    setPasswordSaving(true);

    try {
      await changePasswordRequest({ currentPassword, newPassword });
      resetPasswordFields();
      setShowPasswordForm(false);
      setPasswordSuccess('Mot de passe mis à jour');
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Impossible de changer le mot de passe');
    } finally {
      setPasswordSaving(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-2xl space-y-5">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-on-surface">Paramètres</h1>
        <p className="mt-1 text-on-surface-variant">Nom, slug public, coordonnées et logo du café.</p>
      </div>

      {error ? (
        <p className="rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm text-error">{error}</p>
      ) : null}
      {success ? (
        <p className="rounded-xl border border-primary/20 bg-primary-container px-4 py-3 text-sm text-on-primary-container">
          {success}
        </p>
      ) : null}

      {loading ? (
        <p className="text-on-surface-variant">Chargement...</p>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
          <label className="block text-sm font-medium text-on-surface">
            Nom *
            <input name="name" value={form.name} onChange={handleChange} className={fieldClass} required />
          </label>
          <label className="block text-sm font-medium text-on-surface">
            Slug public *
            <input name="slug" value={form.slug} onChange={handleChange} className={fieldClass} required />
          </label>
          <label className="block text-sm font-medium text-on-surface">
            Description
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={fieldClass} />
          </label>
          <label className="block text-sm font-medium text-on-surface">
            Adresse
            <input name="address" value={form.address} onChange={handleChange} className={fieldClass} />
          </label>
          <label className="block text-sm font-medium text-on-surface">
            Téléphone
            <input name="phone" value={form.phone} onChange={handleChange} className={fieldClass} />
          </label>
          <div>
            <p className="text-sm font-medium text-on-surface">Logo</p>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              {form.logo ? (
                <img src={form.logo} alt="Logo" className="h-24 w-24 rounded-lg object-cover" />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-surface-container-highest text-on-surface-variant">
                  <MaterialIcon name="image" />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <label className="inline-flex cursor-pointer rounded-xl bg-primary px-4 py-2 text-label-lg font-semibold tracking-[0.05em] text-on-primary">
                  {uploading ? 'Envoi...' : 'Choisir un logo'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={uploading} />
                </label>
                {form.logo ? (
                  <button
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, logo: '' }))}
                    className="text-sm font-medium text-error hover:underline"
                  >
                    Retirer le logo
                  </button>
                ) : null}
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={saving || uploading}
            className="rounded-xl bg-primary px-6 py-3 text-label-lg font-semibold tracking-[0.05em] text-on-primary shadow-md disabled:opacity-60"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </form>
      )}

      <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-on-surface">Mot de passe</h2>
        <p className="mt-1 text-sm text-on-surface-variant">
          Saisis le mot de passe actuel, puis le nouveau mot de passe et sa confirmation.
        </p>

        {passwordSuccess ? (
          <p className="mt-3 rounded-xl border border-primary/20 bg-primary-container px-4 py-3 text-sm text-on-primary-container">
            {passwordSuccess}
          </p>
        ) : null}
        {passwordError ? (
          <p className="mt-3 rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm text-error">
            {passwordError}
          </p>
        ) : null}

        {showPasswordForm ? (
          <form onSubmit={handlePasswordSubmit} className="mt-4 grid gap-4">
            <PasswordField
              label="Mot de passe actuel"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              show={showCurrent}
              onToggleShow={() => setShowCurrent((current) => !current)}
              autoComplete="current-password"
              minLength={1}
            />
            <PasswordField
              label="Nouveau mot de passe"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              show={showNew}
              onToggleShow={() => setShowNew((current) => !current)}
              placeholder="8 caractères minimum"
              minLength={8}
            />
            <PasswordField
              label="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              show={showConfirm}
              onToggleShow={() => setShowConfirm((current) => !current)}
              placeholder="Retape le nouveau mot de passe"
              minLength={8}
            />
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={passwordSaving}
                className="rounded-xl bg-primary px-6 py-3 text-label-lg font-semibold tracking-[0.05em] text-on-primary shadow-md disabled:opacity-60"
              >
                {passwordSaving ? 'Enregistrement...' : 'Mettre à jour'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm(false);
                  resetPasswordFields();
                  setPasswordError('');
                }}
                className="rounded-xl bg-surface-container-high px-5 py-2.5 text-sm font-semibold text-on-surface"
              >
                Annuler
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => {
              setShowPasswordForm(true);
              setPasswordSuccess('');
              setPasswordError('');
            }}
            className="mt-4 rounded-xl bg-surface-container-high px-5 py-2.5 text-sm font-semibold text-on-surface"
          >
            Changer le mot de passe
          </button>
        )}
      </div>
    </section>
  );
}
