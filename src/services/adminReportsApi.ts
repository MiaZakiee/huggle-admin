import apiClient from '@/lib/api-client';

export interface Report {
  id: string;
  reporterId: string;
  targetId: string; // seller/store id
  reason: string;
  description: string;
  createdAt: string;
  status: ReportStatus;
}

export enum ReportStatus {
  Pending = 0,
  Reviewed = 1,
  Resolved = 2,
  Dismissed = 3
}

export interface CreateReportRequest {
  reporterId: string;
  targetId: string;
  reason: string;
  description: string;
}

export interface UpdateReportStatusRequest {
  status: ReportStatus;
}

export const adminReportsApi = {
  // Get all reports
  getAllReports: async (): Promise<Report[]> => {
    try {
      const response = await apiClient.get('/api/reports');
      return response.data?.reports || response.data;
    } catch (error) {
      console.error('Error fetching all reports:', error);
      throw error;
    }
  },

  // Get reports for a specific target (seller/store)
  getReportsForTarget: async (targetId: string): Promise<Report[]> => {
    try {
      const response = await apiClient.get(`/api/reports/target/${targetId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reports for target:', error);
      throw error;
    }
  },

  // Get reports by a specific reporter
  getReportsByReporter: async (reporterId: string): Promise<Report[]> => {
    try {
      const response = await apiClient.get(`/api/reports/reporter/${reporterId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reports by reporter:', error);
      throw error;
    }
  },

  // Create a new report
  createReport: async (request: CreateReportRequest): Promise<Report> => {
    try {
      const response = await apiClient.post('/api/reports', request);
      return response.data;
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  },

  // Update report status
  updateReportStatus: async (reportId: string, status: ReportStatus): Promise<void> => {
    try {
      await apiClient.put(`/api/reports/${reportId}`, { status });
    } catch (error) {
      console.error('Error updating report status:', error);
      throw error;
    }
  },

  // Suspend the reported target (product/post/store) via report update
  suspendTarget: async (reportId: string): Promise<void> => {
    try {
      await apiClient.put(`/api/reports/${reportId}`, { suspendTarget: true });
    } catch (error) {
      console.error('Error suspending target:', error);
      throw error;
    }
  },

  // Unsuspend the reported target
  unsuspendTarget: async (reportId: string): Promise<void> => {
    try {
      await apiClient.put(`/api/reports/${reportId}`, { unsuspendTarget: true });
    } catch (error) {
      console.error('Error unsuspending target:', error);
      throw error;
    }
  },

  // Helper function for label
  getStatusLabel: (status: ReportStatus): string => {
    switch (status) {
      case ReportStatus.Pending:
        return 'Pending';
      case ReportStatus.Reviewed:
        return 'Reviewed';
      case ReportStatus.Resolved:
        return 'Resolved';
      case ReportStatus.Dismissed:
        return 'Dismissed';
      default:
        return 'Unknown';
    }
  },

  // Helper function for status variant
  getStatusVariant: (status: ReportStatus): 'destructive' | 'secondary' | 'default' | 'outline' => {
    switch (status) {
      case ReportStatus.Pending:
        return 'destructive';
      case ReportStatus.Reviewed:
        return 'secondary';
      case ReportStatus.Resolved:
        return 'default';
      case ReportStatus.Dismissed:
        return 'outline';
      default:
        return 'outline';
    }
  },
}; 