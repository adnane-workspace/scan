export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

export function parsePaginationQuery(query = {}, { defaultLimit = DEFAULT_LIMIT, maxLimit = MAX_LIMIT } = {}) {
  const page = Math.max(1, Number.parseInt(String(query.page ?? ''), 10) || DEFAULT_PAGE);
  const limit = Math.min(maxLimit, Math.max(1, Number.parseInt(String(query.limit ?? ''), 10) || defaultLimit));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export function buildPaginationMeta({ page, limit, total }) {
  const safeTotal = Math.max(0, Number(total) || 0);
  const totalPages = Math.max(1, Math.ceil(safeTotal / limit) || 1);

  return {
    page,
    limit,
    total: safeTotal,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

export function paginatedResult(items, pagination) {
  return { items, pagination };
}
