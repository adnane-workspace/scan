import { useCallback, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import PublicMenuFrame from '../components/menu/PublicMenuFrame.jsx';
import CategoryGridCard from '../components/menu/CategoryGridCard.jsx';
import PublicMenuHeader from '../components/menu/PublicMenuHeader.jsx';
import PublicProductCard from '../components/menu/PublicProductCard.jsx';
import PublicProductSheet from '../components/menu/PublicProductSheet.jsx';
import { useMenuSlug } from '../context/MenuSlugContext.jsx';
import { setPageMeta, usePublicMenu } from '../hooks/usePublicMenu.js';
import { useLocale } from '../hooks/useLocale.js';
import { findPublicCategory, findPublicParent } from '../utils/categoryTree.js';
import { getMenuPaths } from '../utils/hosts.js';
import { buildShareUrl } from '../utils/share.js';
import ShareButton from '../components/menu/ShareButton.jsx';
import { formatPrice } from '../utils/format.js';

const categoryGridClass =
  'grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
const productGridClass = 'grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
const contentClass = 'mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8';

function MenuStatus({ title, message }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-xl font-semibold text-on-surface md:text-2xl">{title}</h1>
      <p className="mt-2 max-w-md text-sm text-on-surface-variant md:text-base">{message}</p>
    </div>
  );
}

function MenuHeading({ title, action }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3 sm:mb-8">
      <div className="min-w-0">
        <h1 className="break-words font-display text-[1.35rem] font-semibold tracking-tight text-[#0d1b2a] sm:text-2xl md:text-3xl">
          {title}
        </h1>
        <span className="mt-2.5 block h-px w-9 bg-[#c4a574]" />
      </div>
      {action}
    </div>
  );
}

function MenuSkeleton() {
  return (
    <div className={`${contentClass} animate-pulse`}>
      <div className={categoryGridClass}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="aspect-[3/4] rounded-[1.35rem] bg-[#ebe8e2]" />
        ))}
      </div>
    </div>
  );
}

export default function PublicMenuPage() {
  const slug = useMenuSlug();
  const { categoryId } = useParams();
  const { t, locale } = useLocale();
  const [searchParams, setSearchParams] = useSearchParams();
  const { menu, loading, errorStatus } = usePublicMenu(slug);
  const selectedProductId = searchParams.get('product');
  const paths = getMenuPaths(slug);

  const selectedCategory = useMemo(
    () => findPublicCategory(menu?.categories, categoryId),
    [menu, categoryId],
  );

  const selectedParent = useMemo(
    () => (categoryId ? findPublicParent(menu?.categories, categoryId) : undefined),
    [menu, categoryId],
  );

  const selectedProduct = useMemo(
    () => selectedCategory?.products?.find((product) => String(product.id) === String(selectedProductId)) || null,
    [selectedCategory, selectedProductId],
  );

  useEffect(() => {
    if (menu?.cafe && selectedCategory) {
      setPageMeta({
        title: selectedProduct
          ? `${selectedProduct.name} · ${menu.cafe.name}`
          : `${selectedCategory.name} · ${menu.cafe.name}`,
        description:
          selectedProduct?.description ||
          menu.cafe.description ||
          t('menu.pageDescription', { name: menu.cafe.name }),
        robots: 'noindex,follow',
      });
      return;
    }

    if (menu?.cafe) {
      setPageMeta({
        title: t('menu.pageTitle', { name: menu.cafe.name }),
        description: menu.cafe.description || t('menu.pageDescription', { name: menu.cafe.name }),
        robots: 'noindex,follow',
      });
      return;
    }

    if (errorStatus) {
      setPageMeta({
        title: t('menu.missingTitle'),
        description: t('menu.missing'),
      });
    }
  }, [menu, errorStatus, selectedCategory, selectedProduct, t]);

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
  const landingPath = paths.home;
  const categoriesPath = paths.categories;
  const hasChildren = Boolean(selectedCategory?.children?.length);

  function frame(content) {
    return (
      <PublicMenuFrame cafe={cafe} className="menu-app">
        {content}
      </PublicMenuFrame>
    );
  }

  if (loading) {
    return frame(<MenuSkeleton />);
  }

  if (errorStatus && errorStatus !== 404 && errorStatus !== 403) {
    return frame(
      <>
        <PublicMenuHeader cafe={cafe} slug={slug} backTo={landingPath} backLabel={t('menu.home')} />
        <MenuStatus title={t('menu.loadErrorTitle')} message={t('menu.loadError')} />
      </>,
    );
  }

  if (errorStatus === 403) {
    return frame(
      <>
        <PublicMenuHeader cafe={cafe} slug={slug} backTo={landingPath} backLabel={t('menu.home')} />
        <MenuStatus title={t('menu.unavailableTitle')} message={t('menu.unavailable')} />
      </>,
    );
  }

  if (errorStatus) {
    return frame(
      <>
        <PublicMenuHeader cafe={cafe} slug={slug} backTo={landingPath} backLabel={t('menu.home')} />
        <MenuStatus title={t('menu.missingTitle')} message={t('menu.missing')} />
      </>,
    );
  }

  if (!menu?.categories?.length) {
    return frame(
      <>
        <PublicMenuHeader cafe={cafe} slug={slug} backTo={landingPath} backLabel={t('menu.home')} />
        <MenuStatus title={t('menu.emptyTitle')} message={t('menu.empty')} />
      </>,
    );
  }

  if (categoryId && !selectedCategory) {
    return frame(
      <>
        <PublicMenuHeader cafe={cafe} slug={slug} backTo={categoriesPath} backLabel={t('menu.categories')} />
        <MenuStatus title={t('menu.categoryMissingTitle')} message={t('menu.categoryMissing')} />
      </>,
    );
  }

  if (selectedCategory && hasChildren) {
    const backTo = selectedParent ? paths.category(selectedParent.id) : categoriesPath;
    const backLabel = selectedParent ? selectedParent.name : t('menu.categories');

    return frame(
      <div className="min-h-screen overflow-x-hidden">
        <PublicMenuHeader cafe={cafe} slug={slug} backTo={backTo} backLabel={backLabel} />
        <div className={contentClass}>
          <MenuHeading
            title={selectedCategory.name}
            action={
              <ShareButton
                title={`${selectedCategory.name} · ${cafe.name}`}
                text={t('menu.shareCategoryText', { category: selectedCategory.name, cafe: cafe.name })}
                url={buildShareUrl({ slug, categoryId: selectedCategory.id })}
              />
            }
          />
          <div className={categoryGridClass}>
            {selectedCategory.children.map((category) => (
              <CategoryGridCard key={category.id} category={category} slug={slug} />
            ))}
          </div>
        </div>
      </div>,
    );
  }

  if (selectedCategory) {
    const backTo = selectedParent ? paths.category(selectedParent.id) : categoriesPath;
    const backLabel = selectedParent ? selectedParent.name : t('menu.categories');

    return frame(
      <div className="min-h-screen overflow-x-hidden">
        <PublicMenuHeader cafe={cafe} slug={slug} backTo={backTo} backLabel={backLabel} />
        <div className={contentClass}>
          <MenuHeading
            title={selectedCategory.name}
            action={
              <ShareButton
                title={`${selectedCategory.name} · ${cafe.name}`}
                text={t('menu.shareCategoryText', { category: selectedCategory.name, cafe: cafe.name })}
                url={buildShareUrl({ slug, categoryId: selectedCategory.id })}
              />
            }
          />
          <div className={productGridClass}>
            {selectedCategory.products.map((product) => (
              <PublicProductCard key={product.id} product={product} onSelect={openProduct} />
            ))}
          </div>
        </div>
        <PublicProductSheet
          product={selectedProduct}
          onClose={closeProduct}
          shareTitle={selectedProduct ? `${selectedProduct.name} · ${cafe.name}` : ''}
          shareText={
            selectedProduct
              ? `${selectedProduct.name} — ${formatPrice(selectedProduct.price, locale)}`
              : ''
          }
          shareUrl={
            selectedProduct
              ? buildShareUrl({ slug, categoryId: selectedCategory.id, productId: selectedProduct.id })
              : ''
          }
        />
      </div>,
    );
  }

  return frame(
    <div className="min-h-screen overflow-x-hidden">
      <PublicMenuHeader cafe={cafe} slug={slug} backTo={landingPath} backLabel={t('menu.home')} />
      <div className={contentClass}>
        <MenuHeading
          title={t('menu.ourCategories')}
          action={
            <ShareButton
              title={t('menu.pageTitle', { name: cafe.name })}
              text={cafe.description || t('menu.pageDescription', { name: cafe.name })}
              url={buildShareUrl({ slug })}
            />
          }
        />
        <div className={categoryGridClass}>
          {menu.categories.map((category) => (
            <CategoryGridCard key={category.id} category={category} slug={slug} />
          ))}
        </div>
      </div>
    </div>,
  );
}
