import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: { title: string, message: string, date: Date }[] = [];

  getNotifications() {
    return this.notifications;
  }

  addNotification(title: string, message: string) {
    this.notifications.push({ title, message, date: new Date() });
  }

  removeNotification(notification: any) {
    this.notifications = this.notifications.filter(n => n !== notification);
  }

  clearAll() {
    this.notifications = [];
  }
}
