import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";

export function useAuthenticatedRequest() {
  const { getToken } = useAuth();

  const makeRequest = async (url: string, options: RequestInit = {}) => {
    try {
      const token = await getToken();
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        toast.error("Session expired. Please sign in again.");
        throw new Error("Session expired");
      }

      if (response.status === 403) {
        toast.error(
          "Access denied. You do not have permission for this action."
        );
        throw new Error("Access denied");
      }

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Request failed" }));
        toast.error(errorData.message || "Request failed");
        throw new Error(errorData.message || "Request failed");
      }

      return response;
    } catch (error: any) {
      if (
        error.message === "Session expired" ||
        error.message === "Access denied"
      ) {
        throw error;
      }
      toast.error("Network error. Please check your connection.");
      throw error;
    }
  };

  return { makeRequest };
}
