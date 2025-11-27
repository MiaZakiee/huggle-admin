import { ReactNode, useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Bell, Search, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { adminNotificationsApi, Notification, NotificationType } from "@/services/adminNotificationsApi";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { signOut, userEmail, user } = useAdminAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    // Fetch notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await adminNotificationsApi.getNotifications();
      // Ensure we have valid data structure
      if (response && response.notifications) {
        setNotifications(Array.isArray(response.notifications) ? response.notifications : []);
        setUnreadCount(response.unreadCount || 0);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Set empty state on error to prevent crashes
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await adminNotificationsApi.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await adminNotificationsApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      });
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if unread
    if (!notification.isRead) {
      await handleMarkAsRead(notification.id);
    }

    // Navigate to appropriate page for clickable notification types
    if (notification.type === NotificationType.NewReport) {
      setNotificationsOpen(false);
      setTimeout(() => navigate('/reports'), 0);
    } else if (notification.type === NotificationType.NewVerificationRequest) {
      setNotificationsOpen(false);
      setTimeout(() => navigate('/sellers'), 0);
    }
  };

  const handleDeleteNotification = async (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent notification click
    try {
      await adminNotificationsApi.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      // Update unread count if the deleted notification was unread
      const deletedNotification = notifications.find(n => n.id === notificationId);
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      toast({
        title: "Success",
        description: "Notification deleted",
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      });
    }
  };

  const getTypeColor = (type: NotificationType) => {
    const color = adminNotificationsApi.getTypeColor(type);
    return `bg-${color}-100 text-${color}-800`;
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b border-border bg-card">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="lg:hidden" />

                <div className="hidden md:flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users, sellers, reports..."
                      className="pl-10 w-64 bg-background"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="end">
                    <Card className="border-0 shadow-none">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Notifications</CardTitle>
                          {unreadCount > 0 && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={handleMarkAllAsRead}
                              className="text-xs"
                            >
                              Mark all read
                            </Button>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <CardDescription>
                            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="p-0 max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-muted-foreground">
                            No notifications
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {notifications.slice(0, 10).map((notification) => {
                              const isClickable = notification.type === NotificationType.NewReport || 
                                                  notification.type === NotificationType.NewVerificationRequest;
                              
                              return (
                                <div
                                  key={notification.id}
                                  className={`p-3 hover:bg-muted/50 border-b last:border-b-0 ${
                                    !notification.isRead ? 'bg-blue-50/50' : ''
                                  } ${isClickable ? 'cursor-pointer' : ''}`}
                                  onClick={() => handleNotificationClick(notification)}
                                >
                                  <div className="flex items-start justify-between space-x-2">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <Badge 
                                          variant="outline" 
                                          className={`text-xs ${getTypeColor(notification.type)}`}
                                        >
                                          {adminNotificationsApi.getTypeLabel(notification.type)}
                                        </Badge>
                                        {!notification.isRead && (
                                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        )}
                                        {/* {isClickable && (
                                          <Badge variant="secondary" className="text-xs">
                                            New
                                          </Badge>
                                        )} */}
                                      </div>
                                      <p className="font-medium text-sm truncate">
                                        {notification.title}
                                      </p>
                                      <p className="text-xs text-muted-foreground truncate">
                                        {notification.message}
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {formatRelativeTime(notification.createdAt)}
                                      </p>
                                    </div>
                                    
                                    {/* Delete button */}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                                      onClick={(e) => handleDeleteNotification(notification.id, e)}
                                      title="Delete notification"
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </PopoverContent>
                </Popover>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div>
                        <p className="font-medium">
                          {user?.fullName || user?.firstName || "Admin User"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {userEmail}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                      className="text-destructive cursor-pointer"
                      onClick={handleSignOut}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
