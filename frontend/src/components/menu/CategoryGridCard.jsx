import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../../hooks/useLocale.js';
import { firstPublicCover } from '../../utils/categoryTree.js';
import { getMenuPaths } from '../../utils/hosts.js';
import CloudinaryImage from '../ui/CloudinaryImage.jsx';
import MaterialIcon from '../ui/MaterialIcon.jsx';

function categoryMeta(category, t) {
  const childCount = category.children?.length || 0;
  const productCount = category.products?.length || 0;

  if (childCount > 0) {
    return t('menu.subCount', { count: childCount });
  }

  if (productCount > 0) {
    return t('menu.itemCount', { count: productCount });
  }

  return '';
}

export default function CategoryGridCard({ category, slug }) {
  const { t } = useLocale();
  const cover = firstPublicCover(category);
  const [coverFailed, setCoverFailed] = useState(false);
  const paths = getMenuPaths(slug);
  const meta = categoryMeta(category, t);
  const showCover = Boolean(cover) && !coverFailed;

  return (
    <Link
      to={paths.category(category.id)}
      className="group relative block aspect-[3/4] overflow-hidden rounded-[1.35rem] bg-[#d8d4cc] shadow-[0_10px_28px_rgba(13,27,42,0.08)] ring-1 ring-[#0d1b2a]/6"
    >
      {showCover ? (
        <CloudinaryImage
          src={cover}
          alt=""
          preset="categoryCover"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setCoverFailed(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[#ebe8e2] text-[#0d1b2a]/35">
          <MaterialIcon name="grid_view" className="text-4xl" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b2a] via-[#0d1b2a]/25 to-transparent" />
      <span className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4">
        <span className="line-clamp-2 text-start font-display text-sm font-semibold leading-snug text-white sm:text-base">
          {category.name}
        </span>
        {meta ? (
          <span className="mt-1 block text-[11px] font-medium tracking-wide text-[#e8d5a8] sm:text-xs">{meta}</span>
        ) : null}
      </span>
    </Link>
  );
}
