import { useAuth } from "@clerk/clerk-react";

export function useAuthenticatedAPI() {
  const { getToken } = useAuth();

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const token = await getToken();

    return fetch(`https://huggle-backend-jh2l.onrender.com${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };

  return { apiCall };
}

// Admin-specific API functions
export const adminAPI = {
  // Verification requests
  getVerificationRequests: async (token: string) => {
    const response = await fetch(
      "https://huggle-backend-jh2l.onrender.com/api/verification-requests",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.json();
  },

  updateVerificationRequest: async (id: string, data: any, token: string) => {
    const response = await fetch(
      `https://huggle-backend-jh2l.onrender.com/api/verification-requests/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    return response.json();
  },

  // Stores management
  getAllStores: async (token: string) => {
    const response = await fetch(
      "https://huggle-backend-jh2l.onrender.com/api/stores",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.json();
  },

  // Analytics
  getAnalytics: async (id: string, token: string) => {
    const response = await fetch(
      `https://huggle-backend-jh2l.onrender.com/api/analytics/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.json();
  },
};
