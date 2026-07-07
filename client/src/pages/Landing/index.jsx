import { Link } from "react-router-dom";
import { LayoutDashboard, KanbanSquare, CalendarDays, Search, Bell, FolderKanban } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { FaqAccordion } from "./FaqAccordion.jsx";
import { Screenshots } from "./Screenshots.jsx";

const FEATURES = [
  {
    Icon: FolderKanban,
    image: "/demo/feature-projects.svg",
    title: "Gestion de projets",
    description: "Créez des projets colorés avec couverture, description et suivi de progression automatique.",
  },
  {
    Icon: KanbanSquare,
    image: "/demo/feature-kanban.svg",
    title: "Vue Kanban",
    description: "Organisez vos tâches par glisser-déposer entre À faire, En cours et Terminé.",
  },
  {
    Icon: CalendarDays,
    image: "/demo/feature-calendar.svg",
    title: "Calendrier",
    description: "Visualisez vos échéances sur un mois pour ne jamais rien manquer.",
  },
  {
    Icon: LayoutDashboard,
    image: "/demo/feature-dashboard.svg",
    title: "Dashboard",
    description: "Statistiques, graphiques et activité récente pour visualiser votre progression.",
  },
  {
    Icon: Bell,
    image: "/demo/feature-notifications.svg",
    title: "Notifications",
    description: "Rappels d'échéances proches ou dépassées, directement dans l'application.",
  },
  {
    Icon: Search,
    image: "/demo/feature-search.svg",
    title: "Recherche globale",
    description: "Retrouvez instantanément un projet ou une tâche depuis n'importe quelle page.",
  },
];

export default function Landing() {
  const { user } = useAuth();
  const primaryCta = user
    ? { to: "/app", label: "Accéder à mon espace" }
    : { to: "/auth?tab=register", label: "Commencer gratuitement" };

  return (
    <div>
      <section className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6">
        <h1 className="text-4xl font-bold tracking-tight text-text sm:text-5xl">
          Gardez votre <span className="text-primary">Momentum</span>
        </h1>
        <p className="max-w-xl text-lg text-text-secondary">
          Organisez vos projets, priorisez vos tâches et suivez votre progression dans une interface rapide,
          épurée et éco-conçue.
        </p>
        <div className="flex gap-3">
          <Link
            to={primaryCta.to}
            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            {primaryCta.label}
          </Link>
          <a
            href="#features"
            className="rounded-lg border border-text-secondary/30 px-6 py-3 text-sm font-semibold text-text hover:bg-text-secondary/10"
          >
            Découvrir
          </a>
        </div>
        <img
          src="/demo/hero-dashboard-raster.png"
          alt="Aperçu du dashboard Momentum avec statistiques, graphiques et projets récents"
          className="mt-6 w-full max-w-4xl rounded-2xl border border-text-secondary/10 shadow-lg"
        />
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="mb-10 text-center text-2xl font-bold text-text">Tout ce qu’il faut, rien de superflu</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ Icon, image, title, description }) => (
            <div key={title} className="overflow-hidden rounded-xl border border-text-secondary/10 bg-surface">
              <img src={image} alt="" className="h-32 w-full object-cover" />
              <div className="p-6">
                <Icon className="mb-3 h-6 w-6 text-primary" aria-hidden="true" />
                <h3 className="mb-1 font-semibold text-text">{title}</h3>
                <p className="text-sm text-text-secondary">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="screenshots" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="mb-10 text-center text-2xl font-bold text-text">Momentum en images</h2>
        <Screenshots />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="mb-10 text-center text-2xl font-bold text-text">Questions fréquentes</h2>
        <FaqAccordion />
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h2 className="mb-4 text-2xl font-bold text-text">Prêt à reprendre le contrôle de vos projets ?</h2>
        <Link
          to={primaryCta.to}
          className="inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          {primaryCta.label}
        </Link>
      </section>
    </div>
  );
}
