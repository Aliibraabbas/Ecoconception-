import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext.jsx";

export function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-text-secondary">Chargement…</div>;
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}
