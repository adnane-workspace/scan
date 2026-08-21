import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import MaterialIcon from '../ui/MaterialIcon.jsx';

export default function QrCodeModal({ open, cafeName, menuUrl, slug, onClose }) {
  const [dataUrl, setDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open || !menuUrl) {
      setDataUrl('');
      setCopied(false);
      setError('');
      return undefined;
    }

    let cancelled = false;

    QRCode.toDataURL(menuUrl, {
      width: 512,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#121e1f',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (!cancelled) {
          setDataUrl(url);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Impossible de générer le QR code');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [open, menuUrl]);

  if (!open) {
    return null;
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(menuUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Impossible de copier le lien');
    }
  }

  function handleDownload() {
    if (!dataUrl) {
      return;
    }

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `menu-${slug || 'qr'}.png`;
    link.click();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
      <button type="button" className="absolute inset-0 bg-on-surface/40" aria-label="Fermer" onClick={onClose} />
      <section className="relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-surface-container-lowest p-6 shadow-xl sm:max-w-md sm:rounded-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-headline-md font-semibold text-on-surface">QR Code du menu</h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              {cafeName
                ? `Les clients scannent ce code pour ouvrir le menu de ${cafeName}.`
                : 'Les clients scannent ce code pour ouvrir le menu.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high"
            aria-label="Fermer"
          >
            <MaterialIcon name="close" />
          </button>
        </div>

        {error ? (
          <p className="mb-4 rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm text-error">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col items-center gap-4">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            {dataUrl ? (
              <img src={dataUrl} alt={`QR code du menu ${cafeName || ''}`.trim()} className="h-56 w-56" />
            ) : (
              <div className="flex h-56 w-56 items-center justify-center text-sm text-on-surface-variant">
                Génération...
              </div>
            )}
          </div>

          <p className="w-full break-all text-center text-sm text-on-surface-variant">{menuUrl}</p>

          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleDownload}
              disabled={!dataUrl}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-label-lg font-semibold tracking-[0.05em] text-on-primary disabled:opacity-50"
            >
              <MaterialIcon name="download" className="text-[20px]" />
              Télécharger PNG
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-surface-container-high px-4 py-3 text-label-lg font-semibold tracking-[0.05em] text-on-surface"
            >
              <MaterialIcon name={copied ? 'check' : 'content_copy'} className="text-[20px]" />
              {copied ? 'Lien copié' : 'Copier le lien'}
            </button>
          </div>

          <a
            href={menuUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-primary hover:text-primary-container"
          >
            Ouvrir le menu
          </a>
        </div>
      </section>
    </div>
  );
}
