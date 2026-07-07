import { useState } from "react";
import { Menu, Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle.jsx";
import { GlobalSearch } from "@/components/search/GlobalSearch.jsx";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { useNotifications } from "@/hooks/useNotifications.js";

export function Topbar({ onOpenSidebar }) {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const { data } = useNotifications({ limit: 5 });
  const unreadCount = data?.unreadCount ?? 0;

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between gap-4 border-b border-text-secondary/10 bg-surface px-4 py-3 sm:px-6">
      <button onClick={onOpenSidebar} className="rounded-md p-2 text-text-secondary lg:hidden" aria-label="Ouvrir le menu">
        <Menu className="h-5 w-5" />
      </button>
      <GlobalSearch />
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative rounded-md p-2 text-text-secondary hover:bg-text-secondary/10"
            aria-label="Notifications"
            aria-haspopup="true"
            aria-expanded={notifOpen}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
          {notifOpen && <NotificationsPanel onClose={() => setNotifOpen(false)} />}
        </div>
        <span className="hidden text-sm text-text-secondary sm:inline">{user?.email}</span>
        <button onClick={handleLogout} className="rounded-md p-2 text-text-secondary hover:bg-text-secondary/10" aria-label="Se déconnecter">
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

function NotificationsPanel({ onClose }) {
  const { data, isLoading, markAllRead, markRead } = useNotifications({ limit: 10 });

  return (
    <div
      role="dialog"
      aria-label="Notifications"
      className="absolute right-0 z-40 mt-2 w-80 rounded-xl border border-text-secondary/15 bg-surface p-3 shadow-lg"
    >
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-text">Notifications</p>
        <button onClick={() => markAllRead()} className="text-xs text-primary hover:underline">
          Tout marquer lu
        </button>
      </div>
      {isLoading && <p className="text-xs text-text-secondary">Chargement…</p>}
      {!isLoading && (data?.data?.length ?? 0) === 0 && <p className="text-xs text-text-secondary">Aucune notification.</p>}
      <ul className="flex max-h-72 flex-col gap-1 overflow-y-auto">
        {data?.data?.map((n) => (
          <li key={n.id}>
            <button
              onClick={() => markRead(n.id)}
              className={`w-full rounded-md p-2 text-left text-xs hover:bg-text-secondary/10 ${n.read ? "text-text-secondary" : "text-text font-medium"}`}
            >
              <p>{n.title}</p>
              {n.body && <p className="text-text-secondary">{n.body}</p>}
            </button>
          </li>
        ))}
      </ul>
      <button onClick={onClose} className="mt-2 text-xs text-text-secondary hover:underline">
        Fermer
      </button>
    </div>
  );
}
