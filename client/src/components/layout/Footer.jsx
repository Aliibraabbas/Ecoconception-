export function Footer() {
  return (
    <footer className="border-t border-text-secondary/10 bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-text-secondary sm:flex-row sm:px-6">
        <p>© {new Date().getFullYear()} Momentum</p>
        <p>Construit avec React, Express &amp; Supabase</p>
      </div>
    </footer>
  );
}
