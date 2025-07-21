import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Store,
  DollarSign,
  AlertTriangle,
  ShoppingCart,
  TrendingUp,
  Eye,
  Clock,
  BarChart3,
  PhilippinePeso,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminAnalyticsApi } from "@/services/adminAnalyticsApi";
import { adminUsersApi } from "@/services/adminUsersApi";

interface DashboardStats {
  totalUsers: number;
  verifiedSellers: number;
  totalRevenue: number;
  pendingSellerApprovals: number;
}

export function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    verifiedSellers: 0,
    totalRevenue: 0,
    pendingSellerApprovals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch platform analytics for revenue and other stats
        const [platformData, buyers, sellers] = await Promise.all([
          AdminAnalyticsApi.getCurrentPlatformAnalytics(),
          adminUsersApi.getAllBuyers(),
          adminUsersApi.getAllSellers(),
        ]);

        // Calculate stats
        const totalUsers = buyers.length + sellers.length;
        const verifiedSellers = sellers.filter(seller => seller.type === 'seller').length;
        const pendingSellerApprovals = 0; // This would need a specific API endpoint for pending sellers
        
        setStats({
          totalUsers,
          verifiedSellers,
          totalRevenue: platformData.totalRevenue || 0,
          pendingSellerApprovals,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set fallback data
        setStats({
          totalUsers: 0,
          verifiedSellers: 0,
          totalRevenue: 0,
          pendingSellerApprovals: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: loading ? "..." : stats.totalUsers.toLocaleString(),
      icon: Users,
      description: "Buyers + Sellers",
      trend: "neutral",
    },
    {
      title: "Verified Sellers",
      value: loading ? "..." : stats.verifiedSellers.toLocaleString(),
      icon: Store,
      description: `${stats.pendingSellerApprovals} pending approval`,
      trend: "neutral",
    },
    {
      title: "Total Revenue",
      value: loading ? "..." : `₱${stats.totalRevenue.toFixed(2)}`,
      icon: PhilippinePeso,
      description: "Overall platform revenue",
      trend: "up",
    },
    {
      title: "Pending Seller Approvals",
      value: loading ? "..." : stats.pendingSellerApprovals.toString(),
      icon: AlertTriangle,
      description: "Requires review",
      trend: "neutral",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your platform today.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button size="sm" onClick={() => navigate('/analytics')}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className={`text-xs ${
                stat.trend === 'up' ? 'text-success' : 
                stat.trend === 'down' ? 'text-destructive' : 
                'text-muted-foreground'
              }`}>
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Seller Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Store className="h-5 w-5" />
              <span>Pending Seller Approvals</span>
            </CardTitle>
            <CardDescription>
              Sellers waiting for verification and approval
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.pendingSellerApprovals === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No pending seller applications
              </p>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">
                  {stats.pendingSellerApprovals} sellers awaiting approval
                </p>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => navigate('/sellers')}
                >
                  Review All
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Platform Overview</span>
            </CardTitle>
            <CardDescription>
              Key platform metrics at a glance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Users</span>
              <span className="font-medium">{stats.totalUsers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Verified Sellers</span>
              <span className="font-medium">{stats.verifiedSellers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Platform Revenue</span>
              <span className="font-medium">₱{(stats.totalRevenue / 1000).toFixed(0)}K</span>
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/analytics')}
            >
              View Detailed Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col"
              onClick={() => navigate('/analytics')}
            >
              <TrendingUp className="h-6 w-6 mb-2" />
              <span>Analytics</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col"
              onClick={() => navigate('/sellers')}
            >
              <Store className="h-6 w-6 mb-2" />
              <span>Review Sellers</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col"
              onClick={() => navigate('/users')}
            >
              <Users className="h-6 w-6 mb-2" />
              <span>Manage Users</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col"
              onClick={() => navigate('/reports')}
            >
              <AlertTriangle className="h-6 w-6 mb-2" />
              <span>Handle Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}