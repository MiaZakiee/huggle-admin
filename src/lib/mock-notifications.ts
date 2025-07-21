import { Notification } from "@/components/NotificationCard";

export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    type: "NewSeller",
    title: "New Seller Verification Request",
    message: "John Doe has submitted documents for verification.",
    createdAt: "2025-07-19T14:30:00Z",
    isRead: false,
    relatedEntityId: "seller-123",
  },
  {
    id: "notif-2",
    type: "NewReport",
    title: "New Report Created",
    message: "A user has reported inappropriate content.",
    createdAt: "2025-07-20T09:15:00Z",
    isRead: false,
    relatedEntityId: "report-456",
  },
  {
    id: "notif-3",
    type: "NewSeller",
    title: "New Seller Verification Request",
    message: "Jane Smith has submitted documents for verification.",
    createdAt: "2025-07-18T11:00:00Z",
    isRead: true,
    relatedEntityId: "seller-789",
  },
];
