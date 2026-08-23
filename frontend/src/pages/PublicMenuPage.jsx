import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import CategoryGridCard from '../components/menu/CategoryGridCard.jsx';
import PublicProductCard from '../components/menu/PublicProductCard.jsx';
import { setPageMeta, usePublicMenu } from '../hooks/usePublicMenu.js';

const categoryGridClass =
  'grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
const contentClass = 'mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8';

function MenuStatus({ title, message }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-xl font-semibold text-neutral-900 md:text-2xl">{title}</h1>
      <p className="mt-2 max-w-md text-sm text-neutral-500 md:text-base">{message}</p>
    </div>
  );
}

function MenuSkeleton() {
  return (
    <div className={`${contentClass} animate-pulse`}>
      <div className={categoryGridClass}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="aspect-[4/5] rounded-xl bg-neutral-200 sm:rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default function PublicMenuPage() {
  const { slug, categoryId } = useParams();
  const { menu, loading, errorStatus } = usePublicMenu(slug);

  useEffect(() => {
    if (menu?.cafe) {
      setPageMeta({
        title: `${menu.cafe.name} — Menu`,
        description: menu.cafe.description || `Menu de ${menu.cafe.name}`,
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

  const selectedCategory = useMemo(
    () => menu?.categories?.find((category) => String(category.id) === String(categoryId)) || null,
    [menu, categoryId],
  );

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
      <div className={contentClass}>
        <Link to={`/menu/${slug}`} className="text-sm text-neutral-600 hover:text-neutral-900">
          ← Accueil
        </Link>
        <MenuStatus title="Menu vide" message="Le menu est actuellement vide." />
      </div>
    );
  }

  if (categoryId && !selectedCategory) {
    return (
      <div className={contentClass}>
        <Link to={`/menu/${slug}/categories`} className="text-sm text-neutral-600 hover:text-neutral-900">
          ← Nos catégories
        </Link>
        <MenuStatus title="Catégorie introuvable" message="Cette catégorie n'est plus disponible." />
      </div>
    );
  }

  if (selectedCategory) {
    return (
      <div className="min-h-screen">
        <div className={contentClass}>
          <Link to={`/menu/${slug}/categories`} className="text-sm text-neutral-600 hover:text-neutral-900">
            ← Nos catégories
          </Link>
          <h1 className="mt-3 mb-6 text-2xl font-semibold tracking-tight uppercase md:text-3xl">
            {selectedCategory.name}
          </h1>
          <div className={categoryGridClass}>
            {selectedCategory.products.map((product) => (
              <PublicProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className={contentClass}>
        <Link to={`/menu/${slug}`} className="text-sm text-neutral-600 hover:text-neutral-900">
          ← Accueil
        </Link>
        <h1 className="mt-3 mb-6 text-2xl font-semibold tracking-tight md:text-3xl">Nos catégories</h1>
        <div className={categoryGridClass}>
          {menu.categories.map((category) => (
            <CategoryGridCard key={category.id} category={category} slug={slug} />
          ))}
        </div>
      </div>
    </div>
  );
}
