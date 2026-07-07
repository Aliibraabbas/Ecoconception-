import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ListChecks } from "lucide-react";
import { useProject, useProjectStats } from "@/hooks/useProjects.js";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from "@/hooks/useTasks.js";
import { useCategories } from "@/hooks/useCategories.js";
import { ProjectHeader } from "@/components/projects/ProjectHeader.jsx";
import { ViewToggle } from "@/components/tasks/ViewToggle.jsx";
import { TaskFilters } from "@/components/tasks/TaskFilters.jsx";
import { KanbanBoard } from "@/components/tasks/KanbanBoard.jsx";
import { TaskList } from "@/components/tasks/TaskList.jsx";
import { TaskFormModal } from "@/components/tasks/TaskFormModal.jsx";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog.jsx";
import { EmptyState } from "@/components/common/EmptyState.jsx";
import { ErrorState } from "@/components/common/ErrorState.jsx";
import { Skeleton } from "@/components/common/Skeleton.jsx";

export default function ProjectDetail() {
  const { id } = useParams();
  const [view, setView] = useState("kanban");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [modalTask, setModalTask] = useState(undefined);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const { data: project, isLoading: projectLoading, isError: projectError, refetch: refetchProject } = useProject(id);
  const { data: stats } = useProjectStats(id);
  const { data: categories } = useCategories();
  const { data: tasksData, isLoading: tasksLoading, isError: tasksError, refetch: refetchTasks } = useTasks(id, {
    status,
    priority,
    categoryId,
    limit: 100,
  });

  const createTask = useCreateTask(id);
  const updateTask = useUpdateTask(id);
  const deleteTask = useDeleteTask(id);

  const categoriesById = useMemo(() => {
    const map = {};
    for (const cat of categories?.data ?? []) map[cat.id] = cat;
    return map;
  }, [categories]);

  if (projectLoading) return <Skeleton className="h-40" />;
  if (projectError) return <ErrorState onRetry={refetchProject} message="Impossible de charger le projet." />;

  const handleSubmit = async (payload) => {
    if (modalTask?.id) {
      await updateTask.mutateAsync({ id: modalTask.id, ...payload });
    } else {
      await createTask.mutateAsync(payload);
    }
    setModalTask(undefined);
  };

  const handleStatusChange = (task, newStatus) => {
    updateTask.mutate({ id: task.id, status: newStatus });
  };

  const handleDelete = async () => {
    await deleteTask.mutateAsync(taskToDelete.id);
    setTaskToDelete(null);
  };

  const tasks = tasksData?.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <ProjectHeader project={{ ...project.project, progress: stats?.progress ?? 0 }} onCreateTask={() => setModalTask(null)} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ViewToggle view={view} onChange={setView} />
        <TaskFilters
          status={status}
          onStatusChange={setStatus}
          priority={priority}
          onPriorityChange={setPriority}
          categoryId={categoryId}
          onCategoryChange={setCategoryId}
        />
      </div>

      {tasksLoading && <Skeleton className="h-64" />}
      {tasksError && <ErrorState onRetry={refetchTasks} message="Impossible de charger les tâches." />}

      {!tasksLoading && !tasksError && tasks.length === 0 && (
        <EmptyState
          icon={ListChecks}
          title="Aucune tâche"
          description="Ajoutez votre première tâche à ce projet."
          actionLabel="Créer une tâche"
          onAction={() => setModalTask(null)}
        />
      )}

      {!tasksLoading && !tasksError && tasks.length > 0 && view === "kanban" && (
        <KanbanBoard
          tasks={tasks}
          categoriesById={categoriesById}
          onEdit={setModalTask}
          onDelete={setTaskToDelete}
          onStatusChange={handleStatusChange}
        />
      )}

      {!tasksLoading && !tasksError && tasks.length > 0 && view === "list" && (
        <TaskList tasks={tasks} categoriesById={categoriesById} onEdit={setModalTask} onDelete={setTaskToDelete} />
      )}

      {modalTask !== undefined && (
        <TaskFormModal
          task={modalTask}
          onClose={() => setModalTask(undefined)}
          onSubmit={handleSubmit}
          loading={createTask.isPending || updateTask.isPending}
        />
      )}

      {taskToDelete && (
        <ConfirmDialog
          title="Supprimer la tâche"
          message={`Voulez-vous vraiment supprimer "${taskToDelete.title}" ?`}
          confirmLabel="Supprimer"
          onConfirm={handleDelete}
          onClose={() => setTaskToDelete(null)}
          loading={deleteTask.isPending}
        />
      )}
    </div>
  );
}
