import apiClient from '@/lib/api-client';

export interface User {
  id: string;
  clerkUserId: string;
  name: string;
  email: string;
  type: 'buyer' | 'seller';
  createdAt: string;
}

export interface BanUserRequest {
  clerkUserId: string;
  reason: string;
}

export interface UnbanUserRequest {
  clerkUserId: string;
  reason: string;
}

export interface BanRequest {
  clerkUserId: string;
  reason: string;
  createdAt: string;
}

export interface UnbanRequest {
  clerkUserId: string;
  reason: string;
  createdAt: string;
}

export interface DeleteUserRequest {
  clerkUserId: string;
  reason: string;
  confirmDeletion: boolean;
}

// Buyer response from the API
interface BuyerResponse {
  id: string;
  name: string | null;
  emailAddress: string | null;
  createdAt: string;
  updatedAt: string;
  deletedOn: string | null;
}

export const adminUsersApi = {
  // Fetch all buyers using the admin endpoint from BuyerController
  getAllBuyers: async (): Promise<User[]> => {
    try {
      const response = await apiClient.get<BuyerResponse[]>('/api/buyers');
      // The endpoint returns the array directly (not wrapped in ApiResponse)
      const buyers = Array.isArray(response.data) ? response.data : [];
      return buyers.map((buyer) => ({
        id: buyer.id,
        clerkUserId: buyer.id,
        name: buyer.name || '',
        email: buyer.emailAddress || '',
        type: 'buyer' as const,
        createdAt: buyer.createdAt,
      }));
    } catch (error) {
      console.error('Error fetching buyers:', error);
      throw error;
    }
  },

  // Fetch all sellers
  getAllSellers: async (): Promise<User[]> => {
    try {
      const response = await apiClient.get('/api/sellers');
      return response.data.map((seller: any) => ({
        id: seller.id,
        clerkUserId: seller.id,
        name: seller.name,
        email: seller.emailAddress,
        type: 'seller' as const,
        createdAt: seller.createdAt,
      }));
    } catch (error) {
      console.error('Error fetching sellers:', error);
      throw error;
    }
  },

  // Fetch all banned users (buyers and sellers)
  getAllBannedUsers: async (): Promise<User[]> => {
    try {
      const [bannedBuyers, bannedSellers] = await Promise.all([
        apiClient.get('/api/admin/users/banned/buyers'),
        apiClient.get('/api/admin/users/banned/sellers')
      ]);
      
      const bannedBuyersList = bannedBuyers.data.map((buyer: any) => ({
        id: buyer.id,
        clerkUserId: buyer.id,
        name: buyer.name,
        email: buyer.emailAddress,
        type: 'buyer' as const,
        status: 'banned' as const,
        createdAt: buyer.createdAt,
      }));
      
      const bannedSellersList = bannedSellers.data.map((seller: any) => ({
        id: seller.id,
        clerkUserId: seller.id,
        name: seller.name,
        email: seller.emailAddress,
        type: 'seller' as const,
        createdAt: seller.createdAt,
      }));
      
      return [...bannedBuyersList, ...bannedSellersList].sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error fetching banned users:', error);
      return [];
    }
  },

  // Ban a user
  banUser: async (request: BanUserRequest): Promise<void> => {
    try {
      await apiClient.post('/api/admin/users/ban', request);
    } catch (error) {
      console.error('Error banning user:', error);
      throw error;
    }
  },

  // Unban a user
  unbanUser: async (request: UnbanUserRequest): Promise<void> => {
    try {
      await apiClient.post('/api/admin/users/unban', request);
    } catch (error) {
      console.error('Error unbanning user:', error);
      throw error;
    }
  },

  // Fetch all ban requests
  getAllBanRequests: async (): Promise<BanRequest[]> => {
    try {
      const response = await apiClient.get('/api/admin/requests/ban');
      return response.data;
    } catch (error) {
      console.error('Error fetching ban requests:', error);
      return [];
    }
  },

  // Fetch ban request by user ID
  getBanRequest: async (clerkUserId: string): Promise<BanRequest | null> => {
    try {
      const response = await apiClient.get(`/api/admin/requests/ban/${clerkUserId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ban request:', error);
      return null;
    }
  },

  // Fetch all unban requests
  getAllUnbanRequests: async (): Promise<UnbanRequest[]> => {
    try {
      const response = await apiClient.get('/api/admin/requests/unban');
      return response.data;
    } catch (error) {
      console.error('Error fetching unban requests:', error);
      return [];
    }
  },

  // Fetch unban request by user ID
  getUnbanRequest: async (clerkUserId: string): Promise<UnbanRequest | null> => {
    try {
      const response = await apiClient.get(`/api/admin/requests/unban/${clerkUserId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching unban request:', error);
      return null;
    }
  },
};