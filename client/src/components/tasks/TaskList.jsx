import { Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/utils/formatters.js";

const STATUS_LABELS = { todo: "À faire", in_progress: "En cours", done: "Terminé" };
const PRIORITY_LABELS = { low: "Basse", medium: "Moyenne", high: "Haute" };

export function TaskList({ tasks, categoriesById, onEdit, onDelete }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-text-secondary/10 text-left text-text-secondary">
          <th className="py-2 font-medium">Titre</th>
          <th className="py-2 font-medium">Statut</th>
          <th className="py-2 font-medium">Priorité</th>
          <th className="py-2 font-medium">Catégorie</th>
          <th className="py-2 font-medium">Échéance</th>
          <th className="py-2 font-medium sr-only">Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id} className="border-b border-text-secondary/5">
            <td className="py-2 text-text">{task.title}</td>
            <td className="py-2 text-text-secondary">{STATUS_LABELS[task.status]}</td>
            <td className="py-2 text-text-secondary">{PRIORITY_LABELS[task.priority]}</td>
            <td className="py-2 text-text-secondary">{categoriesById[task.categoryId]?.name ?? "—"}</td>
            <td className="py-2 text-text-secondary">{formatDate(task.dueDate)}</td>
            <td className="py-2">
              <div className="flex justify-end gap-1">
                <button onClick={() => onEdit(task)} className="rounded p-1.5 text-text-secondary hover:bg-text-secondary/10" aria-label={`Modifier ${task.title}`}>
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => onDelete(task)} className="rounded p-1.5 text-danger hover:bg-danger/10" aria-label={`Supprimer ${task.title}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
