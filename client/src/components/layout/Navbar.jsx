import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle.jsx";
import { Logo } from "@/assets/logo/Logo.jsx";
import { useAuth } from "@/contexts/AuthContext.jsx";

export function Navbar() {
  const { user } = useAuth();

  return (
    <header className="border-b border-text-secondary/10 bg-surface">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-text">
          <Logo className="h-6 w-6 text-primary" />
          Momentum
        </Link>
        <div className="hidden items-center gap-6 text-sm text-text-secondary sm:flex">
          <a href="#features">Fonctionnalités</a>
          <a href="#faq">FAQ</a>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <Link
              to="/app"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
            >
              Accéder à mon espace
            </Link>
          ) : (
            <>
              <Link to="/auth" className="text-sm font-medium text-text hover:text-primary">
                Se connecter
              </Link>
              <Link
                to="/auth?tab=register"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
              >
                S’inscrire
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
