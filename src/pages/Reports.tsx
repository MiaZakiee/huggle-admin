import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
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
  Eye,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  User,
  Store,
  Image,
  FileText,
} from "lucide-react";
import { adminReportsApi, Report, ReportStatus } from "@/services/adminReportsApi";
import { useToast } from "@/hooks/use-toast";

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    type: 'reviewed' | 'resolved' | 'dismissed' | null;
    report: Report | null;
  }>({ open: false, type: null, report: null });
  const [actionNotes, setActionNotes] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      // Fetch a larger batch of reports to ensure client-side filtering works reasonably well
      // for moderate datasets. Ideal long-term fix is server-side filtering per tab.
      const fetchedReports = await adminReportsApi.getAllReports({ pageSize: 1000 });
      // Ensure reports is always an array
      setReports(Array.isArray(fetchedReports) ? fetchedReports : []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setReports([]); // Set empty array on error
      toast({
        title: "Error",
        description: "Failed to fetch reports. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = (Array.isArray(reports) ? reports : []).filter(report =>
    report?.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report?.reporterId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report?.targetId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: ReportStatus) => {
    const variant = adminReportsApi.getStatusVariant(status);
    const label = adminReportsApi.getStatusLabel(status);
    return <Badge variant={variant}>{label}</Badge>;
  };

  // Filter reports by status
  const pendingReports = filteredReports.filter(r => r.status === ReportStatus.Pending);
  const reviewedReports = filteredReports.filter(r => r.status === ReportStatus.Reviewed);
  const resolvedReports = filteredReports.filter(r => r.status === ReportStatus.Resolved);
  const dismissedReports = filteredReports.filter(r => r.status === ReportStatus.Dismissed);

  const handleReportAction = (action: 'reviewed' | 'resolved' | 'dismissed', report: Report) => {
    setActionDialog({ open: true, type: action, report });
    setActionNotes("");
  };

  const confirmAction = async () => {
    if (!actionDialog.report || !actionDialog.type) return;

    try {
      let newStatus: ReportStatus;
      switch (actionDialog.type) {
        case 'reviewed':
          newStatus = ReportStatus.Reviewed;
          break;
        case 'resolved':
          newStatus = ReportStatus.Resolved;
          break;
        case 'dismissed':
          newStatus = ReportStatus.Dismissed;
          break;
        default:
          return;
      }

      await adminReportsApi.updateReportStatus(actionDialog.report.id, newStatus);

      // Update the local state
      setReports(prev => prev.map(report =>
        report.id === actionDialog.report?.id
          ? { ...report, status: newStatus }
          : report
      ));

      toast({
        title: "Success",
        description: `Report ${actionDialog.type} successfully.`,
      });

      setActionDialog({ open: false, type: null, report: null });
      setActionNotes("");
    } catch (error) {
      console.error('Error updating report status:', error);
      toast({
        title: "Error",
        description: "Failed to update report status. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Content Moderation</h1>
            <p className="text-muted-foreground">
              Review and moderate reported content from users
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="destructive" className="px-3 py-1">
              {pendingReports.length} Pending Reports
            </Badge>
          </div>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports by reason, description, reporter, or target..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Reports Tabs */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="pending">
              Pending ({pendingReports.length})
            </TabsTrigger>
            <TabsTrigger value="reviewed">
              Reviewed ({reviewedReports.length})
            </TabsTrigger>
            <TabsTrigger value="resolved">
              Resolved ({resolvedReports.length})
            </TabsTrigger>
            <TabsTrigger value="dismissed">
              Dismissed ({dismissedReports.length})
            </TabsTrigger>
            <TabsTrigger value="all">
              All ({filteredReports.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <ReportsTable
              reports={pendingReports}
              loading={loading}
              onViewReport={setSelectedReport}
              onReportAction={handleReportAction}
              showActions={true}
            />
          </TabsContent>

          <TabsContent value="reviewed">
            <ReportsTable
              reports={reviewedReports}
              loading={loading}
              onViewReport={setSelectedReport}
              onReportAction={handleReportAction}
              showActions={true}
            />
          </TabsContent>

          <TabsContent value="resolved">
            <ReportsTable
              reports={resolvedReports}
              loading={loading}
              onViewReport={setSelectedReport}
              onReportAction={handleReportAction}
              showActions={false}
            />
          </TabsContent>

          <TabsContent value="dismissed">
            <ReportsTable
              reports={dismissedReports}
              loading={loading}
              onViewReport={setSelectedReport}
              onReportAction={handleReportAction}
              showActions={false}
            />
          </TabsContent>

          <TabsContent value="all">
            <ReportsTable
              reports={filteredReports}
              loading={loading}
              onViewReport={setSelectedReport}
              onReportAction={handleReportAction}
              showActions={false}
            />
          </TabsContent>
        </Tabs>

        {/* Report Details Dialog */}
        <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            {selectedReport && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Report Details</span>
                    {getStatusBadge(selectedReport.status)}
                  </DialogTitle>
                  <DialogDescription>
                    Review reported content and take appropriate action
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Report Information */}
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Report Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Reporter ID</label>
                          <p className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span className="font-mono text-sm">{selectedReport.reporterId}</span>
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Report Date</label>
                          <p className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(selectedReport.createdAt).toLocaleDateString()}</span>
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Reason</label>
                          <p className="font-medium">{selectedReport.reason}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Target ID</label>
                          <p className="flex items-center space-x-1">
                            <Store className="h-4 w-4" />
                            <span className="font-mono text-sm">{selectedReport.targetId}</span>
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Status</label>
                          <div className="mt-1">
                            {getStatusBadge(selectedReport.status)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Report Description */}
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center space-x-2">
                          <FileText className="h-5 w-5" />
                          <span>Report Description</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Description</label>
                          <p className="text-sm whitespace-pre-wrap">{selectedReport.description}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Report ID</label>
                          <p className="text-xs font-mono bg-muted px-2 py-1 rounded">
                            {selectedReport.id}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <DialogFooter>
                  {selectedReport.status === ReportStatus.Pending && (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handleReportAction('dismissed', selectedReport)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Dismiss
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={async () => {
                          try {
                            await adminReportsApi.suspendTarget(selectedReport.id);
                            toast({ title: 'Target suspended', description: 'The reported content has been suspended.' });
                          } catch (e) {
                            toast({ title: 'Error', description: 'Failed to suspend target.', variant: 'destructive' });
                          }
                        }}
                      >
                        Suspend Target
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => handleReportAction('reviewed', selectedReport)}
                      >
                        Mark as Reviewed
                      </Button>
                      <Button
                        onClick={() => handleReportAction('resolved', selectedReport)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Resolve
                      </Button>
                    </div>
                  )}
                  {selectedReport.status === ReportStatus.Reviewed && (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handleReportAction('dismissed', selectedReport)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Dismiss
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={async () => {
                          try {
                            await adminReportsApi.suspendTarget(selectedReport.id);
                            toast({ title: 'Target suspended', description: 'The reported content has been suspended.' });
                          } catch (e) {
                            toast({ title: 'Error', description: 'Failed to suspend target.', variant: 'destructive' });
                          }
                        }}
                      >
                        Suspend Target
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={async () => {
                          try {
                            await adminReportsApi.unsuspendTarget(selectedReport.id);
                            toast({ title: 'Target unsuspended', description: 'The reported content has been unsuspended.' });
                          } catch (e) {
                            toast({ title: 'Error', description: 'Failed to unsuspend target.', variant: 'destructive' });
                          }
                        }}
                      >
                        Unsuspend Target
                      </Button>
                      <Button
                        onClick={() => handleReportAction('resolved', selectedReport)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Resolve
                      </Button>
                    </div>
                  )}
                  {(selectedReport.status === ReportStatus.Resolved || selectedReport.status === ReportStatus.Dismissed) && (
                    <Button variant="outline" onClick={() => setSelectedReport(null)}>
                      Close
                    </Button>
                  )}
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Action Confirmation Dialog */}
        <Dialog open={actionDialog.open} onOpenChange={() => setActionDialog({ open: false, type: null, report: null })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Confirm {actionDialog.type?.charAt(0).toUpperCase()}{actionDialog.type?.slice(1)} Report
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to {actionDialog.type} this report?
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Action Notes (Optional)</label>
              <Textarea
                placeholder={`Add notes about why you're ${actionDialog.type}ing this report...`}
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setActionDialog({ open: false, type: null, report: null })}
              >
                Cancel
              </Button>
              <Button
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

interface ReportsTableProps {
  reports: Report[];
  loading: boolean;
  onViewReport: (report: Report) => void;
  onReportAction: (action: 'reviewed' | 'resolved' | 'dismissed', report: Report) => void;
  showActions: boolean;
}

function ReportsTable({ reports, loading, onViewReport, onReportAction, showActions }: ReportsTableProps) {
  const getStatusBadge = (status: ReportStatus) => {
    const variant = adminReportsApi.getStatusVariant(status);
    const label = adminReportsApi.getStatusLabel(status);
    return <Badge variant={variant}>{label}</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Loading reports...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reporter ID</TableHead>
              <TableHead>Target ID</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No reports found
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <span className="font-mono text-sm">{report.reporterId}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{report.targetId}</span>
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate">{report.reason}</TableCell>
                  <TableCell>
                    <p className="text-sm truncate max-w-[200px]" title={report.description}>
                      {report.description}
                    </p>
                  </TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewReport(report)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>

                      {showActions && (report.status === ReportStatus.Pending || report.status === ReportStatus.Reviewed) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {report.status === ReportStatus.Pending && (
                              <DropdownMenuItem
                                onClick={() => onReportAction('reviewed', report)}
                                className="text-yellow-600"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Mark as Reviewed
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => onReportAction('resolved', report)}
                              className="text-success"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Resolve Report
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onReportAction('dismissed', report)}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Dismiss Report
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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