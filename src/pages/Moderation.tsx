import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { adminReportsApi, Report } from "@/services/adminReportsApi";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function Moderation() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await adminReportsApi.getAllReports();
        setReports(data);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Moderation</h1>
          <Badge variant="secondary">{reports.length} Reported Items</Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reported Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : reports.length === 0 ? (
              <p className="text-muted-foreground">No reported items.</p>
            ) : (
              <div className="space-y-2">
                {reports.map((r) => (
                  <div key={r.id} className="flex items-center justify-between border rounded p-3">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Target ID: <span className="font-mono">{r.targetId}</span></div>
                      <div className="text-xs text-muted-foreground">Reason: {r.reason}</div>
                    </div>
                    <div className="space-x-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          try {
                            await adminReportsApi.suspendTarget(r.id);
                            toast({ title: 'Suspended', description: 'Content suspended successfully.' });
                          } catch {
                            toast({ title: 'Error', description: 'Failed to suspend.', variant: 'destructive' });
                          }
                        }}
                      >
                        Suspend
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={async () => {
                          try {
                            await adminReportsApi.unsuspendTarget(r.id);
                            toast({ title: 'Unsuspended', description: 'Content unsuspended successfully.' });
                          } catch {
                            toast({ title: 'Error', description: 'Failed to unsuspend.', variant: 'destructive' });
                          }
                        }}
                      >
                        Unsuspend
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}


