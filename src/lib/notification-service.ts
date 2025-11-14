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

    // המרה מ-camelCase ל-snake_case עבור המסד נתונים
    const notification = {
      user_id: this.userId,
      template_id: templateId,
      scheduled_for: scheduledFor,
      status: 'pending',
      channel,
      content: customContent || {
        title: template.title,
        message: template.message
      },
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('scheduled_notifications')
      .insert(notification)
      .select()
      .single();

    if (error) throw error;
    
    // המרה מ-snake_case ל-camelCase עבור ה-TypeScript
    return {
      id: data.id,
      userId: data.user_id,
      templateId: data.template_id,
      scheduledFor: data.scheduled_for,
      status: data.status,
      channel: data.channel,
      content: data.content,
      sentAt: data.sent_at,
      createdAt: data.created_at
    };
  }

  // שליחת התראה מיידית
  async sendImmediateNotification(
    type: 'reminder' | 'insight' | 'encouragement' | 'warning',
    title: string,
    message: string,
    channel: 'email' | 'whatsapp' | 'push' = 'push'
  ): Promise<void> {
    try {
      let status: 'sent' | 'failed' = 'sent';

      // שליחת התראה בדפדפן (Browser Notification API)
      if (channel === 'push' && typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification(title, {
            body: message,
            icon: '/favicon.png',
            badge: '/favicon.png',
            tag: `notification-${Date.now()}`,
            requireInteraction: false
          });
        } else if (Notification.permission !== 'denied') {
          // נסה לבקש הרשאה
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            new Notification(title, {
              body: message,
              icon: '/favicon.png',
              badge: '/favicon.png',
              tag: `notification-${Date.now()}`
            });
          }
        }
      }

      // אם ה-channel הוא email, שלח מייל דרך API
      if (channel === 'email') {
        try {
          const response = await fetch('/api/notifications/send-test-notification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: this.userId,
              type,
              title,
              message,
              channel: 'email'
            }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Failed to send email:', errorData);
            status = 'failed';
            throw new Error(`Email sending failed: ${errorData.error || response.statusText}`);
          }

          const result = await response.json();
          console.log('✅ Email sent successfully:', result);
        } catch (emailError) {
          console.error('Error sending email:', emailError);
          status = 'failed';
          throw emailError;
        }
      }

      // שמירה בהיסטוריה
      await this.saveNotificationHistory({
        type,
        title,
        message,
        channel,
        status
      });
    } catch (error) {
      console.error('Error sending immediate notification:', error);
      // גם אם יש שגיאה, ננסה לשמור בהיסטוריה
      try {
        await this.saveNotificationHistory({
          type,
          title,
          message,
          channel,
          status: 'failed'
        });
      } catch (historyError) {
        console.error('Error saving notification history:', historyError);
      }
      throw error;
    }
  }

  // שמירת היסטוריית התראות
  async saveNotificationHistory(notification: {
    type: string;
    title: string;
    message: string;
    channel: string;
    status: 'sent' | 'failed' | 'delivered' | 'read';
  }): Promise<void> {
    // בדוק שהמשתמש מחובר
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('User not authenticated');
    }

    // השתמש ב-session user ID כדי לעמוד ב-RLS policy
    // המרה מ-camelCase ל-snake_case עבור המסד נתונים
    const historyEntry = {
      user_id: session.user.id, // חשוב: השתמש ב-session user ID ל-RLS
      type: notification.type,
      title: notification.title,
      message: notification.message,
      channel: notification.channel,
      status: notification.status,
      sent_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('notification_history')
      .insert(historyEntry);

    if (error) {
      console.error('Error saving notification history:', error);
      throw error;
    }
  }

  // קבלת העדפות המשתמש
  async getNotificationPreferences(): Promise<NotificationPreferences | null> {
    try {
      // בדוק שהמשתמש מחובר
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (!session || sessionError) {
        console.warn('⚠️ User not authenticated, cannot fetch notification preferences');
        return null;
      }

      // ודא שה-userId תואם למשתמש המחובר (נדרש ל-RLS)
      if (session.user.id !== this.userId) {
        console.warn(`⚠️ User ID mismatch: session user (${session.user.id}) vs requested (${this.userId})`);
        // נשתמש ב-session user ID כדי לעמוד ב-RLS policy
      }

      // חשוב: אל תסנן לפי user_id! RLS policy כבר מסננת אוטומטית לפי auth.uid()
      // אם נסנן גם אנחנו, זה יכול לגרום ל-406 error
      // RLS policy: auth.uid() = user_id כבר מבטיח שאנחנו רואים רק את השורות שלנו
      // משתמשים ב-.maybeSingle() במקום .single() כדי להימנע מ-406 כשאין שורה
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .maybeSingle();

      // טיפול בשגיאות
      if (error) {
        // PGRST205 = table not found - הטבלה לא קיימת
        if (error.code === 'PGRST205') {
          console.warn('⚠️ notification_preferences table does not exist. Please run CREATE_NOTIFICATION_TABLES.sql in Supabase SQL Editor.');
          return null;
        }
        // 406 = Not Acceptable - יכול להיות בעיית RLS, headers, או בעיה עם .single()
        if (error.status === 406 || error.code === 'PGRST406' || error.message?.includes('406')) {
          console.warn('⚠️ 406 Not Acceptable error. This might be due to RLS policies, missing Accept header, or no rows exist.');
          // אם אין שורה למשתמש, זה בסדר - נחזיר null
          return null;
        }
        // שגיאות אחרות
        console.error('Error loading notification preferences:', error);
        return null; // במקום throw, נחזיר null כדי לא לשבור את האפליקציה
      }
      
      // אם אין נתונים, נחזיר null
      if (!data) return null;
      
      // המרה מ-snake_case ל-camelCase עבור ה-TypeScript
      return {
        userId: data.user_id,
        email: data.email,
        whatsapp: data.whatsapp,
        push: data.push,
        categories: data.categories,
        updatedAt: data.updated_at || new Date().toISOString()
      };
    } catch (err: any) {
      console.error('Unexpected error loading notification preferences:', err);
      return null; // נחזיר null במקום לזרוק שגיאה
    }
  }

  // עדכון העדפות המשתמש
  async updateNotificationPreferences(preferences: Partial<NotificationPreferences>): Promise<void> {
    // בדוק שהמשתמש מחובר
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('User not authenticated');
    }

    // השתמש ב-session user ID כדי לעמוד ב-RLS policy
    // המרה מ-camelCase ל-snake_case עבור המסד נתונים
    const dbPreferences: any = {
      user_id: session.user.id, // חשוב: השתמש ב-session user ID ל-RLS
      updated_at: new Date().toISOString()
    };

    if (preferences.email) dbPreferences.email = preferences.email;
    if (preferences.whatsapp) dbPreferences.whatsapp = preferences.whatsapp;
    if (preferences.push) dbPreferences.push = preferences.push;
    if (preferences.categories) dbPreferences.categories = preferences.categories;

    // השתמש ב-upsert עם onConflict כדי לעדכן שורה קיימת או ליצור חדשה
    // user_id הוא UNIQUE, אז אם יש כבר שורה - נעדכן אותה
    const { error } = await supabase
      .from('notification_preferences')
      .upsert(dbPreferences, {
        onConflict: 'user_id' // אם יש כבר שורה עם אותו user_id, נעדכן אותה
      });

    if (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  }

  // קבלת היסטוריית התראות
  async getNotificationHistory(limit: number = 50): Promise<NotificationHistory[]> {
    // RLS policy כבר מסננת לפי auth.uid() = user_id, אז אין צורך לסנן ידנית
    const { data, error } = await supabase
      .from('notification_history')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    // המרה מ-snake_case ל-camelCase עבור ה-TypeScript
    return (data || []).map(item => ({
      id: item.id,
      userId: item.user_id,
      type: item.type,
      title: item.title,
      message: item.message,
      channel: item.channel,
      status: item.status,
      sentAt: item.sent_at,
      readAt: item.read_at,
      deliveredAt: item.delivered_at
    }));
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
