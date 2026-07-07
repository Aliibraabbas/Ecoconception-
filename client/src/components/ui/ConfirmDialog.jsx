import { Modal } from "./Modal.jsx";
import { Button } from "./Button.jsx";

export function ConfirmDialog({ title, message, confirmLabel = "Confirmer", onConfirm, onClose, loading }) {
  return (
    <Modal title={title} onClose={onClose}>
      <p className="mb-6 text-sm text-text-secondary">{message}</p>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          Annuler
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
