import { Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import PublicLayout from './layouts/PublicLayout.jsx';
import ActivityLogsPage from './pages/ActivityLogsPage.jsx';
import StoragePage from './pages/StoragePage.jsx';
import CafeDetailPage from './pages/CafeDetailPage.jsx';
import CafesPage from './pages/CafesPage.jsx';
import CreateCafePage from './pages/CreateCafePage.jsx';
import CategoriesPage from './pages/CategoriesPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import PublicMenuLandingPage from './pages/PublicMenuLandingPage.jsx';
import PublicMenuPage from './pages/PublicMenuPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
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
  );
}
