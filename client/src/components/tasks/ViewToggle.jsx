import { List, KanbanSquare } from "lucide-react";
import clsx from "clsx";

export function ViewToggle({ view, onChange }) {
  return (
    <div role="radiogroup" aria-label="Changer de vue" className="flex rounded-lg border border-text-secondary/20 p-1">
      <button
        role="radio"
        aria-checked={view === "list"}
        onClick={() => onChange("list")}
        className={clsx("flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm", view === "list" ? "bg-primary text-white" : "text-text-secondary")}
      >
        <List className="h-4 w-4" /> Liste
      </button>
      <button
        role="radio"
        aria-checked={view === "kanban"}
        onClick={() => onChange("kanban")}
        className={clsx("flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm", view === "kanban" ? "bg-primary text-white" : "text-text-secondary")}
      >
        <KanbanSquare className="h-4 w-4" /> Kanban
      </button>
    </div>
  );
}
