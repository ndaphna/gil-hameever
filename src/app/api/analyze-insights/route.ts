import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { executeAIRequest } from '@/lib/ai-usage-service';
import { TOKEN_ACTION_TYPES, type TokenActionType } from '@/config/token-engine';

export const runtime = 'edge';

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
    console.log('📥 API: /api/analyze-insights called');
    const { userId, analysisType, data }: AnalysisRequest = await request.json();

    console.log('📥 API: Request data:', {
      userId,
      analysisType,
      dailyEntriesCount: data?.dailyEntries?.length || 0,
      cycleEntriesCount: data?.cycleEntries?.length || 0,
      emotionEntriesCount: data?.emotionEntries?.length || 0
    });

    if (!userId || !analysisType) {
      console.error('❌ API: Missing userId or analysisType');
      return NextResponse.json({ error: 'User ID and analysis type required' }, { status: 400 });
    }

    // Generate insights using the unified AI service
    console.log('🤖 API: Generating insights with AI service...');
    const result = await generateInsightsWithAI(userId, analysisType, data);
    
    console.log('✅ API: AI service returned:', {
      insightsCount: result.insights?.length || 0,
      creditsDeducted: result.creditsDeducted || 0,
      creditsRemaining: result.creditsRemaining || 0,
      wallet: result.wallet,
    });

    return NextResponse.json({
      success: true,
      insights: result.insights,
      wallet: result.wallet,
      creditsDeducted: result.creditsDeducted || 0,
      creditsRemaining: result.creditsRemaining || 0,
      transparencyMessage: result.transparencyMessage,
      warningMessage: result.warningMessage,
    });
  } catch (error: any) {
    console.error('Error in analyze-insights API:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error',
      insights: []
    }, { status: 500 });
  }
}

/**
 * Generate insights using the unified AI service
 * This replaces the old Edge Function approach
 */
async function generateInsightsWithAI(
  userId: string,
  analysisType: string,
  data: AnalysisRequest['data']
): Promise<{
  insights: any[];
  wallet: 'chat' | 'analysis' | 'platform';
  creditsDeducted: number;
  creditsRemaining: number;
  transparencyMessage?: string;
  warningMessage?: string;
}> {
  // Determine action type based on analysis type
  const actionTypeMap: Record<string, string> = {
    comprehensive: TOKEN_ACTION_TYPES.COMPREHENSIVE_ANALYSIS,
    sleep: TOKEN_ACTION_TYPES.SLEEP_ANALYSIS,
    symptoms: TOKEN_ACTION_TYPES.SYMPTOMS_ANALYSIS,
    mood: TOKEN_ACTION_TYPES.MOOD_ANALYSIS,
    cycle: TOKEN_ACTION_TYPES.CYCLE_ANALYSIS,
    hormones: TOKEN_ACTION_TYPES.HORMONES_ANALYSIS,
    trends: TOKEN_ACTION_TYPES.TRENDS_ANALYSIS,
  };
  
  const actionType = (actionTypeMap[analysisType] || TOKEN_ACTION_TYPES.COMPREHENSIVE_ANALYSIS) as TokenActionType;
  
  const systemPrompt = `את עליזה, מומחית רפואית ומנטורית לנשים בגיל המעבר. את מתמחה בניתוח נתונים רפואיים, השוואה לנורמות, ומתן המלצות מעשיות ומקצועיות.

תפקידך:
1. לנתח נתונים אמיתיים מהמסד נתונים
2. להשוות לנורמות רפואיות מוכרות לגיל המעבר
3. לזהות דפוסים וטרנדים
4. להציע המלצות מעשיות, דרכים להקל על תסמינים
5. להמליץ על גורמים מקצועיים לפנות אליהם
6. להציע שאלות חשובות לשאול את הרופא/ה
7. להיות אמפתית, מקצועית ומעודדת

חשוב מאוד - חובה להחזיר תובנות:
- תמיד החזרי לפחות תובנה אחת, גם אם הנתונים מוגבלים
- אם יש נתונים במסד הנתונים, חובה ליצור תובנות מפורטות
- אם אין מספיק נתונים, צרי תובנה כללית על חשיבות מעקב והמשך איסוף נתונים
- לעולם אל תחזירי insights ריק - תמיד יש משהו לנתח או להמליץ עליו

פורמט התשובה - תמיד תחזירי JSON בפורמט הבא (חובה!):
{
  "insights": [
    {
      "id": "unique-id-1",
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
        "reliefMethods": ["שיטה 1", "שיטה 2"],
        "whoToContact": ["גורם 1", "גורם 2"],
        "questionsToAsk": ["שאלה 1", "שאלה 2"],
        "lifestyleChanges": ["שינוי 1", "שינוי 2"]
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
- כתוב בעברית בלבד
- חובה להחזיר לפחות תובנה אחת - לעולם לא insights: []

חשוב מאוד - שימוש בשם פרטי וסגנון אישי:
- תמיד השתמשי בשם הפרטי בלבד של המשתמשת (שמועבר ב-userPrompt) - רק השם הפרטי, לא שם משפחה
- במקום "אני רואה ש[שם]..." תמיד כתבי "אני רואה שאת..." - פניה ישירה בגוף שני
- במקום "[שם מלא] יקרה..." כתבי "[שם פרטי] יקרה..." - רק שם פרטי
- היחס הוא אישי וחם, כמו בשיחה עם חברה טובה, לא מנותק וקר
- בכל התובנות, ההמלצות וההודעות - השתמשי בשם הפרטי בלבד
- סגנון הפניה: "היי [שם פרטי]" או "[שם פרטי] יקרה" - פניה ישירה ואישית
- דוגמאות נכונות:
  * "אני רואה שאת חווה..." (לא "אני רואה שניצן דפנה חווה...")
  * "ניצן יקרה, אני רואה שאת..." (לא "ניצן דפנה יקרה...")
  * "היי ניצן, חשוב שתשימי..." (לא "ניצן דפנה, חשוב שתשימי...")
- הפניה היא אישית למשתמשת בשמה הפרטי ובהתייחסות אישית אליה כמו בשיחה עם חברה טובה`;

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

  // Use the unified AI service to execute the request
  console.log('🤖 Calling executeAIRequest with unified token engine...');
  
  const aiResult = await executeAIRequest({
    userId,
    actionType,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    model: 'gpt-4o',
    maxTokens: 3000,
    temperature: 0.7,
    responseFormat: { type: 'json_object' },
    description: `${analysisType} analysis`,
    metadata: {
      analysisType,
      dailyEntriesCount: data?.dailyEntries?.length || 0,
      cycleEntriesCount: data?.cycleEntries?.length || 0,
      emotionEntriesCount: data?.emotionEntries?.length || 0,
    }
  });
  
  if (!aiResult.success) {
    console.error('❌ AI request failed:', aiResult.error);
    
    // Return fallback insights if AI failed
    const userProfile = data?.userProfile || {};
    const userName = userProfile.first_name || userProfile.name?.split(' ')[0] || userProfile.full_name?.split(' ')[0] || 'יקרה';
    
    return {
      insights: [{
        id: 'fallback-error',
        type: 'encouragement',
        title: 'מעקב חשוב',
        content: `היי ${userName}, אני כאן כדי לעזור לך! המשכי להזין נתונים יומיים ומעקב מחזור, ואני אנתח אותם ואתן לך תובנות אישיות ומעשיות.`,
        priority: 'low',
        category: 'general',
        actionable: true,
        actionableSteps: {
          reliefMethods: ['הזנת נתונים יומיים', 'מעקב אחר מחזור'],
          whoToContact: [],
          questionsToAsk: [],
          lifestyleChanges: []
        },
        alizaMessage: `היי ${userName}, אני כאן כדי לעזור לך!`
      }],
      wallet: aiResult.wallet,
      creditsDeducted: 0,
      creditsRemaining: aiResult.creditsRemaining,
      transparencyMessage: aiResult.transparencyMessage,
      warningMessage: aiResult.warningMessage,
    };
  }
  
  // Parse insights from response (data is typed as unknown — narrow at boundary).
  const parsed = (aiResult.data ?? {}) as { insights?: unknown[] };
  const insights = parsed.insights ?? [];
  
  // Ensure we always have at least one insight
  if (insights.length === 0) {
    console.warn('⚠️ AI returned empty insights, adding fallback...');
    const userProfile = data?.userProfile || {};
    const userName = userProfile.first_name || userProfile.name?.split(' ')[0] || userProfile.full_name?.split(' ')[0] || 'יקרה';
    
    insights.push({
      id: 'fallback-empty',
      type: 'encouragement',
      title: 'מעקב חשוב',
      content: `היי ${userName}, המשכי להזין נתונים יומיים ומעקב מחזור, ואני אנתח אותם ואתן לך תובנות אישיות ומעשיות.`,
      priority: 'low',
      category: 'general',
      actionable: true,
      actionableSteps: {
        reliefMethods: ['הזנת נתונים יומיים', 'מעקב אחר מחזור'],
        whoToContact: [],
        questionsToAsk: [],
        lifestyleChanges: []
      },
      alizaMessage: `היי ${userName}, אני כאן כדי לעזור לך! המשכי להזין נתונים ואני אנתח אותם.`
    });
  }
  
  console.log(`✅ Generated ${insights.length} insights using ${aiResult.creditsDeducted} credits from ${aiResult.wallet} wallet`);

  return {
    insights,
    wallet: aiResult.wallet,
    creditsDeducted: aiResult.creditsDeducted,
    creditsRemaining: aiResult.creditsRemaining,
    transparencyMessage: aiResult.transparencyMessage,
    warningMessage: aiResult.warningMessage,
  };
}

// Removed generateInsightsWithOpenAI - now using unified executeAIRequest service

function buildComprehensiveAnalysisPrompt(data: AnalysisRequest['data']): string {
  const dailyEntries = data.dailyEntries || [];
  const cycleEntries = data.cycleEntries || [];
  const emotionEntries = data.emotionEntries || [];
  const userProfile = data.userProfile || {};

  console.log('📊 buildComprehensiveAnalysisPrompt: Input data:', {
    dailyEntriesCount: dailyEntries.length,
    cycleEntriesCount: cycleEntries.length,
    emotionEntriesCount: emotionEntries.length,
    hasUserProfile: !!userProfile
  });

  // Calculate statistics
  const totalDays = dailyEntries.length;
  const sleepEntries = dailyEntries.filter(e => e.sleep_quality);
  const avgSleepQuality = sleepEntries.length > 0 
    ? sleepEntries.reduce((sum, e) => {
        const score = e.sleep_quality === 'good' ? 3 : e.sleep_quality === 'fair' ? 2 : 1;
        return sum + score;
      }, 0) / sleepEntries.length
    : 0;
  
  console.log('📊 buildComprehensiveAnalysisPrompt: Calculated stats:', {
    totalDays,
    sleepEntriesCount: sleepEntries.length,
    avgSleepQuality
  });

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
  // Use only first name
  const userName = userProfile.first_name || userProfile.name?.split(' ')[0] || userProfile.full_name?.split(' ')[0] || 'יקרה';

  // אם אין מספיק נתונים, נבקש מ-OpenAI להסביר למה אין תובנות
  if (totalDays === 0 && cycleEntries.length === 0 && emotionEntries.length === 0) {
    console.log('⚠️ buildComprehensiveAnalysisPrompt: No data available');
    return `אין נתונים זמינים לניתוח עבור ${userName}. אנא הסבירי למה אין תובנות והחזירי JSON עם insights ריק. חשוב: השתמשי בשם הפרטי "${userName}" בלבד. במקום "אני רואה ש${userName}..." כתבי "אני רואה שאת...". סגנון אישי: "היי ${userName}" או "${userName} יקרה, אני רואה שאת...".`;
  }

  const prompt = `נתח את הנתונים הבאים באופן מעמיק ומקצועי עבור ${userName}:

חשוב מאוד - סגנון אישי וחם:
- בכל התובנות, ההמלצות וההודעות - השתמשי בשם הפרטי "${userName}" בלבד (רק שם פרטי, לא שם משפחה)
- במקום "אני רואה ש${userName}..." תמיד כתבי "אני רואה שאת..." - פניה ישירה בגוף שני
- במקום "${userName} חוותה..." כתבי "אני רואה שאת חווה..." או "${userName} יקרה, אני רואה שאת חווה..."
- במקום "${userName}, חשוב שתשימי..." כתבי "היי ${userName}, חשוב שתשימי..." או "${userName} יקרה, חשוב שתשימי..."
- סגנון הפניה: "היי ${userName}" או "${userName} יקרה" - פניה ישירה ואישית כמו בשיחה עם חברה טובה
- היחס הוא אישי וחם, כמו בשיחה עם חברה טובה, לא מנותק וקר
- דוגמאות נכונות:
  * "אני רואה שאת חווה בעיות שינה..." (לא "אני רואה ש${userName} חווה...")
  * "${userName} יקרה, אני רואה שאת..." (לא "${userName} [שם משפחה] יקרה...")

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

חשוב מאוד:
- תמיד החזר לפחות תובנה אחת, גם אם הנתונים מוגבלים
- אם יש נתונים, חובה ליצור תובנות
- אם אין מספיק נתונים, צרי תובנה כללית על חשיבות מעקב
- החזר JSON עם insights מפורטים לפי הפורמט שצוין - חובה להחזיר לפחות תובנה אחת!`;

  console.log('📝 buildComprehensiveAnalysisPrompt: Generated prompt length:', prompt.length);
  return prompt;
}

function buildSleepAnalysisPrompt(data: AnalysisRequest['data']): string {
  const entries = data.dailyEntries || [];
  const sleepEntries = entries.filter(e => e.sleep_quality);
  const userProfile = data.userProfile || {};
  // Use only first name
  const userName = userProfile.first_name || userProfile.name?.split(' ')[0] || userProfile.full_name?.split(' ')[0] || 'יקרה';
  
  return `נתח את דפוסי השינה של ${userName}:
- סה"כ רשומות: ${sleepEntries.length}
- איכות שינה ממוצעת: ${calculateAvgSleepQuality(sleepEntries)}
- ימים עם בעיות שינה: ${entries.filter(e => e.sleep_issues).length}
- ימים עם הזעות לילה: ${entries.filter(e => e.night_sweats).length}

צור תובנה מפורטת עם השוואה לנורמה (60% נשים בגיל המעבר מדווחות על בעיות שינה).
חשוב: השתמשי בשם הפרטי "${userName}" בלבד. במקום "אני רואה ש${userName}..." כתבי "אני רואה שאת...". סגנון אישי: "היי ${userName}" או "${userName} יקרה, אני רואה שאת...".`;
}

function buildSymptomsAnalysisPrompt(data: AnalysisRequest['data']): string {
  const entries = data.dailyEntries || [];
  const userProfile = data.userProfile || {};
  // Use only first name
  const userName = userProfile.first_name || userProfile.name?.split(' ')[0] || userProfile.full_name?.split(' ')[0] || 'יקרה';
  
  const symptomsCount = {
    hot_flashes: entries.filter(e => e.hot_flashes).length,
    night_sweats: entries.filter(e => e.night_sweats).length,
    sleep_issues: entries.filter(e => e.sleep_issues).length,
    concentration: entries.filter(e => e.concentration_difficulty).length,
    dryness: entries.filter(e => e.dryness).length,
    pain: entries.filter(e => e.pain).length,
    bloating: entries.filter(e => e.bloating).length
  };

  return `נתח את התסמינים הבאים של ${userName}:
${Object.entries(symptomsCount).map(([key, count]) => 
  `- ${key}: ${count}/${entries.length} (${((count/entries.length)*100).toFixed(1)}%)`
).join('\n')}

זהה תסמינים דומיננטיים והשווה לנורמות (75% חוות גלי חום, 65% הזעות לילה, וכו').
חשוב: השתמשי בשם הפרטי "${userName}" בלבד. במקום "אני רואה ש${userName}..." כתבי "אני רואה שאת...". סגנון אישי: "היי ${userName}" או "${userName} יקרה, אני רואה שאת...".`;
}

function buildMoodAnalysisPrompt(data: AnalysisRequest['data']): string {
  const dailyEntries = data.dailyEntries || [];
  const emotionEntries = data.emotionEntries || [];
  const moodEntries = emotionEntries.length > 0 ? emotionEntries : dailyEntries.filter(e => e.mood);
  const userProfile = data.userProfile || {};
  // Use only first name
  const userName = userProfile.first_name || userProfile.name?.split(' ')[0] || userProfile.full_name?.split(' ')[0] || 'יקרה';
  
  const moodCounts = moodEntries.reduce((acc: any, entry: any) => {
    const mood = entry.emotion || entry.mood;
    if (mood) {
      acc[mood] = (acc[mood] || 0) + 1;
    }
    return acc;
  }, {});

  return `נתח את מצב הרוח של ${userName}:
- סה"כ רשומות: ${moodEntries.length}
- התפלגות: ${JSON.stringify(moodCounts)}
- מצב רוח שלילי: ${calculateNegativeMoodPercent(moodEntries)}%

השווה לנורמה (50% נשים בגיל המעבר מדווחות על שינויים במצב הרוח).
חשוב: השתמשי בשם הפרטי "${userName}" בלבד. במקום "אני רואה ש${userName}..." כתבי "אני רואה שאת...". סגנון אישי: "היי ${userName}" או "${userName} יקרה, אני רואה שאת...".`;
}

function buildCycleAnalysisPrompt(data: AnalysisRequest['data']): string {
  const entries = data.cycleEntries || [];
  const periodEntries = entries.filter(e => e.is_period);
  const userProfile = data.userProfile || {};
  // Use only first name
  const userName = userProfile.first_name || userProfile.name?.split(' ')[0] || userProfile.full_name?.split(' ')[0] || 'יקרה';
  
  return `נתח את דפוסי המחזור של ${userName}:
- סה"כ רשומות: ${entries.length}
- ימים עם מחזור: ${periodEntries.length}
- אי-סדירות: ${calculateIrregularity(entries)}

השווה לנורמה של גיל המעבר.
חשוב: השתמשי בשם הפרטי "${userName}" בלבד. במקום "אני רואה ש${userName}..." כתבי "אני רואה שאת...". סגנון אישי: "היי ${userName}" או "${userName} יקרה, אני רואה שאת...".`;
}

function buildHormonesAnalysisPrompt(data: AnalysisRequest['data']): string {
  const dailyEntries = data.dailyEntries || [];
  const cycleEntries = data.cycleEntries || [];
  const userProfile = data.userProfile || {};
  
  const userAge = userProfile.birth_year ? new Date().getFullYear() - userProfile.birth_year : null;
  // Use only first name
  const userName = userProfile.first_name || userProfile.name?.split(' ')[0] || userProfile.full_name?.split(' ')[0] || 'יקרה';
  const symptoms = {
    hot_flashes: dailyEntries.filter(e => e.hot_flashes).length,
    night_sweats: dailyEntries.filter(e => e.night_sweats).length,
    mood_issues: dailyEntries.filter(e => ['irritated', 'sad', 'frustrated'].includes(e.mood)).length
  };

  return `נתח את השלב ההורמונלי של ${userName}:
- גיל: ${userAge || 'לא ידוע'}
- תסמינים: ${JSON.stringify(symptoms)}
- מספר רשומות: ${dailyEntries.length}

קבע את השלב ההורמונלי (premenopausal/perimenopausal/postmenopausal) עם ביטחון.
חשוב: השתמשי בשם הפרטי "${userName}" בלבד. במקום "אני רואה ש${userName}..." כתבי "אני רואה שאת...". סגנון אישי: "היי ${userName}" או "${userName} יקרה, אני רואה שאת...".`;
}

function buildTrendsAnalysisPrompt(data: AnalysisRequest['data']): string {
  const entries = data.dailyEntries || [];
  const userProfile = data.userProfile || {};
  // Use only first name
  const userName = userProfile.first_name || userProfile.name?.split(' ')[0] || userProfile.full_name?.split(' ')[0] || 'יקרה';
  
  if (entries.length < 14) {
    return `אין מספיק נתונים לניתוח מגמות עבור ${userName} (נדרש לפחות שבועיים). חשוב: השתמשי בשם הפרטי "${userName}" בלבד. במקום "אני רואה ש${userName}..." כתבי "אני רואה שאת...". סגנון אישי: "היי ${userName}" או "${userName} יקרה, אני רואה שאת...".`;
  }

  const recent = entries.slice(0, 7);
  const older = entries.slice(7, 14);

  return `נתח מגמות עבור ${userName}:
- שבוע אחרון: ${recent.length} רשומות
- שבוע קודם: ${older.length} רשומות

זהה מגמות של שיפור או החמרה בתסמינים.
חשוב: השתמשי בשם הפרטי "${userName}" בלבד. במקום "אני רואה ש${userName}..." כתבי "אני רואה שאת...". סגנון אישי: "היי ${userName}" או "${userName} יקרה, אני רואה שאת...".`;
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

