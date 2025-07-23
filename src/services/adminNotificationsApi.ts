import apiClient from '@/lib/api-client';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

export enum NotificationType {
  // Buyer
  NewProduct = 0,
  NewPost = 1,
  OrderReady = 2,
  // Seller
  NewOrder = 3,
  OrderCancelled = 4,
  // Admin
  NewReport = 5,
  NewSeller = 6,
  NewVerificationRequest = 7
}

export interface NotificationsResponse {
  notifications: Notification[];
  totalCount: number;
  unreadCount: number;
}

export interface CreateNotificationRequest {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
}

export const adminNotificationsApi = {
  // Get notifications for admin
  getNotifications: async (unreadOnly: boolean = false): Promise<NotificationsResponse> => {
    try {
      const response = await apiClient.get('/api/notifications', {
        params: {
          userId: 'admin',
          unreadOnly
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Get unread notification count
  getUnreadCount: async (): Promise<number> => {
    try {
      const response = await apiClient.get('/api/notifications/unread-count', {
        params: { userId: 'admin' }
      });
      return response.data.unreadCount;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId: string): Promise<void> => {
    try {
      await apiClient.put(`/api/notifications/${notificationId}/read`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<number> => {
    try {
      const response = await apiClient.put('/api/notifications/mark-all-read', {}, {
        params: { userId: 'admin' }
      });
      return response.data.updatedCount;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Delete a specific notification
  deleteNotification: async (notificationId: string): Promise<void> => {
    try {
      await apiClient.delete(`/api/notifications/${notificationId}`);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  // Create notification (for testing)
  createNotification: async (request: CreateNotificationRequest): Promise<Notification> => {
    try {
      const response = await apiClient.post('/api/notifications', request);
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  // Helper function to get type label
  getTypeLabel: (type: NotificationType): string => {
    switch (type) {
      case NotificationType.NewProduct:
        return 'Product';
      case NotificationType.NewPost:
        return 'Post';
      case NotificationType.OrderReady:
        return 'Ready';
      case NotificationType.NewOrder:
        return 'Order';
      case NotificationType.OrderCancelled:
        return 'Order Cancelled';
      case NotificationType.NewReport:
        return 'Report';
      case NotificationType.NewSeller:
        return 'Seller';
      case NotificationType.NewVerificationRequest:
        return 'Verification Request';
      default:
        return 'Unknown';
    }
  },

  // Helper function to get type color
  getTypeColor: (type: NotificationType): string => {
    switch (type) {
      case NotificationType.NewProduct:
        return 'blue';
      case NotificationType.NewPost:
        return 'purple';
      case NotificationType.OrderReady:
        return 'green';
      case NotificationType.NewOrder:
        return 'purple';
      case NotificationType.OrderCancelled:
        return 'red';
      case NotificationType.NewReport:
        return 'red';
      case NotificationType.NewSeller:
        return 'green';
      case NotificationType.NewVerificationRequest:
        return 'blue';
      default:
        return 'gray';
    }
  },
}; 