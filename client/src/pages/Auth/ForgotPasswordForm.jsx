import { useState } from "react";
import { supabase } from "@/services/supabaseClient.js";
import { FormField, Input } from "@/components/ui/Input.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { Alert } from "@/components/ui/Alert.jsx";

export function ForgotPasswordForm({ onBack }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset`,
    });
    setLoading(false);
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setSent(true);
  };

  if (sent) {
    return <Alert variant="success">Un e-mail de réinitialisation a été envoyé si ce compte existe.</Alert>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <Alert variant="error">{error}</Alert>}
      <FormField label="Email" htmlFor="forgot-email">
        <Input
          id="forgot-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormField>
      <Button type="submit" loading={loading} className="w-full">
        Envoyer le lien de réinitialisation
      </Button>
      <button type="button" onClick={onBack} className="text-sm text-text-secondary hover:underline">
        Retour à la connexion
      </button>
    </form>
  );
}
