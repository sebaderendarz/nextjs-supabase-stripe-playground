import { createContext, useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { useSupabase } from "./supabase";

export interface User {
  id: string;
  email: string;
}

export interface Profile {
  is_subscribed: boolean;
  interval: string | null;
}

export type UserProfile = User & Profile;

export interface UserContext {
  user: UserProfile | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const Context = createContext<UserContext | null>(null);

const Provider = ({ children }: any) => {
  const { supabase } = useSupabase();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserProfile = async () => {
      const {
        data: { user },
      } = await getUser();
      const profile: Profile | null = user ? await getProfile(user.id) : null;
      if (user && profile) {
        setUser({
          ...user,
          ...profile,
        } as UserProfile);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    supabase.auth.onAuthStateChange(() => {
      getUserProfile();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUser = async () => {
    return await supabase.auth.getUser();
  };

  const getProfile = async (userId: string) => {
    const { data: profile } = await supabase
      .from("profile")
      .select()
      .eq("id", userId)
      .single();
    return profile as Profile;
  };

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  const exposed: UserContext = {
    user,
    isLoading,
    login,
    logout,
  };

  return <Context.Provider value={exposed}>{children}</Context.Provider>;
};

export const useUser = () => useContext(Context);

export default Provider;
