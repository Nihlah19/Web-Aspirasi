import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://hvmjakwrmfcrsgbpyexl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bWpha3dybWZjcnNnYnB5ZXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1Nzk4NjEsImV4cCI6MjA5NzE1NTg2MX0.khVvI1UKkSv81wVBfb2i8FWtn42x0nRVOSEj49123dg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
});
