import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { setClerkTokenGetter } from "@/lib/api-client";

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken } = useAuth();

  useEffect(() => {
    // Set the token getter function for the API client
    setClerkTokenGetter(getToken);
  }, [getToken]);

  return <>{children}</>;
};
