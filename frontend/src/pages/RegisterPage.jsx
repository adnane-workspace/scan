import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const inputClass =
  'w-full bg-transparent px-3 py-3 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none';

export default function RegisterPage() {
  const { isAuthenticated, isReady, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    cafeName: '',
    slug: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isReady) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        cafeName: form.cafeName,
        slug: form.slug.trim() || undefined,
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de créer le compte');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-on-surface">
      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-surface">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-container/10 via-transparent to-primary/5 mix-blend-multiply" />
        </div>

        <div className="relative z-10 w-full max-w-md px-4 py-8 sm:px-0">
          <div className="flex flex-col gap-5 rounded-2xl bg-surface-container-lowest/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="flex flex-col items-center gap-1 text-center">
              <h1 className="font-display text-headline-lg font-semibold tracking-tight text-on-surface">
                Créer un café
              </h1>
              <p className="text-on-surface-variant">Ouvrez votre espace et votre menu public.</p>
            </div>

            <form className="flex w-full flex-col gap-3" onSubmit={handleSubmit}>
              <label className="text-label-md font-medium text-on-surface-variant">
                Votre nom
                <input name="name" value={form.name} onChange={handleChange} className={inputClass} required />
              </label>
              <label className="text-label-md font-medium text-on-surface-variant">
                Email
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass}
                  autoComplete="email"
                  required
                />
              </label>
              <label className="text-label-md font-medium text-on-surface-variant">
                Mot de passe
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className={inputClass}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </label>
              <label className="text-label-md font-medium text-on-surface-variant">
                Nom du café
                <input name="cafeName" value={form.cafeName} onChange={handleChange} className={inputClass} required />
              </label>
              <label className="text-label-md font-medium text-on-surface-variant">
                Slug public (optionnel)
                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="mon-cafe"
                />
              </label>

              {error ? <p className="text-sm text-error">{error}</p> : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 rounded-lg bg-primary px-6 py-3.5 text-label-lg font-semibold tracking-[0.05em] text-on-primary shadow-md disabled:opacity-60"
              >
                {isSubmitting ? 'Création...' : 'Créer mon espace'}
              </button>
            </form>

            <p className="text-center text-sm text-on-surface-variant">
              Déjà un compte ?{' '}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
