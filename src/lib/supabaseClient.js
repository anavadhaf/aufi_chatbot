import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const missingEnvVars = [
  !supabaseUrl && "VITE_SUPABASE_URL",
  !supabaseAnonKey && "VITE_SUPABASE_ANON_KEY",
].filter(Boolean);

if (missingEnvVars.length > 0) {
  console.error(
    `[Supabase] Missing environment variable${missingEnvVars.length > 1 ? "s" : ""}: ${missingEnvVars.join(", ")}. ` +
      "Add them to your .env file before using the Supabase client.",
  );
}

export const isSupabaseConfigured = missingEnvVars.length === 0;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export function getSupabaseClient() {
  if (!supabase) {
    throw new Error(
      "[Supabase] Client not initialized. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.",
    );
  }

  return supabase;
}
