import { useRouter } from "next/router";
import { useUser, UserContext } from "../context/user";
import { useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const router = useRouter();
  const { user, isLoading } = useUser() as UserContext;

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPortal = async () => {
    const { data } = await axios.get("/api/portal");
    router.push(data.url);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-16 px-8">
      <h1 className="text-3xl mb-6">Dashboard</h1>
      {!isLoading && (
        <p>
          {user?.is_subscribed ? (
            <>
              <p className="mb-6">Subscribed: {user.interval}</p>
              <button onClick={loadPortal}>Manage subscription</button>
            </>
          ) : (
            <p>Not subscribed</p>
          )}
        </p>
      )}
    </div>
  );
};

export default Dashboard;
