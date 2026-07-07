import { useCategories } from "@/hooks/useCategories.js";

export function TaskFilters({ status, onStatusChange, priority, onPriorityChange, categoryId, onCategoryChange }) {
  const { data: categories } = useCategories();

  return (
    <div className="flex flex-wrap gap-2">
      <select
        aria-label="Filtrer par statut"
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="rounded-lg border border-text-secondary/20 bg-surface px-3 py-1.5 text-sm text-text"
      >
        <option value="">Tous statuts</option>
        <option value="todo">À faire</option>
        <option value="in_progress">En cours</option>
        <option value="done">Terminé</option>
      </select>
      <select
        aria-label="Filtrer par priorité"
        value={priority}
        onChange={(e) => onPriorityChange(e.target.value)}
        className="rounded-lg border border-text-secondary/20 bg-surface px-3 py-1.5 text-sm text-text"
      >
        <option value="">Toutes priorités</option>
        <option value="low">Basse</option>
        <option value="medium">Moyenne</option>
        <option value="high">Haute</option>
      </select>
      <select
        aria-label="Filtrer par catégorie"
        value={categoryId}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="rounded-lg border border-text-secondary/20 bg-surface px-3 py-1.5 text-sm text-text"
      >
        <option value="">Toutes catégories</option>
        {(categories?.data ?? []).map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}
