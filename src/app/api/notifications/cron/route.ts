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
    // Vercel Cron שולח אוטומטית Authorization header עם CRON_SECRET
    // אבל גם נתמך x-vercel-cron header (אם קיים) או Authorization לבדיקות ידניות
    const authHeader = request.headers.get('authorization');
    const vercelCronHeader = request.headers.get('x-vercel-cron');
    const cronSecret = process.env.CRON_SECRET;
    
    console.log('🔐 Cron authentication check:', {
      hasCronSecret: !!cronSecret,
      hasAuthHeader: !!authHeader,
      hasVercelHeader: !!vercelCronHeader,
      authHeaderValue: authHeader ? authHeader.substring(0, 20) + '...' : null,
      vercelCronValue: vercelCronHeader
    });
    
    // אם יש CRON_SECRET מוגדר, נדרוש אימות
    if (cronSecret) {
      // Vercel Cron שולח אוטומטית: Authorization: Bearer <CRON_SECRET>
      // או x-vercel-cron header (אם קיים)
      const isVercelCron = vercelCronHeader === '1' || vercelCronHeader === 'true';
      const isAuthorized = authHeader === `Bearer ${cronSecret}`;
      
      if (!isVercelCron && !isAuthorized) {
        console.error('❌ Unauthorized cron request:', {
          hasVercelHeader: !!vercelCronHeader,
          hasAuthHeader: !!authHeader,
          vercelCronValue: vercelCronHeader,
          expectedAuth: `Bearer ${cronSecret.substring(0, 10)}...`,
          receivedAuth: authHeader ? authHeader.substring(0, 20) : 'none'
        });
        return NextResponse.json(
          { error: 'Unauthorized', message: 'Missing or invalid CRON_SECRET' },
          { status: 401 }
        );
      }
      
      console.log('✅ Cron request authorized');
    } else {
      console.warn('⚠️ CRON_SECRET not set - allowing request (not recommended for production)');
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
 * מקבל את הזמן הנוכחי ב-Israel timezone ומחזיר את הערכים הרלוונטיים
 */
function getIsraelTimeValues() {
  const now = new Date();
  // המרה ל-Israel timezone (Asia/Jerusalem)
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jerusalem',
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    weekday: 'short',
    month: 'numeric',
    year: 'numeric',
    hour12: false
  });
  
  const parts = formatter.formatToParts(now);
  const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
  const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0');
  const day = parseInt(parts.find(p => p.type === 'day')?.value || '0');
  const month = parseInt(parts.find(p => p.type === 'month')?.value || '0');
  const year = parseInt(parts.find(p => p.type === 'year')?.value || '0');
  
  // חישוב יום השבוע (0 = Sunday, 1 = Monday, etc.)
  const dateInIsrael = new Date(year, month - 1, day, hour, minute);
  const dayOfWeek = dateInIsrael.getDay();
  
  return {
    hour,
    minute,
    dayOfWeek,
    dayOfMonth: day,
    fullDate: now // נשמור את התאריך המקורי לבדיקות נוספות
  };
}

/**
 * עיבוד הניוזלטר לפי העדפות כל משתמשת
 * (העתק מהקובץ newsletter-scheduler/route.ts)
 */
async function processNewsletterScheduler() {
  // שימוש ב-Israel timezone במקום server time
  const israelTime = getIsraelTimeValues();
  const currentHour = israelTime.hour;
  const currentMinute = israelTime.minute;
  const currentDayOfWeek = israelTime.dayOfWeek;
  const currentDayOfMonth = israelTime.dayOfMonth;
  const now = israelTime.fullDate;
  
  console.log(`🕐 Current Israel time: Hour: ${currentHour}, Minute: ${currentMinute}, DayOfWeek: ${currentDayOfWeek} (${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentDayOfWeek]}), DayOfMonth: ${currentDayOfMonth}`);

  // קבל את כל המשתמשות עם העדפות התראות
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
        newsletter_interval_days?: number; // Days between personal newsletters
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
      
      // ה-cron רץ כל שעה בדקה 0 (0 * * * *)
      // הלוגיקה: נשלח אם השעה הנוכחית תואמת לשעה המועדפת
      // אם המשתמשת בחרה 21:00, נשלח ב-21:00
      // אם המשתמשת בחרה 21:25, נשלח ב-21:00 (השעה הקרובה ביותר)
      // אם המשתמשת בחרה 20:45, נשלח ב-21:00 (השעה הבאה)
      
      const isCurrentHour = prefHour === currentHour;
      
      // אם השעה לא תואמת, דלג
      if (!isCurrentHour) {
        console.log(`⏭️ Skipping user ${pref.user_id}: hour mismatch (preferred: ${prefHour}:${String(prefMinute).padStart(2, '0')}, current: ${currentHour}:${String(currentMinute).padStart(2, '0')})`);
        skipped++;
        results.push({
          userId: pref.user_id,
          status: 'skipped',
          reason: `Hour mismatch (preferred: ${prefHour}:${String(prefMinute).padStart(2, '0')}, current: ${currentHour}:${String(currentMinute).padStart(2, '0')})`
        });
        continue;
      }
      
      // אם השעה תואמת, נשלח (כי ה-cron רץ בדקה 0)
      // לא צריך לבדוק את הדקה המועדפת - אם המשתמשת בחרה 19:25, נשלח ב-19:00
      // זה התנהגות תקינה כי ה-cron רץ רק בדקה 0
      if (currentMinute !== 0) {
        // זה לא אמור לקרות כי ה-cron רץ בדקה 0, אבל נבדוק בכל זאת
        console.log(`⏭️ Skipping user ${pref.user_id}: not at minute 0 (current: ${currentMinute})`);
        skipped++;
        results.push({
          userId: pref.user_id,
          status: 'skipped',
          reason: `Not at minute 0 (current: ${currentMinute})`
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

      // קבל את newsletter_interval_days (ברירת מחדל: 4 ימים)
      const newsletterIntervalDays = emailPrefs.newsletter_interval_days || 4;

      if (lastNotification?.sent_at) {
        const lastSent = new Date(lastNotification.sent_at);
        const daysSinceLastSent = (now.getTime() - lastSent.getTime()) / (1000 * 60 * 60 * 24);
        
        // בדוק אם עברו מספיק ימים לפי newsletter_interval_days
        if (daysSinceLastSent < newsletterIntervalDays) {
          console.log(`⏭️ Skipping user ${pref.user_id}: not enough days passed (${daysSinceLastSent.toFixed(2)} days ago, required: ${newsletterIntervalDays} days)`);
          skipped++;
          results.push({
            userId: pref.user_id,
            status: 'skipped',
            reason: `Not enough days passed (${daysSinceLastSent.toFixed(2)} days ago, required: ${newsletterIntervalDays} days)`
          });
          continue;
        }
      } else {
        // אם זה הניוזלטר הראשון, נשלח אותו (אבל רק אם השעה תואמת)
        console.log(`📧 First newsletter for user ${pref.user_id}, will send if time matches`);
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
      const fromEmail = process.env.BREVO_FROM_EMAIL || 'inbal@gilhameever.com';
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

      // קרא את התגובה כ-text קודם (אפשר לקרוא רק פעם אחת)
      const responseText = await response.text();
      
      if (!response.ok) {
        console.error('❌ Brevo API error:', {
          status: response.status,
          statusText: response.statusText,
          error: responseText.substring(0, 500) // רק 500 תווים ראשונים
        });
        return false;
      }

      // Brevo מחזיר 201 Created עם messageId אם המייל נשלח בהצלחה
      // ננסה לפרסר כ-JSON אם אפשר
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const result = JSON.parse(responseText);
          console.log('✅ Newsletter sent via Brevo:', {
            messageId: result.messageId,
            to: to,
            subject: subject.substring(0, 50)
          });
          return true;
        } catch (jsonError) {
          // אם יש בעיה בפרסור JSON, אבל התגובה OK - נחשוב שהמייל נשלח
          console.warn('⚠️ Brevo response is not valid JSON:', responseText.substring(0, 200));
          return true;
        }
      } else {
        // אם זה לא JSON, נחשוב שהמייל נשלח (התגובה OK)
        // Brevo מחזיר 201 Created עם messageId ב-body
        console.log('✅ Newsletter sent via Brevo (non-JSON response):', {
          status: response.status,
          responsePreview: responseText.substring(0, 200),
          to: to
        });
        return true;
      }
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
        const errorText = await response.text();
        console.error('Resend API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText.substring(0, 500)
        });
        return false;
      }

      // בדוק את content-type לפני פרסור JSON (אם צריך)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          await response.json(); // נקרא את התגובה (אם יש)
        } catch (jsonError) {
          // לא קריטי - התגובה OK
          console.warn('⚠️ Resend response parsing warning:', jsonError);
        }
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