import { useState } from 'react';
import { Link, Navigate, useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useLocale } from '../hooks/useLocale.js';
import { createPlatformCafe } from '../services/platform.service.js';
import { getApiError } from '../utils/apiError.js';
import { getHomePath } from '../utils/paths.js';
import Field from '../components/ui/Field.jsx';

const emptyForm = {
  ownerName: '',
  email: '',
  password: '',
  cafeName: '',
  slug: '',
};

export default function CreateCafePage() {
  const { user } = useAuth();
  const { t } = useLocale();
  const navigate = useNavigate();
  const { refreshPlatformOverview } = useOutletContext();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (user?.role !== 'superadmin') {
    return <Navigate to={getHomePath(user)} replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const cafe = await createPlatformCafe({
        ownerName: form.ownerName,
        email: form.email,
        password: form.password,
        cafeName: form.cafeName,
        slug: form.slug.trim() || undefined,
      });
      await refreshPlatformOverview?.();
      navigate(`/platform/cafes/${cafe._id}`, { replace: true });
    } catch (err) {
      setError(getApiError(err, t, 'platform.createError'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-2xl space-y-5">
      <Link to="/platform/cafes" className="text-sm font-semibold text-primary hover:underline">
        {t('platform.allCafes')}
      </Link>

      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-on-surface">{t('platform.createTitle')}</h1>
        <p className="mt-1 text-on-surface-variant">
          {t('platform.createHint')}
        </p>
      </div>

      {error ? (
        <p className="rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm text-error">{error}</p>
      ) : null}

      <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant/20">
        <Field name="cafeName" label={t('platform.cafeName')} icon="storefront" value={form.cafeName} onChange={handleChange} required />
        <Field
          name="slug"
          label={t('platform.slugOptional')}
          icon="link"
          value={form.slug}
          onChange={handleChange}
          placeholder={t('auth.slugPlaceholder')}
        />
        <Field name="ownerName" label={t('platform.ownerName')} icon="badge" value={form.ownerName} onChange={handleChange} required />
        <Field
          name="email"
          type="email"
          label={t('platform.ownerEmail')}
          icon="mail"
          value={form.email}
          onChange={handleChange}
          autoComplete="off"
          required
        />
        <Field
          name="password"
          type="password"
          label={t('platform.password')}
          icon="lock"
          value={form.password}
          onChange={handleChange}
          minLength={8}
          autoComplete="new-password"
          required
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-primary px-6 py-3 text-label-lg font-semibold tracking-[0.05em] text-on-primary shadow-md disabled:opacity-60"
        >
          {saving ? t('platform.creating') : t('platform.create')}
        </button>
      </form>
    </section>
  );
}
