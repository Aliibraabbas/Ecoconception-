function toCamel(snake) {
  return snake.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());
}

// Convertit récursivement les clés snake_case (SQL) en camelCase (API), sans toucher aux valeurs.
export function mapRow(row) {
  if (!row) return null;
  const result = {};
  for (const [key, value] of Object.entries(row)) {
    result[toCamel(key)] = value;
  }
  return result;
}

export function mapRows(rows) {
  return rows.map(mapRow);
}
