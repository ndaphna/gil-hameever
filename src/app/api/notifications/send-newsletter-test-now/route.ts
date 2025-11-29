import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { SmartNotificationService } from '@/lib/smart-notification-service';
import { createInsightEmail, calculateUserStatistics } from '@/lib/email-templates';

export const runtime = 'edge';

/**
 * שליחת בדיקה מיידית של הניוזלטר - מתעלם מהשעה והתדירות
 * שולח ניוזלטר לכל המשתמשות שבחרו לקבל ניוזלטר יומי
 */
export async function POST(request: Request) {
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

    // קבל כל המשתמשות עם העדפות התראות יומיות
    const { data: preferences, error: prefError } = await supabaseAdmin
      .from('notification_preferences')
      .select(`
        user_id,
        email,
        updated_at
      `);

    if (prefError) {
      return NextResponse.json(
        { error: prefError.message },
        { status: 500 }
      );
    }

    if (!preferences || preferences.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No users with notification preferences found',
        processed: 0,
        sent: 0
      });
    }

    let sent = 0;
    let failed = 0;
    const results: any[] = [];

    // עבד כל משתמשת
    for (const pref of preferences) {
      try {
        const emailPrefs = pref.email as {
          enabled: boolean;
          frequency: 'daily' | 'weekly' | 'monthly';
          time: string;
        };

        // בדוק רק אם אימייל מופעל ותדירות יומית
        if (!emailPrefs?.enabled || emailPrefs.frequency !== 'daily') {
          continue;
        }

        // קבל פרטי משתמש
        const { data: profile } = await supabaseAdmin
          .from('user_profile')
          .select('id, email, subscription_status, first_name, name, full_name')
          .eq('id', pref.user_id)
          .single();

        if (!profile) {
          results.push({ userId: pref.user_id, status: 'skipped', reason: 'User not found' });
          continue;
        }

        // בדוק אם המשתמשת מנויה
        if (profile.subscription_status !== 'active') {
          results.push({ userId: pref.user_id, status: 'skipped', reason: 'User not subscribed' });
          continue;
        }

        // קבל נתונים
        const notificationService = new SmartNotificationService();
        const decision = await notificationService.shouldSendNotification(pref.user_id);

        // אם אין insight, ניצור insight כללי לניוזלטר היומי
        let insight = decision.insight;
        let userData = decision.userData;

        if (!insight || !decision.shouldSend) {
          // קבל נתונים למקרה שאין insight
          if (!userData) {
            const { data: dailyEntries } = await supabaseAdmin
              .from('daily_entries')
              .select('*')
              .eq('user_id', pref.user_id)
              .order('date', { ascending: false })
              .limit(30);
            
            const { data: cycleEntries } = await supabaseAdmin
              .from('cycle_entries')
              .select('*')
              .eq('user_id', pref.user_id)
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

        // חישוב סטטיסטיקות
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
          await notificationService.saveNotificationHistory(pref.user_id, insight, 'sent');
          sent++;
          results.push({
            userId: pref.user_id,
            email: profile.email,
            status: 'sent'
          });
        } else {
          failed++;
          results.push({
            userId: pref.user_id,
            email: profile.email,
            status: 'failed',
            reason: 'Email sending failed'
          });
        }
      } catch (error: any) {
        failed++;
        results.push({
          userId: pref.user_id,
          status: 'error',
          error: error.message
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Newsletter test completed',
      timestamp: new Date().toISOString(),
      processed: preferences.length,
      sent,
      failed,
      results: results.slice(0, 20) // החזר רק 20 תוצאות ראשונות
    });
  } catch (error: any) {
    console.error('Newsletter test error:', error);
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

      console.log('✅ Newsletter sent via Brevo to:', to);
      return true;
    }

    console.warn('⚠️ No email service configured');
    return false;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

