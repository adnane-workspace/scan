import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useLocale } from '../../hooks/useLocale.js';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isReady } = useAuth();
  const { t } = useLocale();

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-on-surface-variant">
        {t('common.loading')}
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children ?? <Outlet />;
}
