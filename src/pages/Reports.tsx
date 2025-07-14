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
import { mockReports, ContentReport } from "@/lib/mock-data";

export default function Reports() {
  const [reports] = useState<ContentReport[]>(mockReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState<ContentReport | null>(null);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    type: 'resolve' | 'dismiss' | 'remove' | null;
    report: ContentReport | null;
  }>({ open: false, type: null, report: null });
  const [actionNotes, setActionNotes] = useState("");

  const filteredReports = reports.filter(report =>
    report.reportedContent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: ContentReport['status']) => {
    const statusConfig = {
      open: { variant: "destructive" as const, label: "Open" },
      'in-review': { variant: "secondary" as const, label: "In Review" },
      resolved: { variant: "default" as const, label: "Resolved" },
      dismissed: { variant: "outline" as const, label: "Dismissed" },
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getContentTypeBadge = (type: ContentReport['reportedContent']['type']) => {
    const typeConfig = {
      product: { variant: "outline" as const, label: "Product", icon: Store },
      post: { variant: "secondary" as const, label: "Post", icon: Image },
    };
    
    const config = typeConfig[type];
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <Icon className="h-3 w-3" />
        <span>{config.label}</span>
      </Badge>
    );
  };

  const openReports = filteredReports.filter(r => r.status === 'open');
  const inReviewReports = filteredReports.filter(r => r.status === 'in-review');
  const resolvedReports = filteredReports.filter(r => r.status === 'resolved');
  const dismissedReports = filteredReports.filter(r => r.status === 'dismissed');

  const handleReportAction = (action: 'resolve' | 'dismiss' | 'remove', report: ContentReport) => {
    setActionDialog({ open: true, type: action, report });
    setActionNotes("");
  };

  const confirmAction = () => {
    // Here you would call the API to perform the action
    console.log(`${actionDialog.type} report:`, actionDialog.report?.id, actionNotes);
    setActionDialog({ open: false, type: null, report: null });
    setActionNotes("");
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
            {openReports.length} Open Reports
          </Badge>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports by content, reporter, seller, or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Reports Tabs */}
      <Tabs defaultValue="open" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="open">
            Open ({openReports.length})
          </TabsTrigger>
          <TabsTrigger value="in-review">
            In Review ({inReviewReports.length})
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

        <TabsContent value="open">
          <ReportsTable 
            reports={openReports} 
            onViewReport={setSelectedReport}
            onReportAction={handleReportAction}
            showActions={true}
          />
        </TabsContent>

        <TabsContent value="in-review">
          <ReportsTable 
            reports={inReviewReports} 
            onViewReport={setSelectedReport}
            onReportAction={handleReportAction}
            showActions={true}
          />
        </TabsContent>

        <TabsContent value="resolved">
          <ReportsTable 
            reports={resolvedReports} 
            onViewReport={setSelectedReport}
            onReportAction={handleReportAction}
            showActions={false}
          />
        </TabsContent>

        <TabsContent value="dismissed">
          <ReportsTable 
            reports={dismissedReports} 
            onViewReport={setSelectedReport}
            onReportAction={handleReportAction}
            showActions={false}
          />
        </TabsContent>

        <TabsContent value="all">
          <ReportsTable 
            reports={filteredReports} 
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
                        <label className="text-sm font-medium text-muted-foreground">Reported By</label>
                        <p className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{selectedReport.reportedBy}</span>
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Report Date</label>
                        <p className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(selectedReport.reportDate).toLocaleDateString()}</span>
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Reason</label>
                        <p className="font-medium">{selectedReport.reason}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Seller</label>
                        <p className="flex items-center space-x-1">
                          <Store className="h-4 w-4" />
                          <span>{selectedReport.seller}</span>
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

                {/* Reported Content */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <span>Reported Content</span>
                        {getContentTypeBadge(selectedReport.reportedContent.type)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Title</label>
                        <p className="font-medium">{selectedReport.reportedContent.title}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Description</label>
                        <p className="text-sm">{selectedReport.reportedContent.description}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Content ID</label>
                        <p className="text-xs font-mono bg-muted px-2 py-1 rounded">
                          {selectedReport.reportedContent.id}
                        </p>
                      </div>
                      
                      {/* Mock content preview */}
                      <div className="border border-border rounded-lg p-3 bg-muted/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Content Preview</span>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View Full
                          </Button>
                        </div>
                        <div className="bg-muted rounded h-32 flex items-center justify-center">
                          <p className="text-muted-foreground text-sm">
                            [Content preview would appear here]
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <DialogFooter>
                {selectedReport.status === 'open' || selectedReport.status === 'in-review' ? (
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline"
                      onClick={() => handleReportAction('dismiss', selectedReport)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Dismiss
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => handleReportAction('remove', selectedReport)}
                    >
                      Remove Content
                    </Button>
                    <Button 
                      onClick={() => handleReportAction('resolve', selectedReport)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Resolve
                    </Button>
                  </div>
                ) : (
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
              {actionDialog.type === 'remove' 
                ? 'This will permanently remove the reported content and may result in seller penalties.'
                : `Are you sure you want to ${actionDialog.type} this report?`
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Action Notes</label>
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
              variant={actionDialog.type === 'remove' ? 'destructive' : 'default'}
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
  reports: ContentReport[];
  onViewReport: (report: ContentReport) => void;
  onReportAction: (action: 'resolve' | 'dismiss' | 'remove', report: ContentReport) => void;
  showActions: boolean;
}

function ReportsTable({ reports, onViewReport, onReportAction, showActions }: ReportsTableProps) {
  const getStatusBadge = (status: ContentReport['status']) => {
    const statusConfig = {
      open: { variant: "destructive" as const, label: "Open" },
      'in-review': { variant: "secondary" as const, label: "In Review" },
      resolved: { variant: "default" as const, label: "Resolved" },
      dismissed: { variant: "outline" as const, label: "Dismissed" },
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getContentTypeBadge = (type: ContentReport['reportedContent']['type']) => {
    return (
      <Badge variant="outline" className="capitalize">
        {type}
      </Badge>
    );
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Content</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Reported By</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No reports found
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{report.reportedContent.title}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {report.reportedContent.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{getContentTypeBadge(report.reportedContent.type)}</TableCell>
                  <TableCell>{report.reportedBy}</TableCell>
                  <TableCell>{report.seller}</TableCell>
                  <TableCell className="max-w-[150px] truncate">{report.reason}</TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell>{new Date(report.reportDate).toLocaleDateString()}</TableCell>
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
                      
                      {showActions && (report.status === 'open' || report.status === 'in-review') && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => onReportAction('resolve', report)}
                              className="text-success"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Resolve Report
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => onReportAction('dismiss', report)}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Dismiss Report
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => onReportAction('remove', report)}
                              className="text-destructive"
                            >
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Remove Content
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