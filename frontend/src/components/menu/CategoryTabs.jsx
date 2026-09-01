import { useEffect, useRef } from 'react';

function TabRail({ items, activeId, onSelect }) {
  const activeRef = useRef(null);

  useEffect(() => {
    const node = activeRef.current;

    if (!node || typeof node.scrollIntoView !== 'function') {
      return;
    }

    node.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [activeId]);

  if (!items?.length) {
    return null;
  }

  return (
    <div
      className="flex gap-1.5 overflow-x-auto overscroll-x-contain px-4 py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-2 sm:px-6 sm:py-3 lg:px-8 [&::-webkit-scrollbar]:hidden"
      role="tablist"
    >
      {items.map((item) => {
        const active = String(item.id) === String(activeId);

        return (
          <button
            key={item.id}
            ref={active ? activeRef : null}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(item)}
            className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-sm transition-colors ${
              active
                ? 'bg-[#0d1b2a] font-semibold text-[#e0e1dd]'
                : 'bg-transparent font-medium text-[#0d1b2a]/65 hover:bg-[#0d1b2a]/6 hover:text-[#0d1b2a]'
            }`}
          >
            {item.name}
          </button>
        );
      })}
    </div>
  );
}

export default function CategoryTabs({ items, activeId, onSelect }) {
  if (!items?.length) {
    return null;
  }

  return (
    <div className="sticky top-[calc(3.75rem+env(safe-area-inset-top))] z-30 border-b border-[#0d1b2a]/8 bg-[#f7f6f3]/92 backdrop-blur-2xl sm:top-[calc(4.5rem+env(safe-area-inset-top))]">
      <TabRail items={items} activeId={activeId} onSelect={onSelect} />
    </div>
  );
}
