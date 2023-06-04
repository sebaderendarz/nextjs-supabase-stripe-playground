import { SupabaseClient } from "@supabase/supabase-js";
import { createContext, useContext } from "react";
import browserClient from "../lib/supabase/cookies/browser-client";

type SupabaseContext = {
  supabase: SupabaseClient;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Context.Provider value={{ supabase: browserClient }}>
      {children}
    </Context.Provider>
  );
}

export const useSupabase = (): SupabaseContext => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider");
  }

  return context;
};
