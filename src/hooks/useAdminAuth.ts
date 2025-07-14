import { useAuth, useUser } from "@clerk/clerk-react";
import { isAuthorizedAdmin } from "@/config/auth";

export function useAdminAuth() {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();

  const isAuthorized =
    isSignedIn && user?.primaryEmailAddress?.emailAddress
      ? isAuthorizedAdmin(user.primaryEmailAddress.emailAddress)
      : false;

  const userEmail = user?.primaryEmailAddress?.emailAddress;

  return {
    isLoaded,
    isSignedIn,
    isAuthorized,
    userEmail,
    signOut,
    user,
  };
}
