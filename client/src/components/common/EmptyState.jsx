import { Button } from "@/components/ui/Button.jsx";

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-text-secondary/30 px-6 py-16 text-center">
      {Icon && <Icon className="h-10 w-10 text-text-secondary" aria-hidden="true" />}
      <p className="text-lg font-semibold text-text">{title}</p>
      {description && <p className="max-w-sm text-sm text-text-secondary">{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
