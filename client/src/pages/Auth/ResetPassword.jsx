import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/services/supabaseClient.js";
import { FormField, Input } from "@/components/ui/Input.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { Alert } from "@/components/ui/Alert.jsx";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    setLoading(true);
    setError(null);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    navigate("/app");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-text">Nouveau mot de passe</h1>
      {error && <Alert variant="error">{error}</Alert>}
      <FormField label="Nouveau mot de passe" htmlFor="new-password">
        <Input
          id="new-password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormField>
      <Button type="submit" loading={loading} className="w-full">
        Mettre à jour
      </Button>
    </form>
  );
}
