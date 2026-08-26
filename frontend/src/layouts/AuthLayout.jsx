import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { APP_NAME } from '../utils/constants.js';

export default function AuthLayout() {
  useEffect(() => {
    document.title = APP_NAME;
  }, []);

  return <Outlet />;
}
