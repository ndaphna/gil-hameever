import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { userId, dailyEntries, cycleEntries } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        error: 'OpenAI API key not configured',
        message: null
      }, { status: 500 });
    }

    // Analyze user data to create context for the message
    const recentEntries = (dailyEntries || []).slice(0, 7);
    const recentCycles = (cycleEntries || []).slice(0, 3);
    
    // Calculate patterns
    const hotFlashesCount = recentEntries.filter((e: any) => e.hot_flashes).length;
    const sleepIssuesCount = recentEntries.filter((e: any) => 
      e.sleep_issues || e.sleep_quality === 'poor'
    ).length;
    const poorSleepDays = recentEntries.filter((e: any) => e.sleep_quality === 'poor').length;
    const moodIssuesCount = recentEntries.filter((e: any) => 
      ['sad', 'irritated', 'frustrated'].includes(e.mood)
    ).length;
    const nightSweatsCount = recentEntries.filter((e: any) => e.night_sweats).length;
    const energyLowCount = recentEntries.filter((e: any) => e.energy_level === 'low').length;
    
    // Get current time of day
    const hour = new Date().getHours();
    const isEvening = hour >= 18;
    const isMorning = hour >= 5 && hour < 12;
    
    // Build context prompt
    let contextPrompt = `את עליזה, יועצת אישית מקצועית ומנופאוזית מנוסה לנשים בגיל המעבר. 

תפקידך: ליצור הודעה חכמה, אישית וחמה המבוססת על הנתונים האמיתיים של המשתמשת.

כללי התנהגות:
- השתמשי בשפה חמה, אמפתית ומעודדת
- התמקדי בפתרונות מעשיים
- השתמשי בנתונים האמיתיים שניתנו לך
- זהה דפוסים מעניינים בנתונים
- תני המלצות ספציפיות ומעשיות
- כתוב בעברית בלבד
- ההודעה צריכה להיות 2-4 משפטים, אישית ומרתקת

הנתונים של המשתמשת:
- מספר ימים במעקב: ${recentEntries.length}
- גלי חום: ${hotFlashesCount}/${recentEntries.length} ימים
- בעיות שינה: ${sleepIssuesCount}/${recentEntries.length} ימים (${poorSleepDays} ימים עם שינה גרועה)
- בעיות מצב רוח: ${moodIssuesCount}/${recentEntries.length} ימים
- הזעות לילה: ${nightSweatsCount}/${recentEntries.length} ימים
- אנרגיה נמוכה: ${energyLowCount}/${recentEntries.length} ימים
- שעה נוכחית: ${isMorning ? 'בוקר' : isEvening ? 'ערב' : 'יום'}
- רשומות מחזור: ${recentCycles.length}

צרי הודעה חכמה, אישית ומעודדת המבוססת על הנתונים האלה.`;

    // Determine message type and action URL based on patterns
    let messageType: string = 'encouragement';
    let actionUrl: string = '';
    let emoji: string = '💕';

    if (isMorning && recentEntries.length > 0) {
      const todayEntry = recentEntries.find((e: any) => {
        const entryDate = new Date(e.date).toISOString().split('T')[0];
        const today = new Date().toISOString().split('T')[0];
        return entryDate === today && e.time_of_day === 'morning';
      });
      
      if (!todayEntry) {
        messageType = 'morning';
        actionUrl = '/physical-activity';
        emoji = '🌅';
      }
    } else if (isEvening) {
      messageType = 'evening';
      actionUrl = '/menopausal-sleep';
      emoji = '🌙';
    } else if (hotFlashesCount >= 3 && nightSweatsCount >= 2) {
      messageType = 'tip';
      actionUrl = '/heat-waves';
      emoji = '🔥';
    } else if (sleepIssuesCount >= 3 && energyLowCount >= 3) {
      messageType = 'tip';
      actionUrl = '/physical-activity';
      emoji = '⚡';
    } else if (moodIssuesCount >= 3) {
      messageType = 'encouragement';
      actionUrl = '/self-worth';
      emoji = '🤗';
    } else if (recentCycles.length > 0) {
      const lastPeriod = recentCycles.find((e: any) => e.is_period);
      if (lastPeriod) {
        const daysSince = Math.floor(
          (new Date().getTime() - new Date(lastPeriod.date).getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSince > 35) {
          messageType = 'cycle';
          emoji = '🌸';
        }
      }
    } else if (recentEntries.length >= 7) {
      messageType = 'encouragement';
      emoji = '🎆';
    }

    // Call OpenAI to generate personalized message
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: contextPrompt },
        { role: 'user', content: 'צרי הודעה חכמה ואישית המבוססת על הנתונים שסופקו.' }
      ],
      max_tokens: 200,
      temperature: 0.8,
    });

    const generatedMessage = completion.choices[0]?.message?.content || 
      'שמתי לב שכשישנת פחות מ-6 שעות, גלי החום עלו ב-30%. הנה טיפ לשיפור השינה שלך: נסי להוריד את הטמפרטורה בחדר ל-18 מעלות ולבשי בגדים מבדים נושמים.';

    // Save message to database (if not mock user)
    if (!userId.startsWith('mock-user-')) {
      const { error } = await supabaseAdmin
        .from('aliza_messages')
        .insert({
          user_id: userId,
          type: messageType,
          message: generatedMessage,
          emoji: emoji,
          action_url: actionUrl || null,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving message to database:', error);
      }
    }

    return NextResponse.json({
      success: true,
      message: {
        id: 'new-' + Date.now(),
        user_id: userId,
        type: messageType,
        message: generatedMessage,
        emoji: emoji,
        action_url: actionUrl || null,
        created_at: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('Error generating Aliza message:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error',
      message: null
    }, { status: 500 });
  }
}

