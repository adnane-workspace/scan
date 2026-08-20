export default function CategoryNavigation({ categories, activeId, onSelect }) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-10 border-b border-stone-200/80 bg-[#faf7f2]/95 backdrop-blur">
      <div className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((category) => {
          const isActive = category.id === activeId;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelect(category.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-600 shadow-sm hover:bg-stone-100'
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
