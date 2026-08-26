import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useLocale } from '../../hooks/useLocale.js';
import { getHomePath } from '../../utils/paths.js';

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, isReady, user } = useAuth();
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

  if (roles?.length && !roles.includes(user?.role)) {
    return <Navigate to={getHomePath(user)} replace />;
  }

  return children ?? <Outlet />;
}
