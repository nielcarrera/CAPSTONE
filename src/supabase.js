import { createClient } from "@supabase/supabase-js";

// Get your Supabase credentials from the dashboard
const SUPABASE_URL = "https://qeanesmfzhimrfkrrcmd.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlYW5lc21memhpbXJma3JyY21kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2MzEwMDksImV4cCI6MjA1NTIwNzAwOX0.TMw7ea3h07WooAFvAG9OaPb_T_dDUZ9QbZZtl-wigRY";

// Create a Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
