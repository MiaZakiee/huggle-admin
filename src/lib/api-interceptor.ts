// API Interceptor for Huggle Admin Platform
// This will handle all API calls with authentication, error handling, and request/response transformation

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface ApiError {
  message: string;
  status: number;
  errors?: string[];
}

class ApiInterceptor {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = process.env.REACT_APP_API_URL || 'http://localhost:5000/api') {
    this.baseURL = baseURL;
  }

  setAuthToken(token: string) {
    this.token = token;
  }

  removeAuthToken() {
    this.token = null;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    let data: any;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const error: ApiError = {
        message: data.message || `HTTP Error: ${response.status}`,
        status: response.status,
        errors: data.errors,
      };
      throw error;
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message,
    };
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, params[key].toString());
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  // File upload with form data
  async uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    const headers: Record<string, string> = {};
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    return this.handleResponse<T>(response);
  }
}

// Create singleton instance
export const apiClient = new ApiInterceptor();

// API endpoints for the admin platform
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  
  // Dashboard
  DASHBOARD: {
    STATS: '/admin/dashboard/stats',
    RECENT_ACTIVITY: '/admin/dashboard/recent-activity',
  },
  
  // Sellers
  SELLERS: {
    LIST: '/admin/sellers',
    DETAILS: (id: string) => `/admin/sellers/${id}`,
    APPROVE: (id: string) => `/admin/sellers/${id}/approve`,
    REJECT: (id: string) => `/admin/sellers/${id}/reject`,
    ONBOARDING: '/admin/sellers/onboarding',
    ANALYTICS: (id: string) => `/admin/sellers/${id}/analytics`,
  },
  
  // Users
  USERS: {
    LIST: '/admin/users',
    DETAILS: (id: string) => `/admin/users/${id}`,
    BAN: (id: string) => `/admin/users/${id}/ban`,
    UNBAN: (id: string) => `/admin/users/${id}/unban`,
    DISABLE: (id: string) => `/admin/users/${id}/disable`,
    ENABLE: (id: string) => `/admin/users/${id}/enable`,
  },
  
  // Content Moderation
  CONTENT: {
    REPORTS: '/admin/content/reports',
    REPORT_DETAILS: (id: string) => `/admin/content/reports/${id}`,
    RESOLVE_REPORT: (id: string) => `/admin/content/reports/${id}/resolve`,
    REMOVE_CONTENT: (id: string) => `/admin/content/${id}/remove`,
  },
  
  // Analytics
  ANALYTICS: {
    PLATFORM: '/admin/analytics/platform',
    USERS: '/admin/analytics/users',
    REVENUE: '/admin/analytics/revenue',
    PRODUCTS: '/admin/analytics/products',
  },
  
  // Admin Management
  ADMIN: {
    LIST: '/admin/admins',
    CREATE: '/admin/admins',
    UPDATE: (id: string) => `/admin/admins/${id}`,
    DELETE: (id: string) => `/admin/admins/${id}`,
    CHANGE_ROLE: (id: string) => `/admin/admins/${id}/role`,
  },
};

export default apiClient;