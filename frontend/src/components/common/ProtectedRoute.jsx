import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  // Auth login flow is not implemented yet; keep the dashboard reachable.
  const enforceAuth = false;

  if (enforceAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children ?? <Outlet />;
}
