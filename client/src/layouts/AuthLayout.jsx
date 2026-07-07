import { Link, Outlet } from "react-router-dom";
import { Logo } from "@/assets/logo/Logo.jsx";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2 text-xl font-bold text-text">
          <Logo className="h-6 w-6 text-primary" />
          Momentum
        </Link>
        <div className="rounded-2xl border border-text-secondary/10 bg-surface p-6 shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
