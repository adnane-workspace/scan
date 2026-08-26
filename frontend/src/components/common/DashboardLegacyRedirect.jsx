import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useLocale } from '../../hooks/useLocale.js';
import { mapLegacyDashboardPath } from '../../utils/paths.js';

export default function DashboardLegacyRedirect() {
  const { isAuthenticated, isReady, user } = useAuth();
  const { t } = useLocale();
  const location = useLocation();

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-on-surface-variant">{t('common.loading')}</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={mapLegacyDashboardPath(location.pathname, user)} replace />;
}
