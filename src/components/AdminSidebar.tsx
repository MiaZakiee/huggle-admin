import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Store,
  Shield,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Seller Management",
    url: "/sellers",
    icon: Store,
  },
  {
    title: "User Management",
    url: "/users",
    icon: Users,
  },
  {
    title: "Content Moderation",
    url: "/reports",
    icon: Shield,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavClass = (path: string) => {
    return isActive(path)
      ? "bg-primary text-primary-foreground font-medium"
      : "hover:bg-accent hover:text-accent-foreground";
  };

  return (
    <Sidebar className="border-r border-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">H</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-primary">Huggle</h2>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
            <span className="text-primary-foreground font-bold text-sm">H</span>
          </div>
        )}
      </div>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${getNavClass(
                        item.url
                      )}`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto pt-4 border-t border-border">
          <Button
            variant="ghost"
            className={`w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 ${
              isCollapsed ? "px-0" : "px-3"
            }`}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span className="ml-3 text-sm">Logout</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}