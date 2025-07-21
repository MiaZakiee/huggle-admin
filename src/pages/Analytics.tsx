import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  PhilippinePeso,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Store,
  RefreshCcw,
  Calendar,
  Loader2,
  AlertCircle,
  Activity,
  Target,
  Eye,
  ShoppingBag,
} from "lucide-react";
import { useAdminAnalytics } from "@/hooks/useAdminAnalytics";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AdminApiTestComponent } from "@/components/AdminApiTestComponent";
import type { TimeRange } from "@/services/adminAnalyticsApi";

export default function Analytics() {
  const { data, topStores, monthlyData, loading, error, timeRange, setTimeRange, refetch, isConnected } = useAdminAnalytics();

  const timeRangeOptions = [
    { value: '1month' as TimeRange, label: '1 Month' },
    { value: '3months' as TimeRange, label: '3 Months' },
    { value: '6months' as TimeRange, label: '6 Months' },
    { value: '1year' as TimeRange, label: '1 Year' },
    { value: 'overall' as TimeRange, label: 'Overall' },
  ];

  // Show API test component if not connected
  if (!isConnected && !loading) {
    return (
      <AdminLayout>
        <div className="p-6 space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">Admin Analytics</h1>
            <p className="text-muted-foreground">
              Testing connection to analytics API...
            </p>
          </div>
          <AdminApiTestComponent />
        </div>
      </AdminLayout>
    );
  }

  // Loading state
  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-lg">Loading analytics...</span>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <AdminLayout>
        <div className="p-6 space-y-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load analytics: {error}
              <Button variant="outline" size="sm" onClick={refetch} className="ml-2">
                Retry
              </Button>
            </AlertDescription>
          </Alert>
          <AdminApiTestComponent />
        </div>
      </AdminLayout>
    );
  }

  // Helper function to format trends
  const formatTrend = (trend: number | undefined) => {
    if (trend === undefined || trend === null) return { value: '0%', isPositive: true };
    const isPositive = trend >= 0;
    return {
      value: `${isPositive ? '+' : ''}${trend.toFixed(1)}%`,
      isPositive
    };
  };

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return `₱${amount.toFixed(2)}`;
  };

  // Helper function to calculate conversion rate
  const calculateConversionRate = (purchases: number, views: number): number => {
    if (views === 0) return 0;
    return (purchases / views) * 100;
  };

  const overviewStats = data ? [
    {
      title: "Total Users",
      value: data.snapshot.totalUsers.toLocaleString(),
      change: "N/A",
      trend: "up" as const,
      icon: Users,
      description: "Platform registered users",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(data.timeRangeAnalysis.periodTotals.revenue),
      change: formatTrend(data.timeRangeAnalysis.trends?.revenueTrend).value,
      trend: formatTrend(data.timeRangeAnalysis.trends?.revenueTrend).isPositive ? "up" as const : "down" as const,
      icon: PhilippinePeso,
      description: `${data.timeRangeAnalysis.timeRange.replace('month', ' month')} period`,
    },
    {
      title: "Total Orders",
      value: data.snapshot.totalOrders.toLocaleString(),
      change: "N/A",
      trend: "up" as const,
      icon: ShoppingCart,
      description: "Platform lifetime orders",
    },
    {
      title: "Active Stores",
      value: data.snapshot.totalStores.toLocaleString(),
      change: formatTrend(data.timeRangeAnalysis.trends?.storeGrowth).value,
      trend: formatTrend(data.timeRangeAnalysis.trends?.storeGrowth).isPositive ? "up" as const : "down" as const,
      icon: Store,
      description: "Verified seller stores",
    },
  ] : [];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Platform Analytics</h1>
            <p className="text-muted-foreground">
              Comprehensive platform performance and insights
              {data && (
                <span className="ml-2 text-sm">
                  • {data.timeRangeAnalysis.monthsAnalyzed} months analyzed
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={refetch}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {overviewStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`text-xs flex items-center ${
                    stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {stat.change}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Data</TabsTrigger>
            <TabsTrigger value="stores">Top Stores</TabsTrigger>
            <TabsTrigger value="debug">API Debug</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Platform Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Platform Activity
                  </CardTitle>
                  <CardDescription>Key activity metrics for {timeRange}</CardDescription>
                </CardHeader>
                <CardContent>
                  {data && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Views</span>
                        <span className="font-semibold">{data.timeRangeAnalysis.periodTotals.views.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Cart Adds</span>
                        <span className="font-semibold">{data.timeRangeAnalysis.periodTotals.cartAdds.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Purchases</span>
                        <span className="font-semibold">{data.timeRangeAnalysis.periodTotals.purchases.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Conversion Rate</span>
                        <span className="font-semibold">
                          {calculateConversionRate(data.timeRangeAnalysis.periodTotals.purchases, data.timeRangeAnalysis.periodTotals.views).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Growth Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Growth Metrics
                  </CardTitle>
                  <CardDescription>Period over period growth</CardDescription>
                </CardHeader>
                <CardContent>
                  {data && data.timeRangeAnalysis.trends ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Views Growth</span>
                        <span className={`font-semibold ${
                          formatTrend(data.timeRangeAnalysis.trends.viewsTrend).isPositive 
                            ? 'text-emerald-600' 
                            : 'text-red-600'
                        }`}>
                          {formatTrend(data.timeRangeAnalysis.trends.viewsTrend).value}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Purchases Growth</span>
                        <span className={`font-semibold ${
                          formatTrend(data.timeRangeAnalysis.trends.purchasesTrend).isPositive 
                            ? 'text-emerald-600' 
                            : 'text-red-600'
                        }`}>
                          {formatTrend(data.timeRangeAnalysis.trends.purchasesTrend).value}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Revenue Growth</span>
                        <span className={`font-semibold ${
                          formatTrend(data.timeRangeAnalysis.trends.revenueTrend).isPositive 
                            ? 'text-emerald-600' 
                            : 'text-red-600'
                        }`}>
                          {formatTrend(data.timeRangeAnalysis.trends.revenueTrend).value}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Store Growth</span>
                        <span className={`font-semibold ${
                          formatTrend(data.timeRangeAnalysis.trends.storeGrowth).isPositive 
                            ? 'text-emerald-600' 
                            : 'text-red-600'
                        }`}>
                          {formatTrend(data.timeRangeAnalysis.trends.storeGrowth).value}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center space-y-2">
                        <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto" />
                        <p className="text-sm text-muted-foreground">
                          Insufficient data to make comparison
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Growth metrics require historical data for analysis
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Monthly Data Tab */}
          <TabsContent value="monthly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Monthly Breakdown
                </CardTitle>
                <CardDescription>Month-by-month performance data</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>New Stores</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyData.map((month, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{month.month}</TableCell>
                        <TableCell>{formatCurrency(month.revenue)}</TableCell>
                        <TableCell>{month.orders.toLocaleString()}</TableCell>
                        <TableCell>{month.newStores.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Top Stores Tab */}
          <TabsContent value="stores" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Stores</CardTitle>
                <CardDescription>Leading stores by revenue and engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Store Name</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Cart Adds</TableHead>
                      <TableHead>Purchases</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Conversion</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topStores.map((store, index) => {
                      const conversionRate = calculateConversionRate(store.purchases, store.views);
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{store.storeName}</TableCell>
                          <TableCell>{store.totalProducts}</TableCell>
                          <TableCell>{store.views.toLocaleString()}</TableCell>
                          <TableCell>{store.cartAdds.toLocaleString()}</TableCell>
                          <TableCell>{store.purchases.toLocaleString()}</TableCell>
                          <TableCell>{formatCurrency(store.revenue)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Progress value={conversionRate} className="w-16" />
                              <span className="text-xs">{conversionRate.toFixed(1)}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Debug Tab */}
          <TabsContent value="debug" className="space-y-4">
            <AdminApiTestComponent />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
