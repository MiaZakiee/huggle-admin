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
} from "lucide-react";
import { mockDashboardStats, mockSellers, mockReports } from "@/lib/mock-data";

export function Dashboard() {
  const stats = mockDashboardStats;
  const pendingSellers = mockSellers.filter(s => s.status === 'pending');
  const openReports = mockReports.filter(r => r.status === 'open');

  const statCards = [
    {
      title: "Active Users",
      value: stats.activeUsers.toLocaleString(),
      icon: Users,
      description: "+12.5% from last month",
      trend: "up",
    },
    {
      title: "Verified Sellers",
      value: stats.verifiedSellers.toLocaleString(),
      icon: Store,
      description: "3 pending approval",
      trend: "neutral",
    },
    {
      title: "Total Revenue",
      value: `₱${(stats.totalRevenue / 1000).toFixed(0)}K`,
      icon: DollarSign,
      description: "+8.2% from last month",
      trend: "up",
    },
    {
      title: "Pending Reports",
      value: stats.pendingReports.toString(),
      icon: AlertTriangle,
      description: "Requires immediate attention",
      trend: "down",
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
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View Reports
          </Button>
          <Button size="sm">
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
            {pendingSellers.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No pending seller applications
              </p>
            ) : (
              pendingSellers.slice(0, 3).map((seller) => (
                <div key={seller.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{seller.storeName}</h4>
                    <p className="text-sm text-muted-foreground">{seller.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Submitted {new Date(seller.submissionDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                </div>
              ))
            )}
            {pendingSellers.length > 3 && (
              <Button variant="ghost" className="w-full">
                View All ({pendingSellers.length})
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Recent Reports</span>
            </CardTitle>
            <CardDescription>
              Content reports requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {openReports.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No open reports
              </p>
            ) : (
              openReports.slice(0, 3).map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{report.reportedContent.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      Reported by {report.reportedBy}
                    </p>
                    <p className="text-xs text-muted-foreground">{report.reason}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="destructive">
                      {report.status}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                </div>
              ))
            )}
            {openReports.length > 3 && (
              <Button variant="ghost" className="w-full">
                View All ({openReports.length})
              </Button>
            )}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Store className="h-6 w-6 mb-2" />
              <span>Review Sellers</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              <span>Manage Users</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <AlertTriangle className="h-6 w-6 mb-2" />
              <span>Handle Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}