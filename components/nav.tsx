import Link from "next/link";
import { useUser, UserContext } from "@/context/user";

const Nav = () => {
  const { user } = useUser() as UserContext;
  return (
    <nav className="flex py-4 px-6 border-b border-gray-200">
      <Link href="/">Home</Link>
      <Link href="/dashboard" className="ml-2">
        Dashboard
      </Link>
      <Link href="/pricing" className="ml-2">
        Pricing
      </Link>
      <div className="ml-auto">
        <Link href={user ? "/logout" : "/login"}>
          {user ? "Logout" : "Login"}
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
