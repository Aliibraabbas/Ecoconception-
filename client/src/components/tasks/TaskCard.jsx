import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/utils/formatters.js";

const PRIORITY_STYLES = {
  low: "bg-priority-low/15 text-priority-low",
  medium: "bg-priority-medium/15 text-priority-medium",
  high: "bg-priority-high/15 text-priority-high",
};
const PRIORITY_LABELS = { low: "Basse", medium: "Moyenne", high: "Haute" };

export function TaskCard({ task, category, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col gap-2 rounded-lg border border-text-secondary/10 bg-background p-3"
    >
      <div className="flex items-start justify-between gap-2">
        <button
          {...attributes}
          {...listeners}
          className="text-left text-sm font-medium text-text focus:outline-none"
          aria-label={`Déplacer la tâche ${task.title}`}
        >
          {task.title}
        </button>
        <div className="flex shrink-0 gap-1">
          <button onClick={() => onEdit(task)} className="rounded p-1 text-text-secondary hover:bg-text-secondary/10" aria-label={`Modifier ${task.title}`}>
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => onDelete(task)} className="rounded p-1 text-danger hover:bg-danger/10" aria-label={`Supprimer ${task.title}`}>
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className={`rounded-full px-2 py-0.5 font-medium ${PRIORITY_STYLES[task.priority]}`}>
          {PRIORITY_LABELS[task.priority]}
        </span>
        {category && (
          <span className="rounded-full px-2 py-0.5 font-medium" style={{ backgroundColor: `${category.color}25`, color: category.color }}>
            {category.name}
          </span>
        )}
        {task.dueDate && <span className="text-text-secondary">{formatDate(task.dueDate)}</span>}
      </div>
    </div>
  );
}
