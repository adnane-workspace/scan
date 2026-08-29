import { useState } from 'react';
import { useLocale } from '../../hooks/useLocale.js';
import Field from '../ui/Field.jsx';
import MaterialIcon from '../ui/MaterialIcon.jsx';

export default function QrChangeRequestModal({ open, onClose, onSubmit, submitting, error }) {
  const { t } = useLocale();
  const [reason, setReason] = useState('');

  if (!open) {
    return null;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const ok = await onSubmit(reason.trim());

    if (ok) {
      setReason('');
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
      <button type="button" className="absolute inset-0 bg-on-surface/40" aria-label={t('common.close')} onClick={onClose} />
      <section className="relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-surface-container-lowest p-6 shadow-xl sm:max-w-md sm:rounded-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-headline-md font-semibold text-on-surface">{t('qr.requestTitle')}</h2>
            <p className="mt-1 text-sm text-on-surface-variant">{t('qr.requestHint')}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high"
            aria-label={t('common.close')}
          >
            <MaterialIcon name="close" />
          </button>
        </div>

        {error ? (
          <p className="mb-4 rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm text-error">{error}</p>
        ) : null}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <Field
            as="textarea"
            label={t('qr.requestReason')}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={4}
            minLength={8}
            maxLength={400}
            required
            placeholder={t('qr.requestPlaceholder')}
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={submitting || reason.trim().length < 8}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-label-lg font-semibold tracking-[0.05em] text-on-primary disabled:opacity-50"
            >
              {submitting ? t('common.saving') : t('qr.requestSubmit')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-surface-container-high px-4 py-3 text-label-lg font-semibold tracking-[0.05em] text-on-surface"
            >
              {t('common.cancel')}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
