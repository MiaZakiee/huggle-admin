import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Function to get Clerk token (will be called from components)
let getClerkToken: (() => Promise<string | null>) | null = null;

export const setClerkTokenGetter = (
  tokenGetter: () => Promise<string | null>
) => {
  getClerkToken = tokenGetter;
};

// Request interceptor for auth
api.interceptors.request.use(
  async (config) => {
    if (getClerkToken) {
      const token = await getClerkToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error("Unauthorized access - redirecting to login");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
