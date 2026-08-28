import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useLocale } from '../hooks/useLocale.js';
import { getHomePath } from '../utils/paths.js';

export default function NotFoundPage() {
  const { t } = useLocale();
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center text-on-surface">
      <h1 className="font-display text-3xl font-semibold">{t('notFound.title')}</h1>
      <p className="text-on-surface-variant">{t('notFound.message')}</p>
      <Link to={isAuthenticated ? getHomePath(user) : '/'} className="font-semibold text-primary hover:underline">
        {t('notFound.back')}
      </Link>
    </div>
  );
}
