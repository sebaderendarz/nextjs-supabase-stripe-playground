import "../styles/globals.css";
import UserProvider from "../context/user";
import Nav from "../components/nav";
import SupabaseProvider from "@/context/supabase";

export default function App({ Component, pageProps }: any) {
  return (
    <SupabaseProvider>
      <UserProvider>
        <Nav />
        <Component {...pageProps} />
      </UserProvider>
    </SupabaseProvider>
  );
}
