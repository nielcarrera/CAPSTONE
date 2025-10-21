import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase;

if (!window.__supabase) {
  window.__supabase = createClient(supabaseUrl, supabaseAnonKey);
}
supabase = window.__supabase;

export { supabase };
