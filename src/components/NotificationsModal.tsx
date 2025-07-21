import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NotificationCard } from "./NotificationCard";
import { Notification } from "./NotificationCard";

interface NotificationsModalProps {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  open,
  onClose,
  notifications,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No new notifications.
            </div>
          ) : (
            notifications.map((notif) => (
              <NotificationCard
                key={notif.id}
                notification={notif}
                onClose={onClose}
              />
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
