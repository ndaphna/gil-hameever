import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AnalysisRequest {
  userId: string;
  analysisType: 'comprehensive' | 'sleep' | 'symptoms' | 'mood' | 'cycle' | 'hormones' | 'trends';
  data: {
    dailyEntries?: any[];
    cycleEntries?: any[];
    emotionEntries?: any[];
    userProfile?: any;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { userId, analysisType, data }: AnalysisRequest = await request.json();

    if (!userId || !analysisType) {
      return NextResponse.json({ error: 'User ID and analysis type required' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        error: 'OpenAI API key not configured',
        insights: [] // Return empty insights if no API key
      }, { status: 500 });
    }

    // Generate insights using OpenAI
    const insights = await generateInsightsWithOpenAI(analysisType, data);

    return NextResponse.json({ success: true, insights });
  } catch (error: any) {
    console.error('Error in analyze-insights API:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error',
      insights: []
    }, { status: 500 });
  }
}

async function generateInsightsWithOpenAI(
  analysisType: string,
  data: AnalysisRequest['data']
): Promise<any[]> {
  const systemPrompt = `את עליזה, מומחית רפואית ומנטורית לנשים בגיל המעבר. את מתמחה בניתוח נתונים רפואיים, השוואה לנורמות, ומתן המלצות מעשיות ומקצועיות.

תפקידך:
1. לנתח נתונים אמיתייםשתמשת
2. להשוות לנורמות רפואיות מוכרות לגיל המעבר
3. לזהות דפוסים וטרנדים
4. להציע המלצות מעשיות, דרכים להקל על תסמינים
5. להמליץ על גורמים מקצועיים לפנות אליהם
6. להציע שאלות חשובות לשאול את הרופא/ה
7. להיות אמפתית, מקצועית ומעודדת

פורמט התשובה - תמיד תחזיר JSON בפורמט הבא (חובה!):
{
  "insights": [
    {
      "id": "unique-id",
      "type": "pattern|recommendation|warning|encouragement",
      "title": "כותרת קצרה ומדויקת",
      "content": "תיאור מפורט של התובנה",
      "priority": "high|medium|low",
      "category": "sleep|symptoms|mood|cycle|hormones|lifestyle",
      "actionable": true|false,
      "comparisonToNorm": {
        "userValue": מספר,
        "averageValue": מספר,
        "explanation": "הסבר השוואה לנורמה"
      },
      "actionableSteps": {
        "reliefMethods": ["שיטה 1", "שיטה 2", ...],
        "whoToContact": ["גורם 1", "גורם 2", ...],
        "questionsToAsk": ["שאלה 1", "שאלה 2", ...],
        "lifestyleChanges": ["שינוי 1", "שינוי 2", ...]
      },
      "alizaMessage": "הודעה אישית חמה מעליזה"
    }
  ]
}

חשוב:
- כל הנתונים שאת מקבלת הם אמיתיים מהמסד נתונים
- השווה תמיד לנורמות רפואיות מוכרות (60-75% לנשים בגיל המעבר חוות בעיות שינה, 75% חוות גלי חום, וכו')
- תן המלצות ספציפיות ומעשיות
- היה מדויקת עם המספרים והנתונים
- כתוב בעברית בלבד`;

  let userPrompt = '';

  switch (analysisType) {
    case 'sleep':
      userPrompt = buildSleepAnalysisPrompt(data);
      break;
    case 'symptoms':
      userPrompt = buildSymptomsAnalysisPrompt(data);
      break;
    case 'mood':
      userPrompt = buildMoodAnalysisPrompt(data);
      break;
    case 'cycle':
      userPrompt = buildCycleAnalysisPrompt(data);
      break;
    case 'hormones':
      userPrompt = buildHormonesAnalysisPrompt(data);
      break;
    case 'trends':
      userPrompt = buildTrendsAnalysisPrompt(data);
      break;
    case 'comprehensive':
    default:
      userPrompt = buildComprehensiveAnalysisPrompt(data);
      break;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 3000,
      temperature: 0.7
    });

    const responseContent = completion.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(responseContent);
    
    return parsed.insights || [];
  } catch (error: any) {
    console.error('Error calling OpenAI:', error);
    return [];
  }
}

function buildComprehensiveAnalysisPrompt(data: AnalysisRequest['data']): string {
  const dailyEntries = data.dailyEntries || [];
  const cycleEntries = data.cycleEntries || [];
  const emotionEntries = data.emotionEntries || [];
  const userProfile = data.userProfile || {};

  // Calculate statistics
  const totalDays = dailyEntries.length;
  const sleepEntries = dailyEntries.filter(e => e.sleep_quality);
  const avgSleepQuality = sleepEntries.length > 0 
    ? sleepEntries.reduce((sum, e) => {
        const score = e.sleep_quality === 'good' ? 3 : e.sleep_quality === 'fair' ? 2 : 1;
        return sum + score;
      }, 0) / sleepEntries.length
    : 0;

  const symptoms = {
    hot_flashes: dailyEntries.filter(e => e.hot_flashes).length,
    night_sweats: dailyEntries.filter(e => e.night_sweats).length,
    sleep_issues: dailyEntries.filter(e => e.sleep_issues || e.woke_up_night).length,
    mood_issues: dailyEntries.filter(e => ['irritated', 'sad', 'frustrated'].includes(e.mood)).length,
    concentration: dailyEntries.filter(e => e.concentration_difficulty).length,
    dryness: dailyEntries.filter(e => e.dryness).length,
    pain: dailyEntries.filter(e => e.pain).length,
    bloating: dailyEntries.filter(e => e.bloating).length
  };

  const userAge = userProfile.birth_year ? new Date().getFullYear() - userProfile.birth_year : null;

  return `נתח את הנתונים הבאים באופן מעמיק ומקצועי:

נתונים כללים:
- מספר ימים של נתונים: ${totalDays}
- גיל משתמש: ${userAge || 'לא ידוע'}

איכות שינה:
- מספר רשומות שינה: ${sleepEntries.length}
- איכות שינה ממוצעת: ${avgSleepQuality.toFixed(2)} (1=poor, 2=fair, 3=good)
- ימים עם בעיות שינה: ${symptoms.sleep_issues}/${totalDays} (${((symptoms.sleep_issues/totalDays)*100).toFixed(1)}%)
- ימים עם הזעות לילה: ${symptoms.night_sweats}/${totalDays} (${((symptoms.night_sweats/totalDays)*100).toFixed(1)}%)

תסמינים:
${Object.entries(symptoms).map(([key, count]) => 
  `- ${key}: ${count}/${totalDays} (${((count/totalDays)*100).toFixed(1)}%)`
).join('\n')}

מחזור:
- מספר רשומות מחזור: ${cycleEntries.length}
- ימים עם מחזור: ${cycleEntries.filter(e => e.is_period).length}

מצב רוח:
- רשומות מצב רוח: ${emotionEntries.length || dailyEntries.filter(e => e.mood).length}

צור ניתוח מקיף הכולל:
1. השוואה לנורמות רפואיות (60% נשים מדווחות על בעיות שינה, 75% על גלי חום, וכו')
2. זיהוי דפוסים חשובים
3. המלצות מעשיות ספציפיות
4. גורמים מקצועיים לפנות אליהם
5. שאלות חשובות לשאול רופא/ה
6. דרכים להקל על התסמינים

החזר JSON עם insights מפורטים לפי הפורמט שצוין.`;
}

function buildSleepAnalysisPrompt(data: AnalysisRequest['data']): string {
  const entries = data.dailyEntries || [];
  const sleepEntries = entries.filter(e => e.sleep_quality);
  
  return `נתח את דפוסי השינה:
- סה"כ רשומות: ${sleepEntries.length}
- איכות שינה ממוצעת: ${calculateAvgSleepQuality(sleepEntries)}
- ימים עם בעיות שינה: ${entries.filter(e => e.sleep_issues).length}
- ימים עם הזעות לילה: ${entries.filter(e => e.night_sweats).length}

צור תובנה מפורטת עם השוואה לנורמה (60% נשים בגיל המעבר מדווחות על בעיות שינה).`;
}

function buildSymptomsAnalysisPrompt(data: AnalysisRequest['data']): string {
  const entries = data.dailyEntries || [];
  
  const symptomsCount = {
    hot_flashes: entries.filter(e => e.hot_flashes).length,
    night_sweats: entries.filter(e => e.night_sweats).length,
    sleep_issues: entries.filter(e => e.sleep_issues).length,
    concentration: entries.filter(e => e.concentration_difficulty).length,
    dryness: entries.filter(e => e.dryness).length,
    pain: entries.filter(e => e.pain).length,
    bloating: entries.filter(e => e.bloating).length
  };

  return `נתח את התסמינים הבאים:
${Object.entries(symptomsCount).map(([key, count]) => 
  `- ${key}: ${count}/${entries.length} (${((count/entries.length)*100).toFixed(1)}%)`
).join('\n')}

זהה תסמינים דומיננטיים והשווה לנורמות (75% חוות גלי חום, 65% הזעות לילה, וכו').`;
}

function buildMoodAnalysisPrompt(data: AnalysisRequest['data']): string {
  const dailyEntries = data.dailyEntries || [];
  const emotionEntries = data.emotionEntries || [];
  const moodEntries = emotionEntries.length > 0 ? emotionEntries : dailyEntries.filter(e => e.mood);
  
  const moodCounts = moodEntries.reduce((acc: any, entry: any) => {
    const mood = entry.emotion || entry.mood;
    if (mood) {
      acc[mood] = (acc[mood] || 0) + 1;
    }
    return acc;
  }, {});

  return `נתח את מצב הרוח:
- סה"כ רשומות: ${moodEntries.length}
- התפלגות: ${JSON.stringify(moodCounts)}
- מצב רוח שלילי: ${calculateNegativeMoodPercent(moodEntries)}%

השווה לנורמה (50% נשים בגיל המעבר מדווחות על שינויים במצב הרוח).`;
}

function buildCycleAnalysisPrompt(data: AnalysisRequest['data']): string {
  const entries = data.cycleEntries || [];
  const periodEntries = entries.filter(e => e.is_period);
  
  return `נתח את דפוסי המחזור:
- סה"כ רשומות: ${entries.length}
- ימים עם מחזור: ${periodEntries.length}
- אי-סדירות: ${calculateIrregularity(entries)}

השווה לנורמה של גיל המעבר.`;
}

function buildHormonesAnalysisPrompt(data: AnalysisRequest['data']): string {
  const dailyEntries = data.dailyEntries || [];
  const cycleEntries = data.cycleEntries || [];
  const userProfile = data.userProfile || {};
  
  const userAge = userProfile.birth_year ? new Date().getFullYear() - userProfile.birth_year : null;
  const symptoms = {
    hot_flashes: dailyEntries.filter(e => e.hot_flashes).length,
    night_sweats: dailyEntries.filter(e => e.night_sweats).length,
    mood_issues: dailyEntries.filter(e => ['irritated', 'sad', 'frustrated'].includes(e.mood)).length
  };

  return `נתח את השלב ההורמונלי:
- גיל: ${userAge || 'לא ידוע'}
- תסמינים: ${JSON.stringify(symptoms)}
- מספר רשומות: ${dailyEntries.length}

קבע את השלב ההורמונלי (premenopausal/perimenopausal/postmenopausal) עם ביטחון.`;
}

function buildTrendsAnalysisPrompt(data: AnalysisRequest['data']): string {
  const entries = data.dailyEntries || [];
  
  if (entries.length < 14) {
    return 'אין מספיק נתונים לניתוח מגמות (נדרש לפחות שבועיים).';
  }

  const recent = entries.slice(0, 7);
  const older = entries.slice(7, 14);

  return `נתח מגמות:
- שבוע אחרון: ${recent.length} רשומות
- שבוע קודם: ${older.length} רשומות

זהה מגמות של שיפור או החמרה בתסמינים.`;
}

// Helper functions
function calculateAvgSleepQuality(sleepEntries: any[]): string {
  if (sleepEntries.length === 0) return '0';
  const scores = sleepEntries.map(e => {
    if (e.sleep_quality === 'good') return 3;
    if (e.sleep_quality === 'fair') return 2;
    return 1;
  });
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return avg.toFixed(2);
}

function calculateNegativeMoodPercent(moodEntries: any[]): number {
  if (moodEntries.length === 0) return 0;
  const negative = moodEntries.filter(e => {
    const mood = e.emotion || e.mood;
    return ['irritated', 'sad', 'frustrated'].includes(mood);
  }).length;
  return Math.round((negative / moodEntries.length) * 100);
}

function calculateIrregularity(cycleEntries: any[]): string {
  if (cycleEntries.length < 3) return 'לא מספיק נתונים';
  const periods = cycleEntries.filter(e => e.is_period).map(e => new Date(e.date));
  if (periods.length < 3) return 'לא מספיק מחזורים';
  
  const intervals = [];
  for (let i = 1; i < periods.length; i++) {
    const diff = (periods[i].getTime() - periods[i-1].getTime()) / (1000 * 60 * 60 * 24);
    intervals.push(diff);
  }
  
  const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const variance = intervals.reduce((sum, int) => sum + Math.pow(int - avg, 2), 0) / intervals.length;
  const stdDev = Math.sqrt(variance);
  
  return `${(stdDev / avg * 100).toFixed(1)}%`;
}

