import api from "@/lib/api-client";
import {
  VerificationRequest,
  VerificationRequestSearchParameters,
  VerificationRequestResponse,
} from "@/types/seller";

export class VerificationService {
  private static baseUrl = "/api/verification-requests";

  static async searchRequests(
    params: VerificationRequestSearchParameters = {}
  ): Promise<VerificationRequestResponse> {
    const response = await api.get<any>(this.baseUrl, {
      params,
    });

    // Map the backend DTO structure to the frontend expectation
    const requests = (response.data?.requests || []).map((dto: any) => ({
      ...dto.verificationRequest,
      seller: dto.seller,
      store: dto.store,
    }));

    return {
      requests,
      totalCount: response.data?.totalCount || 0,
    };
  }

  static async getById(id: string): Promise<VerificationRequest> {
    const response = await api.get<VerificationRequest>(
      `${this.baseUrl}/${id}`
    );
    return response.data;
  }

  static async updateRequest(
    id: string,
    request: VerificationRequest
  ): Promise<VerificationRequest> {
    // Fetch the latest data from the backend to ensure all required fields are present
    const latest = await this.getById(id);
    // Only send the fields the backend expects, merged with the latest data
    const { seller, store, ...cleanedRequest } = { ...latest, ...request };
    const response = await api.put<VerificationRequest>(
      `${this.baseUrl}/${id}`,
      cleanedRequest
    );
    console.log("Request updated:", response);
    return response.data;
  }

  static async createRequest(
    request: VerificationRequest
  ): Promise<VerificationRequest> {
    const response = await api.post<VerificationRequest>(this.baseUrl, request);
    return response.data;
  }
}
