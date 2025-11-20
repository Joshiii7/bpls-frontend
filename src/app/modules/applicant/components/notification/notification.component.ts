import { Component } from '@angular/core';
import { ApplicantService } from '../../services/applicant.service';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  created_at?: string;
}

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {
  isOpen = false;
  notifications: Notification[] = [];

  constructor(private api: ApplicantService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.api.getSystemNotification().subscribe({
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

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  markAllAsRead(): void {
    this.notifications = this.notifications.map(n => ({ ...n, is_read: true }));
    // Optional: send a request to backend to mark all as read
    // this.apiService.markAllNotificationsAsRead().subscribe();
  }

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
