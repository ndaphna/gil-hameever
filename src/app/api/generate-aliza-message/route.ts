import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { executeAIRequest } from '@/lib/ai-usage-service';
import { TOKEN_ACTION_TYPES } from '@/config/token-engine';
import type { DailyEntry, CycleEntry } from '@/types/journal';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  let userId: string | undefined;
  let dailyEntries: DailyEntry[] = [];
  let cycleEntries: CycleEntry[] = [];
  
  try {
    const requestData = await request.json();
    userId = requestData.userId;
    dailyEntries = requestData.dailyEntries || [];
    cycleEntries = requestData.cycleEntries || [];

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }


    // Analyze user data to create context for the message
    const recentEntries = (dailyEntries || []).slice(0, 7);
    const recentCycles = (cycleEntries || []).slice(0, 3);
    
    // Calculate patterns
    const hotFlashesCount = recentEntries.filter((e: DailyEntry) => e.hot_flashes).length;
    const sleepIssuesCount = recentEntries.filter((e: DailyEntry) => 
      e.sleep_issues || e.sleep_quality === 'poor'
    ).length;
    const poorSleepDays = recentEntries.filter((e: DailyEntry) => e.sleep_quality === 'poor').length;
    const moodIssuesCount = recentEntries.filter((e: DailyEntry) => 
      ['sad', 'irritated', 'frustrated'].includes(e.mood || '')
    ).length;
    const nightSweatsCount = recentEntries.filter((e: DailyEntry) => e.night_sweats).length;
    const energyLowCount = recentEntries.filter((e: DailyEntry) => e.energy_level === 'low').length;
    
    // Get current time of day
    const hour = new Date().getHours();
    const isEvening = hour >= 18;
    const isMorning = hour >= 5 && hour < 12;
    
    // Get user profile for name
    const { data: profile } = await supabaseAdmin
      .from('user_profile')
      .select('first_name, name, full_name, email')
      .eq('id', userId)
      .single();
    
    // Use first_name only for display
    const userName = profile?.first_name || profile?.name?.split(' ')[0] || profile?.full_name?.split(' ')[0] || profile?.email?.split('@')[0] || 'יקרה';
    
    // Build context prompt
    const contextPrompt = `את עליזה, יועצת אישית מקצועית ומנופאוזית מנוסה לנשים בגיל המעבר. 

תפקידך: ליצור הודעה חכמה, אישית וחמה המבוססת על הנתונים האמיתיים של ${userName}.

חשוב מאוד - שימוש בשם פרטי וסגנון אישי:
- תמיד השתמשי בשם הפרטי "${userName}" בהודעה
- לעולם אל תכתבי "שתמשת" או "את" - תמיד השתמשי בשם "${userName}"
- סגנון הפניה: "היי ${userName}" או "${userName} יקרה" - פניה ישירה ואישית כמו בשיחה עם חברה טובה
- במקום "${userName} חוותה..." כתבי "אני רואה שאת חווה..." או "${userName} יקרה, אני רואה שאת חווה..."
- במקום "${userName}, חשוב שתשימי..." כתבי "היי ${userName}, חשוב שתשימי..." או "${userName} יקרה, חשוב שתשימי..."
- היחס הוא אישי וחם, כמו בשיחה עם חברה טובה, לא מנותק וקר
- פני ישירות ל-${userName} בשמה בהתייחסות אישית

כללי התנהגות:
- השתמשי בשפה חמה, אמפתית ומעודדת
- התמקדי בפתרונות מעשיים
- השתמשי בנתונים האמיתיים שניתנו לך
- זהה דפוסים מעניינים בנתונים
- תני המלצות ספציפיות ומעשיות
- כתוב בעברית בלבד
- ההודעה צריכה להיות 2-4 משפטים, אישית ומרתקת

הנתונים של ${userName}:
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
    // Balanced approach: prioritize time-based, then cycle, then issues, then encouragement
    let messageType: string = 'encouragement';
    let actionUrl: string = '';
    let emoji: string = '💕';

    // Use timestamp for variety (not just entry count) to ensure different types
    const varietySeed = Date.now() % 10;
    
    // Morning messages (5-12) - higher priority
    if (isMorning && recentEntries.length > 0) {
      const todayEntry = recentEntries.find((e: DailyEntry) => {
        const entryDate = new Date(e.date).toISOString().split('T')[0];
        const today = new Date().toISOString().split('T')[0];
        return entryDate === today && e.time_of_day === 'morning';
      });
      
      if (!todayEntry) {
        messageType = 'morning';
        actionUrl = '/physical-activity';
        emoji = '🌅';
      }
    } 
    // Evening messages (18+) - higher priority
    else if (isEvening) {
      messageType = 'evening';
      actionUrl = '/menopausal-sleep';
      emoji = '🌙';
    } 
    // Cycle-related messages - if has cycle data, 40% chance
    else if (recentCycles.length > 0) {
      const lastPeriod = recentCycles.find((e: CycleEntry) => e.is_period);
      if (lastPeriod) {
        const daysSince = Math.floor(
          (new Date().getTime() - new Date(lastPeriod.date).getTime()) / (1000 * 60 * 60 * 24)
        );
        // If long cycle (>35 days) or variety seed suggests cycle message
        if (daysSince > 35 || varietySeed < 4) {
          messageType = 'cycle';
          emoji = '🌸';
        }
      } else if (varietySeed < 4) {
        // Has cycle entries but no period - still can be cycle message
        messageType = 'cycle';
        emoji = '🌸';
      }
    }
    
    // Only set tip if not already set to cycle/morning/evening AND issues are significant
    if (messageType === 'encouragement') {
      // Tip for hot flashes - only if significant (3+ days) AND variety allows
      if ((hotFlashesCount >= 3 || nightSweatsCount >= 3) && varietySeed >= 4 && varietySeed < 7) {
        messageType = 'tip';
        actionUrl = '/heat-waves';
        emoji = '🔥';
      } 
      // Tip for sleep issues - only if significant (3+ days) AND variety allows
      else if ((sleepIssuesCount >= 3 || energyLowCount >= 3) && varietySeed >= 7 && varietySeed < 9) {
        messageType = 'tip';
        actionUrl = '/physical-activity';
        emoji = '⚡';
      } 
      // Mood issues - encouragement with action
      else if (moodIssuesCount >= 2) {
        messageType = 'encouragement';
        actionUrl = '/self-worth';
        emoji = '🤗';
      } 
      // General encouragement for consistent tracking
      else if (recentEntries.length >= 5) {
        messageType = 'encouragement';
        emoji = '🎆';
      }
      // Default: general encouragement
      else {
        messageType = 'encouragement';
        emoji = '💕';
      }
    }

    // Generate fallback message based on data
    const generateFallbackMessage = (): string => {
      if (hotFlashesCount >= 3) {
        return `שמתי לב שיש לך גלי חום בתדירות גבוהה, ${userName}. הנה טיפ שיכול לעזור: נסי להימנע מקפאין אחר הצהריים, תרגלי נשימות עמוקות כשאת מרגישה גל חום מתקרב, והחזיקי מאוורר קטן בתיק. 💙`;
      } else if (sleepIssuesCount >= 3) {
        return `אני רואה שיש לך לילות קשים, ${userName}. טיפ לשינה טובה יותר: נסי ליצור רוטינת שינה קבועה, הימנעי ממסכים שעה לפני השינה, ודאגי לחדר קריר ונעים. גם פעילות גופנית קלה ביום יכולה לעזור. 🌙`;
      } else if (moodIssuesCount >= 3) {
        return `אני רואה שיש לך ימים עם מצב רוח נמוך, ${userName}. טיפ למצב רוח טוב יותר: נסי לצאת לטיול קצר, לדבר עם חברה, או לעשות משהו שאת אוהבת. גם פעילות גופנית קלה משחררת אנדורפינים שעוזרים למצב הרוח. 💕`;
      } else if (recentEntries.length >= 7) {
        return `אני רואה שאת עקבית במעקב שלך - זה נהדר, ${userName}! ככל שתמלאי יותר את היומן, כך אוכל לתת לך תובנות מדויקות יותר. המשכי כך! 🌸`;
      } else {
        return `היי ${userName}, אני כאן בשבילך! ככל שתמלאי יותר את היומן, כך אוכל לתת לך תובנות מדויקות יותר ומעודכנות. בואי נמשיך יחד במסע הזה. 💙`;
      }
    };
    
    let generatedMessage: string;
    let tokensDeducted: number = 0;
    let tokensRemaining: number = 0;

    // Use the unified AI service to generate the message
    console.log('🤖 Calling executeAIRequest for Aliza message...');
    
    const aiResult = await executeAIRequest({
      userId,
      actionType: TOKEN_ACTION_TYPES.ALIZA_MESSAGE,
      messages: [
        { role: 'system', content: contextPrompt },
        { role: 'user', content: 'צרי הודעה חכמה, אישית ומעודדת המבוססת על הנתונים שניתנו.' }
      ],
      model: 'gpt-4o',
      maxTokens: 600,
      temperature: 0.7,
      description: `Daily Aliza message for ${userName}`,
      metadata: {
        messageType,
        userName,
        entriesCount: recentEntries.length,
        hotFlashesCount,
        sleepIssuesCount,
        moodIssuesCount,
      }
    });
    
    if (aiResult.success && aiResult.response) {
      generatedMessage = aiResult.response;
      tokensDeducted = aiResult.tokensDeducted;
      tokensRemaining = aiResult.tokensRemaining;
      console.log(`✅ Generated message using ${tokensDeducted} tokens, ${tokensRemaining} remaining`);
    } else {
      console.warn('⚠️ AI request failed, using fallback message');
      generatedMessage = generateFallbackMessage();
      tokensDeducted = 0;
      tokensRemaining = aiResult.tokensRemaining || 0;
    }

    // Save message to database (if not mock user)
    // Token deduction is already handled by executeAIRequest
    if (!userId.startsWith('mock-user-')) {
      const today = new Date().toISOString().split('T')[0];
      
      // Insert new message WITHOUT deleting old ones - keep all messages
      // Each message gets a unique timestamp to preserve history
      const { error } = await supabaseAdmin
        .from('aliza_messages')
        .insert({
          user_id: userId,
          type: messageType,
          message: generatedMessage,
          emoji: emoji,
          action_url: actionUrl || null,
          message_date: today,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving message to database:', error);
      } else {
        console.log('✅ Message saved to database for date:', today);
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
      },
      tokensDeducted,
      tokensRemaining,
    });

  } catch (error: unknown) {
    console.error('Error generating Aliza message:', error);
    
    // Generate a fallback message even on error
    const recentEntries = dailyEntries.slice(0, 7);
    const hotFlashesCount = recentEntries.filter((e: DailyEntry) => e.hot_flashes).length;
    const sleepIssuesCount = recentEntries.filter((e: DailyEntry) => 
      e.sleep_issues || e.sleep_quality === 'poor'
    ).length;
    const moodIssuesCount = recentEntries.filter((e: DailyEntry) => 
      ['sad', 'irritated', 'frustrated'].includes(e.mood || '')
    ).length;
    
    let fallbackMessage = 'אני כאן בשבילך! ככל שתמלאי יותר את היומן, כך אוכל לתת לך תובנות מדויקות יותר ומעודכנות. בואי נמשיך יחד במסע הזה. 💙';
    
    if (hotFlashesCount >= 3) {
      fallbackMessage = 'שמתי לב שיש לך גלי חום בתדירות גבוהה. הנה טיפ שיכול לעזור: נסי להימנע מקפאין אחר הצהריים, תרגלי נשימות עמוקות כשאת מרגישה גל חום מתקרב, והחזיקי מאוורר קטן בתיק. 💙';
    } else if (sleepIssuesCount >= 3) {
      fallbackMessage = 'אני רואה שיש לך לילות קשים. טיפ לשינה טובה יותר: נסי ליצור רוטינת שינה קבועה, הימנעי ממסכים שעה לפני השינה, ודאגי לחדר קריר ונעים. 🌙';
    } else if (moodIssuesCount >= 3) {
      fallbackMessage = 'אני רואה שיש לך ימים עם מצב רוח נמוך. טיפ למצב רוח טוב יותר: נסי לצאת לטיול קצר, לדבר עם חברה, או לעשות משהו שאת אוהבת. 💕';
    }
    
    // Return success with fallback message instead of error
    return NextResponse.json({
      success: true,
      message: {
        id: 'fallback-' + Date.now(),
        user_id: userId,
        type: 'encouragement',
        message: fallbackMessage,
        emoji: '💙',
        action_url: null,
        created_at: new Date().toISOString()
      },
      tokensDeducted: 0,
      tokensRemaining: 0,
      warning: 'Used fallback message due to technical issue'
    });
  }
}




