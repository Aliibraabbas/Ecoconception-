const PRIORITY_STYLES = {
  low: "bg-priority-low/15 text-priority-low",
  medium: "bg-priority-medium/15 text-priority-medium",
  high: "bg-priority-high/15 text-priority-high",
};

export function TaskChip({ task, onClick }) {
  return (
    <button
      onClick={() => onClick(task)}
      className={`block w-full truncate rounded px-1.5 py-0.5 text-left text-xs font-medium ${PRIORITY_STYLES[task.priority]}`}
    >
      {task.title}
    </button>
  );
}
