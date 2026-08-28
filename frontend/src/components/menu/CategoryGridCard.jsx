import { Link } from 'react-router-dom';
import { firstPublicCover } from '../../utils/categoryTree.js';
import { getMenuPaths } from '../../utils/hosts.js';
import CloudinaryImage from '../ui/CloudinaryImage.jsx';

export default function CategoryGridCard({ category, slug }) {
  const cover = firstPublicCover(category);

  const paths = getMenuPaths(slug);

  return (
    <Link
      to={paths.category(category.id)}
      className="group relative block aspect-[4/5] overflow-hidden rounded-xl bg-neutral-200 sm:aspect-[3/4] sm:rounded-2xl"
    >
      {cover ? (
        <CloudinaryImage
          src={cover}
          alt=""
          preset="categoryCover"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="h-full w-full bg-neutral-300" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
      <span className="absolute inset-x-3 bottom-3 line-clamp-2 text-left text-xs font-bold tracking-wide text-white uppercase sm:inset-x-4 sm:bottom-4 sm:text-sm md:text-base">
        {category.name}
      </span>
    </Link>
  );
}
