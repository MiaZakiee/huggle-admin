import { useAdminAuth } from "@/hooks/useAdminAuth";
import { LoadingPage } from "./LoadingPage";
import { UnauthorizedPage } from "./UnauthorizedPage";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoaded, isSignedIn, isAuthorized } = useAdminAuth();

  // Still loading authentication state
  if (!isLoaded) {
    return <LoadingPage />;
  }

  // Not signed in, redirect to login
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  // Signed in but not authorized (email not in admin list)
  if (!isAuthorized) {
    return <UnauthorizedPage />;
  }

  // Authorized admin, show the protected content
  return <>{children}</>;
}
