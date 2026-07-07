import { formatDate } from "@/utils/formatters.js";

export function UpcomingDeadlines({ tasks = [] }) {
  if (tasks.length === 0) {
    return <p className="text-sm text-text-secondary">Aucune échéance à venir.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task) => (
        <li key={task.id} className="flex items-center justify-between text-sm">
          <span className="text-text">{task.title}</span>
          <span className="text-text-secondary">{formatDate(task.dueDate)}</span>
        </li>
      ))}
    </ul>
  );
}
