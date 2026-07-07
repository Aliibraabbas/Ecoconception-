import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-3 py-4">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="rounded-md p-2 text-text-secondary hover:bg-text-secondary/10 disabled:opacity-40"
        aria-label="Page précédente"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="text-sm text-text-secondary">
        Page {page} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded-md p-2 text-text-secondary hover:bg-text-secondary/10 disabled:opacity-40"
        aria-label="Page suivante"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
