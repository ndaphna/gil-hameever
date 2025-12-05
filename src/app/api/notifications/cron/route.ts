import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { SmartNotificationService } from '@/lib/smart-notification-service';
import { createInsightEmail, calculateUserStatistics } from '@/lib/email-templates';

// שינוי ל-nodejs runtime כדי לתמוך ב-fetch פנימי
export const runtime = 'nodejs';

/**
 * Cron endpoint לבדיקה ושליחת התראות
 * צריך להיות מוגדר ב-Vercel Cron או שירות אחר
 * 
 * Vercel Cron example (vercel.json):
 * {
 *   "crons": [{
 *     "path": "/api/notifications/cron",
 *     "schedule": "0 * * * *"  // כל שעה בדקה 0
 *   }]
 * }
 */
export async function GET(request: Request) {
  try {
    // בדוק API key (אבטחה)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // קרא ישירות לפונקציה של מתזמן הניוזלטר
    // זה בודק את ההעדפות של כל משתמשת ושולח ניוזלטרים לפי התדירות והשעה שבחרה
    const result = await processNewsletterScheduler();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...result
    });
  } catch (error: any) {
    console.error('Cron error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

/**
 * עיבוד הניוזלטר לפי העדפות כל משתמשת
 * (העתק מהקובץ newsletter-scheduler/route.ts)
 */
async function processNewsletterScheduler() {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentDayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const currentDayOfMonth = now.getDate();

  // קבל כל המשתמשות עם העדפות התראות
  const { data: preferences, error: prefError } = await supabaseAdmin
    .from('notification_preferences')
    .select(`
      user_id,
      email,
      updated_at
    `);

  if (prefError) {
    console.error('Error fetching preferences:', prefError);
    return {
      processed: 0,
      sent: 0,
      skipped: 0,
      errors: [prefError.message]
    };
  }

  if (!preferences || preferences.length === 0) {
    return {
      processed: 0,
      sent: 0,
      skipped: 0,
      message: 'No users with notification preferences found'
    };
  }

  let sent = 0;
  let skipped = 0;
  const errors: any[] = [];
  const results: any[] = [];

  // עבד כל משתמשת
  for (const pref of preferences) {
    try {
      const emailPrefs = pref.email as {
        enabled: boolean;
        frequency: 'daily' | 'weekly' | 'monthly';
        time: string; // HH:MM format
      };

      console.log(`📧 Processing user ${pref.user_id}:`, {
        enabled: emailPrefs?.enabled,
        frequency: emailPrefs?.frequency,
        time: emailPrefs?.time,
        currentHour,
        currentMinute,
        currentDayOfWeek,
        currentDayOfMonth
      });

      // בדוק אם אימייל מופעל
      if (!emailPrefs?.enabled) {
        console.log(`⏭️ Skipping user ${pref.user_id}: email not enabled`);
        skipped++;
        results.push({
          userId: pref.user_id,
          status: 'skipped',
          reason: 'Email not enabled'
        });
        continue;
      }

      // בדוק אם הגיע הזמן לשלוח לפי השעה
      // ה-cron רץ בתחילת כל שעה (דקה 0)
      // נשלח ניוזלטר אם השעה המועדפת היא בשעה הנוכחית
      
      // תיקון פורמט השעה (אם יש "20:1" נהפוך ל-"20:01")
      let timeStr = emailPrefs.time;
      if (!timeStr.includes(':')) {
        console.warn(`⚠️ Invalid time format for user ${pref.user_id}: ${timeStr}`);
        skipped++;
        results.push({
          userId: pref.user_id,
          status: 'skipped',
          reason: `Invalid time format: ${timeStr}`
        });
        continue;
      }
      
      const [prefHour, prefMinute] = timeStr.split(':').map(Number);
      
      // בדוק שהשעה תקינה
      if (isNaN(prefHour) || isNaN(prefMinute) || prefHour < 0 || prefHour > 23 || prefMinute < 0 || prefMinute > 59) {
        console.warn(`⚠️ Invalid time values for user ${pref.user_id}: ${timeStr} (hour: ${prefHour}, minute: ${prefMinute})`);
        skipped++;
        results.push({
          userId: pref.user_id,
          status: 'skipped',
          reason: `Invalid time values: ${timeStr}`
        });
        continue;
      }
      
      // בדוק אם השעה המועדפת היא בשעה הנוכחית
      const isCurrentHour = prefHour === currentHour;
      
      // אם השעה לא תואמת, דלג
      if (!isCurrentHour) {
        console.log(`⏭️ Skipping user ${pref.user_id}: hour mismatch (preferred: ${prefHour}:${prefMinute}, current: ${currentHour}:${currentMinute})`);
        skipped++;
        results.push({
          userId: pref.user_id,
          status: 'skipped',
          reason: `Hour mismatch (preferred: ${prefHour}:${prefMinute}, current: ${currentHour}:${currentMinute})`
        });
        continue;
      }
      
      // אם השעה תואמת אבל הדקה המועדפת גדולה מ-0, נשלח רק אם אנחנו בדקה 0
      // (כי ה-cron רץ בדקה 0 של כל שעה)
      if (prefMinute > 0 && currentMinute !== 0) {
        console.log(`⏭️ Skipping user ${pref.user_id}: minute mismatch (preferred: ${prefMinute}, current: ${currentMinute})`);
        skipped++;
        results.push({
          userId: pref.user_id,
          status: 'skipped',
          reason: `Minute mismatch (preferred: ${prefMinute}, current: ${currentMinute})`
        });
        continue;
      }

      // בדוק אם הגיע הזמן לפי התדירות
      const shouldSendByFrequency = await checkFrequency(
        pref.user_id,
        emailPrefs.frequency,
        currentDayOfWeek,
        currentDayOfMonth
      );

      if (!shouldSendByFrequency) {
        console.log(`⏭️ Skipping user ${pref.user_id}: frequency check failed (frequency: ${emailPrefs.frequency}, dayOfWeek: ${currentDayOfWeek}, dayOfMonth: ${currentDayOfMonth})`);
        skipped++;
        results.push({
          userId: pref.user_id,
          status: 'skipped',
          reason: `Frequency check failed (${emailPrefs.frequency}, day ${currentDayOfWeek}, month day ${currentDayOfMonth})`
        });
        continue;
      }

      // בדוק מתי נשלח הניוזלטר האחרון (כדי לא לשלוח יותר מדי)
      const { data: lastNotification } = await supabaseAdmin
        .from('notification_history')
        .select('sent_at')
        .eq('user_id', pref.user_id)
        .eq('channel', 'email')
        .order('sent_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (lastNotification?.sent_at) {
        const lastSent = new Date(lastNotification.sent_at);
        const hoursSinceLastSent = (now.getTime() - lastSent.getTime()) / (1000 * 60 * 60);
        
        // לא נשלח יותר מפעם ב-23 שעות (אפילו אם התדירות היא יומית)
        if (hoursSinceLastSent < 23) {
          console.log(`⏭️ Skipping user ${pref.user_id}: sent recently (${hoursSinceLastSent.toFixed(2)} hours ago)`);
          skipped++;
          results.push({
            userId: pref.user_id,
            status: 'skipped',
            reason: `Sent recently (${hoursSinceLastSent.toFixed(2)} hours ago)`
          });
          continue;
        }
      }

      // כל התנאים מתקיימים - שלח ניוזלטר!
      console.log(`✅ All checks passed for user ${pref.user_id}, sending newsletter...`);
      const sendResult = await sendNewsletterToUser(pref.user_id);
      
      if (sendResult.sent) {
        sent++;
        results.push({
          userId: pref.user_id,
          status: 'sent',
          frequency: emailPrefs.frequency,
          time: emailPrefs.time
        });
        console.log(`✅ Newsletter sent successfully to user ${pref.user_id}`);
      } else {
        skipped++;
        results.push({
          userId: pref.user_id,
          status: 'skipped',
          reason: sendResult.reason
        });
        console.log(`❌ Newsletter sending failed for user ${pref.user_id}: ${sendResult.reason}`);
      }
    } catch (error: any) {
      console.error(`❌ Error processing user ${pref.user_id}:`, error);
      errors.push({ userId: pref.user_id, error: error.message });
      skipped++;
      results.push({
        userId: pref.user_id,
        status: 'error',
        reason: error.message
      });
    }
  }

  console.log(`📊 Newsletter scheduler summary:`, {
    processed: preferences.length,
    sent,
    skipped,
    errors: errors.length
  });

  return {
    processed: preferences.length,
    sent,
    skipped,
    errors: errors.length > 0 ? errors : undefined,
    results: results // החזר את כל התוצאות עם הסיבות
  };
}

/**
 * בודק אם צריך לשלוח לפי התדירות
 */
async function checkFrequency(
  userId: string,
  frequency: 'daily' | 'weekly' | 'monthly',
  currentDayOfWeek: number,
  currentDayOfMonth: number
): Promise<boolean> {
  if (frequency === 'daily') {
    return true; // כל יום
  }

  if (frequency === 'weekly') {
    // כל יום שני (1 = Monday)
    return currentDayOfWeek === 1;
  }

  if (frequency === 'monthly') {
    // ביום הראשון של החודש
    return currentDayOfMonth === 1;
  }

  return false;
}

/**
 * שולח ניוזלטר למשתמשת ספציפית
 */
async function sendNewsletterToUser(userId: string): Promise<{ sent: boolean; reason?: string }> {
  try {
    // קבל פרטי משתמש
    const { data: profile } = await supabaseAdmin
      .from('user_profile')
      .select('id, email, subscription_status, first_name, name, full_name')
      .eq('id', userId)
      .single();

    if (!profile) {
      return { sent: false, reason: 'User not found' };
    }

    // בדוק אם המשתמשת מנויה
    if (profile.subscription_status !== 'active') {
      return { sent: false, reason: 'User not subscribed' };
    }

    // בדוק אם צריך לשלוח התראה
    const notificationService = new SmartNotificationService();
    const decision = await notificationService.shouldSendNotification(userId);

    // אם אין insight, ניצור insight כללי לניוזלטר היומי
    let insight = decision.insight;
    let userData = decision.userData;

    if (!insight || !decision.shouldSend) {
      // קבל נתונים למקרה שאין insight
      if (!userData) {
        const { data: dailyEntries } = await supabaseAdmin
          .from('daily_entries')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false })
          .limit(30);
        
        const { data: cycleEntries } = await supabaseAdmin
          .from('cycle_entries')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false })
          .limit(10);

        userData = {
          dailyEntries: dailyEntries || [],
          cycleEntries: cycleEntries || [],
          lastEntryDate: dailyEntries?.[0]?.date || null,
          daysSinceLastEntry: dailyEntries?.[0]?.date 
            ? Math.floor((Date.now() - new Date(dailyEntries[0].date).getTime()) / (1000 * 60 * 60 * 24))
            : 999
        };
      }

      // יצירת insight כללי לניוזלטר היומי
      insight = {
        type: 'encouragement',
        priority: 'medium',
        title: 'הניוזלטר היומי שלך 🌸',
        message: userData.dailyEntries.length > 0
          ? `שלום ${profile.first_name || profile.name?.split(' ')[0] || profile.full_name?.split(' ')[0] || 'יקרה'}! הנה הניוזלטר היומי שלך עם תובנות, טיפים ומשאבים שיעזרו לך במסע שלך. אני כאן בשבילך!`
          : `שלום ${profile.first_name || profile.name?.split(' ')[0] || profile.full_name?.split(' ')[0] || 'יקרה'}! בואי נתחיל את המסע שלך יחד. הניוזלטר הזה יכלול טיפים, משאבים ותובנות שיעזרו לך להבין טוב יותר את הגוף שלך ואת מה שעובר עלייך.`,
        actionUrl: '/journal?tab=daily'
      };
    }

    // חישוב סטטיסטיקות מהנתונים
    let statistics = undefined;
    if (userData) {
      statistics = calculateUserStatistics(
        userData.dailyEntries,
        userData.cycleEntries
      );
    }

    // יצירת תבנית המייל - use first_name only for display
    const userName = profile.first_name || profile.name?.split(' ')[0] || profile.full_name?.split(' ')[0] || profile.email?.split('@')[0] || 'יקרה';
    const emailTemplate = createInsightEmail(
      userName,
      insight,
      statistics
    );

    // שליחת המייל
    const emailSent = await sendEmail(
      profile.email!,
      emailTemplate.subject,
      emailTemplate.html,
      emailTemplate.text
    );

    if (emailSent) {
      // שמירה בהיסטוריה
      await notificationService.saveNotificationHistory(userId, insight, 'sent');
      
      return { sent: true };
    } else {
      await notificationService.saveNotificationHistory(userId, insight, 'failed');
      return { sent: false, reason: 'Email sending failed' };
    }
  } catch (error: any) {
    console.error('Error sending newsletter to user:', error);
    return { sent: false, reason: error.message };
  }
}

/**
 * שליחת מייל באמצעות Brevo (לשעבר Sendinblue)
 * אפשר גם להשתמש ב: SendGrid, AWS SES, Resend
 */
async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<boolean> {
  try {
    // Brevo (Sendinblue) - מומלץ!
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    if (BREVO_API_KEY) {
      const fromEmail = process.env.BREVO_FROM_EMAIL || 'noreply@gilhameever.com';
      const fromName = process.env.BREVO_FROM_NAME || 'עליזה - מנופאוזית וטוב לה';
      
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: {
            name: fromName,
            email: fromEmail
          },
          to: [{ email: to }],
          subject: subject,
          htmlContent: html,
          textContent: text,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Brevo API error:', error);
        return false;
      }

      const result = await response.json();
      console.log('✅ Newsletter sent via Brevo:', result);
      return true;
    }

    // Resend (אלטרנטיבה)
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (RESEND_API_KEY) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'עליזה <noreply@gilhameever.com>',
          to: [to],
          subject: subject,
          html: html,
          text: text,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Resend API error:', error);
        return false;
      }

      return response.ok;
    }

    // SendGrid (אלטרנטיבה)
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    if (SENDGRID_API_KEY) {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: 'noreply@gilhameever.com', name: 'עליזה' },
          subject: subject,
          content: [
            { type: 'text/plain', value: text },
            { type: 'text/html', value: html }
          ],
        }),
      });

      return response.ok;
    }

    // אם אין שירות מוגדר - לוג למטרות פיתוח
    console.log('📧 Newsletter would be sent (no service configured):', {
      to,
      subject,
      htmlLength: html.length,
      textLength: text.length
    });
    console.warn('⚠️ No email service configured. Please set BREVO_API_KEY, RESEND_API_KEY, or SENDGRID_API_KEY');

    // במצב פיתוח, נחזיר true כדי לבדוק את הלוגיקה
    return process.env.NODE_ENV === 'development';
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

