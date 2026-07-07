import { Button } from "@/components/ui/Button.jsx";

export function ErrorState({ message = "Une erreur est survenue.", onRetry }) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center gap-3 rounded-xl border border-danger/30 bg-danger/5 px-6 py-12 text-center">
      <p className="text-sm font-medium text-danger">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Réessayer
        </Button>
      )}
    </div>
  );
}
