import { Link } from "react-router-dom";

export function RecentProjects({ projects = [] }) {
  if (projects.length === 0) {
    return <p className="text-sm text-text-secondary">Aucun projet pour le moment.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {projects.map((project) => (
        <li key={project.id}>
          <Link
            to={`/app/projects/${project.id}`}
            className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-text-secondary/10"
          >
            <span className="flex items-center gap-2 text-text">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: project.color }} aria-hidden="true" />
              {project.name}
            </span>
            <span className="text-text-secondary">{Math.round((project.progress ?? 0) * 100)}%</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
