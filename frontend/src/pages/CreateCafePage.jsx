import { useState } from 'react';
import { Link, Navigate, useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useLocale } from '../hooks/useLocale.js';
import { createPlatformCafe } from '../services/platform.service.js';

const fieldClass =
  'mt-1 w-full rounded-lg bg-surface-container-highest px-3 py-2 text-on-surface outline-none focus:ring-2 focus:ring-primary';

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
  const { refreshCafes } = useOutletContext();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (user?.role !== 'superadmin') {
    return <Navigate to="/dashboard" replace />;
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
      await refreshCafes?.();
      navigate(`/dashboard/cafes/${cafe._id}`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || t('platform.createError'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-2xl space-y-5">
      <Link to="/dashboard/cafes" className="text-sm font-semibold text-primary hover:underline">
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
        <label className="block text-sm font-medium text-on-surface">
          {t('platform.cafeName')}
          <input name="cafeName" value={form.cafeName} onChange={handleChange} className={fieldClass} required />
        </label>
        <label className="block text-sm font-medium text-on-surface">
          {t('platform.slugOptional')}
          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            className={fieldClass}
            placeholder={t('auth.slugPlaceholder')}
          />
        </label>
        <label className="block text-sm font-medium text-on-surface">
          {t('platform.ownerName')}
          <input name="ownerName" value={form.ownerName} onChange={handleChange} className={fieldClass} required />
        </label>
        <label className="block text-sm font-medium text-on-surface">
          {t('platform.ownerEmail')}
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className={fieldClass}
            autoComplete="off"
            required
          />
        </label>
        <label className="block text-sm font-medium text-on-surface">
          {t('platform.password')}
          <input
            name="password"
            type="text"
            value={form.password}
            onChange={handleChange}
            className={fieldClass}
            minLength={8}
            autoComplete="off"
            required
          />
        </label>
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
