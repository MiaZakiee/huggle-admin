import { useState } from "react";
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
  DollarSign,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Store,
  Eye,
  Download,
  Calendar,
} from "lucide-react";
import { mockAnalytics, AnalyticsData } from "@/lib/mock-data";

export default function Analytics() {
  const [analytics] = useState<AnalyticsData>(mockAnalytics);
  const [timeRange, setTimeRange] = useState<AnalyticsData['timeRange']>('1month');

  // Mock chart data - in real implementation, this would come from the API
  const chartData = {
    userGrowth: [
      { month: 'Jan', users: 12000 },
      { month: 'Feb', users: 13200 },
      { month: 'Mar', users: 14100 },
      { month: 'Apr', users: 15420 },
    ],
    revenue: [
      { month: 'Jan', revenue: 980000 },
      { month: 'Feb', revenue: 1100000 },
      { month: 'Mar', revenue: 1180000 },
      { month: 'Apr', revenue: 1250000 },
    ],
    orders: [
      { month: 'Jan', completed: 7234, cancelled: 566 },
      { month: 'Feb', completed: 7890, cancelled: 623 },
      { month: 'Mar', completed: 8456, cancelled: 678 },
      { month: 'Apr', completed: 8234, cancelled: 700 },
    ],
  };

  const overviewStats = [
    {
      title: "Total Users",
      value: analytics.users.total.toLocaleString(),
      change: "+12.5%",
      trend: "up",
      icon: Users,
      description: `${analytics.users.new.toLocaleString()} new this month`,
    },
    {
      title: "Total Revenue",
      value: `₱${(analytics.revenue.total / 1000).toFixed(0)}K`,
      change: `+${analytics.revenue.growth}%`,
      trend: "up",
      icon: DollarSign,
      description: "Compared to last month",
    },
    {
      title: "Total Orders",
      value: analytics.orders.total.toLocaleString(),
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
      description: `${analytics.orders.completed.toLocaleString()} completed`,
    },
    {
      title: "Active Users",
      value: analytics.users.active.toLocaleString(),
      change: "+5.1%",
      trend: "up",
      icon: TrendingUp,
      description: "Monthly active users",
    },
  ];

  const timeRangeOptions = [
    { value: '1month', label: '1 Month' },
    { value: '3months', label: '3 Months' },
    { value: '6months', label: '6 Months' },
    { value: '1year', label: '1 Year' },
    { value: 'overall', label: 'Overall' },
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Platform Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive platform performance and user insights
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as AnalyticsData['timeRange'])}>
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
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
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
                  stat.trend === 'up' ? 'text-success' : 'text-destructive'
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

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Monthly user acquisition trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chartData.userGrowth.map((data, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{data.month}</span>
                      <div className="flex items-center space-x-2 flex-1 ml-4">
                        <Progress 
                          value={(data.users / 16000) * 100} 
                          className="flex-1"
                        />
                        <span className="text-sm text-muted-foreground w-16 text-right">
                          {data.users.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Revenue Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Monthly revenue performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chartData.revenue.map((data, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{data.month}</span>
                      <div className="flex items-center space-x-2 flex-1 ml-4">
                        <Progress 
                          value={(data.revenue / 1300000) * 100} 
                          className="flex-1"
                        />
                        <span className="text-sm text-muted-foreground w-20 text-right">
                          ₱{(data.revenue / 1000).toFixed(0)}K
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Order Performance</CardTitle>
              <CardDescription>Order completion and cancellation rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chartData.orders.map((data, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-medium">{data.month}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="font-bold text-success">{data.completed.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Cancelled</p>
                      <p className="font-bold text-destructive">{data.cancelled.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Users</span>
                  <span className="font-bold">{analytics.users.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">New Users</span>
                  <span className="font-bold text-success">+{analytics.users.new.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Active Users</span>
                  <span className="font-bold">{analytics.users.active.toLocaleString()}</span>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Activity Rate</span>
                    <span>{((analytics.users.active / analytics.users.total) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={(analytics.users.active / analytics.users.total) * 100} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Buyers</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Sellers</span>
                      <span>14%</span>
                    </div>
                    <Progress value={14} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Admins</span>
                      <span>1%</span>
                    </div>
                    <Progress value={1} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Active</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Disabled</span>
                      <span>6%</span>
                    </div>
                    <Progress value={6} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Banned</span>
                      <span>2%</span>
                    </div>
                    <Progress value={2} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">₱{(analytics.revenue.total / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-sm">Growth Rate</span>
                  <span className="font-bold text-success">+{analytics.revenue.growth}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Order Value</span>
                  <span className="font-bold">₱{Math.round(analytics.revenue.total / analytics.orders.total)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Sources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Product Sales</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Membership Fees</span>
                      <span>20%</span>
                    </div>
                    <Progress value={20} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Other</span>
                      <span>5%</span>
                    </div>
                    <Progress value={5} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Best selling products by sales volume and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead className="text-right">Sales</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Growth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.topProducts.map((product, index) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">#{index + 1}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell className="text-right">{product.sales.toLocaleString()}</TableCell>
                      <TableCell className="text-right">₱{product.revenue.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <span className="text-success">+12%</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </AdminLayout>
  );
}