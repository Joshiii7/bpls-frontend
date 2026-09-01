import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApplicantService } from 'src/app/modules/applicant/services/applicant.service';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  is_read: boolean;
  created_at?: string;
}

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {
  isOpen = false;
  isLoading = true;
  notifications: Notification[] = [];
  private pollHandle: any;

  constructor(private api: ApplicantService) {}

  ngOnInit(): void {
    this.loadNotifications();
    this.pollHandle = setInterval(() => {
      this.loadNotifications();
    }, 5000);
  }

  ngOnDestroy(): void {
    clearInterval(this.pollHandle);
  }

  loadNotifications(): void {
    this.api.getSystemNotification().subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.notifications = (response.data || []).map((notif: any) => ({
          id: notif.id,
          title: notif.title,
          message: notif.message,
          time: this.formatTime(notif.created_at),
          is_read: notif.is_read,
          created_at: notif.created_at
        }));
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Error fetching notifications:', err);
      }
    });
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  markAllAsRead(): void {
    const previous = this.notifications;
    this.notifications = this.notifications.map(n => ({ ...n, is_read: true }));
    this.api.markAllNotificationsRead().subscribe({
      error: (err: any) => {
        console.error('Error marking notifications as read:', err);
        this.notifications = previous;
      }
    });
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.is_read).length;
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
