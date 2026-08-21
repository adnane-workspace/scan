import { Link } from 'react-router-dom';

export default function CategoryGridCard({ category, slug }) {
  const cover = category.image || category.products.find((product) => product.image)?.image || '';

  return (
    <Link
      to={`/menu/${slug}/${category.id}`}
      className="group relative block aspect-[4/5] overflow-hidden rounded-xl bg-neutral-200 sm:aspect-[3/4] sm:rounded-2xl"
    >
      {cover ? (
        <img
          src={cover}
          alt=""
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
