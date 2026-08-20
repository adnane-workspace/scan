import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-900">
      <main className="mx-auto min-h-screen max-w-xl bg-[#faf7f2] pb-10">
        <Outlet />
      </main>
    </div>
  );
}
