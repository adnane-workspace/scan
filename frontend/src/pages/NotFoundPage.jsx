import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center">
      <h1 className="text-3xl font-semibold text-slate-900">Page not found</h1>
      <p className="text-slate-600">The page you requested does not exist yet.</p>
      <Link to="/dashboard" className="text-amber-700 hover:underline">
        Back to dashboard
      </Link>
    </div>
  );
}
