import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout.jsx';
import PublicLayout from './layouts/PublicLayout.jsx';
import { useLocale } from './hooks/useLocale.js';

const DashboardLayout = lazy(() => import('./layouts/DashboardLayout.jsx'));
const ActivityLogsPage = lazy(() => import('./pages/ActivityLogsPage.jsx'));
const StoragePage = lazy(() => import('./pages/StoragePage.jsx'));
const CafeDetailPage = lazy(() => import('./pages/CafeDetailPage.jsx'));
const CafesPage = lazy(() => import('./pages/CafesPage.jsx'));
const CreateCafePage = lazy(() => import('./pages/CreateCafePage.jsx'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));
const ProductsPage = lazy(() => import('./pages/ProductsPage.jsx'));
const PublicMenuLandingPage = lazy(() => import('./pages/PublicMenuLandingPage.jsx'));
const PublicMenuPage = lazy(() => import('./pages/PublicMenuPage.jsx'));
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'));
const SettingsPage = lazy(() => import('./pages/SettingsPage.jsx'));

function RouteFallback() {
  const { t } = useLocale();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-on-surface-variant">{t('common.loading')}</p>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="cafes" element={<CafesPage />} />
          <Route path="cafes/new" element={<CreateCafePage />} />
          <Route path="cafes/:id" element={<CafeDetailPage />} />
          <Route path="logs" element={<ActivityLogsPage />} />
          <Route path="storage" element={<StoragePage />} />
        </Route>

        <Route element={<PublicLayout />}>
          <Route path="/menu/:slug" element={<PublicMenuLandingPage />} />
          <Route path="/menu/:slug/categories" element={<PublicMenuPage />} />
          <Route path="/menu/:slug/:categoryId" element={<PublicMenuPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
