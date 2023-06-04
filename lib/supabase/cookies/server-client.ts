import {
  createServerComponentClient,
  SupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const createServerSupabase = (): SupabaseClient =>
  createServerComponentClient({ cookies });

export default createServerSupabase;
