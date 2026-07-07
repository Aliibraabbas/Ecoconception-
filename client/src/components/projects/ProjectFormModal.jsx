import { useState } from "react";
import { Modal } from "@/components/ui/Modal.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { FormField, Input } from "@/components/ui/Input.jsx";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#EC4899"];

export function ProjectFormModal({ project, onClose, onSubmit, loading }) {
  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [color, setColor] = useState(project?.color ?? COLORS[0]);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Le nom est requis.");
      return;
    }
    onSubmit({ name: name.trim(), description: description.trim() || undefined, color });
  };

  return (
    <Modal title={project ? "Modifier le projet" : "Nouveau projet"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField label="Nom" htmlFor="project-name" error={error}>
          <Input id="project-name" value={name} onChange={(e) => setName(e.target.value)} required />
        </FormField>
        <FormField label="Description" htmlFor="project-description">
          <textarea
            id="project-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-text-secondary/30 bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary"
          />
        </FormField>
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-text">Couleur</legend>
          <div className="flex gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-label={`Couleur ${c}`}
                aria-pressed={color === c}
                className={`h-7 w-7 rounded-full ring-offset-2 ${color === c ? "ring-2 ring-primary" : ""}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </fieldset>
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
