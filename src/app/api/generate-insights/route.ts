import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import OpenAI from 'openai';

console.log('🔑 OpenAI API Key loaded:', process.env.OPENAI_API_KEY ? 'YES' : 'NO');
console.log('🔑 Supabase URL loaded:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'YES' : 'NO');
console.log('🔑 Supabase Service Key loaded:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'YES' : 'NO');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    // Calculate patterns
    const consecutiveDays = calculateConsecutiveDays(checkIns);
    const sleepPatterns = analyzeSleepPatterns(checkIns);
    const moodTrends = analyzeMoodTrends(checkIns);

    const insights = [];

    // Generate sleep insight
    if (sleepPatterns.totalDays > 0) {
      const sleepInsight = await generateSleepInsight(sleepPatterns);
      insights.push(sleepInsight);
    }

    // Generate mood insight
    if (moodTrends.dominantMood) {
      const moodInsight = await generateMoodInsight(moodTrends);
      insights.push(moodInsight);
    }

    // Generate encouragement insight
    if (consecutiveDays > 0) {
      const encouragementInsight = await generateEncouragementInsight(consecutiveDays);
      insights.push(encouragementInsight);
    }

    // Save insights to database
    for (const insight of insights) {
      await supabaseAdmin
        .from('journal_insights')
        .insert({
          user_id: userId,
          type: insight.type,
          title: insight.title,
          description: insight.description,
          data: insight.data
        });
    }

    // Deduct tokens for AI-generated insights (only if OpenAI was used)
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'dummy-key' && insights.length > 0) {
      const tokensToDeduct = insights.length * 10; // 10 tokens per insight
      try {
        // Get current tokens first
        const { data: profile } = await supabaseAdmin
          .from('user_profile')
          .select('current_tokens')
          .eq('id', userId)
          .single();
        
        if (profile) {
          const newTokens = Math.max(0, (profile.current_tokens || 0) - tokensToDeduct);
          await supabaseAdmin
            .from('user_profile')
            .update({ current_tokens: newTokens })
            .eq('id', userId);
          
          console.log(`Deducted ${tokensToDeduct} tokens for ${insights.length} insights. New balance: ${newTokens}`);
        }
      } catch (error) {
        console.error('Error deducting tokens:', error);
      }
    }

    return NextResponse.json({ success: true, insights });
  } catch (error) {
    console.error('Error generating insights:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calculateConsecutiveDays(checkIns: any[]): number {
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

function analyzeSleepPatterns(checkIns: any[]): any {
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

function analyzeMoodTrends(checkIns: any[]): any {
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

async function generateSleepInsight(sleepPatterns: any): Promise<any> {

  const systemPrompt = `את עליזה, עוזרת דיגיטלית חכמה לנשים במנופאוזה.
צרי תובנה חכמה על דפוסי שינה בהתבסס על הנתונים.
היה מדויקת, מעודדת ומעשית. השתמשי בנתונים הספציפיים של המשתמשת.`;

  const userPrompt = `צרי תובנה על דפוסי שינה:
- ימים עם שינה גרועה: ${sleepPatterns.poorSleepDays}/${sleepPatterns.totalDays}
- איכות שינה ממוצעת: ${sleepPatterns.averageSleepQuality?.toFixed(1) || 'לא זמין'}
- מגמת שינה: ${sleepPatterns.recentTrend}

צרי תובנה קצרה (2-3 משפטים) עם הצעה מעשית. השתמשי בנתונים הספציפיים.`;

  try {
    if (!openai) {
      throw new Error('OpenAI client not available');
    }
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 150,
      temperature: 0.7
    });

    return {
      type: 'pattern',
      title: 'דפוס שינה',
      description: completion.choices[0]?.message?.content || getFallbackSleepInsight(sleepPatterns).description,
      data: sleepPatterns
    };
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return getFallbackSleepInsight(sleepPatterns);
  }
}

async function generateMoodInsight(moodTrends: any): Promise<any> {

  const systemPrompt = `את עליזה, עוזרת דיגיטלית חכמה לנשים במנופאוזה.
צרי תובנה חכמה על מגמות מצב רוח.
היה אמפתית, מעודדת ומעשית. השתמשי בנתונים הספציפיים של המשתמשת.`;

  const userPrompt = `צרי תובנה על מגמות מצב רוח:
- מצב רוח דומיננטי: ${moodTrends.dominantMood}
- מגמת מצב רוח: ${moodTrends.recentMoodTrend}
- התפלגות מצבי רוח: ${JSON.stringify(moodTrends.moodCounts)}

צרי תובנה קצרה (2-3 משפטים) עם הצעה מעשית. השתמשי בנתונים הספציפיים.`;

  try {
    if (!openai) {
      throw new Error('OpenAI client not available');
    }
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 150,
      temperature: 0.7
    });

    return {
      type: 'trend',
      title: 'מגמת מצב רוח',
      description: completion.choices[0]?.message?.content || getFallbackMoodInsight(moodTrends).description,
      data: moodTrends
    };
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return getFallbackMoodInsight(moodTrends);
  }
}

async function generateEncouragementInsight(consecutiveDays: number): Promise<any> {

  const systemPrompt = `את עליזה, עוזרת דיגיטלית חכמה לנשים במנופאוזה.
צרי הודעת עידוד חכמה ומעודדת.
היי חמה, אנושית ומעודדת. השתמשי באימוג'ים ובשפה אישית.`;

  const userPrompt = `צרי הודעת עידוד:
- ימים רצופים של דיווח: ${consecutiveDays}

צרי הודעה קצרה (2-3 משפטים) מעודדת וחמה. השתמשי בנתונים הספציפיים.`;

  try {
    if (!openai) {
      throw new Error('OpenAI client not available');
    }
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 150,
      temperature: 0.8
    });

    return {
      type: 'suggestion',
      title: 'עידוד',
      description: completion.choices[0]?.message?.content || getFallbackEncouragementInsight(consecutiveDays).description,
      data: { consecutiveDays }
    };
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return getFallbackEncouragementInsight(consecutiveDays);
  }
}

function getFallbackSleepInsight(sleepPatterns: any): any {
  const { poorSleepDays, totalDays, averageSleepQuality } = sleepPatterns;
  
  if (poorSleepDays >= 3) {
    return {
      type: 'pattern',
      title: 'דפוס שינה',
      description: `שמתי לב שלא ישנת טוב ב-${poorSleepDays} ימים מתוך ${totalDays}. זה יכול להשפיע על גלי החום. נסי תרגילי נשימה לפני השינה ושתי תה קמומיל.`,
      data: sleepPatterns
    };
  } else if (averageSleepQuality && averageSleepQuality < 2.5) {
    return {
      type: 'pattern',
      title: 'דפוס שינה',
      description: `השינה שלך לא יציבה. נסי ליצור שגרת שינה קבועה - לכי לישון באותה שעה כל ערב.`,
      data: sleepPatterns
    };
  } else {
    return {
      type: 'pattern',
      title: 'דפוס שינה',
      description: `השינה שלך נראית טובה! המשכי עם השגרה הקיימת.`,
      data: sleepPatterns
    };
  }
}

function getFallbackMoodInsight(moodTrends: any): any {
  const { dominantMood } = moodTrends;
  
  if (dominantMood === 'sad' || dominantMood === 'frustrated') {
    return {
      type: 'trend',
      title: 'מגמת מצב רוח',
      description: `בשבוע האחרון הרגשת בעיקר ${dominantMood === 'sad' ? 'עצובה' : 'מתוסכלת'}. זה בסדר לחוות רגשות קשים - הנה כמה תרגילים שיכולים לעזור: נשימות עמוקות, הליכה קצרה, או שיחה עם חברה.`,
      data: moodTrends
    };
  } else {
    return {
      type: 'trend',
      title: 'מגמת מצב רוח',
      description: `המצב רוח שלך נראה יציב. המשכי לטפל בעצמך!`,
      data: moodTrends
    };
  }
}

function getFallbackEncouragementInsight(consecutiveDays: number): any {
  return {
    type: 'suggestion',
    title: 'עידוד',
    description: consecutiveDays >= 7 
      ? `איזה יופי! עקבת כבר ${consecutiveDays} ימים ברצף 👏 הגוף שלך מדבר — ואת מקשיבה. עליזה גאה בך.`
      : `כל הכבוד על ההתמדה! 👏`,
    data: { consecutiveDays }
  };
}
