import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import PlaceholderPage from '../components/ui/PlaceholderPage.jsx';
import { useAuth } from '../hooks/useAuth.js';

export default function LoginPage() {
  const { isAuthenticated, isReady, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isReady) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to sign in';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PlaceholderPage title="Login" description="Sign in to manage your cafe digital menu.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            placeholder="admin@example.com"
            autoComplete="email"
            required
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            placeholder="********"
            autoComplete="current-password"
            minLength={8}
            required
          />
        </label>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          className="w-full rounded-lg bg-slate-900 px-4 py-2 text-white disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </PlaceholderPage>
  );
}
