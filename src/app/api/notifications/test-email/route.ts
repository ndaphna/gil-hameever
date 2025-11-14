import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { SmartNotificationService } from '@/lib/smart-notification-service';
import { createInsightEmail, calculateUserStatistics } from '@/lib/email-templates';

/**
 * API endpoint לבדיקת שליחת מייל
 * שימושי לבדיקה ידנית
 */
export async function POST(request: Request) {
  try {
    const { email, userId } = await request.json();

    // אם נשלח email, נחפש את ה-userId
    let targetUserId = userId;
    if (email && !userId) {
      const { data: profile } = await supabaseAdmin
        .from('user_profile')
        .select('id')
        .eq('email', email)
        .single();

      if (!profile) {
        return NextResponse.json(
          { error: 'User not found', email },
          { status: 404 }
        );
      }

      targetUserId = profile.id;
    }

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'Please provide either userId or email' },
        { status: 400 }
      );
    }

    // קבל פרטי משתמש
    const { data: profile } = await supabaseAdmin
      .from('user_profile')
      .select('id, email, subscription_status, name')
      .eq('id', targetUserId)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // בדוק אם צריך לשלוח התראה
    const notificationService = new SmartNotificationService();
    const decision = await notificationService.shouldSendNotification(targetUserId);

    if (!decision.shouldSend) {
      return NextResponse.json({
        success: false,
        reason: decision.reason,
        userId: targetUserId,
        email: profile.email,
        subscriptionStatus: profile.subscription_status
      });
    }

    if (!decision.insight) {
      return NextResponse.json({
        success: false,
        reason: 'No insight generated',
        userId: targetUserId,
        email: profile.email
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

    // יצירת תבנית המייל
    const emailTemplate = createInsightEmail(
      profile.name || profile.email?.split('@')[0] || 'יקרה',
      decision.insight,
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
      await notificationService.saveNotificationHistory(targetUserId, decision.insight, 'sent');
      
      return NextResponse.json({
        success: true,
        message: 'Email sent successfully',
        userId: targetUserId,
        email: profile.email,
        insight: {
          type: decision.insight.type,
          title: decision.insight.title,
          priority: decision.insight.priority
        },
        emailPreview: {
          subject: emailTemplate.subject,
          htmlLength: emailTemplate.html.length,
          textLength: emailTemplate.text.length
        }
      });
    } else {
      await notificationService.saveNotificationHistory(targetUserId, decision.insight, 'failed');
      
      return NextResponse.json({
        success: false,
        reason: 'Email sending failed',
        userId: targetUserId,
        email: profile.email,
        insight: decision.insight
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error in test-email:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * שליחת מייל - אותו קוד כמו ב-send-smart-email
 */
async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<boolean> {
  try {
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
      console.log('✅ Email sent via Brevo:', result);
      return true;
    }

    console.warn('⚠️ BREVO_API_KEY not configured');
    return false;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

