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
    
    // Build context prompt
    const contextPrompt = `את עליזה, יועצת אישית מקצועית ומנופאוזית מנוסה לנשים בגיל המעבר. 

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
      const lastPeriod = recentCycles.find((e: CycleEntry) => e.is_period);
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
            const newTokenBalance = Math.max(0, currentTokens - deductTokens);
            
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
      deduct_tokens: deductTokens
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




