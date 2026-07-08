const ITEM_COUNT = 50000;
const CACHE_TTL_MS = 30000;

let cache = null;
let cachedAt = 0;

function generateItems(count) {
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push({
      id: i,
      value: Math.random() * 1000,
      category: i % 5,
      label: `item-${i}`,
    });
  }
  return items;
}

function computeBenchmark() {
  const items = generateItems(ITEM_COUNT);

  const filtered = items.filter((item) => item.value > 500);
  const sorted = [...filtered].sort((a, b) => b.value - a.value);
  const mapped = sorted.map((item) => ({
    id: item.id,
    label: item.label,
    value: Number(item.value.toFixed(2)),
  }));

  return {
    totalGenerated: items.length,
    totalFiltered: filtered.length,
    top5: mapped.slice(0, 5),
  };
}

export function runBenchmark() {
  const now = Date.now();
  if (cache && now - cachedAt < CACHE_TTL_MS) {
    return cache;
  }

  cache = computeBenchmark();
  cachedAt = now;
  return cache;
}
