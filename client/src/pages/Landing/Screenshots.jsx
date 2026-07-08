const SCREENSHOTS = [
  { src: "/demo/screenshot-dashboard-raster.webp", label: "Dashboard", width: 1440, height: 900 },
  { src: "/demo/screenshot-projects.svg", label: "Projets", width: 1440, height: 900 },
  { src: "/demo/screenshot-kanban-raster.webp", label: "Kanban", width: 1440, height: 900 },
  { src: "/demo/screenshot-calendar-raster.webp", label: "Calendrier", width: 1440, height: 900 },
];

export function Screenshots() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {SCREENSHOTS.map(({ src, label, width, height }) => (
        <figure key={label} className="overflow-hidden rounded-xl border border-text-secondary/10 bg-surface">
          <img
            src={src}
            alt={`Capture d'écran de la page ${label} de Momentum`}
            width={width}
            height={height}
            loading="lazy"
            className="w-full object-cover"
          />
          <figcaption className="px-3 py-2 text-center text-sm font-medium text-text-secondary">{label}</figcaption>
        </figure>
      ))}
    </div>
  );
}