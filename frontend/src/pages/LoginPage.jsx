import PlaceholderPage from '../components/ui/PlaceholderPage.jsx';

export default function LoginPage() {
  return (
    <PlaceholderPage
      title="Login"
      description="Admin authentication will be connected to the JWT login endpoint in a later step."
    >
      <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="admin@cafe.com"
            disabled
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Password
          <input
            type="password"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="********"
            disabled
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-lg bg-slate-900 px-4 py-2 text-white"
          disabled
        >
          Sign in (coming soon)
        </button>
      </form>
    </PlaceholderPage>
  );
}
