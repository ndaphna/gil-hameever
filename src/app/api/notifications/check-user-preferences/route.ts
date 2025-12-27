import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

/**
 * בדיקת העדפות משתמשת לפי אימייל
 * GET /api/notifications/check-user-preferences?email=nitzandaphna@gmail.com
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    // מצא את המשתמשת לפי אימייל
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profile')
      .select('id, email, first_name, name, full_name, subscription_status')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return NextResponse.json(
        { error: 'Error fetching user profile', details: profileError.message },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json(
        { error: 'User not found', email },
        { status: 404 }
      );
    }

    // קבל את ההעדפות
    const { data: preferences, error: prefError } = await supabaseAdmin
      .from('notification_preferences')
      .select('*')
      .eq('user_id', profile.id)
      .maybeSingle();

    if (prefError) {
      console.error('Error fetching preferences:', prefError);
      return NextResponse.json(
        { error: 'Error fetching preferences', details: prefError.message },
        { status: 500 }
      );
    }

    // קבל את ההיסטוריה של הניוזלטרים שנשלחו
    const { data: history, error: historyError } = await supabaseAdmin
      .from('notification_history')
      .select('sent_at, channel, insight')
      .eq('user_id', profile.id)
      .eq('channel', 'email')
      .order('sent_at', { ascending: false })
      .limit(5);

    // חישוב זמן ישראל הנוכחי
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
    const currentDay = parseInt(parts.find(p => p.type === 'day')?.value || '0');
    const currentMonth = parseInt(parts.find(p => p.type === 'month')?.value || '0');
    const currentYear = parseInt(parts.find(p => p.type === 'year')?.value || '0');
    const dateInIsrael = new Date(currentYear, currentMonth - 1, currentDay, currentHour, currentMinute);
    const currentDayOfWeek = dateInIsrael.getDay();
    const currentDayOfMonth = currentDay;

    // בדיקה מתי אמור להישלח המייל הבא
    let nextSendTime = null;
    let shouldSendNow = false;
    let reason = '';

    if (preferences && preferences.email) {
      const emailPrefs = preferences.email as {
        enabled: boolean;
        frequency: 'daily' | 'weekly' | 'monthly';
        time: string;
      };

      if (emailPrefs.enabled) {
        const [prefHour, prefMinute] = emailPrefs.time.split(':').map(Number);
        
        // בדוק אם צריך לשלוח עכשיו
        const isCurrentHour = prefHour === currentHour;
        const isCurrentMinute = prefMinute === currentMinute || (prefMinute > 0 && currentMinute === 0);
        
        // בדוק תדירות
        let frequencyCheck = false;
        if (emailPrefs.frequency === 'daily') {
          frequencyCheck = true;
        } else if (emailPrefs.frequency === 'weekly') {
          frequencyCheck = currentDayOfWeek === 1; // יום שני
        } else if (emailPrefs.frequency === 'monthly') {
          frequencyCheck = currentDayOfMonth === 1;
        }

        // בדוק מתי נשלח המייל האחרון
        const lastSent = history && history.length > 0 ? new Date(history[0].sent_at) : null;
        const hoursSinceLastSent = lastSent 
          ? (now.getTime() - lastSent.getTime()) / (1000 * 60 * 60)
          : 999;

        shouldSendNow = isCurrentHour && isCurrentMinute && frequencyCheck && hoursSinceLastSent >= 23;

        if (!shouldSendNow) {
          if (!isCurrentHour) {
            reason = `Not the right hour (preferred: ${prefHour}:${String(prefMinute).padStart(2, '0')}, current: ${currentHour}:${String(currentMinute).padStart(2, '0')})`;
          } else if (!frequencyCheck) {
            reason = `Frequency check failed (${emailPrefs.frequency}, current day: ${currentDayOfWeek}, month day: ${currentDayOfMonth})`;
          } else if (hoursSinceLastSent < 23) {
            reason = `Sent recently (${hoursSinceLastSent.toFixed(2)} hours ago)`;
          }
        }

        // חישוב מתי המייל הבא אמור להישלח
        const nextSendDate = new Date(now);
        if (emailPrefs.frequency === 'daily') {
          nextSendDate.setHours(prefHour, prefMinute, 0, 0);
          if (nextSendDate <= now) {
            nextSendDate.setDate(nextSendDate.getDate() + 1);
          }
        } else if (emailPrefs.frequency === 'weekly') {
          // יום שני הבא
          const daysUntilMonday = (1 - currentDayOfWeek + 7) % 7 || 7;
          nextSendDate.setDate(nextSendDate.getDate() + daysUntilMonday);
          nextSendDate.setHours(prefHour, prefMinute, 0, 0);
        } else if (emailPrefs.frequency === 'monthly') {
          // יום הראשון של החודש הבא
          nextSendDate.setMonth(nextSendDate.getMonth() + 1, 1);
          nextSendDate.setHours(prefHour, prefMinute, 0, 0);
        }
        nextSendTime = nextSendDate.toISOString();
      }
    }

    return NextResponse.json({
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.first_name || profile.name || profile.full_name,
        subscription_status: profile.subscription_status
      },
      preferences: preferences || null,
      currentTime: {
        israel: {
          hour: currentHour,
          minute: currentMinute,
          dayOfWeek: currentDayOfWeek,
          dayOfMonth: currentDayOfMonth,
          dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentDayOfWeek],
          full: formatter.format(now)
        },
        utc: now.toISOString()
      },
      emailSettings: preferences?.email ? {
        enabled: (preferences.email as any).enabled,
        frequency: (preferences.email as any).frequency,
        time: (preferences.email as any).time,
        nextSendTime,
        shouldSendNow,
        reason: shouldSendNow ? 'Should send now!' : reason
      } : null,
      lastSent: history && history.length > 0 ? {
        sent_at: history[0].sent_at,
        hoursAgo: history[0].sent_at 
          ? ((now.getTime() - new Date(history[0].sent_at).getTime()) / (1000 * 60 * 60)).toFixed(2)
          : null,
        insight: history[0].insight
      } : null,
      recentHistory: history || []
    });
  } catch (error: any) {
    console.error('Error checking user preferences:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}









