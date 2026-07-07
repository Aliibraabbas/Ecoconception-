const SCREENSHOTS = [
  { src: "/demo/screenshot-dashboard-raster.png", label: "Dashboard" },
  { src: "/demo/screenshot-projects.svg", label: "Projets" },
  { src: "/demo/screenshot-kanban-raster.png", label: "Kanban" },
  { src: "/demo/screenshot-calendar-raster.png", label: "Calendrier" },
];

export function Screenshots() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {SCREENSHOTS.map(({ src, label }) => (
        <figure key={label} className="overflow-hidden rounded-xl border border-text-secondary/10 bg-surface">
          <img src={src} alt={`Capture d'écran de la page ${label} de Momentum`} className="w-full object-cover" />
          <figcaption className="px-3 py-2 text-center text-sm font-medium text-text-secondary">{label}</figcaption>
        </figure>
      ))}
    </div>
  );
}
