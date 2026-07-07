import { NavLink, Link } from "react-router-dom";
import { LayoutDashboard, FolderKanban, Calendar, Settings, User, X } from "lucide-react";
import clsx from "clsx";
import { Logo } from "@/assets/logo/Logo.jsx";

const LINKS = [
  { to: "/app", label: "Dashboard", Icon: LayoutDashboard, end: true },
  { to: "/app/projects", label: "Projets", Icon: FolderKanban },
  { to: "/app/calendar", label: "Calendrier", Icon: Calendar },
  { to: "/app/profile", label: "Profil", Icon: User },
  { to: "/app/settings", label: "Paramètres", Icon: Settings },
];

export function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-30 w-64 transform border-r border-text-secondary/10 bg-surface p-4 transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold text-text" aria-label="Retour à la page d'accueil Momentum">
            <Logo className="h-5 w-5 text-primary" />
            Momentum
          </Link>
          <button onClick={onClose} className="rounded-md p-1 text-text-secondary lg:hidden" aria-label="Fermer le menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-1">
          {LINKS.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-primary/10 text-primary" : "text-text-secondary hover:bg-text-secondary/10"
                )
              }
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
