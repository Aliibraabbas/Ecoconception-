import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button.jsx";

export function ProjectToolbar({ q, onQChange, status, onStatusChange, onCreate }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2 rounded-lg border border-text-secondary/20 bg-surface px-3 py-2 sm:max-w-xs">
        <Search className="h-4 w-4 text-text-secondary" aria-hidden="true" />
        <label htmlFor="project-search" className="sr-only">
          Rechercher un projet
        </label>
        <input
          id="project-search"
          type="search"
          placeholder="Rechercher…"
          value={q}
          onChange={(e) => onQChange(e.target.value)}
          className="w-full bg-transparent text-sm text-text outline-none placeholder:text-text-secondary"
        />
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="project-status" className="sr-only">
          Filtrer par statut
        </label>
        <select
          id="project-status"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded-lg border border-text-secondary/20 bg-surface px-3 py-2 text-sm text-text"
        >
          <option value="">Tous les statuts</option>
          <option value="active">Actifs</option>
          <option value="archived">Archivés</option>
        </select>
        <Button onClick={onCreate} aria-label="Créer un projet">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Projet
        </Button>
      </div>
    </div>
  );
}
