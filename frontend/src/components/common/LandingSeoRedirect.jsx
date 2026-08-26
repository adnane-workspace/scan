import { Navigate, useLocation } from 'react-router-dom';
import { mapLandingSeoRedirect } from '../../utils/paths.js';

export default function LandingSeoRedirect() {
  const location = useLocation();
  const to = mapLandingSeoRedirect(location.pathname);

  return <Navigate to={to || '/'} replace />;
}
