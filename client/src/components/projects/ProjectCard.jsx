import { Link } from "react-router-dom";
import { Pencil, Archive, Trash2 } from "lucide-react";
import { formatPercent } from "@/utils/formatters.js";

export function ProjectCard({ project, onEdit, onArchive, onDelete }) {
  return (
    <div className="group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-text-secondary/10 bg-surface p-4">
      <Link to={`/app/projects/${project.id}`} className="flex flex-col gap-2 focus:outline-none">
        {project.coverImageUrl && (
          <img
            src={project.coverImageUrl}
            alt=""
            className="-mx-4 -mt-4 mb-1 h-28 w-[calc(100%+2rem)] object-cover"
          />
        )}
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: project.color }} aria-hidden="true" />
          <h3 className="font-semibold text-text">{project.name}</h3>
        </div>
        {project.description && <p className="line-clamp-2 text-sm text-text-secondary">{project.description}</p>}
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span>{project.taskCount} tâche(s)</span>
          <span>{formatPercent(project.progress)}</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-text-secondary/15">
          <div
            className="h-1.5 rounded-full bg-accent"
            style={{ width: formatPercent(project.progress) }}
          />
        </div>
      </Link>
      <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <button onClick={() => onEdit(project)} className="rounded-md p-1.5 text-text-secondary hover:bg-text-secondary/10" aria-label={`Modifier ${project.name}`}>
          <Pencil className="h-4 w-4" />
        </button>
        <button onClick={() => onArchive(project)} className="rounded-md p-1.5 text-text-secondary hover:bg-text-secondary/10" aria-label={`Archiver ${project.name}`}>
          <Archive className="h-4 w-4" />
        </button>
        <button onClick={() => onDelete(project)} className="rounded-md p-1.5 text-danger hover:bg-danger/10" aria-label={`Supprimer ${project.name}`}>
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
