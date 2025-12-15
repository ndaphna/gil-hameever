import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { SmartNotificationService } from '@/lib/smart-notification-service';
import { createInsightEmail, calculateUserStatistics } from '@/lib/email-templates';

export const runtime = 'edge';

/**
 * שליחת ניוזלטר לדוגמה למשתמשת ספציפית לפי אימייל
 * 
 * זה endpoint לבדיקה ודוגמה - שולח ניוזלטר עם תובנות ומסר מעודד
 */
export async function POST(request: Request) {
  try {
    const { email, force } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // מצא את המשתמשת לפי אימייל
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profile')
      .select('id, email, subscription_status, first_name, name, full_name')
      .eq('email', email)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { 
          error: 'User not found',
          message: `User with email ${email} not found. Please ensure the user has signed up first.`
        },
        { status: 404 }
      );
    }

    const userId = profile.id;
    // Use first_name only for display
    const userName = profile.first_name || profile.name?.split(' ')[0] || profile.full_name?.split(' ')[0] || profile.email?.split('@')[0] || 'יקרה';

    // קבל נתונים של המשתמשת
    const notificationService = new SmartNotificationService();
    const userData = await notificationService.getUserData(userId);

    // צור תובנה מותאמת אישית
    let insight;
    let statistics;

    if (userData && userData.dailyEntries.length > 0) {
      // יש נתונים - ננתח אותם ונצור תובנה אמיתית
      const decision = await notificationService.shouldSendNotification(userId);
      
      if (decision.insight) {
        insight = decision.insight;
        statistics = calculateUserStatistics(
          userData.dailyEntries,
          userData.cycleEntries
        );
      } else {
        // אין תובנה ספציפית - נצור תובנה כללית מעודדת
        insight = {
          type: 'encouragement',
          priority: 'medium',
          title: 'בואי נמשיך יחד את המסע שלך 🌸',
          message: 'אני רואה שאת עובדת על המעקב שלך. זה נהדר! ככל שתמלאי יותר נתונים, כך אוכל לתת לך תובנות מדויקות יותר. בואי נמשיך יחד.',
          actionUrl: '/journal?tab=daily'
        };
        statistics = calculateUserStatistics(
          userData.dailyEntries,
          userData.cycleEntries
        );
      }
    } else {
      // אין נתונים - נצור מסר מעודד להתחיל
      insight = {
        type: 'encouragement',
        priority: 'high',
        title: 'בואי נתחיל את המסע שלך יחד 🌸',
        message: 'אני כאן כדי לעזור לך לעקוב אחרי המסע שלך בגיל המעבר. כל יום שאת מעדכנת את היומן, אני לומדת יותר עלייך ויכולה לתת לך תובנות מותאמות אישית. בואי נתחיל!',
        actionUrl: '/journal?tab=daily'
      };
      statistics = undefined;
    }

    // הוסף מסר מעודד נוסף לעדכן את היומן
    // הוסף קריאה לפעולה ברורה לעדכן את היומן
    if (insight.message) {
      // אם המסר לא כולל כבר קריאה לעדכן, נוסיף אחת
      if (!insight.message.includes('בואי נעדכן') && !insight.message.includes('עדכן את היומן')) {
        insight.message += '\n\n💙 **בואי נעדכן את היומן היומי שלך** - זה לוקח רק כמה דקות ויכול לעזור לך להבין טוב יותר את הגוף שלך ואת מה שעובר עלייך. כל עדכון חשוב ומסייע לי לתת לך תובנות מדויקות יותר.';
      }
      
      // ודא שיש actionUrl לעדכן את היומן
      if (!insight.actionUrl) {
        insight.actionUrl = '/journal?tab=daily';
      }
    }

    // יצירת תבנית המייל
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
      
      return NextResponse.json({
        success: true,
        sent: true,
        userId,
        email: profile.email,
        userName,
        insight: {
          type: insight.type,
          title: insight.title
        },
        message: 'Newsletter sent successfully!'
      });
    } else {
      await notificationService.saveNotificationHistory(userId, insight, 'failed');
      
      return NextResponse.json({
        success: false,
        sent: false,
        reason: 'Email sending failed',
        message: 'Failed to send email. Please check email service configuration.'
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error sending newsletter demo:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error', 
        message: error.message 
      },
      { status: 500 }
    );
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
    console.log('\n' + '='.repeat(60));
    console.log('📧 Sending newsletter email via Brevo');
    console.log('='.repeat(60));

    // Brevo (Sendinblue) - מומלץ!
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    
    console.log('🔑 Checking Brevo configuration...');
    console.log('   BREVO_API_KEY:', BREVO_API_KEY ? '✅ Set' : '❌ Missing');
    console.log('   BREVO_FROM_EMAIL:', process.env.BREVO_FROM_EMAIL || '⚠️ Not set (using default)');
    console.log('   BREVO_FROM_NAME:', process.env.BREVO_FROM_NAME || '⚠️ Not set (using default)');

    if (BREVO_API_KEY) {
      const fromEmail = process.env.BREVO_FROM_EMAIL || 'inbal@gilhameever.com';
      const fromName = process.env.BREVO_FROM_NAME || 'עליזה - מנופאוזית וטוב לה';
      
      console.log('📤 Sending email:');
      console.log('   From:', `${fromName} <${fromEmail}>`);
      console.log('   To:', to);
      console.log('   Subject:', subject);
      console.log('   HTML length:', html.length, 'chars');
      console.log('   Text length:', text.length, 'chars');

      const payload = {
        sender: {
          name: fromName,
          email: fromEmail
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: html,
        textContent: text,
      };

      console.log('🌐 Calling Brevo API...');
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('📥 Brevo API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        let errorJson;
        try {
          errorJson = JSON.parse(errorText);
        } catch {
          errorJson = { rawError: errorText };
        }

        console.error('❌ Brevo API error:');
        console.error('   Status:', response.status);
        console.error('   Response:', JSON.stringify(errorJson, null, 2));
        console.log('='.repeat(60) + '\n');
        return false;
      }

      const result = await response.json();
      console.log('✅ Newsletter demo sent via Brevo successfully!');
      console.log('   Message ID:', result.messageId || 'N/A');
      console.log('='.repeat(60) + '\n');
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
    console.log('📧 Newsletter demo would be sent (no service configured):', {
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

