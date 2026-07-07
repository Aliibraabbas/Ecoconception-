export function parsePagination(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  return { page, limit, offset: (page - 1) * limit };
}

export function buildPaginationMeta(page, limit, total) {
  return { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) };
}

// Parse "champ:asc|desc" en respectant une liste blanche de colonnes triables.
export function parseSort(sortParam, allowedColumns, defaultSort) {
  if (!sortParam) return defaultSort;
  const [column, direction] = sortParam.split(":");
  if (!allowedColumns.includes(column)) return defaultSort;
  const dir = direction === "asc" ? "asc" : "desc";
  return { column, direction: dir };
}
