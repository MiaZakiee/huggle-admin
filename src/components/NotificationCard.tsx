import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCheck, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export type NotificationType = "NewSeller" | "NewReport";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  relatedEntityId: string;
}

interface NotificationCardProps {
  notification: Notification;
  onClose: () => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onClose,
}) => {
  const navigate = useNavigate();

  const handleGoTo = () => {
    if (notification.type === "NewSeller") {
      navigate("/sellers", {
        state: { highlightId: notification.relatedEntityId },
      });
    } else if (notification.type === "NewReport") {
      navigate("/reports", {
        state: { highlightId: notification.relatedEntityId },
      });
    }
    onClose();
  };

  return (
    <div
      className={`flex items-center gap-4 rounded-lg border p-4 bg-card ${
        !notification.isRead ? "border-primary" : ""
      }`}
    >
      <div>
        {notification.type === "NewSeller" ? (
          <UserCheck className="h-6 w-6 text-primary" />
        ) : (
          <AlertCircle className="h-6 w-6 text-destructive" />
        )}
      </div>
      <div className="flex-1">
        <div className="font-semibold">{notification.title}</div>
        <div className="text-sm text-muted-foreground">
          {notification.message}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {new Date(notification.createdAt).toLocaleString()}
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        {!notification.isRead && <Badge variant="secondary">New</Badge>}
        <Button size="sm" onClick={handleGoTo}>
          Go to
        </Button>
      </div>
    </div>
  );
};
