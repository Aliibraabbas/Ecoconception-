import { useRef, useState } from "react";
import { User } from "lucide-react";
import { supabase } from "@/services/supabaseClient.js";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { Alert } from "@/components/ui/Alert.jsx";

export function AvatarUploader({ avatarUrl, onUploaded }) {
  const { user } = useAuth();
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError(null);

    const path = `${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (uploadError) {
      setError("Échec de l'envoi de l'avatar.");
      setLoading(false);
      return;
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    await onUploaded(data.publicUrl);
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-text-secondary/10">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar de l'utilisateur" className="h-full w-full object-cover" />
        ) : (
          <User className="h-8 w-8 text-text-secondary" aria-hidden="true" />
        )}
      </div>
      <div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        <Button type="button" variant="secondary" loading={loading} onClick={() => inputRef.current?.click()}>
          Changer l’avatar
        </Button>
        {error && <Alert variant="error">{error}</Alert>}
      </div>
    </div>
  );
}
