import { supabase } from './supabase';
import { 
  NotificationSettings, 
  NotificationTemplate, 
  ScheduledNotification, 
  NotificationPreferences,
  NotificationHistory 
} from '@/types/notifications';

export class NotificationService {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  // קבלת תבניות התראות מובנות
  getNotificationTemplates(): NotificationTemplate[] {
    return [
      {
        id: 'daily-reminder',
        type: 'reminder',
        title: 'זמן לעדכן את היומן שלך 🌸',
        message: 'היי! איך את מרגישה היום? בואי נעדכן את היומן יחד',
        category: 'journal',
        triggers: ['daily_reminder'],
        priority: 'medium'
      },
      {
        id: 'weekly-insight',
        type: 'insight',
        title: 'יש לי תובנה חדשה עבורך! 💡',
        message: 'ניתחתי את הנתונים שלך השבוע ויש לי כמה תובנות מעניינות לשתף',
        category: 'insights',
        triggers: ['weekly_analysis'],
        priority: 'high'
      },
      {
        id: 'symptom-warning',
        type: 'warning',
        title: 'זיהיתי דפוס שכדאי לשים לב אליו ⚠️',
        message: 'אני רואה שיש עלייה בתסמינים מסוימים. כדאי להתייעץ עם רופא',
        category: 'health',
        triggers: ['symptom_increase'],
        priority: 'high'
      },
      {
        id: 'encouragement',
        type: 'encouragement',
        title: 'את עושה עבודה נהדרת! 🌟',
        message: 'אני רואה שיש שיפור במצב שלך. המשכי כך!',
        category: 'motivation',
        triggers: ['improvement_detected'],
        priority: 'low'
      },
      {
        id: 'cycle-reminder',
        type: 'reminder',
        title: 'זמן לעדכן את מעקב המחזור 📅',
        message: 'בואי נעדכן את מעקב המחזור החודשי שלך',
        category: 'cycle',
        triggers: ['cycle_reminder'],
        priority: 'medium'
      },
      {
        id: 'wellness-tip',
        type: 'insight',
        title: 'טיפ בריאותי מיוחד עבורך 💪',
        message: 'יש לי טיפ שיכול לעזור לך להתמודד עם התסמינים',
        category: 'wellness',
        triggers: ['wellness_tip'],
        priority: 'medium'
      }
    ];
  }

  // יצירת התראה מתוזמנת
  async scheduleNotification(
    templateId: string,
    scheduledFor: string,
    channel: 'email' | 'whatsapp' | 'push',
    customContent?: { title: string; message: string }
  ): Promise<ScheduledNotification> {
    const template = this.getNotificationTemplates().find(t => t.id === templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    const notification: Omit<ScheduledNotification, 'id'> = {
      userId: this.userId,
      templateId,
      scheduledFor,
      status: 'pending',
      channel,
      content: customContent || {
        title: template.title,
        message: template.message
      },
      createdAt: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('scheduled_notifications')
      .insert(notification)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // שליחת התראה מיידית
  async sendImmediateNotification(
    type: 'reminder' | 'insight' | 'encouragement' | 'warning',
    title: string,
    message: string,
    channel: 'email' | 'whatsapp' | 'push' = 'push'
  ): Promise<void> {
    // כאן יהיה הקוד לשליחת התראה בפועל
    // לדוגמה: שליחה לווטסאפ, אימייל, או push notification
    
    // שמירה בהיסטוריה
    await this.saveNotificationHistory({
      type,
      title,
      message,
      channel,
      status: 'sent'
    });
  }

  // שמירת היסטוריית התראות
  async saveNotificationHistory(notification: {
    type: string;
    title: string;
    message: string;
    channel: string;
    status: 'sent' | 'failed' | 'delivered' | 'read';
  }): Promise<void> {
    const historyEntry: Omit<NotificationHistory, 'id'> = {
      userId: this.userId,
      ...notification,
      sentAt: new Date().toISOString()
    };

    const { error } = await supabase
      .from('notification_history')
      .insert(historyEntry);

    if (error) throw error;
  }

  // קבלת העדפות המשתמש
  async getNotificationPreferences(): Promise<NotificationPreferences | null> {
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', this.userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  // עדכון העדפות המשתמש
  async updateNotificationPreferences(preferences: Partial<NotificationPreferences>): Promise<void> {
    const { error } = await supabase
      .from('notification_preferences')
      .upsert({
        userId: this.userId,
        ...preferences,
        updatedAt: new Date().toISOString()
      });

    if (error) throw error;
  }

  // קבלת היסטוריית התראות
  async getNotificationHistory(limit: number = 50): Promise<NotificationHistory[]> {
    const { data, error } = await supabase
      .from('notification_history')
      .select('*')
      .eq('user_id', this.userId)
      .order('sent_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  // יצירת התראות אוטומטיות בהתבסס על נתונים
  async createAutomaticNotifications(): Promise<void> {
    // בדיקת תנאים ליצירת התראות אוטומטיות
    const conditions = await this.checkNotificationConditions();
    
    for (const condition of conditions) {
      if (condition.shouldNotify) {
        await this.scheduleNotification(
          condition.templateId,
          condition.scheduledFor,
          condition.channel,
          condition.customContent
        );
      }
    }
  }

  // בדיקת תנאים ליצירת התראות
  private async checkNotificationConditions(): Promise<{
    shouldNotify: boolean;
    templateId: string;
    scheduledFor: string;
    channel: 'email' | 'whatsapp' | 'push';
    customContent?: { title: string; message: string };
  }[]> {
    const conditions = [];

    // בדיקת תזכורת יומית
    const lastJournalEntry = await this.getLastJournalEntry();
    const hoursSinceLastEntry = lastJournalEntry 
      ? (Date.now() - new Date(lastJournalEntry.created_at).getTime()) / (1000 * 60 * 60)
      : 24;

    if (hoursSinceLastEntry > 24) {
      conditions.push({
        shouldNotify: true,
        templateId: 'daily-reminder',
        scheduledFor: new Date(Date.now() + 1000 * 60 * 30).toISOString(), // 30 דקות מעכשיו
        channel: 'push' as const
      });
    }

    // בדיקת ניתוח שבועי
    const lastWeeklyAnalysis = await this.getLastWeeklyAnalysis();
    const daysSinceLastAnalysis = lastWeeklyAnalysis 
      ? (Date.now() - new Date(lastWeeklyAnalysis).getTime()) / (1000 * 60 * 60 * 24)
      : 7;

    if (daysSinceLastAnalysis >= 7) {
      conditions.push({
        shouldNotify: true,
        templateId: 'weekly-insight',
        scheduledFor: new Date(Date.now() + 1000 * 60 * 60).toISOString(), // שעה מעכשיו
        channel: 'push' as const
      });
    }

    // בדיקת תסמינים מוגברים
    const symptomTrend = await this.getSymptomTrend();
    if (symptomTrend.isIncreasing) {
      conditions.push({
        shouldNotify: true,
        templateId: 'symptom-warning',
        scheduledFor: new Date(Date.now() + 1000 * 60 * 15).toISOString(), // 15 דקות מעכשיו
        channel: 'push' as const,
        customContent: {
          title: 'זיהיתי עלייה בתסמינים',
          message: `אני רואה שיש עלייה ב${symptomTrend.symptom}. כדאי להתייעץ עם רופא.`
        }
      });
    }

    return conditions;
  }

  // פונקציות עזר
  private async getLastJournalEntry(): Promise<any> {
    const { data } = await supabase
      .from('emotion_entry')
      .select('created_at')
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return data;
  }

  private async getLastWeeklyAnalysis(): Promise<string | null> {
    const { data } = await supabase
      .from('insight_analysis')
      .select('created_at')
      .eq('user_id', this.userId)
      .eq('type', 'weekly')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return data?.created_at || null;
  }

  private async getSymptomTrend(): Promise<{ isIncreasing: boolean; symptom: string }> {
    // כאן יהיה הקוד לניתוח מגמות תסמינים
    // כרגע מחזיר ערך דמה
    return {
      isIncreasing: Math.random() > 0.7,
      symptom: 'גלי חום'
    };
  }

  // שליחת הודעת ווטסאפ
  async sendWhatsAppMessage(phoneNumber: string, message: string): Promise<void> {
    // כאן יהיה הקוד לשליחת הודעת ווטסאפ
    // לדוגמה: שימוש ב-WhatsApp Business API
    console.log(`Sending WhatsApp to ${phoneNumber}: ${message}`);
  }

  // שליחת אימייל
  async sendEmail(email: string, subject: string, message: string): Promise<void> {
    // כאן יהיה הקוד לשליחת אימייל
    // לדוגמה: שימוש ב-SendGrid או AWS SES
    console.log(`Sending email to ${email}: ${subject} - ${message}`);
  }

  // שליחת Push Notification
  async sendPushNotification(userId: string, title: string, message: string): Promise<void> {
    // כאן יהיה הקוד לשליחת Push Notification
    // לדוגמה: שימוש ב-Firebase Cloud Messaging
    console.log(`Sending push to ${userId}: ${title} - ${message}`);
  }
}
