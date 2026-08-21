function formatPrice(price) {
  return `${Number(price).toFixed(2)} €`;
}

export default function PublicProductCard({ product }) {
  return (
    <article className="overflow-hidden rounded-xl bg-white shadow-sm sm:rounded-2xl">
      <div className="aspect-square w-full bg-neutral-200">
        {product.image ? (
          <img src={product.image} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl text-neutral-400">🍽️</div>
        )}
      </div>
      <div className="px-3 py-3 text-center sm:px-4 sm:py-4">
        <h3 className="text-sm font-bold tracking-wide text-black uppercase sm:text-base">{product.name}</h3>
        <p className="mt-1 text-sm text-neutral-700">{formatPrice(product.price)}</p>
      </div>
    </article>
  );
}
