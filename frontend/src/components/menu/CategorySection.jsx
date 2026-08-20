import ProductCard from './ProductCard.jsx';

export default function CategorySection({ category }) {
  return (
    <section id={`category-${category.id}`} className="scroll-mt-24 px-4 py-6">
      <h2 className="border-b border-stone-200 pb-2 text-xl font-semibold text-stone-900">
        {category.name}
      </h2>
      <div className="divide-y divide-stone-100">
        {category.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
