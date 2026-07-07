import { useState } from "react";
import { DndContext, DragOverlay, closestCorners, PointerSensor, KeyboardSensor, useSensor, useSensors } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn.jsx";
import { TaskCard } from "./TaskCard.jsx";

const COLUMNS = [
  { id: "todo", title: "À faire" },
  { id: "in_progress", title: "En cours" },
  { id: "done", title: "Terminé" },
];

export function KanbanBoard({ tasks, categoriesById, onEdit, onDelete, onStatusChange }) {
  const [activeTask, setActiveTask] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.id] = tasks.filter((t) => t.status === col.id).sort((a, b) => a.position - b.position);
    return acc;
  }, {});

  const handleDragStart = (event) => {
    setActiveTask(tasks.find((t) => t.id === event.active.id) || null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const activeTaskData = tasks.find((t) => t.id === active.id);
    if (!activeTaskData) return;

    const overColumn = COLUMNS.some((c) => c.id === over.id)
      ? over.id
      : tasks.find((t) => t.id === over.id)?.status;

    if (!overColumn || overColumn === activeTaskData.status) return;
    onStatusChange(activeTaskData, overColumn);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4" role="group" aria-label="Tableau Kanban">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            tasks={grouped[col.id]}
            categoriesById={categoriesById}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask && <TaskCard task={activeTask} category={categoriesById[activeTask.categoryId]} onEdit={() => {}} onDelete={() => {}} />}
      </DragOverlay>
    </DndContext>
  );
}
