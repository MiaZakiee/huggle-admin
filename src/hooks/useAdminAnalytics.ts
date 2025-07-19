import { useState, useEffect, useCallback } from 'react';
import { 
  AdminAnalyticsApi, 
  PlatformOverviewResponse, 
  SecureStorePerformance, 
  MonthlyData,
  TimeRange 
} from '@/services/adminAnalyticsApi';

interface UseAdminAnalyticsReturn {
  // Data states
  data: PlatformOverviewResponse | null;
  topStores: SecureStorePerformance[];
  monthlyData: MonthlyData[];
  
  // Loading and error states
  loading: boolean;
  error: string | null;
  
  // Controls
  timeRange: TimeRange;
  setTimeRange: (timeRange: TimeRange) => void;
  refetch: () => Promise<void>;
  isConnected: boolean;
}

export function useAdminAnalytics(): UseAdminAnalyticsReturn {
  // State management
  const [data, setData] = useState<PlatformOverviewResponse | null>(null);
  const [topStores, setTopStores] = useState<SecureStorePerformance[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('1month');
  const [isConnected, setIsConnected] = useState(false);

  // Test API connection on mount
  useEffect(() => {
    const testConnection = async () => {
      console.log('[Admin Analytics Hook] Testing API connection...');
      try {
        const result = await AdminAnalyticsApi.testConnection();
        setIsConnected(result.success);
        
        if (!result.success) {
          setError(`Unable to connect to analytics service: ${result.message || result.error}`);
          console.error('[Admin Analytics Hook] API connection failed:', result.message || result.error);
        } else {
          console.log('[Admin Analytics Hook] API connection successful:', result.message);
        }
      } catch (err) {
        console.error('[Admin Analytics Hook] Connection test error:', err);
        setIsConnected(false);
        setError('Failed to test API connection');
      }
    };

    testConnection();
  }, []);

  // Fetch all analytics data
  const fetchData = useCallback(async () => {
    if (!isConnected) {
      console.log('[Admin Analytics Hook] Skipping data fetch - not connected');
      return;
    }

    console.log(`[Admin Analytics Hook] Fetching data for timeRange: ${timeRange}`);
    setLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel
      const [
        platformOverview,
        topStoresData,
        monthlyBreakdown
      ] = await Promise.all([
        AdminAnalyticsApi.getPlatformOverview(timeRange),
        AdminAnalyticsApi.getTopStores(0, 10, 'revenue'), // monthsAgo, limit, sortBy
        AdminAnalyticsApi.getMonthlyBreakdown(12) // Get 12 months of data
      ]);

      console.log('[Admin Analytics Hook] Data fetched successfully:', {
        platformOverview,
        topStoresCount: topStoresData.length,
        monthlyDataCount: monthlyBreakdown.length
      });

      setData(platformOverview);
      setTopStores(topStoresData);
      setMonthlyData(monthlyBreakdown);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch analytics data';
      console.error('[Admin Analytics Hook] Error fetching data:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [timeRange, isConnected]);

  // Fetch data when timeRange changes or connection is established
  useEffect(() => {
    if (isConnected) {
      fetchData();
    }
  }, [fetchData, isConnected]);

  // Manual refetch function
  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // Handle timeRange changes
  const handleTimeRangeChange = useCallback((newTimeRange: TimeRange) => {
    console.log(`[Admin Analytics Hook] Changing timeRange from ${timeRange} to ${newTimeRange}`);
    setTimeRange(newTimeRange);
  }, [timeRange]);

  return {
    data,
    topStores,
    monthlyData,
    loading,
    error,
    timeRange,
    setTimeRange: handleTimeRangeChange,
    refetch,
    isConnected,
  };
}
