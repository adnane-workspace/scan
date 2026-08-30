import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import MarketingLink from '../components/common/MarketingLink.jsx';
import AuthBrandPanel from '../components/auth/AuthBrandPanel.jsx';
import AuthField from '../components/auth/AuthField.jsx';
import BrandLogo from '../components/ui/BrandLogo.jsx';
import LanguageSwitcher from '../components/ui/LanguageSwitcher.jsx';
import MaterialIcon from '../components/ui/MaterialIcon.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useLocale } from '../hooks/useLocale.js';
import { startTrialRequest } from '../services/auth.service.js';
import { getApiError } from '../utils/apiError.js';
import { getHomePath } from '../utils/paths.js';

export default function TrialPage() {
  const { isAuthenticated, isReady, acceptSession, user } = useAuth();
  const { t } = useLocale();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    cafeName: '',
    city: '',
  });
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
      const result = await startTrialRequest(form);
      const nextUser = acceptSession(result.token, result.user);
      navigate(getHomePath(nextUser), { replace: true });
    } catch (err) {
      setError(getApiError(err, t, 'auth.trialError'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-background text-on-surface lg:grid-cols-2">
      <AuthBrandPanel />

      <section className="relative flex min-h-screen items-center justify-center overflow-y-auto px-4 py-10 sm:px-8">
        <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/8 blur-[90px] lg:hidden" />
        <div className="absolute top-4 end-4 z-20 sm:top-6 sm:end-6">
          <LanguageSwitcher />
        </div>

        <div className="relative z-10 w-full max-w-[420px] py-8">
          <div className="mb-8 flex flex-col items-center text-center lg:items-start lg:text-start">
            <div className="mb-5 lg:hidden">
              <MarketingLink to="/" aria-label={t('landing.navHome')}>
                <BrandLogo />
              </MarketingLink>
            </div>
            <h2 className="font-display text-headline-lg font-semibold tracking-tight text-on-surface sm:text-4xl">
              {t('auth.trialTitle')}
            </h2>
            <p className="mt-2 text-on-surface-variant">{t('auth.trialSubtitle')}</p>
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
              errorId="trial-error"
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
              errorId="trial-error"
            />
            <AuthField
              id="phone"
              label={t('auth.phone')}
              type="tel"
              icon="call"
              value={form.phone}
              onChange={handleChange}
              autoComplete="tel"
              invalid={Boolean(error)}
              errorId="trial-error"
            />
            <AuthField
              id="cafeName"
              label={t('auth.cafeName')}
              icon="storefront"
              value={form.cafeName}
              onChange={handleChange}
              autoComplete="organization"
              invalid={Boolean(error)}
              errorId="trial-error"
            />
            <AuthField
              id="city"
              label={t('auth.city')}
              icon="location_city"
              value={form.city}
              onChange={handleChange}
              autoComplete="address-level2"
              required={false}
              invalid={Boolean(error)}
              errorId="trial-error"
            />

            {error ? (
              <p id="trial-error" role="alert" className="rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm text-error">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-label-lg font-semibold tracking-[0.05em] text-on-primary shadow-md transition-all hover:bg-primary/90 hover:shadow-lg active:scale-[0.98] disabled:opacity-60"
            >
              {isSubmitting ? t('auth.trialSubmitting') : t('auth.trialSubmit')}
              <MaterialIcon name="arrow_forward" className="text-[20px]" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-on-surface-variant lg:text-start">
            {t('auth.trialOwnAccount')}{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              {t('auth.createCafe')}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
