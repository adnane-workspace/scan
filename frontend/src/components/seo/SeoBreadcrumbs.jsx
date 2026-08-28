import { Link } from 'react-router-dom';

export default function SeoBreadcrumbs({ items }) {
  if (!items?.length) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-8 text-sm text-on-surface-variant">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const last = index === items.length - 1;

          return (
            <li key={item.path} className="flex items-center gap-1">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {last ? (
                <span className="text-on-surface">{item.name}</span>
              ) : (
                <Link to={item.path} className="hover:text-primary">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
