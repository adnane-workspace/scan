import PlaceholderPage from '../components/ui/PlaceholderPage.jsx';
import { useHealth } from '../hooks/useHealth.js';

export default function DashboardPage() {
  const health = useHealth();

  return (
    <PlaceholderPage
      title="Dashboard"
      description="This admin overview will later show cafe stats, products, and the public QR menu link."
    >
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm font-medium text-slate-700">API status</p>
        <p className={`mt-1 text-sm ${health.ok ? 'text-emerald-700' : 'text-slate-500'}`}>
          {health.loading ? 'Checking API...' : health.message}
        </p>
      </div>
    </PlaceholderPage>
  );
}
