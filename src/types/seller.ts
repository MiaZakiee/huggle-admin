export enum Status {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
}

export interface SellerDetails {
  id: string;
  name: string;
  emailAddress: string;
  // Add other fields as needed
}

export interface StoreDetails {
  id: string;
  name: string;
  address: string;
  // Add other fields as needed
}

export interface VerificationRequest {
  id: string;
  sellerId: string;
  governmentIdImageUrl: string;
  governmentIdType: string;
  businessPermitPdfUrl: string;
  status: Status;
  message?: string;
  createdAt: string;
  updatedAt?: string;
  seller?: SellerDetails;
  store?: StoreDetails;
}

export interface VerificationRequestSearchParameters {
  Status?: Status;
  IsAscending?: boolean;
  PageSize?: number;
  PageNumber?: number;
  LastDocId?: string;
}

export interface VerificationRequestResponse {
  requests: VerificationRequest[];
  totalCount: number;
}
