import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Eye,
  Ban,
  UserCheck,
  UserX,
  Calendar,
  Clock,
  DollarSign,
  ShoppingCart,
} from "lucide-react";
import { mockUsers, User } from "@/lib/mock-data";

export default function Users() {
  const [users] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    type: 'ban' | 'disable' | 'enable' | null;
    user: User | null;
  }>({ open: false, type: null, user: null });

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: User['status']) => {
    const statusConfig = {
      active: { variant: "default" as const, label: "Active" },
      disabled: { variant: "secondary" as const, label: "Disabled" },
      banned: { variant: "destructive" as const, label: "Banned" },
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTypeBadge = (type: User['type']) => {
    const typeConfig = {
      buyer: { variant: "outline" as const, label: "Buyer" },
      seller: { variant: "secondary" as const, label: "Seller" },
      admin: { variant: "default" as const, label: "Admin" },
    };
    
    const config = typeConfig[type];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const buyers = filteredUsers.filter(u => u.type === 'buyer');
  const sellers = filteredUsers.filter(u => u.type === 'seller');
  const admins = filteredUsers.filter(u => u.type === 'admin');
  const activeUsers = filteredUsers.filter(u => u.status === 'active');
  const inactiveUsers = filteredUsers.filter(u => u.status === 'disabled' || u.status === 'banned');

  const handleUserAction = (action: 'ban' | 'disable' | 'enable', user: User) => {
    setActionDialog({ open: true, type: action, user });
  };

  const confirmAction = () => {
    // Here you would call the API to perform the action
    console.log(`${actionDialog.type} user:`, actionDialog.user?.id);
    setActionDialog({ open: false, type: null, user: null });
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">
            Manage platform users, roles, and permissions
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name, email, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* User Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">
            All ({filteredUsers.length})
          </TabsTrigger>
          <TabsTrigger value="buyers">
            Buyers ({buyers.length})
          </TabsTrigger>
          <TabsTrigger value="sellers">
            Sellers ({sellers.length})
          </TabsTrigger>
          <TabsTrigger value="admins">
            Admins ({admins.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({activeUsers.length})
          </TabsTrigger>
          <TabsTrigger value="inactive">
            Inactive ({inactiveUsers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <UserTable 
            users={filteredUsers} 
            onViewUser={setSelectedUser}
            onUserAction={handleUserAction}
          />
        </TabsContent>

        <TabsContent value="buyers">
          <UserTable 
            users={buyers} 
            onViewUser={setSelectedUser}
            onUserAction={handleUserAction}
          />
        </TabsContent>

        <TabsContent value="sellers">
          <UserTable 
            users={sellers} 
            onViewUser={setSelectedUser}
            onUserAction={handleUserAction}
          />
        </TabsContent>

        <TabsContent value="admins">
          <UserTable 
            users={admins} 
            onViewUser={setSelectedUser}
            onUserAction={handleUserAction}
          />
        </TabsContent>

        <TabsContent value="active">
          <UserTable 
            users={activeUsers} 
            onViewUser={setSelectedUser}
            onUserAction={handleUserAction}
          />
        </TabsContent>

        <TabsContent value="inactive">
          <UserTable 
            users={inactiveUsers} 
            onViewUser={setSelectedUser}
            onUserAction={handleUserAction}
          />
        </TabsContent>
      </Tabs>

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <span>{selectedUser.name}</span>
                  {getTypeBadge(selectedUser.type)}
                </DialogTitle>
                <DialogDescription>
                  User account details and activity information
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">User Type</label>
                    <div className="mt-1">
                      {getTypeBadge(selectedUser.type)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="mt-1">
                      {getStatusBadge(selectedUser.status)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Join Date</label>
                    <p className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(selectedUser.joinDate).toLocaleDateString()}</span>
                    </p>
                  </div>
                </div>

                {/* Activity Information */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Active</label>
                  <p className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(selectedUser.lastActive).toLocaleDateString()}</span>
                  </p>
                </div>

                {/* Buyer-specific metrics */}
                {selectedUser.type === 'buyer' && selectedUser.totalOrders && (
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Purchase Activity</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <ShoppingCart className="h-4 w-4" />
                          <span className="text-sm font-medium">Total Orders</span>
                        </div>
                        <p className="text-lg font-bold">{selectedUser.totalOrders}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <DollarSign className="h-4 w-4" />
                          <span className="text-sm font-medium">Total Spent</span>
                        </div>
                        <p className="text-lg font-bold">₱{selectedUser.totalSpent?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedUser(null)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={() => setActionDialog({ open: false, type: null, user: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Confirm {actionDialog.type?.charAt(0).toUpperCase()}{actionDialog.type?.slice(1)} User
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {actionDialog.type} {actionDialog.user?.name}? This action can be undone later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setActionDialog({ open: false, type: null, user: null })}
            >
              Cancel
            </Button>
            <Button 
              variant={actionDialog.type === 'ban' ? 'destructive' : 'default'}
              onClick={confirmAction}
            >
              Confirm {actionDialog.type?.charAt(0).toUpperCase()}{actionDialog.type?.slice(1)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </AdminLayout>
  );
}

interface UserTableProps {
  users: User[];
  onViewUser: (user: User) => void;
  onUserAction: (action: 'ban' | 'disable' | 'enable', user: User) => void;
}

function UserTable({ users, onViewUser, onUserAction }: UserTableProps) {
  const getStatusBadge = (status: User['status']) => {
    const statusConfig = {
      active: { variant: "default" as const, label: "Active" },
      disabled: { variant: "secondary" as const, label: "Disabled" },
      banned: { variant: "destructive" as const, label: "Banned" },
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTypeBadge = (type: User['type']) => {
    const typeConfig = {
      buyer: { variant: "outline" as const, label: "Buyer" },
      seller: { variant: "secondary" as const, label: "Seller" },
      admin: { variant: "default" as const, label: "Admin" },
    };
    
    const config = typeConfig[type];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getTypeBadge(user.type)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(user.lastActive).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewUser(user)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {user.status === 'active' && (
                            <>
                              <DropdownMenuItem 
                                onClick={() => onUserAction('disable', user)}
                                className="text-warning"
                              >
                                <UserX className="h-4 w-4 mr-2" />
                                Disable Account
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => onUserAction('ban', user)}
                                className="text-destructive"
                              >
                                <Ban className="h-4 w-4 mr-2" />
                                Ban User
                              </DropdownMenuItem>
                            </>
                          )}
                          {(user.status === 'disabled' || user.status === 'banned') && (
                            <DropdownMenuItem 
                              onClick={() => onUserAction('enable', user)}
                              className="text-success"
                            >
                              <UserCheck className="h-4 w-4 mr-2" />
                              Enable Account
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}