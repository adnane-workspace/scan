import { useEffect, useState } from 'react';
import { fetchHealth } from '../services/health.service.js';

export function useHealth() {
  const [status, setStatus] = useState({
    loading: true,
    ok: false,
    message: 'Checking API...',
  });

  useEffect(() => {
    let cancelled = false;

    fetchHealth()
      .then((data) => {
        if (!cancelled) {
          setStatus({
            loading: false,
            ok: Boolean(data.success),
            message: data.message,
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus({
            loading: false,
            ok: false,
            message: 'API unreachable',
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return status;
}
