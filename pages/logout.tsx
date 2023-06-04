import { useEffect } from "react";
import { useUser, UserContext } from "../context/user";

const Logout = () => {
  const { logout } = useUser() as UserContext;

  useEffect(() => {
    logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <p>Logging out</p>;
};

export default Logout;
