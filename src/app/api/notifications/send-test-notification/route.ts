import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

/**
 * API endpoint לשליחת התראת בדיקה
 * נקרא מ-NotificationService.sendImmediateNotification
 */
export async function POST(request: Request) {
  try {
    const { userId, type, title, message, channel } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // קבל את כתובת המייל של המשתמש
    const { data: profile } = await supabaseAdmin
      .from('user_profile')
      .select('email, name')
      .eq('id', userId)
      .single();

    if (!profile || !profile.email) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 404 }
      );
    }

    // אם ה-channel הוא email, שלח מייל
    if (channel === 'email') {
      const emailSent = await sendEmail(
        profile.email,
        title,
        createTestEmailHTML(profile.name || 'יקרה', title, message),
        createTestEmailText(title, message)
      );

      if (!emailSent) {
        return NextResponse.json(
          { error: 'Failed to send email' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: channel === 'email' ? 'Email sent successfully' : 'Notification sent',
      channel,
      email: profile.email
    });
  } catch (error: any) {
    console.error('Error in send-test-notification:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * שליחת מייל באמצעות Brevo
 */
async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<boolean> {
  try {
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    if (!BREVO_API_KEY) {
      console.warn('⚠️ BREVO_API_KEY not configured');
      return false;
    }

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
    console.log('✅ Email sent via Brevo:', result);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * יצירת תבנית HTML למייל בדיקה
 */
function createTestEmailHTML(name: string, title: string, message: string): string {
  return `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; background-color: #f5f5f5; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #8B4C9F; margin: 0; font-size: 28px;">${title}</h1>
    </div>
    
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-right: 4px solid #8B4C9F;">
      <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0;">${message}</p>
    </div>
    
    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
      <p style="color: #666; font-size: 14px; margin: 0;">זוהי הודעת בדיקה מ-<strong>עליזה</strong></p>
      <p style="color: #999; font-size: 12px; margin-top: 10px;">אם קיבלת את המייל הזה, זה אומר שהמערכת עובדת מצוין! 🌸</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * יצירת תבנית טקסט פשוטה למייל בדיקה
 */
function createTestEmailText(title: string, message: string): string {
  return `
${title}

${message}

---
זוהי הודעת בדיקה מעליזה
אם קיבלת את המייל הזה, זה אומר שהמערכת עובדת מצוין! 🌸
  `.trim();
}


