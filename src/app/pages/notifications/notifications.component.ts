import { Component, OnInit } from '@angular/core';
import { ApplicantService } from 'src/app/modules/applicant/services/applicant.service';

interface Notification {
  id: number;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  isLoading = true;
  notifications: Notification[] = [];

  constructor(private api: ApplicantService) {
    document.title = 'BPLS | Notifications';
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.api.getSystemNotification().subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.notifications = response.data || [];
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Error fetching notifications:', err);
      }
    });
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
}
