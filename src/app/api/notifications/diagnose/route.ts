import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

/**
 * אבחון מקיף של מערכת הניוזלטרים
 * GET /api/notifications/diagnose
 * 
 * בודק:
 * 1. הגדרות סביבה (BREVO_API_KEY, CRON_SECRET)
 * 2. משתמשות עם העדפות
 * 3. מצב מנויים
 * 4. היסטוריית שליחות
 * 5. זמן ישראל הנוכחי
 * 6. האם ה-cron job אמור לרוץ עכשיו
 */
export async function GET(request: Request) {
  try {
    const diagnosis: any = {
      timestamp: new Date().toISOString(),
      environment: {},
      users: {},
      cron: {},
      issues: [],
      recommendations: []
    };

    // 1. בדיקת משתני סביבה
    diagnosis.environment = {
      BREVO_API_KEY: !!process.env.BREVO_API_KEY ? '✅ Set' : '❌ Missing',
      BREVO_FROM_EMAIL: process.env.BREVO_FROM_EMAIL || '❌ Not set',
      BREVO_FROM_NAME: process.env.BREVO_FROM_NAME || '❌ Not set',
      RESEND_API_KEY: !!process.env.RESEND_API_KEY ? '✅ Set' : '❌ Missing',
      SENDGRID_API_KEY: !!process.env.SENDGRID_API_KEY ? '✅ Set' : '❌ Missing',
      CRON_SECRET: !!process.env.CRON_SECRET ? '✅ Set' : '⚠️ Not set (less secure)',
      NODE_ENV: process.env.NODE_ENV || 'unknown'
    };

    if (!process.env.BREVO_API_KEY && !process.env.RESEND_API_KEY && !process.env.SENDGRID_API_KEY) {
      diagnosis.issues.push('❌ No email service configured (BREVO_API_KEY, RESEND_API_KEY, or SENDGRID_API_KEY)');
      diagnosis.recommendations.push('Set BREVO_API_KEY in Vercel environment variables');
    }

    // 2. חישוב זמן ישראל
    const now = new Date();
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
    const currentHour = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
    const currentMinute = parseInt(parts.find(p => p.type === 'minute')?.value || '0');
    const day = parseInt(parts.find(p => p.type === 'day')?.value || '0');
    const month = parseInt(parts.find(p => p.type === 'month')?.value || '0');
    const year = parseInt(parts.find(p => p.type === 'year')?.value || '0');
    const dateInIsrael = new Date(year, month - 1, day, currentHour, currentMinute);
    const currentDayOfWeek = dateInIsrael.getDay();

    diagnosis.cron = {
      currentTime: {
        israel: formatter.format(now),
        utc: now.toISOString(),
        hour: currentHour,
        minute: currentMinute,
        dayOfWeek: currentDayOfWeek,
        dayOfWeekName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentDayOfWeek],
        dayOfMonth: day
      },
      vercelCronSchedule: '0 * * * * (every hour at minute 0)',
      shouldRunNow: currentMinute === 0,
      nextRun: currentMinute === 0 
        ? 'Running now!' 
        : `Next run in ${60 - currentMinute} minutes (at ${currentHour + 1}:00)`
    };

    // 3. קבלת כל המשתמשות עם העדפות
    const { data: preferences, error: prefError } = await supabaseAdmin
      .from('notification_preferences')
      .select(`
        user_id,
        email,
        updated_at
      `);

    if (prefError) {
      diagnosis.issues.push(`❌ Error fetching preferences: ${prefError.message}`);
      return NextResponse.json(diagnosis, { status: 500 });
    }

    if (!preferences || preferences.length === 0) {
      diagnosis.issues.push('⚠️ No users with notification preferences found');
      diagnosis.recommendations.push('Users need to configure notification preferences in their profile');
      return NextResponse.json(diagnosis);
    }

    // 4. בדיקת כל משתמשת
    const userDetails: any[] = [];
    let activeSubscribers = 0;
    let enabledEmails = 0;
    let shouldSendNow = 0;

    for (const pref of preferences) {
      const emailPrefs = pref.email as {
        enabled?: boolean;
        frequency?: 'daily' | 'weekly' | 'monthly';
        time?: string;
      };

      // קבל פרטי משתמש
      const { data: profile } = await supabaseAdmin
        .from('user_profile')
        .select('id, email, subscription_status, first_name, name')
        .eq('id', pref.user_id)
        .maybeSingle();

      if (!profile) {
        userDetails.push({
          userId: pref.user_id,
          status: '❌ Profile not found',
          email: 'N/A',
          subscription_status: 'N/A'
        });
        continue;
      }

      const isSubscribed = profile.subscription_status === 'active';
      const isEmailEnabled = emailPrefs?.enabled === true;
      
      if (isSubscribed) activeSubscribers++;
      if (isEmailEnabled) enabledEmails++;

      // בדוק אם צריך לשלוח עכשיו
      let willSendNow = false;
      let sendReason = '';

      if (!isSubscribed) {
        sendReason = 'Not subscribed';
      } else if (!isEmailEnabled) {
        sendReason = 'Email notifications disabled';
      } else if (!emailPrefs?.time) {
        sendReason = 'No preferred time set';
      } else {
        const [prefHour, prefMinute] = (emailPrefs.time || '09:00').split(':').map(Number);
        const isCurrentHour = prefHour === currentHour;
        const isMinute0 = currentMinute === 0;

        if (isCurrentHour && isMinute0) {
          // בדוק תדירות
          let frequencyCheck = false;
          if (emailPrefs.frequency === 'daily') {
            frequencyCheck = true;
          } else if (emailPrefs.frequency === 'weekly') {
            frequencyCheck = currentDayOfWeek === 1; // Monday
          } else if (emailPrefs.frequency === 'monthly') {
            frequencyCheck = day === 1;
          }

          if (frequencyCheck) {
            // בדוק מתי נשלח לאחרונה
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
              
              if (hoursSinceLastSent < 23) {
                sendReason = `Sent ${hoursSinceLastSent.toFixed(1)} hours ago (minimum 23h required)`;
              } else {
                willSendNow = true;
                shouldSendNow++;
                sendReason = '✅ Should send now!';
              }
            } else {
              willSendNow = true;
              shouldSendNow++;
              sendReason = '✅ Should send now! (never sent before)';
            }
          } else {
            sendReason = `Frequency check failed (${emailPrefs.frequency}, day ${currentDayOfWeek}, month day ${day})`;
          }
        } else {
          sendReason = `Time mismatch (preferred: ${prefHour}:${String(prefMinute || 0).padStart(2, '0')}, current: ${currentHour}:${String(currentMinute).padStart(2, '0')})`;
        }
      }

      // קבל היסטוריה אחרונה
      const { data: history } = await supabaseAdmin
        .from('notification_history')
        .select('sent_at, status')
        .eq('user_id', pref.user_id)
        .eq('channel', 'email')
        .order('sent_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      userDetails.push({
        userId: pref.user_id,
        email: profile.email,
        name: profile.first_name || profile.name || 'N/A',
        subscription_status: profile.subscription_status,
        emailEnabled: isEmailEnabled,
        frequency: emailPrefs?.frequency || 'N/A',
        preferredTime: emailPrefs?.time || 'N/A',
        willSendNow,
        sendReason,
        lastSent: history?.sent_at || 'Never',
        lastSentStatus: history?.status || 'N/A',
        hoursSinceLastSent: history?.sent_at 
          ? ((now.getTime() - new Date(history.sent_at).getTime()) / (1000 * 60 * 60)).toFixed(1)
          : 'N/A'
      });
    }

    diagnosis.users = {
      total: preferences.length,
      activeSubscribers,
      enabledEmails,
      shouldSendNow,
      details: userDetails
    };

    // 5. בדיקת היסטוריה כללית
    const { data: recentHistory } = await supabaseAdmin
      .from('notification_history')
      .select('sent_at, status, user_id')
      .eq('channel', 'email')
      .order('sent_at', { ascending: false })
      .limit(10);

    diagnosis.history = {
      recent: recentHistory || [],
      totalRecent: recentHistory?.length || 0,
      last24Hours: recentHistory?.filter(h => {
        const sentAt = new Date(h.sent_at);
        return (now.getTime() - sentAt.getTime()) < 24 * 60 * 60 * 1000;
      }).length || 0
    };

    // 6. המלצות
    if (shouldSendNow === 0 && enabledEmails > 0) {
      diagnosis.recommendations.push('No emails should be sent right now. Check if cron job is running at the correct time.');
    }

    if (activeSubscribers === 0) {
      diagnosis.recommendations.push('No active subscribers found. Users need active subscription to receive newsletters.');
    }

    if (enabledEmails === 0) {
      diagnosis.recommendations.push('No users have email notifications enabled. Users need to enable email in notification settings.');
    }

    if (diagnosis.history.last24Hours === 0 && enabledEmails > 0) {
      diagnosis.recommendations.push('⚠️ No emails sent in last 24 hours despite enabled users. Check cron job execution.');
    }

    return NextResponse.json(diagnosis, { status: 200 });
  } catch (error: any) {
    console.error('Diagnosis error:', error);
    return NextResponse.json(
      {
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

