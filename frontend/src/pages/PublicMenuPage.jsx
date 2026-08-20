import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CategoryNavigation from '../components/menu/CategoryNavigation.jsx';
import CategorySection from '../components/menu/CategorySection.jsx';
import MenuHeader from '../components/menu/MenuHeader.jsx';
import { getPublicMenu } from '../services/menu.service.js';

function setPageMeta({ title, description }) {
  document.title = title;

  let meta = document.querySelector('meta[name="description"]');

  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'description';
    document.head.appendChild(meta);
  }

  meta.content = description;
}

function MenuStatus({ title, message }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl">☕</div>
      <h1 className="text-2xl font-semibold text-stone-900">{title}</h1>
      <p className="mt-2 max-w-sm text-sm text-stone-500">{message}</p>
    </div>
  );
}

function MenuSkeleton() {
  return (
    <div className="animate-pulse px-4 py-8">
      <div className="mx-auto h-20 w-20 rounded-full bg-stone-200" />
      <div className="mx-auto mt-4 h-8 w-48 rounded-lg bg-stone-200" />
      <div className="mx-auto mt-3 h-4 w-64 rounded bg-stone-100" />
      <div className="mt-8 flex gap-2">
        <div className="h-9 w-20 rounded-full bg-stone-200" />
        <div className="h-9 w-24 rounded-full bg-stone-200" />
        <div className="h-9 w-20 rounded-full bg-stone-200" />
      </div>
      <div className="mt-8 space-y-4">
        <div className="h-24 rounded-2xl bg-stone-100" />
        <div className="h-24 rounded-2xl bg-stone-100" />
        <div className="h-24 rounded-2xl bg-stone-100" />
      </div>
    </div>
  );
}

export default function PublicMenuPage() {
  const { slug } = useParams();
  const [menu, setMenu] = useState(null);
  const [activeId, setActiveId] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setErrorStatus(null);

    getPublicMenu(slug)
      .then((data) => {
        if (cancelled) {
          return;
        }

        setMenu(data);
        setActiveId(data.categories[0]?.id || '');
        setPageMeta({
          title: `${data.cafe.name} — Menu`,
          description: data.cafe.description || `Menu de ${data.cafe.name}`,
        });
      })
      .catch((error) => {
        if (!cancelled) {
          setErrorStatus(error.response?.status || 500);
          setPageMeta({
            title: 'Menu introuvable',
            description: "Ce menu n'est plus disponible.",
          });
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      document.title = 'Digital Menu';
    };
  }, [slug]);

  function handleSelectCategory(categoryId) {
    setActiveId(categoryId);
    document.getElementById(`category-${categoryId}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  if (loading) {
    return <MenuSkeleton />;
  }

  if (errorStatus === 403) {
    return <MenuStatus title="Menu indisponible" message="Ce café n'a actuellement pas de menu disponible." />;
  }

  if (errorStatus) {
    return <MenuStatus title="Menu introuvable" message="Ce menu n'est plus disponible." />;
  }

  if (!menu?.categories?.length) {
    return (
      <>
        <MenuHeader cafe={menu.cafe} />
        <MenuStatus title="Menu vide" message="Le menu est actuellement vide." />
      </>
    );
  }

  return (
    <div>
      <MenuHeader cafe={menu.cafe} />
      <CategoryNavigation categories={menu.categories} activeId={activeId} onSelect={handleSelectCategory} />
      {menu.categories.map((category) => (
        <CategorySection key={category.id} category={category} />
      ))}
    </div>
  );
}
