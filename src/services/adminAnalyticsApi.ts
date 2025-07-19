import axios from 'axios';

// Types based on backend models
export type TimeRange = '1month' | '3months' | '6months' | '1year' | 'overall';

export interface PlatformOverviewResponse {
  snapshot: AdminPlatformOverview;
  timeRangeAnalysis: TimeRangeAnalysis;
  topStores: SecureStorePerformance[];
}

export interface AdminPlatformOverview {
  totalUsers: number;
  totalOrders: number;
  totalStores: number;
  totalProducts: number;
  totalRevenue: number;
  lastUpdated: string;
}

export interface TimeRangeAnalysis {
  timeRange: string;
  monthsAnalyzed: number;
  periodTotals: {
    views: number;
    cartAdds: number;
    purchases: number;
    revenue: number;
  };
  periodAverages: {
    viewsPerMonth: number;
    cartAddsPerMonth: number;
    purchasesPerMonth: number;
    revenuePerMonth: number;
    engagementScore: number;
  };
  trends?: {
    viewsTrend: number;
    cartAddsTrend: number;
    purchasesTrend: number;
    revenueTrend: number;
    storeGrowth: number;
  };
  monthlyBreakdown: SecurePlatformAnalyticsSummary[];
}

export interface SecurePlatformAnalyticsSummary {
  monthIndex: number;
  totalStores: number;
  activeStores: number;
  totalProducts: number;
  totalViews: number;
  totalCartAdds: number;
  totalPurchases: number;
  totalRevenue: number;
  averageEngagementScore: number;
  averageViewsPerStore: number;
  averageRevenuePerStore: number;
  averageProductsPerStore: number;
  topStores: SecureStorePerformance[];
}

export interface SecureStorePerformance {
  storeName: string;
  totalProducts: number;
  views: number;
  cartAdds: number;
  purchases: number;
  revenue: number;
  engagementScore: number;
}

export interface TopStore {
  id: string;
  name: string;
  revenue: number;
  orders: number;
  rating: number;
}

export interface MonthlyData {
  month: string;
  revenue: number;
  orders: number;
  newStores: number;
}

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
}

// Configuration
const config: ApiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5132',
  timeout: 10000,
};

// Create axios instance
const api = axios.create({
  baseURL: config.baseUrl,
  timeout: config.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Admin Analytics API
export const AdminAnalyticsApi = {
  // Get configuration
  getConfig: (): ApiConfig => config,

  // Test API connection
  testConnection: async () => {
    try {
      const response = await api.get('/api/admin/analytics/platform/current');
      return {
        success: true,
        message: 'Connection successful',
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  // Get platform overview analytics
  getPlatformOverview: async (timeRange: TimeRange): Promise<PlatformOverviewResponse> => {
    try {
      const response = await api.get('/api/admin/analytics/platform/overview', {
        params: { timeRange }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching platform overview:', error);
      throw error;
    }
  },

  // Get current platform analytics
  getCurrentPlatformAnalytics: async (): Promise<SecurePlatformAnalyticsSummary> => {
    try {
      const response = await api.get('/api/admin/analytics/platform/current');
      return response.data;
    } catch (error) {
      console.error('Error fetching current platform analytics:', error);
      throw error;
    }
  },

  // Get platform analytics for specific month
  getPlatformMonthlyAnalytics: async (monthsAgo: number): Promise<SecurePlatformAnalyticsSummary> => {
    try {
      const response = await api.get(`/api/admin/analytics/platform/monthly/${monthsAgo}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching platform monthly analytics:', error);
      throw error;
    }
  },

  // Get platform analytics summary over multiple months
  getPlatformAnalyticsSummary: async (monthsCount: number) => {
    try {
      const response = await api.get(`/api/admin/analytics/platform/summary/${monthsCount}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching platform analytics summary:', error);
      throw error;
    }
  },

  // Get top performing stores
  getTopStores: async (monthsAgo: number = 0, limit: number = 10, sortBy: string = 'engagementScore'): Promise<SecureStorePerformance[]> => {
    try {
      const response = await api.get('/api/admin/analytics/platform/top-stores', {
        params: {
          monthsAgo,
          topCount: limit,
          sortBy,
        },
      });
      return response.data.topStores || [];
    } catch (error) {
      console.error('Error fetching top stores:', error);
      return [];
    }
  },

  // Get monthly breakdown data (derived from platform analytics)
  getMonthlyBreakdown: async (monthsCount: number = 12): Promise<MonthlyData[]> => {
    try {
      const response = await api.get(`/api/admin/analytics/platform/summary/${monthsCount}`);
      const data = response.data;
      
      // Transform the monthly breakdown to match MonthlyData interface
      return data.monthlyBreakdown?.map((month: SecurePlatformAnalyticsSummary, index: number) => ({
        month: `Month ${index + 1}`,
        revenue: month.totalRevenue,
        orders: month.totalPurchases,
        newStores: month.activeStores,
      })) || [];
    } catch (error) {
      console.error('Error fetching monthly data:', error);
      return [];
    }
  },

  // Get analytics for a specific store (from regular analytics controller)
  getStoreAnalytics: async (storeId: string, monthsAgo: number = 0) => {
    try {
      const response = await api.get(`/api/analytics/store/${storeId}/monthly/${monthsAgo}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching store analytics:', error);
      throw error;
    }
  },

  // Get store analytics summary
  getStoreAnalyticsSummary: async (storeId: string, monthsCount: number = 6) => {
    try {
      const response = await api.get(`/api/analytics/store/${storeId}/summary/${monthsCount}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching store analytics summary:', error);
      throw error;
    }
  },

  // Get top performing products in store
  getTopPerformingProducts: async (storeId: string, monthsAgo: number = 0, topCount: number = 5, sortBy: string = 'engagementScore') => {
    try {
      const response = await api.get(`/api/analytics/store/${storeId}/top-products`, {
        params: {
          monthsAgo,
          topCount,
          sortBy,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching top performing products:', error);
      throw error;
    }
  },

  // Get product analytics summary
  getProductAnalyticsSummary: async (productId: string, monthsAgo: number = 0) => {
    try {
      const response = await api.get(`/api/analytics/product/${productId}/summary/${monthsAgo}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product analytics summary:', error);
      throw error;
    }
  },

  // Get product analytics range summary
  getProductAnalyticsRange: async (productId: string, monthsCount: number = 6) => {
    try {
      const response = await api.get(`/api/analytics/product/${productId}/summary/range/${monthsCount}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product analytics range:', error);
      throw error;
    }
  },

  // Get product insights
  getProductInsights: async (productId: string, monthsBack: number = 6) => {
    try {
      const response = await api.get(`/api/analytics/product/${productId}/insights`, {
        params: { monthsBack },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching product insights:', error);
      throw error;
    }
  },
};

// Export types and API
export default AdminAnalyticsApi;
