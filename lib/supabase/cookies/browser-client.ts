import {
  createPagesBrowserClient,
  SupabaseClient,
} from "@supabase/auth-helpers-nextjs";

const browserSupabase: SupabaseClient = createPagesBrowserClient();

export default browserSupabase;
