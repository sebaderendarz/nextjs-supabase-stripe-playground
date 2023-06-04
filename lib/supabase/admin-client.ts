import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseAdmin: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_KEY || ""
);

export default supabaseAdmin;
