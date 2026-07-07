import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/services/supabaseClient.js";
import { FormField, Input } from "@/components/ui/Input.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { Alert } from "@/components/ui/Alert.jsx";

export function RegisterForm() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message.includes("already") ? "Cet e-mail est déjà utilisé." : signUpError.message);
      return;
    }
    if (data.session) {
      navigate("/app");
      return;
    }
    setSuccess(true);
  };

  if (success) {
    return <Alert variant="success">Compte créé ! Vérifiez votre boîte mail pour confirmer votre inscription.</Alert>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <Alert variant="error">{error}</Alert>}
      <FormField label="Nom complet" htmlFor="register-name">
        <Input id="register-name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </FormField>
      <FormField label="Email" htmlFor="register-email">
        <Input
          id="register-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormField>
      <FormField label="Mot de passe" htmlFor="register-password">
        <Input
          id="register-password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormField>
      <Button type="submit" loading={loading} className="w-full">
        S’inscrire
      </Button>
    </form>
  );
}
