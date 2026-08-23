import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import MaterialIcon from '../components/ui/MaterialIcon.jsx';
import { setPageMeta, usePublicMenu } from '../hooks/usePublicMenu.js';

function LandingStatus({ title, message }) {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-2xl font-semibold text-on-surface">{title}</h1>
      <p className="mt-2 max-w-md text-sm text-on-surface-variant">{message}</p>
    </div>
  );
}

export default function PublicMenuLandingPage() {
  const { slug } = useParams();
  const { menu, loading, errorStatus } = usePublicMenu(slug);

  useEffect(() => {
    if (menu?.cafe) {
      setPageMeta({
        title: menu.cafe.name,
        description: menu.cafe.description || `Bienvenue chez ${menu.cafe.name}`,
      });
      return;
    }

    if (errorStatus) {
      setPageMeta({
        title: 'Menu introuvable',
        description: "Ce menu n'est plus disponible.",
      });
    }
  }, [menu, errorStatus]);

  if (loading) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4">
        <div className="h-24 w-24 animate-pulse rounded-full bg-surface-container-high" />
        <div className="h-6 w-40 animate-pulse rounded-lg bg-surface-container-high" />
      </div>
    );
  }

  if (errorStatus === 403) {
    return <LandingStatus title="Menu indisponible" message="Ce café n'a actuellement pas de menu disponible." />;
  }

  if (errorStatus || !menu?.cafe) {
    return <LandingStatus title="Menu introuvable" message="Ce menu n'est plus disponible." />;
  }

  const { cafe } = menu;

  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-background px-6 py-12">
      <div className="pointer-events-none absolute top-1/4 left-1/4 h-[40vw] w-[40vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-container/15 blur-[100px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-[30vw] w-[30vw] translate-x-1/2 translate-y-1/2 rounded-full bg-tertiary-container/15 blur-[80px]" />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        {cafe.logo ? (
          <img
            src={cafe.logo}
            alt=""
            className="h-28 w-28 rounded-2xl object-cover shadow-md sm:h-32 sm:w-32"
          />
        ) : (
          <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-surface-container-lowest font-display text-4xl font-semibold text-primary shadow-md sm:h-32 sm:w-32">
            {cafe.name.slice(0, 1)}
          </div>
        )}

        <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-on-surface sm:text-5xl">
          {cafe.name}
        </h1>

        {cafe.description ? (
          <p className="mt-3 max-w-sm text-body-lg text-on-surface-variant">{cafe.description}</p>
        ) : null}

        {cafe.address || cafe.phone ? (
          <div className="mt-5 flex flex-col items-center gap-2 text-sm text-on-surface-variant">
            {cafe.address ? (
              <p className="inline-flex items-center gap-2">
                <MaterialIcon name="location_on" className="text-[18px]" />
                {cafe.address}
              </p>
            ) : null}
            {cafe.phone ? (
              <p className="inline-flex items-center gap-2">
                <MaterialIcon name="call" className="text-[18px]" />
                {cafe.phone}
              </p>
            ) : null}
          </div>
        ) : null}

        <Link
          to={`/menu/${slug}/categories`}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-label-lg font-semibold tracking-[0.05em] text-on-primary shadow-md transition-transform hover:bg-primary/90 hover:shadow-lg active:scale-[0.98] sm:w-auto sm:min-w-56"
        >
          Voir mon menu
          <MaterialIcon name="arrow_forward" className="text-[20px]" />
        </Link>
      </div>
    </div>
  );
}
