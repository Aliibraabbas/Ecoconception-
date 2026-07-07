import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/services/supabaseClient.js";
import { FormField, Input } from "@/components/ui/Input.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { Alert } from "@/components/ui/Alert.jsx";

export function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError("Identifiants invalides. Vérifiez votre email et votre mot de passe.");
      return;
    }
    navigate("/app");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <Alert variant="error">{error}</Alert>}
      <FormField label="Email" htmlFor="login-email">
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormField>
      <FormField label="Mot de passe" htmlFor="login-password">
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormField>
      <Button type="submit" loading={loading} className="w-full">
        Se connecter
      </Button>
    </form>
  );
}
