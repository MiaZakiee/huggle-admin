import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
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
  Loader2,
  DollarSign,
  ShoppingCart,
  Store,
  Package,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { adminUsersApi, User as ApiUser } from '@/services/adminUsersApi';

type User = ApiUser;

export default function Users() {
  const [buyers, setBuyers] = useState<User[]>([]);
  const [sellers, setSellers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [bannedUsers, setBannedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    type: 'ban' | 'unban' | null;
    user: User | null;
  }>({ open: false, type: null, user: null });
  const [actionReason, setActionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsersData();
  }, []);

  const fetchUsersData = async () => {
    try {
      setLoading(true);
      const [buyersData, sellersData, bannedUsersData] = await Promise.all([
        adminUsersApi.getAllBuyers(),
        adminUsersApi.getAllSellers(),
        adminUsersApi.getAllBannedUsers()
      ]);
      setBuyers(buyersData);
      setSellers(sellersData);
      // Combine buyers and sellers for the "All" tab
      setAllUsers([...buyersData, ...sellersData]);
      setBannedUsers(bannedUsersData);
      toast({ title: "Success", description: "Users data loaded successfully" });
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({ title: "Error", description: "Failed to fetch users data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search term
  const filteredBuyers = buyers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredSellers = sellers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredAllUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredBannedUsers = bannedUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserAction = (action: 'ban' | 'unban', user: User) => {
    setActionDialog({ open: true, type: action, user });
    setActionReason("");
  };

  const confirmAction = async () => {
    if (!actionDialog.user || !actionDialog.type) return;
    if (!actionReason.trim() || actionReason.length < 5) {
      toast({ title: "Error", description: "Please provide a reason (minimum 5 characters)", variant: "destructive" });
      return;
    }
    try {
      setActionLoading(true);
      if (actionDialog.type === 'ban') {
        await adminUsersApi.banUser({ clerkUserId: actionDialog.user.clerkUserId, reason: actionReason });
      } else {
        await adminUsersApi.unbanUser({ clerkUserId: actionDialog.user.clerkUserId, reason: actionReason });
      }
      toast({ title: "Success", description: `User ${actionDialog.type === 'ban' ? 'banned' : 'unbanned'} successfully` });
      await fetchUsersData();
    } catch (error: any) {
      console.error(`Error ${actionDialog.type}ning user:`, error);
      toast({ title: "Error", description: error.response?.data?.message || `Failed to ${actionDialog.type} user`, variant: "destructive" });
    } finally {
      setActionLoading(false);
      setActionDialog({ open: false, type: null, user: null });
      setActionReason("");
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground">Manage platform users, roles, and permissions</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({filteredAllUsers.length})</TabsTrigger>
            <TabsTrigger value="buyers">Buyers ({filteredBuyers.length})</TabsTrigger>
            <TabsTrigger value="sellers">Sellers ({filteredSellers.length})</TabsTrigger>
            <TabsTrigger value="banned">Banned ({filteredBannedUsers.length})</TabsTrigger>
          </TabsList>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading users...</span>
            </div>
          ) : (
            <>
              <TabsContent value="all">
                <UserTable 
                  users={filteredAllUsers} 
                  onUserAction={handleUserAction}
                  showBanAction={true}
                  showUnbanAction={false}
                />
              </TabsContent>
              <TabsContent value="buyers">
                <UserTable 
                  users={filteredBuyers} 
                  onUserAction={handleUserAction}
                  showBanAction={true}
                  showUnbanAction={false}
                />
              </TabsContent>
              <TabsContent value="sellers">
                <UserTable 
                  users={filteredSellers} 
                  onUserAction={handleUserAction}
                  showBanAction={true}
                  showUnbanAction={false}
                />
              </TabsContent>
              <TabsContent value="banned">
                <UserTable 
                  users={filteredBannedUsers} 
                  onUserAction={handleUserAction}
                  showBanAction={false}
                  showUnbanAction={true}
                />
              </TabsContent>
            </>
          )}
        </Tabs>
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="max-w-2xl">
            {selectedUser && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <span>{selectedUser.name}</span>
                  </DialogTitle>
                  <DialogDescription>User account details and activity information</DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                  {selectedUser.type === 'buyer' && (
                    <div className="border border-border rounded-lg p-4">
                      <h4 className="font-medium mb-3">Purchase Activity</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <ShoppingCart className="h-4 w-4" />
                            <span className="text-sm font-medium">Total Orders</span>
                          </div>
                          <p className="text-lg font-bold">{selectedUser.totalOrders || 0}</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <DollarSign className="h-4 w-4" />
                            <span className="text-sm font-medium">Total Spent</span>
                          </div>
                          <p className="text-lg font-bold">₱{(selectedUser.totalSpent || 0).toLocaleString()}</p>
                        </div>
                      </div>
                      {selectedUser.favoriteStores && selectedUser.favoriteStores.length > 0 && (
                        <div className="mt-3">
                          <label className="text-sm font-medium text-muted-foreground">Favorite Stores</label>
                          <p className="text-sm">{selectedUser.favoriteStores.length} stores</p>
                        </div>
                      )}
                    </div>
                  )}
                  {selectedUser.type === 'seller' && (
                    <div className="border border-border rounded-lg p-4">
                      <h4 className="font-medium mb-3">Store Activity</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <Package className="h-4 w-4" />
                            <span className="text-sm font-medium">Total Products</span>
                          </div>
                          <p className="text-lg font-bold">{selectedUser.totalProducts || 0}</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <DollarSign className="h-4 w-4" />
                            <span className="text-sm font-medium">Total Sales</span>
                          </div>
                          <p className="text-lg font-bold">₱{(selectedUser.totalSales || 0).toLocaleString()}</p>
                        </div>
                      </div>
                      {selectedUser.storeName && (
                        <div className="mt-3">
                          <label className="text-sm font-medium text-muted-foreground">Store</label>
                          <p className="flex items-center space-x-1">
                            <Store className="h-4 w-4" />
                            <span>{selectedUser.storeName}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSelectedUser(null)}>Close</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
        <Dialog open={actionDialog.open} onOpenChange={() => setActionDialog({ open: false, type: null, user: null })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{actionDialog.type === 'ban' ? 'Ban User' : 'Unban User'}</DialogTitle>
              <DialogDescription>
                {actionDialog.type === 'ban' 
                  ? `Are you sure you want to ban ${actionDialog.user?.name}? This will prevent them from accessing the platform.`
                  : `Are you sure you want to unban ${actionDialog.user?.name}? This will restore their account access.`
                }
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Reason *</label>
                <Textarea
                  placeholder={`Enter reason for ${actionDialog.type}ning this user...`}
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
                {actionReason.length > 0 && actionReason.length < 5 && (
                  <p className="text-sm text-red-500 mt-1">Reason must be at least 5 characters long</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setActionDialog({ open: false, type: null, user: null })} disabled={actionLoading}>Cancel</Button>
              <Button variant={actionDialog.type === 'ban' ? 'destructive' : 'default'} onClick={confirmAction} disabled={actionLoading || !actionReason.trim() || actionReason.length < 5}>
                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {actionDialog.type === 'ban' ? 'Ban User' : 'Unban User'}
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
  onUserAction: (action: 'ban' | 'unban', user: User) => void;
  showBanAction?: boolean;
  showUnbanAction?: boolean;
}

function UserTable({ users, onUserAction, showBanAction = false, showUnbanAction = false }: UserTableProps) {
  const getTypeBadge = (type: User['type']) => {
    const typeConfig = {
      buyer: { variant: "outline" as const, label: "Buyer" },
      seller: { variant: "secondary" as const, label: "Seller" },
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
              <TableHead className="text-center">Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No users found</TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="text-center">{getTypeBadge(user.type)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">

                      {showBanAction && (
                        <Button size="sm" variant="destructive" onClick={() => onUserAction('ban', user)}>
                          <Ban className="h-4 w-4 mr-1" />Ban
                        </Button>
                      )}
                      {showUnbanAction && (
                        <Button size="sm" variant="default" onClick={() => onUserAction('unban', user)}>
                          <UserCheck className="h-4 w-4 mr-1" />Unban
                        </Button>
                      )}
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