import { useState, useEffect } from "react";
import { VerificationService } from "@/services/verificationService";
import {
  VerificationRequest,
  VerificationRequestSearchParameters,
  Status,
} from "@/types/seller";

export const useVerificationRequests = (
  initialParams?: VerificationRequestSearchParameters
) => {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<VerificationRequestSearchParameters>(
    initialParams || { PageSize: 10, PageNumber: 1 }
  );

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await VerificationService.searchRequests(params);
      setRequests(data.requests);
      setTotalCount(data.totalCount);
    } catch (err) {
      console.error("Error fetching verification requests:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch verification requests"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateRequest = async (
    id: string,
    updatedRequest: VerificationRequest
  ) => {
    try {
      const updated = await VerificationService.updateRequest(
        id,
        updatedRequest
      );
      setRequests((prev) => prev.map((req) => (req.id === id ? updated : req)));
      return updated;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to update request"
      );
    }
  };

  const approveRequest = async (id: string, message?: string) => {
    const request = requests.find((r) => r.id === id);
    if (!request) throw new Error("Request not found");

    return updateRequest(id, {
      ...request,
      status: Status.Approved,
      message: message || "Application approved",
    });
  };

  const rejectRequest = async (id: string, message?: string) => {
    const request = requests.find((r) => r.id === id);
    if (!request) throw new Error("Request not found");

    return updateRequest(id, {
      ...request,
      status: Status.Rejected,
      message: message || "Application rejected",
    });
  };

  useEffect(() => {
    fetchRequests();
  }, [params.Status, params.PageNumber, params.PageSize]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    requests,
    totalCount,
    loading,
    error,
    params,
    setParams,
    refetch: fetchRequests,
    approveRequest,
    rejectRequest,
    updateRequest,
  };
};
