import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import type { DailyEntry, CycleEntry } from '@/types/journal';

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

    // Try Edge Function first, fallback to direct OpenAI call if needed
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    let generatedMessage: string;
    let assistantTokens: number = 0;
    let deductTokens: number = 0;

    // Generate fallback message based on data
    const generateFallbackMessage = (): string => {
      if (hotFlashesCount >= 3) {
        return 'שמתי לב שיש לך גלי חום בתדירות גבוהה. הנה טיפ שיכול לעזור: נסי להימנע מקפאין אחר הצהריים, תרגלי נשימות עמוקות כשאת מרגישה גל חום מתקרב, והחזיקי מאוורר קטן בתיק. 💙';
      } else if (sleepIssuesCount >= 3) {
        return 'אני רואה שיש לך לילות קשים. טיפ לשינה טובה יותר: נסי ליצור רוטינת שינה קבועה, הימנעי ממסכים שעה לפני השינה, ודאגי לחדר קריר ונעים. גם פעילות גופנית קלה ביום יכולה לעזור. 🌙';
      } else if (moodIssuesCount >= 3) {
        return 'אני רואה שיש לך ימים עם מצב רוח נמוך. טיפ למצב רוח טוב יותר: נסי לצאת לטיול קצר, לדבר עם חברה, או לעשות משהו שאת אוהבת. גם פעילות גופנית קלה משחררת אנדורפינים שעוזרים למצב הרוח. 💕';
      } else if (recentEntries.length >= 7) {
        return 'אני רואה שאת עקבית במעקב שלך - זה נהדר! ככל שתמלאי יותר את היומן, כך אוכל לתת לך תובנות מדויקות יותר. המשכי כך! 🌸';
      } else {
        return 'אני כאן בשבילך! ככל שתמלאי יותר את היומן, כך אוכל לתת לך תובנות מדויקות יותר ומעודכנות. בואי נמשיך יחד במסע הזה. 💙';
      }
    };

    // Try Edge Function first
    if (supabaseUrl && supabaseAnonKey) {
      try {
        const response = await fetch(`${supabaseUrl}/functions/v1/generate-aliza-message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({
            contextPrompt
          }),
        });

        if (response.ok) {
          const edgeFunctionResponse = await response.json();
          generatedMessage = edgeFunctionResponse.message || generateFallbackMessage();
          assistantTokens = edgeFunctionResponse.assistant_tokens || 0;
          deductTokens = edgeFunctionResponse.deduct_tokens || assistantTokens * 2;
        } else {
          // Edge Function failed, try direct OpenAI call
          throw new Error(`Edge Function returned ${response.status}`);
        }
      } catch (edgeError: unknown) {
        console.warn('Edge Function not available, trying direct OpenAI call:', edgeError);
        
        // Fallback to direct OpenAI call if Edge Function is not available
        if (openaiApiKey && openaiApiKey !== 'dummy-key') {
          try {
            const completion = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${openaiApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                  { role: 'system', content: contextPrompt },
                  { role: 'user', content: 'צרי הודעה חכמה, אישית ומעודדת המבוססת על הנתונים שניתנו.' }
                ],
                max_tokens: 600,
                temperature: 0.7,
              }),
            });

            if (completion.ok) {
              const data = await completion.json();
              generatedMessage = data.choices[0]?.message?.content || generateFallbackMessage();
              assistantTokens = data.usage?.completion_tokens || 0;
              deductTokens = assistantTokens * 2;
            } else {
              throw new Error('OpenAI API call failed');
            }
          } catch (openaiError: unknown) {
            console.error('Direct OpenAI call also failed:', openaiError);
            // Use fallback message
            generatedMessage = generateFallbackMessage();
            assistantTokens = 0;
            deductTokens = 0;
          }
        } else {
          // No OpenAI key available, use fallback
          console.warn('Edge Function not available and no OpenAI API key configured, using fallback message');
          generatedMessage = generateFallbackMessage();
          assistantTokens = 0;
          deductTokens = 0;
        }
      }
    } else {
      // No Supabase config, try direct OpenAI
      if (openaiApiKey && openaiApiKey !== 'dummy-key') {
        try {
          const completion = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openaiApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4',
              messages: [
                { role: 'system', content: contextPrompt },
                { role: 'user', content: 'צרי הודעה חכמה, אישית ומעודדת המבוססת על הנתונים שניתנו.' }
              ],
              max_tokens: 200,
              temperature: 0.7,
            }),
          });

          if (completion.ok) {
            const data = await completion.json();
            generatedMessage = data.choices[0]?.message?.content || generateFallbackMessage();
            assistantTokens = data.usage?.completion_tokens || 0;
            deductTokens = assistantTokens * 2;
          } else {
            throw new Error('OpenAI API call failed');
          }
        } catch (error) {
          console.error('OpenAI direct call failed:', error);
          generatedMessage = generateFallbackMessage();
          assistantTokens = 0;
          deductTokens = 0;
        }
      } else {
        generatedMessage = generateFallbackMessage();
        assistantTokens = 0;
        deductTokens = 0;
      }
    }

    // Save message to database and handle tokens (if not mock user)
    let newTokenBalance: number | null = null;
    
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

      // Deduct tokens if AI was used (same formula as chat: assistant_tokens * 2)
      if (deductTokens > 0) {
        try {
          // Get current tokens
          const { data: profile } = await supabaseAdmin
            .from('user_profile')
            .select('current_tokens, tokens_remaining')
            .eq('id', userId)
            .single();

          if (profile) {
            const currentTokens = profile.current_tokens ?? profile.tokens_remaining ?? 0;
            newTokenBalance = Math.max(0, currentTokens - deductTokens);
            
            await supabaseAdmin
              .from('user_profile')
              .update({ 
                current_tokens: newTokenBalance,
                tokens_remaining: newTokenBalance  // Keep both fields in sync
              })
              .eq('id', userId);

            console.log(`✅ Deducted ${deductTokens} tokens (${assistantTokens} assistant tokens * 2) for smart message. New balance: ${newTokenBalance}`);
          }
        } catch (tokenError) {
          console.error('Error deducting tokens for smart message:', tokenError);
        }
      } else {
        // Get current token balance even if no deduction
        try {
          const { data: profile } = await supabaseAdmin
            .from('user_profile')
            .select('current_tokens, tokens_remaining')
            .eq('id', userId)
            .single();
          
          if (profile) {
            newTokenBalance = profile.current_tokens ?? profile.tokens_remaining ?? 0;
          }
        } catch (error) {
          console.error('Error getting token balance:', error);
        }
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
      assistant_tokens: assistantTokens,
      deduct_tokens: deductTokens,
      tokens_remaining: newTokenBalance // Include new balance in response
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
      assistant_tokens: 0,
      deduct_tokens: 0,
      warning: 'Used fallback message due to technical issue'
    });
  }
}




