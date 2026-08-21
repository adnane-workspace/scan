import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import MaterialIcon from '../components/ui/MaterialIcon.jsx';
import { useAuth } from '../hooks/useAuth.js';

export default function LoginPage() {
  const { isAuthenticated, isReady, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isReady) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Impossible de se connecter';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-on-surface">
      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-surface">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-container/10 via-transparent to-primary/5 mix-blend-multiply" />
          <div className="pointer-events-none absolute top-1/4 left-1/4 h-[40vw] w-[40vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-container/20 opacity-50 blur-[100px]" />
          <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-[30vw] w-[30vw] translate-x-1/2 translate-y-1/2 rounded-full bg-tertiary-container/15 opacity-40 blur-[80px]" />
        </div>

        <div className="relative z-10 w-full max-w-md px-4 sm:px-0">
          <div className="flex flex-col gap-stack-lg rounded-2xl bg-surface-container-lowest/80 p-stack-lg shadow-2xl backdrop-blur-xl sm:p-container">
            <div className="mb-1 flex flex-col items-center justify-center gap-1">
              <div className="mb-2 flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-surface-container shadow-inner">
                <img
                  src="/epicurean-logo.png"
                  alt="Epicurean"
                  className="h-full w-full object-contain p-2 mix-blend-multiply"
                />
              </div>
              <h1 className="text-center font-display text-headline-lg font-semibold tracking-tight text-on-surface">
                Accès Administrateur
              </h1>
              <p className="text-center text-on-surface-variant">
                Veuillez vous identifier pour accéder à votre espace de gestion.
              </p>
            </div>

            <form className="flex w-full flex-col gap-3" onSubmit={handleSubmit}>
              <div className="group relative flex flex-col gap-1">
                <label
                  htmlFor="email"
                  className="pl-1 text-label-md font-medium tracking-wider text-on-surface-variant uppercase transition-colors group-focus-within:text-primary"
                >
                  Email Professionnel
                </label>
                <div className="relative flex items-center overflow-hidden rounded-lg bg-surface-container-low transition-all duration-300 group-focus-within:bg-surface-container-lowest group-focus-within:shadow-[0_0_0_2px_var(--color-primary)]">
                  <MaterialIcon name="mail" className="ml-3 pointer-events-none text-on-surface-variant/50 transition-colors group-focus-within:text-primary" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full bg-transparent px-3 py-3 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none"
                    placeholder="contact@restaurant.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="group relative flex flex-col gap-1">
                <label
                  htmlFor="password"
                  className="pl-1 text-label-md font-medium tracking-wider text-on-surface-variant uppercase transition-colors group-focus-within:text-primary"
                >
                  Mot de passe
                </label>
                <div className="relative flex items-center overflow-hidden rounded-lg bg-surface-container-low transition-all duration-300 group-focus-within:bg-surface-container-lowest group-focus-within:shadow-[0_0_0_2px_var(--color-primary)]">
                  <MaterialIcon name="lock" className="ml-3 pointer-events-none text-on-surface-variant/50 transition-colors group-focus-within:text-primary" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full bg-transparent px-3 py-3 font-mono tracking-widest text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    className="mr-2 rounded-md p-2 text-on-surface-variant/50 transition-colors hover:text-on-surface-variant focus:ring-2 focus:ring-primary/50 focus:outline-none"
                    onClick={() => setShowPassword((visible) => !visible)}
                  >
                    <MaterialIcon name={showPassword ? 'visibility_off' : 'visibility'} className="text-[20px]" />
                  </button>
                </div>
              </div>

              {error ? <p className="text-sm text-error">{error}</p> : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative mt-1 flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary px-6 py-3.5 text-label-lg font-semibold tracking-[0.05em] text-on-primary shadow-md transition-all duration-300 hover:bg-primary/90 hover:shadow-lg active:scale-[0.98] disabled:opacity-60"
              >
                <span className="absolute inset-0 h-full w-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                <span className="relative z-10">{isSubmitting ? 'Connexion en cours...' : 'Se connecter'}</span>
                <MaterialIcon name="arrow_forward" className="relative z-10 text-[20px]" />
              </button>
            </form>

            <div className="mt-1 border-t border-on-surface-variant/10 pt-3 text-center">
              <p className="flex items-center justify-center gap-2 text-label-md font-medium text-on-surface-variant/60">
                <MaterialIcon name="lock" className="text-[16px]" />
                Connexion sécurisée Epicurean OS
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
