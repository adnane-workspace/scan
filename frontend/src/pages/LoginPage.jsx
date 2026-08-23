import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import MaterialIcon from '../components/ui/MaterialIcon.jsx';
import { useAuth } from '../hooks/useAuth.js';

function Field({
  id,
  label,
  type = 'text',
  icon,
  value,
  onChange,
  placeholder,
  autoComplete,
  minLength,
  invalid,
  children,
}) {
  return (
    <div className="group flex flex-col gap-1.5">
      <label htmlFor={id} className="text-label-md font-medium tracking-wider text-on-surface-variant uppercase">
        {label}
      </label>
      <div
        className={`flex items-center rounded-xl bg-surface-container-low ring-1 transition-shadow ${
          invalid
            ? 'ring-error focus-within:ring-2 focus-within:ring-error'
            : 'ring-transparent focus-within:ring-2 focus-within:ring-primary'
        }`}
      >
        <MaterialIcon
          name={icon}
          className="ml-3 pointer-events-none text-[20px] text-on-surface-variant/50 group-focus-within:text-primary"
        />
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          minLength={minLength}
          required
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? 'login-error' : undefined}
          className="w-full bg-transparent px-3 py-3.5 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none"
        />
        {children}
      </div>
    </div>
  );
}

export default function LoginPage() {
  const { isAuthenticated, isReady, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isReady) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-pulse rounded-full bg-surface-container-high" />
      </main>
    );
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
      setError(err.response?.data?.message || 'Impossible de se connecter');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-background text-on-surface lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-[#16110e] text-[#fff8f3] lg:flex lg:flex-col lg:justify-between lg:px-14 lg:py-14 xl:px-16">
        <div className="pointer-events-none absolute -top-24 -left-16 h-80 w-80 rounded-full bg-primary-container/40 blur-[110px]" />
        <div className="pointer-events-none absolute right-0 bottom-0 h-96 w-96 translate-x-1/4 translate-y-1/4 rounded-full bg-tertiary/30 blur-[120px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:22px_22px]" />

        <div className="relative z-10 flex items-center gap-3">
          <img src="/epicurean-logo.png" alt="" className="h-12 w-12 rounded-xl bg-[#fff8f3] object-contain p-1.5" />
          <span className="font-display text-2xl tracking-tight">Epicurean</span>
        </div>

        <div className="relative z-10 max-w-md">
          <p className="text-label-md font-semibold tracking-[0.18em] text-primary-container uppercase">Menu digital</p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.15] tracking-tight xl:text-6xl">
            Le menu QR de votre café.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-[#fff8f3]/72">
            Un lien, un scan, votre carte. Gérez catégories, photos et disponibilité depuis un seul espace.
          </p>
        </div>

        <ul className="relative z-10 space-y-4 text-sm text-[#fff8f3]/80">
          <li className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8">
              <MaterialIcon name="qr_code_2" className="text-[20px]" />
            </span>
            QR code prêt à poser sur les tables
          </li>
          <li className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8">
              <MaterialIcon name="restaurant_menu" className="text-[20px]" />
            </span>
            Menu public, toujours à jour
          </li>
          <li className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8">
              <MaterialIcon name="dashboard" className="text-[20px]" />
            </span>
            Tableau de bord pour le gérant
          </li>
        </ul>
      </aside>

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-8">
        <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/8 blur-[90px] lg:hidden" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-tertiary/10 blur-[80px] lg:hidden" />

        <div className="relative z-10 w-full max-w-[420px]">
          <div className="mb-8 flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="mb-5 flex items-center gap-3 lg:hidden">
              <img src="/epicurean-logo.png" alt="" className="h-12 w-12 rounded-xl bg-surface-container-lowest object-contain p-1.5 shadow-sm" />
              <span className="font-display text-2xl tracking-tight text-primary">Epicurean</span>
            </div>
            <h2 className="font-display text-headline-lg font-semibold tracking-tight text-on-surface sm:text-4xl">
              Connexion
            </h2>
            <p className="mt-2 text-on-surface-variant">Accédez à l’espace de gestion de votre café.</p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Field
              id="email"
              label="Email"
              type="email"
              icon="mail"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="contact@restaurant.com"
              autoComplete="email"
              invalid={Boolean(error)}
            />

            <Field
              id="password"
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'}
              icon="lock"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              minLength={8}
              invalid={Boolean(error)}
            >
              <button
                type="button"
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                className="mr-2 rounded-lg p-2 text-on-surface-variant/50 transition-colors hover:text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => setShowPassword((visible) => !visible)}
              >
                <MaterialIcon name={showPassword ? 'visibility_off' : 'visibility'} className="text-[20px]" />
              </button>
            </Field>

            {error ? (
              <p
                id="login-error"
                role="alert"
                className="rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm text-error"
              >
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-label-lg font-semibold tracking-[0.05em] text-on-primary shadow-md transition-all hover:bg-primary/90 hover:shadow-lg active:scale-[0.98] disabled:opacity-60"
            >
              {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
              <MaterialIcon name="arrow_forward" className="text-[20px]" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-on-surface-variant lg:text-left">
            Pas encore de compte ?{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Créer un café
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
