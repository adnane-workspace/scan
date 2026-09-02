import { useCallback, useEffect, useState } from 'react';

const emptyPagination = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 1,
  hasNext: false,
  hasPrev: false,
};

export function usePaginatedList(fetcher, { page = 1, limit = 20, deps = [], enabled = true } = {}) {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(emptyPagination);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(
    async (silent = false) => {
      if (!enabled) {
        return null;
      }

      if (!silent) {
        setLoading(true);
      }

      setError('');

      try {
        const result = await fetcher({ page, limit });
        setItems(result.items || []);
        setPagination(result.pagination || emptyPagination);
        return result;
      } catch (err) {
        setError(err);
        setItems([]);
        setPagination(emptyPagination);
        return null;
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [enabled, fetcher, limit, page],
  );

  useEffect(() => {
    reload();
  }, [reload, ...deps]);

  return {
    items,
    pagination,
    loading,
    error,
    reload,
    setItems,
  };
}
