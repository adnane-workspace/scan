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
            className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-sm transition-all duration-200 ${
              active
                ? 'bg-[var(--menu-tab-active-bg)] font-semibold text-[var(--menu-tab-active-text)] shadow-sm'
                : 'bg-transparent font-medium text-[var(--menu-tab-inactive-text)] hover:bg-[var(--menu-tab-hover-bg)] hover:text-on-surface'
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
    <div className="sticky top-[calc(3.75rem+env(safe-area-inset-top))] z-30 border-b border-[var(--menu-chrome-border)] bg-[var(--menu-chrome-bg)] backdrop-blur-2xl transition-colors duration-500 sm:top-[calc(4.5rem+env(safe-area-inset-top))]">
      <TabRail items={items} activeId={activeId} onSelect={onSelect} />
    </div>
  );
}
