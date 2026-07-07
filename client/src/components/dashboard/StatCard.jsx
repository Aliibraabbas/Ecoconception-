export function StatCard({ label, value, Icon }) {
  return (
    <div className="rounded-xl border border-text-secondary/10 bg-surface p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-text-secondary" aria-hidden="true" />}
      </div>
      <p className="mt-2 text-2xl font-bold text-text">{value}</p>
    </div>
  );
}
