import { useCallback, useMemo, useRef, useState } from 'react';
import MaterialIcon from '../components/ui/MaterialIcon.jsx';
import { ToastContext } from './toast-context.js';

const DEFAULT_DURATION = 3800;

function ToastItem({ toast, onDismiss }) {
  const tone =
    toast.type === 'error'
      ? 'border-error/25 bg-error-container text-error'
      : toast.type === 'info'
        ? 'border-outline-variant bg-surface-container-lowest text-on-surface'
        : 'border-[#0d1b2a]/10 bg-[#0d1b2a] text-white';

  const icon = toast.type === 'error' ? 'error' : toast.type === 'info' ? 'info' : 'check_circle';

  return (
    <div
      role="status"
      className={`pointer-events-auto flex w-[min(22rem,calc(100vw-2rem))] items-start gap-3 rounded-2xl border px-4 py-3 shadow-[0_16px_40px_rgba(13,27,42,0.2)] animate-[toastIn_220ms_cubic-bezier(0.22,1,0.36,1)] ${tone}`}
    >
      <MaterialIcon name={icon} className="mt-0.5 shrink-0 text-[22px]" />
      <p className="min-w-0 flex-1 text-sm font-medium leading-snug">{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 rounded-lg p-1 opacity-70 hover:opacity-100"
        aria-label="Close"
      >
        <MaterialIcon name="close" className="text-[18px]" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const dismiss = useCallback((id) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const push = useCallback(
    (message, type = 'success', duration = DEFAULT_DURATION) => {
      const text = String(message || '').trim();
      if (!text) {
        return;
      }

      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((current) => [...current.slice(-4), { id, message: text, type }]);

      if (duration > 0) {
        const timer = window.setTimeout(() => {
          dismiss(id);
        }, duration);
        timersRef.current.set(id, timer);
      }
    },
    [dismiss],
  );

  const toast = useMemo(
    () => ({
      success: (message, duration) => push(message, 'success', duration ?? DEFAULT_DURATION),
      error: (message, duration) => push(message, 'error', duration ?? DEFAULT_DURATION),
      info: (message, duration) => push(message, 'info', duration ?? DEFAULT_DURATION),
      dismiss,
    }),
    [push, dismiss],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed top-[max(1rem,env(safe-area-inset-top))] end-[max(1rem,env(safe-area-inset-right))] z-[100] flex flex-col items-end gap-2">
        {toasts.map((item) => (
          <ToastItem key={item.id} toast={item} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
