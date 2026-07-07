import { useState } from "react";
import { supabase } from "@/services/supabaseClient.js";
import { FormField, Input } from "@/components/ui/Input.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { Alert } from "@/components/ui/Alert.jsx";

export function PasswordForm() {
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
    setSuccess(false);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setSuccess(true);
    setPassword("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-text">Changer le mot de passe</h2>
      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">Mot de passe mis à jour.</Alert>}
      <FormField label="Nouveau mot de passe" htmlFor="new-password-profile">
        <Input
          id="new-password-profile"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormField>
      <Button type="submit" loading={loading} className="w-fit">
        Mettre à jour
      </Button>
    </form>
  );
}
