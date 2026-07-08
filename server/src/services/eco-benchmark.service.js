const ITEM_COUNT = 50000;

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

export function runBenchmark() {
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
