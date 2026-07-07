export function SearchResults({ data, isLoading, onSelect, onDismiss }) {
  const projects = data?.data?.projects ?? [];
  const tasks = data?.data?.tasks ?? [];
  const hasResults = projects.length > 0 || tasks.length > 0;

  return (
    <div className="absolute z-40 mt-2 w-full rounded-lg border border-text-secondary/15 bg-surface p-2 shadow-lg">
      {isLoading && <p className="p-2 text-xs text-text-secondary">Recherche…</p>}
      {!isLoading && !hasResults && <p className="p-2 text-xs text-text-secondary">Aucun résultat.</p>}
      {projects.length > 0 && (
        <div className="mb-1">
          <p className="px-2 py-1 text-xs font-semibold uppercase text-text-secondary">Projets</p>
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelect("project", p.id)}
              className="block w-full rounded-md px-2 py-1.5 text-left text-sm text-text hover:bg-text-secondary/10"
            >
              {p.name}
            </button>
          ))}
        </div>
      )}
      {tasks.length > 0 && (
        <div>
          <p className="px-2 py-1 text-xs font-semibold uppercase text-text-secondary">Tâches</p>
          {tasks.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelect("task", t.id, t.projectId)}
              className="block w-full rounded-md px-2 py-1.5 text-left text-sm text-text hover:bg-text-secondary/10"
            >
              {t.title}
            </button>
          ))}
        </div>
      )}
      <button onClick={onDismiss} className="mt-1 w-full rounded-md px-2 py-1 text-center text-xs text-text-secondary hover:underline">
        Fermer
      </button>
    </div>
  );
}
