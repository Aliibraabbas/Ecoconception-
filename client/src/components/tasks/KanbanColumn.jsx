import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard.jsx";

export function KanbanColumn({ id, title, tasks, categoriesById, onEdit, onDelete }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex w-72 shrink-0 flex-col gap-3 rounded-xl border p-3 ${
        isOver ? "border-primary bg-primary/5" : "border-text-secondary/10 bg-surface"
      }`}
    >
      <h3 className="flex items-center justify-between text-sm font-semibold text-text">
        {title}
        <span className="rounded-full bg-text-secondary/10 px-2 py-0.5 text-xs text-text-secondary">{tasks.length}</span>
      </h3>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} category={categoriesById[task.categoryId]} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
