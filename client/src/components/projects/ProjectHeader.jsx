import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button.jsx";
import { formatPercent } from "@/utils/formatters.js";

export function ProjectHeader({ project, onCreateTask }) {
  return (
    <div className="flex flex-col gap-4">
      {project.coverImageUrl && (
        <img src={project.coverImageUrl} alt="" className="h-32 w-full rounded-xl object-cover sm:h-40" />
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="h-4 w-4 rounded-full" style={{ backgroundColor: project.color }} aria-hidden="true" />
          <div>
            <h1 className="text-xl font-bold text-text">{project.name}</h1>
            <p className="text-sm text-text-secondary">{formatPercent(project.progress)} complété</p>
          </div>
        </div>
        <Button onClick={onCreateTask} aria-label="Créer une tâche">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Tâche
        </Button>
      </div>
    </div>
  );
}
