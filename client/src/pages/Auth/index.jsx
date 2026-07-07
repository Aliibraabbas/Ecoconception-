import { useState } from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import clsx from "clsx";
import { isSupabaseConfigured } from "@/services/supabaseClient.js";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { Alert } from "@/components/ui/Alert.jsx";
import { LoginForm } from "./LoginForm.jsx";
import { RegisterForm } from "./RegisterForm.jsx";
import { ForgotPasswordForm } from "./ForgotPasswordForm.jsx";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [tab, setTab] = useState(searchParams.get("tab") === "register" ? "register" : "login");
  const [forgotPassword, setForgotPassword] = useState(false);

  if (user) return <Navigate to="/app" replace />;

  if (!isSupabaseConfigured) {
    return (
      <Alert variant="error">
        Configuration Supabase manquante. Renseignez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans client/.env.
      </Alert>
    );
  }

  if (forgotPassword) {
    return <ForgotPasswordForm onBack={() => setForgotPassword(false)} />;
  }

  return (
    <div>
      <div role="tablist" aria-label="Authentification" className="mb-6 flex rounded-lg border border-text-secondary/20 p-1">
        <button
          role="tab"
          aria-selected={tab === "login"}
          onClick={() => setTab("login")}
          className={clsx(
            "flex-1 rounded-md py-2 text-sm font-medium transition-colors",
            tab === "login" ? "bg-primary text-white" : "text-text-secondary"
          )}
        >
          Connexion
        </button>
        <button
          role="tab"
          aria-selected={tab === "register"}
          onClick={() => setTab("register")}
          className={clsx(
            "flex-1 rounded-md py-2 text-sm font-medium transition-colors",
            tab === "register" ? "bg-primary text-white" : "text-text-secondary"
          )}
        >
          Inscription
        </button>
      </div>

      {tab === "login" ? <LoginForm /> : <RegisterForm />}

      {tab === "login" && (
        <button
          type="button"
          onClick={() => setForgotPassword(true)}
          className="mt-4 text-sm text-text-secondary hover:underline"
        >
          Mot de passe oublié ?
        </button>
      )}
    </div>
  );
}
