import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes("[PROJECT-REF]")
);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

/**
 * Sign in with email and password via Supabase Auth
 */
export async function signInWithEmail(email: string, password: string) {
  if (!supabase) {
    throw new Error("Supabase is not configured yet. Please use local demo login or add your VITE_SUPABASE_URL.");
  }
  return supabase.auth.signInWithPassword({ email, password });
}

/**
 * Sign up with email and password via Supabase Auth
 */
export async function signUpWithEmail(email: string, password: string, name: string) {
  if (!supabase) {
    throw new Error("Supabase is not configured yet. Please use local demo login or add your VITE_SUPABASE_URL.");
  }
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role: "learner" }
    }
  });
}

/**
 * Sign in with Google OAuth via Supabase Auth
 */
export async function signInWithGoogle() {
  if (!supabase) {
    throw new Error("Supabase is not configured yet. Please add your VITE_SUPABASE_URL and Google OAuth credentials.");
  }
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin
    }
  });
}

/**
 * Sign out of Supabase
 */
export async function signOutSupabase() {
  if (supabase) {
    await supabase.auth.signOut();
  }
}

/**
 * Upload study material to Supabase Storage bucket 'documents'
 */
export async function uploadDocumentToSupabase(file: File): Promise<string | null> {
  if (!supabase) return null;

  try {
    const cleanFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { data, error } = await supabase.storage
      .from("documents")
      .upload(cleanFileName, file, {
        cacheControl: "3600",
        upsert: true
      });

    if (error || !data) {
      console.warn("Supabase Storage upload returned error, falling back:", error);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from("documents")
      .getPublicUrl(cleanFileName);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.warn("Supabase storage error:", err);
    return null;
  }
}
