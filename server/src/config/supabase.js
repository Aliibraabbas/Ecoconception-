import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";

const supabaseAuthClient = createClient(env.supabaseUrl, env.supabaseAnonKey);

// Valide le token Supabase Auth via l'API Supabase (auth.getUser) plutôt qu'une
// vérification JWT locale : certains projets Supabase (clés asymétriques, rotation)
// ne sont pas fiables à vérifier manuellement en HS256/JWKS depuis le backend.
export async function verifySupabaseToken(token) {
  const { data, error } = await supabaseAuthClient.auth.getUser(token);
  if (error || !data?.user) {
    throw new Error("Token Supabase invalide ou expiré");
  }
  return data.user;
}
