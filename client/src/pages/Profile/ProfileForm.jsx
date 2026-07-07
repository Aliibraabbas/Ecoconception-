import { useState } from "react";
import { FormField, Input } from "@/components/ui/Input.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { Alert } from "@/components/ui/Alert.jsx";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { AvatarUploader } from "./AvatarUploader.jsx";

export function ProfileForm({ profile, onSave, saving }) {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(profile.fullName ?? "");
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave({ fullName });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <AvatarUploader avatarUrl={profile.avatarUrl} onUploaded={(url) => onSave({ avatarUrl: url })} />
      {saved && <Alert variant="success">Profil mis à jour.</Alert>}
      <FormField label="Nom complet" htmlFor="profile-name">
        <Input id="profile-name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </FormField>
      <FormField label="Email" htmlFor="profile-email">
        <Input id="profile-email" value={user?.email ?? ""} disabled readOnly />
      </FormField>
      <Button type="submit" loading={saving} className="w-fit">
        Enregistrer
      </Button>
    </form>
  );
}
