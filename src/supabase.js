import { createClient } from "@supabase/supabase-js";

// Get your Supabase credentials from the dashboard
const SUPABASE_URL = "https://avpsfftgxglwiqxyzpaw.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cHNmZnRneGdsd2lxeHl6cGF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2MzEwNzgsImV4cCI6MjA1NTIwNzA3OH0.Ea-cgETqjKcXAuZ8zvS5HnErVVT0tb_0DBWzTCYAtUw";

// Create a Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
