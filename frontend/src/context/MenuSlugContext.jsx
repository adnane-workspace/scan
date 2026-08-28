import { createContext, useContext } from 'react';
import { useParams } from 'react-router-dom';

export const MenuSlugContext = createContext(null);

export function MenuSlugProvider({ slug, children }) {
  return <MenuSlugContext.Provider value={slug}>{children}</MenuSlugContext.Provider>;
}

export function useMenuSlug() {
  const fromHost = useContext(MenuSlugContext);
  const { slug } = useParams();
  return fromHost || slug;
}
