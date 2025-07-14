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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Eye,
  Check,
  X,
  FileText,
  Store,
  MapPin,
  Calendar,
  Star,
  DollarSign,
} from "lucide-react";
import { mockSellers, Seller } from "@/lib/mock-data";

export default function Sellers() {
  const [sellers] = useState<Seller[]>(mockSellers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  const filteredSellers = sellers.filter(seller =>
    seller.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: Seller['status']) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, label: "Pending" },
      approved: { variant: "default" as const, label: "Approved" },
      rejected: { variant: "destructive" as const, label: "Rejected" },
      suspended: { variant: "destructive" as const, label: "Suspended" },
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getMembershipBadge = (status: Seller['membershipStatus']) => {
    const statusConfig = {
      active: { variant: "default" as const, label: "Active" },
      expired: { variant: "destructive" as const, label: "Expired" },
      pending: { variant: "secondary" as const, label: "Pending" },
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const pendingSellers = filteredSellers.filter(s => s.status === 'pending');
  const approvedSellers = filteredSellers.filter(s => s.status === 'approved');
  const rejectedSellers = filteredSellers.filter(s => s.status === 'rejected');

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Seller Management</h1>
          <p className="text-muted-foreground">
            Review seller applications and manage store accounts
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sellers by name, store, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Seller Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">
            Pending ({pendingSellers.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedSellers.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedSellers.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({filteredSellers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <SellerTable 
            sellers={pendingSellers} 
            onReview={setSelectedSeller}
            showActions={true}
          />
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <SellerTable 
            sellers={approvedSellers} 
            onReview={setSelectedSeller}
            showActions={false}
          />
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <SellerTable 
            sellers={rejectedSellers} 
            onReview={setSelectedSeller}
            showActions={false}
          />
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <SellerTable 
            sellers={filteredSellers} 
            onReview={setSelectedSeller}
            showActions={false}
          />
        </TabsContent>
      </Tabs>

      {/* Seller Review Dialog */}
      <Dialog open={!!selectedSeller} onOpenChange={() => setSelectedSeller(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedSeller && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Store className="h-5 w-5" />
                  <span>{selectedSeller.storeName}</span>
                </DialogTitle>
                <DialogDescription>
                  Review seller application and documents
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Seller Information */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Seller Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                        <p className="font-medium">{selectedSeller.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <p className="font-medium">{selectedSeller.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Store Name</label>
                        <p className="font-medium">{selectedSeller.storeName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Location</label>
                        <p className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{selectedSeller.storeLocation}</span>
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Submission Date</label>
                        <p className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(selectedSeller.submissionDate).toLocaleDateString()}</span>
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Status</label>
                          <div className="mt-1">
                            {getStatusBadge(selectedSeller.status)}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Membership</label>
                          <div className="mt-1">
                            {getMembershipBadge(selectedSeller.membershipStatus)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Documents */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Submitted Documents</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="border border-border rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4" />
                            <span className="font-medium">Government ID</span>
                          </div>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedSeller.documents.govId}
                        </p>
                      </div>
                      <div className="border border-border rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4" />
                            <span className="font-medium">Business Permit</span>
                          </div>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedSeller.documents.businessPermit}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Performance Metrics (for approved sellers) */}
                  {selectedSeller.status === 'approved' && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Performance Metrics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="flex items-center justify-center space-x-1 mb-1">
                              <DollarSign className="h-4 w-4" />
                              <span className="text-sm font-medium">Revenue</span>
                            </div>
                            <p className="text-lg font-bold">₱{selectedSeller.totalRevenue.toLocaleString()}</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center space-x-1 mb-1">
                              <Store className="h-4 w-4" />
                              <span className="text-sm font-medium">Orders</span>
                            </div>
                            <p className="text-lg font-bold">{selectedSeller.totalOrders}</p>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <Star className="h-4 w-4" />
                            <span className="text-sm font-medium">Rating</span>
                          </div>
                          <p className="text-lg font-bold">{selectedSeller.rating}/5.0</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* Review Notes */}
              {selectedSeller.status === 'pending' && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Review Notes</label>
                  <Textarea
                    placeholder="Add notes about this seller application..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              )}

              <DialogFooter>
                {selectedSeller.status === 'pending' ? (
                  <div className="flex space-x-2">
                    <Button variant="destructive">
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button>
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" onClick={() => setSelectedSeller(null)}>
                    Close
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </AdminLayout>
  );
}

interface SellerTableProps {
  sellers: Seller[];
  onReview: (seller: Seller) => void;
  showActions: boolean;
}

function SellerTable({ sellers, onReview, showActions }: SellerTableProps) {
  const getStatusBadge = (status: Seller['status']) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, label: "Pending" },
      approved: { variant: "default" as const, label: "Approved" },
      rejected: { variant: "destructive" as const, label: "Rejected" },
      suspended: { variant: "destructive" as const, label: "Suspended" },
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Store Name</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submission Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sellers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No sellers found
                </TableCell>
              </TableRow>
            ) : (
              sellers.map((seller) => (
                <TableRow key={seller.id}>
                  <TableCell className="font-medium">{seller.storeName}</TableCell>
                  <TableCell>{seller.name}</TableCell>
                  <TableCell>{seller.email}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{seller.storeLocation}</TableCell>
                  <TableCell>{getStatusBadge(seller.status)}</TableCell>
                  <TableCell>{new Date(seller.submissionDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onReview(seller)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                      {showActions && seller.status === 'pending' && (
                        <>
                          <Button size="sm" variant="destructive">
                            <X className="h-4 w-4" />
                          </Button>
                          <Button size="sm">
                            <Check className="h-4 w-4" />
                          </Button>
                        </>
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