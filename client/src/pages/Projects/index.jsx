import { useState } from "react";
import { FolderKanban } from "lucide-react";
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from "@/hooks/useProjects.js";
import { useDebounce } from "@/hooks/useDebounce.js";
import { ProjectToolbar } from "@/components/projects/ProjectToolbar.jsx";
import { ProjectCard } from "@/components/projects/ProjectCard.jsx";
import { ProjectFormModal } from "@/components/projects/ProjectFormModal.jsx";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog.jsx";
import { Pagination } from "@/components/common/Pagination.jsx";
import { EmptyState } from "@/components/common/EmptyState.jsx";
import { ErrorState } from "@/components/common/ErrorState.jsx";
import { Skeleton } from "@/components/common/Skeleton.jsx";

export default function Projects() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [modalProject, setModalProject] = useState(undefined);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const debouncedQ = useDebounce(q, 300);
  const { data, isLoading, isError, refetch } = useProjects({ q: debouncedQ, status, page });
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();

  const handleSubmit = async (payload) => {
    if (modalProject?.id) {
      await updateMutation.mutateAsync({ id: modalProject.id, ...payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setModalProject(undefined);
  };

  const handleArchive = (project) => {
    updateMutation.mutate({ id: project.id, status: project.status === "active" ? "archived" : "active" });
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(projectToDelete.id);
    setProjectToDelete(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-text">Projets</h1>
      <ProjectToolbar
        q={q}
        onQChange={(v) => {
          setQ(v);
          setPage(1);
        }}
        status={status}
        onStatusChange={(v) => {
          setStatus(v);
          setPage(1);
        }}
        onCreate={() => setModalProject(null)}
      />

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      )}

      {isError && <ErrorState onRetry={refetch} message="Impossible de charger les projets." />}

      {!isLoading && !isError && data.data.length === 0 && (
        <EmptyState
          icon={FolderKanban}
          title="Aucun projet pour le moment"
          description="Créez votre premier projet pour commencer à organiser vos tâches."
          actionLabel="Créer un projet"
          onAction={() => setModalProject(null)}
        />
      )}

      {!isLoading && !isError && data.data.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.data.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={setModalProject}
                onArchive={handleArchive}
                onDelete={setProjectToDelete}
              />
            ))}
          </div>
          <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
        </>
      )}

      {modalProject !== undefined && (
        <ProjectFormModal
          project={modalProject}
          onClose={() => setModalProject(undefined)}
          onSubmit={handleSubmit}
          loading={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {projectToDelete && (
        <ConfirmDialog
          title="Supprimer le projet"
          message={`Voulez-vous vraiment supprimer "${projectToDelete.name}" ? Cette action est irréversible.`}
          confirmLabel="Supprimer"
          onConfirm={handleDelete}
          onClose={() => setProjectToDelete(null)}
          loading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
