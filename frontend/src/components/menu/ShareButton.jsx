import { useState } from 'react';
import { useLocale } from '../../hooks/useLocale.js';
import { shareOrCopy } from '../../utils/share.js';
import MaterialIcon from '../ui/MaterialIcon.jsx';

export default function ShareButton({ title, text, url, className = '', showLabel = false, variant = 'ghost' }) {
  const { t } = useLocale();
  const [status, setStatus] = useState('');

  async function handleShare() {
    try {
      const result = await shareOrCopy({ title, text, url });

      if (result === 'copied') {
        setStatus('copied');
        window.setTimeout(() => setStatus(''), 2000);
      }
    } catch {
      setStatus('error');
      window.setTimeout(() => setStatus(''), 2000);
    }
  }

  const label = status === 'copied' ? t('menu.shareCopied') : status === 'error' ? t('menu.shareError') : t('menu.share');

  const tone =
    variant === 'primary'
      ? 'h-12 w-full justify-center bg-[#0d1b2a] text-[#e8d5a8] shadow-[0_10px_24px_rgba(13,27,42,0.16)] hover:bg-[#162536]'
      : variant === 'sheet'
        ? 'h-12 w-full justify-center border border-[#0d1b2a]/12 bg-[#f7f6f3] text-[#0d1b2a] hover:border-[#c4a574]/60 hover:bg-white'
        : 'h-10 text-[#0d1b2a] hover:bg-[#0d1b2a]/6';

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`inline-flex items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors ${tone} ${className}`}
      aria-label={label}
    >
      <MaterialIcon name={status === 'copied' ? 'check' : 'ios_share'} className="text-[20px]" />
      <span className={showLabel ? '' : 'hidden sm:inline'}>{label}</span>
    </button>
  );
}
