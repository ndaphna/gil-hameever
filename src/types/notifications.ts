export interface NotificationSettings {
  id: string;
  userId: string;
  type: 'reminder' | 'insight' | 'encouragement' | 'warning';
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string; // HH:MM format
  channels: ('email' | 'whatsapp' | 'push')[];
  content: {
    title: string;
    message: string;
    actionText?: string;
    actionUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface NotificationTemplate {
  id: string;
  type: 'reminder' | 'insight' | 'encouragement' | 'warning';
  title: string;
  message: string;
  category: string;
  triggers: string[]; // conditions that trigger this notification
  priority: 'low' | 'medium' | 'high';
}

export interface ScheduledNotification {
  id: string;
  userId: string;
  templateId: string;
  scheduledFor: string;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  channel: 'email' | 'whatsapp' | 'push';
  content: {
    title: string;
    message: string;
    actionText?: string;
    actionUrl?: string;
  };
  sentAt?: string;
  createdAt: string;
}

export interface NotificationPreferences {
  userId: string;
  email: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
    newsletter_interval_days?: number; // Days between personal newsletters (default: 4)
  };
  whatsapp: {
    enabled: boolean;
    phoneNumber?: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
  };
  push: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
  };
  categories: {
    reminders: boolean;
    insights: boolean;
    encouragements: boolean;
    warnings: boolean;
  };
  updatedAt: string;
}

export interface NotificationHistory {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  channel: string;
  status: 'sent' | 'failed' | 'delivered' | 'read';
  sentAt: string;
  readAt?: string;
  deliveredAt?: string;
}
