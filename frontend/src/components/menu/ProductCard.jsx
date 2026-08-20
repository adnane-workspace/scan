function formatPrice(price) {
  return `${Number(price).toFixed(2)} €`;
}

export default function ProductCard({ product }) {
  return (
    <article className="flex gap-4 py-4">
      {product.image ? (
        <img
          src={product.image}
          alt=""
          loading="lazy"
          className="h-20 w-20 shrink-0 rounded-2xl object-cover"
        />
      ) : (
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-stone-100 text-xl">
          🍽️
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-stone-900">{product.name}</h3>
          <p className="shrink-0 text-base font-semibold text-amber-800">{formatPrice(product.price)}</p>
        </div>
        {product.description ? (
          <p className="mt-1 text-sm leading-relaxed text-stone-500">{product.description}</p>
        ) : null}
      </div>
    </article>
  );
}
