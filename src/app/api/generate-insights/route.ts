import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import OpenAI from 'openai';
import type { DailyEntry } from '@/types/journal';

export const runtime = 'edge';

interface SleepPatterns {
  totalDays: number;
  poorSleepDays: number;
  averageSleepQuality: number;
  recentTrend: 'declining' | 'stable';
}

interface MoodTrends {
  totalDays: number;
  positiveMoods: number;
  negativeMoods: number;
  dominantMood: string;
  recentTrend: 'improving' | 'declining' | 'stable';
}

interface Insight {
  type: string;
  title: string;
  description: string;
  data?: SleepPatterns | MoodTrends;
}

// Lazy-init OpenAI client. Instantiating at module scope crashes the Next.js
// build when OPENAI_API_KEY is missing, because the build collects page data
// by importing this module — see Vercel build error from commit d23df4f.
let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (_openai) return _openai;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }
  _openai = new OpenAI({ apiKey });
  return _openai;
}

export async function POST(request: NextRequest) {
  try {
    console.log('Generate insights API called');
    const { userId } = await request.json();
    
    if (!userId) {
      console.log('No userId provided');
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }
    
    console.log('Processing insights for user:', userId);

    // Fetch user data
    const [checkInsResult, cycleResult] = await Promise.all([
      supabaseAdmin
        .from('daily_check_ins')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(20),
      supabaseAdmin
        .from('cycle_entries')
        .select('*')
        .eq('user_id', userId)
        .order('start_date', { ascending: false })
        .limit(10)
    ]);

    const checkIns = checkInsResult.data || [];
    const cycleEntries = cycleResult.data || [];

    // Get user profile for name
    const { data: profile } = await supabaseAdmin
      .from('user_profile')
      .select('first_name, name, full_name, email')
      .eq('id', userId)
      .single();
    
    // Use first_name only for display
    const userName = profile?.first_name || profile?.name?.split(' ')[0] || profile?.full_name?.split(' ')[0] || profile?.email?.split('@')[0] || 'יקרה';
    
    // Calculate patterns
    const consecutiveDays = calculateConsecutiveDays(checkIns);
    const sleepPatterns = analyzeSleepPatterns(checkIns);
    const moodTrends = analyzeMoodTrends(checkIns);

    const insights = [];
    let totalAssistantTokens = 0; // Track total tokens from all OpenAI calls

    // Generate sleep insight
    if (sleepPatterns.totalDays > 0) {
      const sleepInsight = await generateSleepInsight(sleepPatterns, userName);
      insights.push(sleepInsight);
      totalAssistantTokens += sleepInsight.assistantTokens || 0;
    }

    // Generate mood insight
    if (moodTrends.dominantMood) {
      const moodInsight = await generateMoodInsight(moodTrends, userName);
      insights.push(moodInsight);
      totalAssistantTokens += moodInsight.assistantTokens || 0;
    }

    // Generate encouragement insight
    if (consecutiveDays > 0) {
      const encouragementInsight = await generateEncouragementInsight(consecutiveDays, userName);
      insights.push(encouragementInsight);
      totalAssistantTokens += encouragementInsight.assistantTokens || 0;
    }

    // Save insights to database (remove assistantTokens before saving)
    for (const insight of insights) {
      const { assistantTokens: _, ...insightToSave } = insight;
      await supabaseAdmin
        .from('journal_insights')
        .insert({
          user_id: userId,
          type: insightToSave.type,
          title: insightToSave.title,
          description: insightToSave.description,
          data: insightToSave.data
        });
    }

    // Deduct from the analysis wallet — 1 credit per generated insight.
    // (Phase 0: this route still does its own OpenAI calls outside ai-usage-service;
    // future refactor will route everything through executeAIRequest. For now we
    // honour the wallet split with a direct, fixed-cost deduction.)
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'dummy-key' && insights.length > 0) {
      const creditsToDeduct = insights.length;
      try {
        const { data: profile } = await supabaseAdmin
          .from('user_profile')
          .select('analysis_credits')
          .eq('id', userId)
          .single();

        if (profile) {
          const before = (profile as { analysis_credits?: number }).analysis_credits ?? 0;
          const after = Math.max(0, before - creditsToDeduct);

          await supabaseAdmin
            .from('user_profile')
            .update({ analysis_credits: after })
            .eq('id', userId);

          console.log(`✅ Deducted ${creditsToDeduct} analysis credits for ${insights.length} insights (raw tokens: ${totalAssistantTokens}). Balance: ${before} → ${after}`);
        }
      } catch (error) {
        console.error('Error deducting analysis credits:', error);
      }
    }

    return NextResponse.json({ success: true, insights });
  } catch (error) {
    console.error('Error generating insights:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calculateConsecutiveDays(checkIns: DailyEntry[]): number {
  if (checkIns.length === 0) return 0;
  
  let consecutive = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < checkIns.length; i++) {
    const checkInDate = new Date(checkIns[i].date);
    checkInDate.setHours(0, 0, 0, 0);
    
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    
    if (checkInDate.getTime() === expectedDate.getTime()) {
      consecutive++;
    } else {
      break;
    }
  }
  
  return consecutive;
}

function analyzeSleepPatterns(checkIns: DailyEntry[]): SleepPatterns {
  const morningCheckIns = checkIns.filter(c => c.time_of_day === 'morning');
  const totalDays = morningCheckIns.length;
  const poorSleepDays = morningCheckIns.filter(c => 
    c.sleep_quality?.value === 'poor' || c.sleep_quality?.value === 'fair'
  ).length;
  
  const sleepQualities = morningCheckIns
    .map(c => {
      const quality = c.sleep_quality?.value;
      if (quality === 'excellent') return 4;
      if (quality === 'good') return 3;
      if (quality === 'fair') return 2;
      if (quality === 'poor') return 1;
      return 0;
    })
    .filter(q => q > 0);
  
  const averageSleepQuality = sleepQualities.length > 0 
    ? sleepQualities.reduce((a, b) => a + b, 0) / sleepQualities.length 
    : 0;

  return {
    totalDays,
    poorSleepDays,
    averageSleepQuality,
    recentTrend: poorSleepDays > totalDays / 2 ? 'declining' : 'stable'
  };
}

function analyzeMoodTrends(checkIns: DailyEntry[]): MoodTrends {
  const eveningCheckIns = checkIns.filter(c => c.time_of_day === 'evening');
  const moods = eveningCheckIns.map(c => c.mood?.value).filter(Boolean);
  
  const moodCounts = moods.reduce((acc, mood) => {
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const dominantMood = Object.keys(moodCounts).reduce((a, b) => 
    moodCounts[a] > moodCounts[b] ? a : b, 'calm'
  );
  
  const recentMoodTrend = moods.slice(0, 3).every(m => ['happy', 'excited'].includes(m)) ? 'positive' :
    moods.slice(0, 3).every(m => ['sad', 'frustrated'].includes(m)) ? 'negative' : 'mixed';

  return {
    dominantMood,
    recentMoodTrend,
    moodCounts
  };
}

async function generateSleepInsight(sleepPatterns: SleepPatterns, userName: string): Promise<Insight & { assistantTokens?: number }> {

  const systemPrompt = `את עליזה, עוזרת דיגיטלית חכמה לנשים במנופאוזה.
צרי תובנה חכמה על דפוסי שינה בהתבסס על הנתונים.
היה מדויקת, מעודדת ומעשית. 
חשוב מאוד - סגנון אישי וחם:
- השתמשי בשם הפרטי "${userName}" בכל התובנות, לא "שתמשת" או "את"
- סגנון הפניה: "היי ${userName}" או "${userName} יקרה" - פניה ישירה ואישית כמו בשיחה עם חברה טובה
- במקום "${userName} חוותה..." כתבי "אני רואה שאת חווה..." או "${userName} יקרה, אני רואה שאת חווה..."
- היחס הוא אישי וחם, כמו בשיחה עם חברה טובה`;

  const userPrompt = `צרי תובנה על דפוסי שינה:
- ימים עם שינה גרועה: ${sleepPatterns.poorSleepDays}/${sleepPatterns.totalDays}
- איכות שינה ממוצעת: ${sleepPatterns.averageSleepQuality?.toFixed(1) || 'לא זמין'}
- מגמת שינה: ${sleepPatterns.recentTrend}

צרי תובנה קצרה (2-3 משפטים) עם הצעה מעשית. השתמשי בנתונים הספציפיים.`;

  try {
    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 150,
      temperature: 0.7
    });

    const assistantTokens = completion.usage?.completion_tokens || 0;

    return {
      type: 'pattern',
      title: 'דפוס שינה',
      description: completion.choices[0]?.message?.content || getFallbackSleepInsight(sleepPatterns, userName).description,
      data: sleepPatterns,
      assistantTokens
    };
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return { ...getFallbackSleepInsight(sleepPatterns, userName), assistantTokens: 0 };
  }
}

async function generateMoodInsight(moodTrends: MoodTrends, userName: string): Promise<Insight & { assistantTokens?: number }> {

  const systemPrompt = `את עליזה, עוזרת דיגיטלית חכמה לנשים במנופאוזה.
צרי תובנה חכמה על מגמות מצב רוח.
היה אמפתית, מעודדת ומעשית.
חשוב מאוד - סגנון אישי וחם:
- השתמשי בשם הפרטי "${userName}" בכל התובנות, לא "שתמשת" או "את"
- סגנון הפניה: "היי ${userName}" או "${userName} יקרה" - פניה ישירה ואישית כמו בשיחה עם חברה טובה
- במקום "${userName} חוותה..." כתבי "אני רואה שאת חווה..." או "${userName} יקרה, אני רואה שאת חווה..."
- היחס הוא אישי וחם, כמו בשיחה עם חברה טובה`;

  const userPrompt = `צרי תובנה על מגמות מצב רוח:
- מצב רוח דומיננטי: ${moodTrends.dominantMood}
- מגמת מצב רוח: ${moodTrends.recentMoodTrend}
- התפלגות מצבי רוח: ${JSON.stringify(moodTrends.moodCounts)}

צרי תובנה קצרה (2-3 משפטים) עם הצעה מעשית. השתמשי בנתונים הספציפיים.`;

  try {
    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 150,
      temperature: 0.7
    });

    const assistantTokens = completion.usage?.completion_tokens || 0;

    return {
      type: 'trend',
      title: 'מגמת מצב רוח',
      description: completion.choices[0]?.message?.content || getFallbackMoodInsight(moodTrends, userName).description,
      data: moodTrends,
      assistantTokens
    };
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return { ...getFallbackMoodInsight(moodTrends, userName), assistantTokens: 0 };
  }
}

async function generateEncouragementInsight(consecutiveDays: number, userName: string): Promise<Insight & { assistantTokens?: number }> {

  const systemPrompt = `את עליזה, עוזרת דיגיטלית חכמה לנשים במנופאוזה.
צרי הודעת עידוד חכמה ומעודדת.
היי חמה, אנושית ומעודדת. השתמשי באימוג'ים ובשפה אישית.
חשוב מאוד - סגנון אישי וחם:
- השתמשי בשם הפרטי "${userName}" בכל התובנות, לא "שתמשת" או "את"
- סגנון הפניה: "היי ${userName}" או "${userName} יקרה" - פניה ישירה ואישית כמו בשיחה עם חברה טובה
- במקום "${userName} חוותה..." כתבי "אני רואה שאת חווה..." או "${userName} יקרה, אני רואה שאת חווה..."
- היחס הוא אישי וחם, כמו בשיחה עם חברה טובה`;

  const userPrompt = `צרי הודעת עידוד:
- ימים רצופים של דיווח: ${consecutiveDays}

צרי הודעה קצרה (2-3 משפטים) מעודדת וחמה. השתמשי בנתונים הספציפיים.`;

  try {
    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 150,
      temperature: 0.8
    });

    const assistantTokens = completion.usage?.completion_tokens || 0;

    return {
      type: 'suggestion',
      title: 'עידוד',
      description: completion.choices[0]?.message?.content || getFallbackEncouragementInsight(consecutiveDays, userName).description,
      data: { consecutiveDays },
      assistantTokens
    };
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return { ...getFallbackEncouragementInsight(consecutiveDays, userName), assistantTokens: 0 };
  }
}

function getFallbackSleepInsight(sleepPatterns: SleepPatterns, userName: string = 'יקרה'): Insight {
  const { poorSleepDays, totalDays, averageSleepQuality } = sleepPatterns;
  
  if (poorSleepDays >= 3) {
    return {
      type: 'pattern',
      title: 'דפוס שינה',
      description: `היי ${userName}, אני רואה שלא ישנת טוב ב-${poorSleepDays} ימים מתוך ${totalDays}. זה יכול להשפיע על גלי החום. נסי תרגילי נשימה לפני השינה ושתי תה קמומיל.`,
      data: sleepPatterns
    };
  } else if (averageSleepQuality && averageSleepQuality < 2.5) {
    return {
      type: 'pattern',
      title: 'דפוס שינה',
      description: `היי ${userName}, אני רואה שהשינה שלך לא יציבה. נסי ליצור שגרת שינה קבועה - לכי לישון באותה שעה כל ערב.`,
      data: sleepPatterns
    };
  } else {
    return {
      type: 'pattern',
      title: 'דפוס שינה',
      description: `היי ${userName}, השינה שלך נראית טובה! המשכי עם השגרה הקיימת.`,
      data: sleepPatterns
    };
  }
}

function getFallbackMoodInsight(moodTrends: MoodTrends, userName: string = 'יקרה'): Insight {
  const { dominantMood } = moodTrends;
  
  if (dominantMood === 'sad' || dominantMood === 'frustrated') {
    return {
      type: 'trend',
      title: 'מגמת מצב רוח',
      description: `היי ${userName}, אני רואה שבשבוע האחרון הרגשת בעיקר ${dominantMood === 'sad' ? 'עצובה' : 'מתוסכלת'}. זה בסדר לחוות רגשות קשים - הנה כמה תרגילים שיכולים לעזור: נשימות עמוקות, הליכה קצרה, או שיחה עם חברה.`,
      data: moodTrends
    };
  } else {
    return {
      type: 'trend',
      title: 'מגמת מצב רוח',
      description: `היי ${userName}, המצב רוח שלך נראה יציב. המשכי לטפל בעצמך!`,
      data: moodTrends
    };
  }
}

function getFallbackEncouragementInsight(consecutiveDays: number, userName: string = 'יקרה'): Insight {
  return {
    type: 'suggestion',
    title: 'עידוד',
    description: consecutiveDays >= 7 
      ? `היי ${userName}, איזה יופי! אני רואה שעקבת כבר ${consecutiveDays} ימים ברצף 👏 הגוף שלך מדבר — ואת מקשיבה. עליזה גאה בך.`
      : `היי ${userName}, כל הכבוד על ההתמדה! 👏`,
    data: { consecutiveDays }
  };
}
