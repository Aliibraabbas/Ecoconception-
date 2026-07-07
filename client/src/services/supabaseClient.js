import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

// null tant que VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY ne sont pas renseignées (voir client/.env)
export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null;
