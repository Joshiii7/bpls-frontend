import { Component, OnInit } from '@angular/core';
import { ApiServicesService } from 'src/app/api-services.service';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  created_at?: string;
}

@Component({
  selector: 'app-notification-dropdown',
  templateUrl: './notification-dropdown.component.html',
  styleUrls: ['./notification-dropdown.component.css']
})
export class NotificationDropdownComponent implements OnInit {
  isOpen = false;
  notifications: Notification[] = [];

  constructor(private apiService: ApiServicesService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  // ✅ Fetch notifications for the authenticated user
  loadNotifications(): void {
    this.apiService.getSystemNotification().subscribe({
      next: (response: any) => {
        this.notifications = response.data.map((notif: any) => ({
          id: notif.id,
          title: notif.title,
          message: notif.message,
          time: this.formatTime(notif.created_at),
          is_read: notif.is_read
        }));
      },
      error: (err: any) => {
        console.error('Error fetching notifications:', err);
      }
    });
  }

  // ✅ Toggles dropdown visibility
  toggleDropdown(): void {
      this.isOpen = !this.isOpen;
  }

  // ✅ Marks all notifications as read locally
  markAllAsRead(): void {
    this.notifications = this.notifications.map(n => ({ ...n, is_read: true }));
    // Optional: send a request to backend to mark all as read
    // this.apiService.markAllNotificationsAsRead().subscribe();
  }

  // Computed properties for unread count
  get unreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  get hasUnread(): boolean {
    return this.unreadCount > 0;
  }

    // Helper: convert created_at timestamp into readable format
  private formatTime(createdAt?: string): string {
    if (!createdAt) return '';
    const created = new Date(createdAt);
    const now = new Date();
    const diff = Math.floor((now.getTime() - created.getTime()) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }
}
