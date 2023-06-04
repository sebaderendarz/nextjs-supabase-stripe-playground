import { useEffect } from "react";
import { useUser, UserContext } from "../context/user";

const Login = () => {
  const { login } = useUser() as UserContext;

  useEffect(() => {
    login();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <p>Logging in</p>;
};

export default Login;
