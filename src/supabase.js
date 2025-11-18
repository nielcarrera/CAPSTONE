// src/lib/supabaseClient.js

import { createClient } from "@supabase/supabase-js";

// This securely loads your keys from the environment variables you set in Vercel.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;  
// This will now work both locally (with a .env file) and on Vercel.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);