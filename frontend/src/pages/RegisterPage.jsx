import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AuthBrandPanel from '../components/auth/AuthBrandPanel.jsx';
import AuthField from '../components/auth/AuthField.jsx';
import BrandLogo from '../components/ui/BrandLogo.jsx';
import LanguageSwitcher from '../components/ui/LanguageSwitcher.jsx';
import MaterialIcon from '../components/ui/MaterialIcon.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useLocale } from '../hooks/useLocale.js';
import { getApiError } from '../utils/apiError.js';
import { getHomePath } from '../utils/paths.js';

export default function RegisterPage() {
  const { isAuthenticated, isReady, register, user } = useAuth();
  const { t } = useLocale();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    cafeName: '',
    slug: '',
  });
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
    return <Navigate to={getHomePath(user)} replace />;
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
      const nextUser = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        cafeName: form.cafeName,
        slug: form.slug.trim() || undefined,
      });
      navigate(getHomePath(nextUser), { replace: true });
    } catch (err) {
      setError(getApiError(err, t, 'auth.registerError'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-background text-on-surface lg:grid-cols-2">
      <AuthBrandPanel />

      <section className="relative flex min-h-screen items-center justify-center overflow-y-auto px-4 py-10 sm:px-8">
        <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/8 blur-[90px] lg:hidden" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-tertiary/10 blur-[80px] lg:hidden" />

        <div className="absolute top-4 end-4 z-20 sm:top-6 sm:end-6">
          <LanguageSwitcher />
        </div>

        <div className="relative z-10 w-full max-w-[420px] py-8">
          <div className="mb-8 flex flex-col items-center text-center lg:items-start lg:text-start">
            <div className="mb-5 lg:hidden">
              <Link to="/" aria-label={t('landing.navHome')}>
                <BrandLogo />
              </Link>
            </div>
            <h2 className="font-display text-headline-lg font-semibold tracking-tight text-on-surface sm:text-4xl">
              {t('auth.registerTitle')}
            </h2>
            <p className="mt-2 text-on-surface-variant">{t('auth.registerSubtitle')}</p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <AuthField
              id="name"
              label={t('auth.yourName')}
              icon="person"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              invalid={Boolean(error)}
              errorId="register-error"
            />

            <AuthField
              id="email"
              label={t('auth.email')}
              type="email"
              icon="mail"
              value={form.email}
              onChange={handleChange}
              placeholder="contact@restaurant.com"
              autoComplete="email"
              invalid={Boolean(error)}
              errorId="register-error"
            />

            <AuthField
              id="password"
              label={t('auth.password')}
              type={showPassword ? 'text' : 'password'}
              icon="lock"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="new-password"
              minLength={8}
              invalid={Boolean(error)}
              errorId="register-error"
            >
              <button
                type="button"
                aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                className="me-2 rounded-lg p-2 text-on-surface-variant/50 transition-colors hover:text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => setShowPassword((visible) => !visible)}
              >
                <MaterialIcon name={showPassword ? 'visibility_off' : 'visibility'} className="text-[20px]" />
              </button>
            </AuthField>

            <AuthField
              id="cafeName"
              label={t('auth.cafeName')}
              icon="storefront"
              value={form.cafeName}
              onChange={handleChange}
              autoComplete="organization"
              invalid={Boolean(error)}
              errorId="register-error"
            />

            <AuthField
              id="slug"
              label={t('auth.slugOptional')}
              icon="link"
              value={form.slug}
              onChange={handleChange}
              placeholder={t('auth.slugPlaceholder')}
              required={false}
              invalid={Boolean(error)}
              errorId="register-error"
            />

            {error ? (
              <p
                id="register-error"
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
              {isSubmitting ? t('auth.creating') : t('auth.createSpace')}
              <MaterialIcon name="arrow_forward" className="text-[20px]" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-on-surface-variant lg:text-start">
            {t('auth.hasAccount')}{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              {t('auth.submit')}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
