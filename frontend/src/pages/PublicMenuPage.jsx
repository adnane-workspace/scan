import { useCallback, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import CategoryGridCard from '../components/menu/CategoryGridCard.jsx';
import PublicMenuHeader from '../components/menu/PublicMenuHeader.jsx';
import PublicProductCard from '../components/menu/PublicProductCard.jsx';
import PublicProductSheet from '../components/menu/PublicProductSheet.jsx';
import { setPageMeta, usePublicMenu } from '../hooks/usePublicMenu.js';
import { useLocale } from '../hooks/useLocale.js';
import { findPublicCategory, findPublicParent } from '../utils/categoryTree.js';

const categoryGridClass =
  'grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
const productGridClass = 'grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
const contentClass = 'mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8';

function MenuStatus({ title, message }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-xl font-semibold text-on-surface md:text-2xl">{title}</h1>
      <p className="mt-2 max-w-md text-sm text-on-surface-variant md:text-base">{message}</p>
    </div>
  );
}

function MenuSkeleton() {
  return (
    <div className={`${contentClass} animate-pulse`}>
      <div className={categoryGridClass}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="aspect-[4/5] rounded-xl bg-surface-container-high sm:rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default function PublicMenuPage() {
  const { slug, categoryId } = useParams();
  const { t } = useLocale();
  const [searchParams, setSearchParams] = useSearchParams();
  const { menu, loading, errorStatus } = usePublicMenu(slug);
  const selectedProductId = searchParams.get('product');

  useEffect(() => {
    if (menu?.cafe) {
      setPageMeta({
        title: t('menu.pageTitle', { name: menu.cafe.name }),
        description: menu.cafe.description || t('menu.pageDescription', { name: menu.cafe.name }),
      });
      return;
    }

    if (errorStatus) {
      setPageMeta({
        title: t('menu.missingTitle'),
        description: t('menu.missing'),
      });
    }
  }, [menu, errorStatus, t]);

  const selectedCategory = useMemo(
    () => findPublicCategory(menu?.categories, categoryId),
    [menu, categoryId],
  );

  const selectedParent = useMemo(
    () => (categoryId ? findPublicParent(menu?.categories, categoryId) : undefined),
    [menu, categoryId],
  );

  const selectedProduct = useMemo(
    () => selectedCategory?.products.find((product) => String(product.id) === String(selectedProductId)) || null,
    [selectedCategory, selectedProductId],
  );

  const openProduct = useCallback(
    (product) => {
      setSearchParams({ product: product.id }, { replace: false });
    },
    [setSearchParams],
  );

  const closeProduct = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const cafe = menu?.cafe;
  const landingPath = `/menu/${slug}`;
  const categoriesPath = `/menu/${slug}/categories`;
  const hasChildren = Boolean(selectedCategory?.children?.length);

  if (loading) {
    return <MenuSkeleton />;
  }

  if (errorStatus === 403) {
    return (
      <>
        <PublicMenuHeader cafe={cafe} slug={slug} backTo={landingPath} backLabel={t('menu.home')} />
        <MenuStatus title={t('menu.unavailableTitle')} message={t('menu.unavailable')} />
      </>
    );
  }

  if (errorStatus) {
    return (
      <>
        <PublicMenuHeader cafe={cafe} slug={slug} backTo={landingPath} backLabel={t('menu.home')} />
        <MenuStatus title={t('menu.missingTitle')} message={t('menu.missing')} />
      </>
    );
  }

  if (!menu?.categories?.length) {
    return (
      <>
        <PublicMenuHeader cafe={cafe} slug={slug} backTo={landingPath} backLabel={t('menu.home')} />
        <MenuStatus title={t('menu.emptyTitle')} message={t('menu.empty')} />
      </>
    );
  }

  if (categoryId && !selectedCategory) {
    return (
      <>
        <PublicMenuHeader cafe={cafe} slug={slug} backTo={categoriesPath} backLabel={t('menu.categories')} />
        <MenuStatus title={t('menu.categoryMissingTitle')} message={t('menu.categoryMissing')} />
      </>
    );
  }

  if (selectedCategory && hasChildren) {
    const backTo = selectedParent ? `/menu/${slug}/${selectedParent.id}` : categoriesPath;
    const backLabel = selectedParent ? selectedParent.name : t('menu.categories');

    return (
      <div className="min-h-screen">
        <PublicMenuHeader cafe={cafe} slug={slug} backTo={backTo} backLabel={backLabel} />
        <div className={contentClass}>
          <h1 className="mb-4 break-words font-display text-xl font-semibold tracking-tight text-on-surface sm:mb-6 sm:text-2xl md:text-3xl">
            {selectedCategory.name}
          </h1>
          <div className={categoryGridClass}>
            {selectedCategory.children.map((category) => (
              <CategoryGridCard key={category.id} category={category} slug={slug} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (selectedCategory) {
    const backTo = selectedParent ? `/menu/${slug}/${selectedParent.id}` : categoriesPath;
    const backLabel = selectedParent ? selectedParent.name : t('menu.categories');

    return (
      <div className="min-h-screen">
        <PublicMenuHeader cafe={cafe} slug={slug} backTo={backTo} backLabel={backLabel} />
        <div className={contentClass}>
          <h1 className="mb-4 break-words font-display text-xl font-semibold tracking-tight text-on-surface sm:mb-6 sm:text-2xl md:text-3xl">
            {selectedCategory.name}
          </h1>
          <div className={productGridClass}>
            {selectedCategory.products.map((product) => (
              <PublicProductCard key={product.id} product={product} onSelect={openProduct} />
            ))}
          </div>
        </div>
        <PublicProductSheet product={selectedProduct} onClose={closeProduct} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PublicMenuHeader cafe={cafe} slug={slug} backTo={landingPath} backLabel={t('menu.home')} />
      <div className={contentClass}>
        <h1 className="mb-4 break-words font-display text-xl font-semibold tracking-tight text-on-surface sm:mb-6 sm:text-2xl md:text-3xl">
          {t('menu.ourCategories')}
        </h1>
        <div className={categoryGridClass}>
          {menu.categories.map((category) => (
            <CategoryGridCard key={category.id} category={category} slug={slug} />
          ))}
        </div>
      </div>
    </div>
  );
}
