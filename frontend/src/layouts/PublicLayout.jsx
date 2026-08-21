import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <Outlet />
    </div>
  );
}
