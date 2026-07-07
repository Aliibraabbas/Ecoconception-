import { useState } from "react";
import { Plus } from "lucide-react";
import { Modal } from "@/components/ui/Modal.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { FormField, Input } from "@/components/ui/Input.jsx";
import { useCategories, useCreateCategory } from "@/hooks/useCategories.js";

export function TaskFormModal({ task, onClose, onSubmit, loading }) {
  const { data: categories } = useCategories();
  const createCategory = useCreateCategory();
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [priority, setPriority] = useState(task?.priority ?? "medium");
  const [status, setStatus] = useState(task?.status ?? "todo");
  const [dueDate, setDueDate] = useState(task?.dueDate ?? "");
  const [categoryId, setCategoryId] = useState(task?.categoryId ?? "");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [error, setError] = useState(null);

  const handleCreateCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return;
    const { category } = await createCategory.mutateAsync({ name });
    setCategoryId(category.id);
    setNewCategoryName("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Le titre est requis.");
      return;
    }
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      status,
      dueDate: dueDate || null,
      categoryId: categoryId || null,
    });
  };

  return (
    <Modal title={task ? "Modifier la tâche" : "Nouvelle tâche"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField label="Titre" htmlFor="task-title" error={error}>
          <Input id="task-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </FormField>
        <FormField label="Description" htmlFor="task-description">
          <textarea
            id="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-text-secondary/30 bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary"
          />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Priorité" htmlFor="task-priority">
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-lg border border-text-secondary/30 bg-background px-3 py-2 text-sm text-text"
            >
              <option value="low">Basse</option>
              <option value="medium">Moyenne</option>
              <option value="high">Haute</option>
            </select>
          </FormField>
          <FormField label="Statut" htmlFor="task-status">
            <select
              id="task-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-text-secondary/30 bg-background px-3 py-2 text-sm text-text"
            >
              <option value="todo">À faire</option>
              <option value="in_progress">En cours</option>
              <option value="done">Terminé</option>
            </select>
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Échéance" htmlFor="task-due">
            <Input id="task-due" type="date" value={dueDate ?? ""} onChange={(e) => setDueDate(e.target.value)} />
          </FormField>
          <FormField label="Catégorie" htmlFor="task-category">
            <select
              id="task-category"
              value={categoryId ?? ""}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border border-text-secondary/30 bg-background px-3 py-2 text-sm text-text"
            >
              <option value="">Aucune</option>
              {(categories?.data ?? []).map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="mt-1.5 flex gap-1.5">
              <Input
                aria-label="Nouvelle catégorie"
                placeholder="Nouvelle catégorie…"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="text-xs"
              />
              <button
                type="button"
                onClick={handleCreateCategory}
                aria-label="Ajouter la catégorie"
                className="shrink-0 rounded-lg border border-text-secondary/30 p-2 text-text-secondary hover:bg-text-secondary/10"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </FormField>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" loading={loading}>
            Enregistrer
          </Button>
        </div>
      </form>
    </Modal>
  );
}
