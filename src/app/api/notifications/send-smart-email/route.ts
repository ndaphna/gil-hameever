import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { SmartNotificationService } from '@/lib/smart-notification-service';
import { createInsightEmail, calculateUserStatistics } from '@/lib/email-templates';

export const runtime = 'edge';

/**
 * API endpoint לשליחת התראות מייל חכמות
 * נקרא על ידי cron job או scheduled task
 */
export async function POST(request: Request) {
  try {
    const { userId, force } = await request.json().catch(() => ({}));

    // אם לא נשלח userId, נבדוק את כל המשתמשות המנויות
    if (!userId) {
      return await processAllSubscribedUsers(force === true);
    }

    // בדוק משתמש ספציפי
    return await processUser(userId, force === true);
  } catch (error: any) {
    console.error('Error in send-smart-email:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * עיבוד משתמש ספציפי
 */
async function processUser(userId: string, force: boolean = false) {
  try {
    // קבל פרטי משתמש
    const { data: profile } = await supabaseAdmin
      .from('user_profile')
      .select('id, email, subscription_status, first_name, name, full_name')
      .eq('id', userId)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // בדוק אם המשתמשת מנויה
    if (profile.subscription_status !== 'active' && !force) {
      return NextResponse.json({ 
        skipped: true, 
        reason: 'User not subscribed' 
      });
    }

    // בדוק אם צריך לשלוח התראה
    const notificationService = new SmartNotificationService();
    const decision = await notificationService.shouldSendNotification(userId);

    if (!decision.shouldSend) {
      return NextResponse.json({
        sent: false,
        reason: decision.reason
      });
    }

    if (!decision.insight) {
      return NextResponse.json({
        sent: false,
        reason: 'No insight generated'
      });
    }

    // חישוב סטטיסטיקות מהנתונים
    let statistics = undefined;
    if (decision.userData) {
      statistics = calculateUserStatistics(
        decision.userData.dailyEntries,
        decision.userData.cycleEntries
      );
    }

    // יצירת תבנית המייל - use first_name only for display
    const userName = profile.first_name || profile.name?.split(' ')[0] || profile.full_name?.split(' ')[0] || profile.email?.split('@')[0] || 'יקרה';
    const emailTemplate = createInsightEmail(
      userName,
      decision.insight,
      statistics
    );

    // שליחת המייל (כאן צריך להוסיף שירות שליחת מיילים אמיתי)
    const emailSent = await sendEmail(
      profile.email!,
      emailTemplate.subject,
      emailTemplate.html,
      emailTemplate.text
    );

    if (emailSent) {
      // שמירה בהיסטוריה
      await notificationService.saveNotificationHistory(userId, decision.insight, 'sent');
      
      return NextResponse.json({
        sent: true,
        userId,
        email: profile.email,
        insight: decision.insight.type,
        title: decision.insight.title
      });
    } else {
      await notificationService.saveNotificationHistory(userId, decision.insight, 'failed');
      
      return NextResponse.json({
        sent: false,
        reason: 'Email sending failed'
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error processing user:', error);
    return NextResponse.json(
      { error: 'Error processing user', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * עיבוד כל המשתמשות המנויות
 */
async function processAllSubscribedUsers(force: boolean = false) {
  try {
    // קבל כל המשתמשות המנויות
    const { data: users } = await supabaseAdmin
      .from('user_profile')
      .select('id, email, subscription_status, first_name, name, full_name')
      .eq('subscription_status', 'active');

    if (!users || users.length === 0) {
      return NextResponse.json({
        processed: 0,
        sent: 0,
        skipped: 0
      });
    }

    let sent = 0;
    let skipped = 0;
    const errors: any[] = [];

    // עבד כל משתמשת
    for (const user of users) {
      try {
        const result = await processUser(user.id, force);
        const data = await result.json();
        
        if (data.sent) {
          sent++;
        } else {
          skipped++;
        }
      } catch (error: any) {
        errors.push({ userId: user.id, error: error.message });
        skipped++;
      }
    }

    return NextResponse.json({
      processed: users.length,
      sent,
      skipped,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error: any) {
    console.error('Error processing all users:', error);
    return NextResponse.json(
      { error: 'Error processing users', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * שליחת מייל באמצעות Brevo (לשעבר Sendinblue)
 * אפשר גם להשתמש ב:
 * - SendGrid
 * - AWS SES
 * - Resend
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

      if (!response.ok) {
        const error = await response.text();
        console.error('Brevo API error:', error);
        return false;
      }

      const result = await response.json();
      console.log('✅ Email sent via Brevo:', result);
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
    console.log('📧 Email would be sent (no service configured):', {
      to,
      subject,
      htmlLength: html.length,
      textLength: text.length
    });
    console.warn('⚠️ No email service configured. Please set BREVO_API_KEY, RESEND_API_KEY, or SENDGRID_API_KEY');

    // במצב פיתוח, נחזיר true כדי לבדוק את הלוגיקה
    // בייצור, צריך להחזיר false אם אין שירות מוגדר
    return process.env.NODE_ENV === 'development';
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

