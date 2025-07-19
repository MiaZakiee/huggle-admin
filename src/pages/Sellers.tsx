import React, { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Loader2,
} from "lucide-react";
import { useVerificationRequests } from "@/hooks/useVerificationRequests";
import { VerificationRequest, Status } from "@/types/seller";
import { useToast } from "@/hooks/use-toast";

export default function Sellers() {
  const {
    requests,
    totalCount,
    loading,
    error,
    params,
    setParams,
    approveRequest,
    rejectRequest,
    refetch,
  } = useVerificationRequests();

  const [selectedSeller, setSelectedSeller] =
    useState<VerificationRequest | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">(
    Status.Pending
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);
  const { toast } = useToast();
  // Add state for confirmation dialog
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    type: "approve" | "reject" | null;
  }>({ open: false, type: null });
  const [actionError, setActionError] = useState<string | null>(null);

  // Handler to open confirmation dialog
  const openActionDialog = (type: "approve" | "reject") => {
    setActionDialog({ open: true, type });
    setActionError(null);
  };

  // Handler to confirm action
  const confirmAction = async () => {
    if (actionDialog.type === "reject" && !reviewNotes.trim()) {
      setActionError("Review notes are required for rejection.");
      return;
    }
    if (!selectedSeller) return;
    setProcessing(selectedSeller.id);
    try {
      if (actionDialog.type === "approve") {
        await approveRequest(
          selectedSeller.id,
          reviewNotes || "Application approved"
        );
        toast({
          title: "Success",
          description: "Seller application approved successfully",
        });
      } else if (actionDialog.type === "reject") {
        await rejectRequest(selectedSeller.id, reviewNotes);
        toast({ title: "Success", description: "Seller application rejected" });
      }
      setSelectedSeller(null);
      setReviewNotes("");
      setActionDialog({ open: false, type: null });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to process request",
        variant: "destructive",
      });
      setActionError(error?.message || "Failed to process request");
    } finally {
      setProcessing(null);
    }
  };

  // Filter requests based on current tab and search term
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      searchTerm === "" ||
      request.sellerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && request.status === statusFilter;
  });

  // Handle status filter changes
  const handleStatusFilter = (value: string) => {
    // Change parameter type to string
    let status: Status | "all";

    if (value === "all") {
      status = "all";
    } else {
      status = parseInt(value) as Status; // Convert string back to Status enum
    }

    setStatusFilter(status);
    setParams((prev) => ({
      ...prev,
      Status: status === "all" ? undefined : status,
      PageNumber: 1,
    }));
  };

  // Handle approval
  const handleApprove = async (id: string) => {
    try {
      setProcessing(id);
      await approveRequest(id, reviewNotes || "Application approved");
      setSelectedSeller(null);
      setReviewNotes("");
      toast({
        title: "Success",
        description: "Seller application approved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve seller application",
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
    }
  };

  // Handle rejection
  const handleReject = async (id: string) => {
    try {
      setProcessing(id);
      await rejectRequest(id, reviewNotes || "Application rejected");
      setSelectedSeller(null);
      setReviewNotes("");
      toast({
        title: "Success",
        description: "Seller application rejected",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject seller application",
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status: Status) => {
    const statusConfig = {
      [Status.Pending]: { variant: "secondary" as const, label: "Pending" },
      [Status.Approved]: { variant: "default" as const, label: "Approved" },
      [Status.Rejected]: { variant: "destructive" as const, label: "Rejected" },
    };

    // Add fallback to prevent undefined config
    const config = statusConfig[status] || {
      variant: "secondary" as const,
      label: "Unknown",
    };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Count requests by status
  const pendingCount = requests.filter(
    (r) => r.status === Status.Pending
  ).length;
  const approvedCount = requests.filter(
    (r) => r.status === Status.Approved
  ).length;
  const rejectedCount = requests.filter(
    (r) => r.status === Status.Rejected
  ).length;

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-destructive mb-4">
                  Error loading seller applications: {error}
                </p>
                <Button onClick={refetch}>Try Again</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Seller Management
            </h1>
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
        <Tabs
          value={statusFilter === "all" ? "all" : statusFilter.toString()} // Convert to string
          onValueChange={handleStatusFilter}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({totalCount})</TabsTrigger>
            <TabsTrigger value={Status.Pending.toString()}>
              Pending ({pendingCount})
            </TabsTrigger>
            <TabsTrigger value={Status.Approved.toString()}>
              Approved ({approvedCount})
            </TabsTrigger>
            <TabsTrigger value={Status.Rejected.toString()}>
              Rejected ({rejectedCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value={statusFilter === "all" ? "all" : statusFilter.toString()}
            className="space-y-4"
          >
            {loading ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Loading seller applications...</span>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <SellerTable
                requests={filteredRequests}
                onReview={setSelectedSeller}
                getStatusBadge={getStatusBadge}
                showActions={
                  statusFilter === Status.Pending || statusFilter === "all"
                }
                onApprove={handleApprove}
                onReject={handleReject}
                processing={processing}
              />
            )}
          </TabsContent>
        </Tabs>

        {/* Seller Review Dialog */}
        <Dialog
          open={!!selectedSeller}
          onOpenChange={() => setSelectedSeller(null)}
        >
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            {selectedSeller && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Seller Application Details</span>
                  </DialogTitle>
                  <DialogDescription>
                    Review seller verification request and documents
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Application Information */}
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Seller Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Seller Name
                          </label>
                          <p className="font-medium">
                            {selectedSeller.seller?.name || "-"}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Seller Email
                          </label>
                          <p className="font-medium">
                            {selectedSeller.seller?.emailAddress || "-"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Store Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Store Name
                          </label>
                          <p className="font-medium">
                            {selectedSeller.store?.name || "-"}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Store Address
                          </label>
                          <p className="font-medium">
                            {selectedSeller.store?.address || "-"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Documents */}
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Submitted Documents
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="border border-border rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4" />
                              <span className="font-medium">Government ID</span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                window.open(
                                  selectedSeller.governmentIdImageUrl,
                                  "_blank"
                                )
                              }
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {selectedSeller.governmentIdType}
                          </p>
                        </div>
                        <div className="border border-border rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4" />
                              <span className="font-medium">
                                Business Permit
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                window.open(
                                  selectedSeller.businessPermitPdfUrl,
                                  "_blank"
                                )
                              }
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Business registration document
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Review Notes */}
                {selectedSeller.status === Status.Pending && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">
                      Review Notes
                    </label>
                    <Textarea
                      placeholder="Add notes about this seller application..."
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                )}

                <DialogFooter>
                  {selectedSeller.status === Status.Pending ? (
                    <div className="flex space-x-2">
                      <Button
                        variant="destructive"
                        onClick={() => openActionDialog("reject")}
                        disabled={processing === selectedSeller.id}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button
                        onClick={() => openActionDialog("approve")}
                        disabled={processing === selectedSeller.id}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setSelectedSeller(null)}
                    >
                      Close
                    </Button>
                  )}
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Confirmation Dialog */}
        <Dialog
          open={actionDialog.open}
          onOpenChange={() => setActionDialog({ open: false, type: null })}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionDialog.type === "approve"
                  ? "Confirm Approval"
                  : "Confirm Rejection"}
              </DialogTitle>
              <DialogDescription>
                {actionDialog.type === "approve"
                  ? "Are you sure you want to approve this seller application?"
                  : "Are you sure you want to reject this seller application?"}
              </DialogDescription>
            </DialogHeader>
            {actionDialog.type === "reject" && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  Review Notes <span className="text-destructive">*</span>
                </label>
                <Textarea
                  placeholder="Add notes about why you're rejecting this application..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={3}
                />
              </div>
            )}
            {actionError && (
              <p className="text-destructive text-sm">{actionError}</p>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setActionDialog({ open: false, type: null })}
              >
                Cancel
              </Button>
              <Button
                variant={
                  actionDialog.type === "reject" ? "destructive" : "default"
                }
                onClick={confirmAction}
                disabled={processing === selectedSeller?.id}
              >
                {processing === selectedSeller?.id ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : null}
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

interface SellerTableProps {
  requests: VerificationRequest[];
  onReview: (request: VerificationRequest) => void;
  getStatusBadge: (status: Status) => JSX.Element;
  showActions: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  processing: string | null;
}

function SellerTable({
  requests,
  onReview,
  getStatusBadge,
  showActions,
  onApprove,
  onReject,
  processing,
}: SellerTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Store Name</TableHead>
              <TableHead>Seller Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submission Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No seller applications found
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.store?.name || "-"}</TableCell>
                  <TableCell>{request.seller?.name || "-"}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    {new Date(request.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onReview(request)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
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
