/**
 * תבניות מייל בעברית עבור התראות חכמות
 */

import { DailyEntry, CycleEntry } from '@/types/journal';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface UserStatistics {
  totalEntries: number;
  daysTracked: number;
  lastEntryDate: string | null;
  sleepStats: {
    good: number;
    fair: number;
    poor: number;
    goodPercentage: number;
  };
  moodStats: {
    happy: number;
    calm: number;
    sad: number;
    frustrated: number;
    irritated: number;
    dominantMood: string;
  };
  symptomStats: {
    hotFlashes: number;
    hotFlashesPercentage: number;
    nightSweats: number;
    poorSleep: number;
    lowEnergy: number;
  };
  energyStats: {
    high: number;
    medium: number;
    low: number;
    average: string;
  };
  recentTrends: {
    sleepImproving: boolean;
    moodImproving: boolean;
    symptomsDecreasing: boolean;
  };
  cycleInfo?: {
    lastPeriod?: string;
    cycleLength?: number;
  };
}

/**
 * מחשב סטטיסטיקות מהנתונים של המשתמשת
 */
export function calculateUserStatistics(
  dailyEntries: DailyEntry[],
  cycleEntries: CycleEntry[]
): UserStatistics {
  const totalEntries = dailyEntries.length;
  const uniqueDates = new Set(dailyEntries.map(e => e.date)).size;
  
  // סטטיסטיקות שינה
  const sleepEntries = dailyEntries.filter(e => e.sleep_quality);
  const goodSleep = sleepEntries.filter(e => e.sleep_quality === 'good').length;
  const fairSleep = sleepEntries.filter(e => e.sleep_quality === 'fair').length;
  const poorSleep = sleepEntries.filter(e => e.sleep_quality === 'poor').length;
  const goodSleepPercentage = sleepEntries.length > 0 
    ? Math.round((goodSleep / sleepEntries.length) * 100) 
    : 0;

  // סטטיסטיקות מצב רוח
  const moodEntries = dailyEntries.filter(e => e.mood);
  const happy = moodEntries.filter(e => e.mood === 'happy').length;
  const calm = moodEntries.filter(e => e.mood === 'calm').length;
  const sad = moodEntries.filter(e => e.mood === 'sad').length;
  const frustrated = moodEntries.filter(e => e.mood === 'frustrated').length;
  const irritated = moodEntries.filter(e => e.mood === 'irritated').length;
  
  const moodCounts = { happy, calm, sad, frustrated, irritated };
  const dominantMood = Object.entries(moodCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'calm';
  
  const moodLabels: Record<string, string> = {
    happy: 'שמחה 😊',
    calm: 'רגועה 🧘',
    sad: 'עצובה 💙',
    frustrated: 'מתוסכלת 😤',
    irritated: 'עצבנית 😠'
  };

  // סטטיסטיקות תסמינים
  const hotFlashes = dailyEntries.filter(e => e.hot_flashes).length;
  const hotFlashesPercentage = totalEntries > 0 
    ? Math.round((hotFlashes / totalEntries) * 100) 
    : 0;
  const nightSweats = dailyEntries.filter(e => e.night_sweats).length;
  const poorSleepDays = dailyEntries.filter(e => e.sleep_quality === 'poor').length;
  const lowEnergy = dailyEntries.filter(e => e.energy_level === 'low').length;

  // סטטיסטיקות אנרגיה
  const energyEntries = dailyEntries.filter(e => e.energy_level);
  const highEnergy = energyEntries.filter(e => e.energy_level === 'high').length;
  const mediumEnergy = energyEntries.filter(e => e.energy_level === 'medium').length;
  const lowEnergyCount = energyEntries.filter(e => e.energy_level === 'low').length;
  
  let averageEnergy = 'בינונית';
  if (energyEntries.length > 0) {
    const energyScore = (highEnergy * 3 + mediumEnergy * 2 + lowEnergyCount * 1) / energyEntries.length;
    if (energyScore >= 2.5) averageEnergy = 'גבוהה';
    else if (energyScore >= 1.5) averageEnergy = 'בינונית';
    else averageEnergy = 'נמוכה';
  }

  // מגמות אחרונות (השוואה בין שבוע אחרון לשבוע הקודם)
  const lastWeek = dailyEntries.slice(0, 7);
  const previousWeek = dailyEntries.slice(7, 14);
  
  const lastWeekGoodSleep = lastWeek.filter(e => e.sleep_quality === 'good').length;
  const previousWeekGoodSleep = previousWeek.filter(e => e.sleep_quality === 'good').length;
  const sleepImproving = lastWeekGoodSleep > previousWeekGoodSleep && previousWeek.length > 0;
  
  const lastWeekHappy = lastWeek.filter(e => e.mood === 'happy' || e.mood === 'calm').length;
  const previousWeekHappy = previousWeek.filter(e => e.mood === 'happy' || e.mood === 'calm').length;
  const moodImproving = lastWeekHappy > previousWeekHappy && previousWeek.length > 0;
  
  const lastWeekHotFlashes = lastWeek.filter(e => e.hot_flashes).length;
  const previousWeekHotFlashes = previousWeek.filter(e => e.hot_flashes).length;
  const symptomsDecreasing = lastWeekHotFlashes < previousWeekHotFlashes && previousWeek.length > 0;

  // מידע על מחזור
  const lastPeriod = cycleEntries.find(e => e.is_period)?.date;
  
  const lastEntry = dailyEntries[0];
  const lastEntryDate = lastEntry?.date || null;

  return {
    totalEntries,
    daysTracked: uniqueDates,
    lastEntryDate,
    sleepStats: {
      good: goodSleep,
      fair: fairSleep,
      poor: poorSleep,
      goodPercentage: goodSleepPercentage
    },
    moodStats: {
      happy,
      calm,
      sad,
      frustrated,
      irritated,
      dominantMood: moodLabels[dominantMood] || 'רגועה 🧘'
    },
    symptomStats: {
      hotFlashes,
      hotFlashesPercentage,
      nightSweats,
      poorSleep: poorSleepDays,
      lowEnergy
    },
    energyStats: {
      high: highEnergy,
      medium: mediumEnergy,
      low: lowEnergyCount,
      average: averageEnergy
    },
    recentTrends: {
      sleepImproving,
      moodImproving,
      symptomsDecreasing
    },
    cycleInfo: lastPeriod ? {
      lastPeriod,
      cycleLength: cycleEntries.length
    } : undefined
  };
}

/**
 * יוצר מסר מעצים דינמי על בסיס הסטטיסטיקות
 */
function generateEmpoweringMessage(stats: UserStatistics, insight: { type: string; title: string }): string {
  const messages: string[] = [];
  
  if (stats.sleepStats.goodPercentage >= 60) {
    messages.push('את עושה עבודה נהדרת בשמירה על איכות שינה טובה! 🌙✨');
  }
  
  if (stats.recentTrends.sleepImproving) {
    messages.push('אני רואה שהשינה שלך משתפרת - זה נהדר! המשכי כך! 😴');
  }
  
  if (stats.recentTrends.moodImproving) {
    messages.push('מצב הרוח שלך משתפר - את בדרך הנכונה! 💙');
  }
  
  if (stats.recentTrends.symptomsDecreasing) {
    messages.push('יש ירידה בתסמינים - זה סימן מעולה! 🎉');
  }
  
  if (stats.totalEntries >= 20) {
    messages.push(`את עקבית ומסורה - ${stats.totalEntries} רשומות זה הישג מדהים! 🌟`);
  }
  
  if (stats.energyStats.average === 'גבוהה') {
    messages.push('רמת האנרגיה שלך גבוהה - את מלאת כוח! 💪');
  }
  
  if (messages.length === 0) {
    messages.push('כל צעד קטן הוא התקדמות. את עושה את זה נהדר! 🌸');
  }
  
  return messages[Math.floor(Math.random() * messages.length)];
}

export function createInsightEmail(
  userName: string,
  insight: {
    type: string;
    title: string;
    message: string;
    actionUrl?: string;
    data?: any;
  },
  statistics?: UserStatistics
): EmailTemplate {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://gilhameever.com';
  const currentDate = new Date().toLocaleDateString('he-IL', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // חישוב סטטיסטיקות אם לא סופקו
  const stats = statistics || {
    totalEntries: 0,
    daysTracked: 0,
    lastEntryDate: null,
    sleepStats: { good: 0, fair: 0, poor: 0, goodPercentage: 0 },
    moodStats: { happy: 0, calm: 0, sad: 0, frustrated: 0, irritated: 0, dominantMood: 'רגועה 🧘' },
    symptomStats: { hotFlashes: 0, hotFlashesPercentage: 0, nightSweats: 0, poorSleep: 0, lowEnergy: 0 },
    energyStats: { high: 0, medium: 0, low: 0, average: 'בינונית' },
    recentTrends: { sleepImproving: false, moodImproving: false, symptomsDecreasing: false }
  };
  
  const empoweringMessage = generateEmpoweringMessage(stats, insight);
  
  // קבע את טקסט הכפתור לפי ה-actionUrl
  const actionButtonText = insight.actionUrl?.includes('/journal') 
    ? 'עדכן את היומן היומי שלי →'
    : insight.actionUrl?.includes('/profile')
    ? 'להגדרות שלי →'
    : 'לפרטים נוספים →';
  
  const actionButton = insight.actionUrl
    ? `
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0;">
        <tr>
          <td align="center">
            <a href="${baseUrl}${insight.actionUrl}" 
               style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #ff0080 0%, #8000ff 100%); color: #ffffff; text-decoration: none; font-weight: 700; border-radius: 30px; font-size: 16px; box-shadow: 0 4px 15px rgba(255, 0, 128, 0.3);">
              ${actionButtonText}
            </a>
          </td>
        </tr>
      </table>
    `
    : '';

  // בניית סקשן הסטטיסטיקות
  const statsSection = stats.totalEntries > 0 ? `
    <!-- Statistics Section -->
    <tr>
      <td style="padding: 0 32px 32px 32px;">
        <h3 style="margin: 0 0 24px 0; color: #333333; font-size: 22px; font-weight: 700; text-align: right;">
          📊 הנתונים שלך השבוע
        </h3>
        
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <!-- Sleep Stats -->
            <td width="50%" style="padding: 0 8px 16px 8px; vertical-align: top;">
              <div style="background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%); border-radius: 12px; padding: 20px; border: 2px solid #e8e9ff; text-align: center;">
                <div style="font-size: 36px; margin-bottom: 8px;">😴</div>
                <div style="font-size: 32px; font-weight: 700; color: #ff0080; margin-bottom: 4px;">${stats.sleepStats.goodPercentage}%</div>
                <div style="font-size: 14px; color: #666666; margin-bottom: 8px;">שינה טובה</div>
                <div style="font-size: 12px; color: #999999;">${stats.sleepStats.good} מתוך ${stats.sleepStats.good + stats.sleepStats.fair + stats.sleepStats.poor} לילות</div>
              </div>
            </td>
            
            <!-- Mood Stats -->
            <td width="50%" style="padding: 0 8px 16px 8px; vertical-align: top;">
              <div style="background: linear-gradient(135deg, #fff5f8 0%, #ffffff 100%); border-radius: 12px; padding: 20px; border: 2px solid #ffe8f0; text-align: center;">
                <div style="font-size: 36px; margin-bottom: 8px;">💙</div>
                <div style="font-size: 18px; font-weight: 700; color: #8000ff; margin-bottom: 4px;">${stats.moodStats.dominantMood}</div>
                <div style="font-size: 14px; color: #666666; margin-bottom: 8px;">מצב רוח דומיננטי</div>
                <div style="font-size: 12px; color: #999999;">${stats.moodStats.happy + stats.moodStats.calm} ימים חיוביים</div>
              </div>
            </td>
          </tr>
          
          <tr>
            <!-- Energy Stats -->
            <td width="50%" style="padding: 0 8px 16px 8px; vertical-align: top;">
              <div style="background: linear-gradient(135deg, #f0fff4 0%, #ffffff 100%); border-radius: 12px; padding: 20px; border: 2px solid #e0f5e8; text-align: center;">
                <div style="font-size: 36px; margin-bottom: 8px;">⚡</div>
                <div style="font-size: 20px; font-weight: 700; color: #00c853; margin-bottom: 4px;">${stats.energyStats.average}</div>
                <div style="font-size: 14px; color: #666666; margin-bottom: 8px;">רמת אנרגיה ממוצעת</div>
                <div style="font-size: 12px; color: #999999;">${stats.energyStats.high} גבוהה, ${stats.energyStats.medium} בינונית</div>
              </div>
            </td>
            
            <!-- Symptoms Stats -->
            <td width="50%" style="padding: 0 8px 16px 8px; vertical-align: top;">
              <div style="background: linear-gradient(135deg, #fff8e1 0%, #ffffff 100%); border-radius: 12px; padding: 20px; border: 2px solid #ffe0b2; text-align: center;">
                <div style="font-size: 36px; margin-bottom: 8px;">🔥</div>
                <div style="font-size: 32px; font-weight: 700; color: #ff6f00; margin-bottom: 4px;">${stats.symptomStats.hotFlashesPercentage}%</div>
                <div style="font-size: 14px; color: #666666; margin-bottom: 8px;">גלי חום</div>
                <div style="font-size: 12px; color: #999999;">${stats.symptomStats.hotFlashes} ימים מתוך ${stats.totalEntries}</div>
              </div>
            </td>
          </tr>
        </table>
        
        ${stats.recentTrends.sleepImproving || stats.recentTrends.moodImproving || stats.recentTrends.symptomsDecreasing ? `
        <div style="background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%); border-right: 4px solid #4caf50; padding: 20px; border-radius: 8px; margin-top: 16px;">
          <div style="font-size: 18px; font-weight: 700; color: #2e7d32; margin-bottom: 8px; text-align: right;">✨ מגמות חיוביות:</div>
          <ul style="margin: 0; padding-right: 20px; color: #555555; font-size: 14px; line-height: 1.8; text-align: right;">
            ${stats.recentTrends.sleepImproving ? '<li>שינה משתפרת! 🌙</li>' : ''}
            ${stats.recentTrends.moodImproving ? '<li>מצב רוח משתפר! 😊</li>' : ''}
            ${stats.recentTrends.symptomsDecreasing ? '<li>תסמינים יורדים! 🎉</li>' : ''}
          </ul>
        </div>
        ` : ''}
      </td>
    </tr>
  ` : '';

  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${insight.title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #f5f5f5 0%, #e8e9ff 100%);">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #f5f5f5 0%, #e8e9ff 100%); padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="650" style="max-width: 650px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.15);">
          
          <!-- Premium Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #ff0080 0%, #8000ff 100%); padding: 50px 40px; text-align: center; position: relative;">
              <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"50\" r=\"2\" fill=\"rgba(255,255,255,0.1)\"/></svg>') repeat; opacity: 0.3;"></div>
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; position: relative; z-index: 1; text-shadow: 0 2px 10px rgba(0,0,0,0.2);">
                🌸 מנופאוזית וטוב לה
              </h1>
              <p style="margin: 12px 0 0 0; color: rgba(255,255,255,0.95); font-size: 16px; position: relative; z-index: 1;">
                ${currentDate}
              </p>
            </td>
          </tr>

          <!-- Personal Greeting -->
          <tr>
            <td style="padding: 40px 40px 24px 40px; background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);">
              <h2 style="margin: 0 0 8px 0; color: #333333; font-size: 28px; font-weight: 700; text-align: right;">
                שלום ${userName || 'יקרה'} 👋
              </h2>
              <p style="margin: 0; color: #666666; font-size: 16px; text-align: right; line-height: 1.6;">
                ${empoweringMessage}
              </p>
            </td>
          </tr>

          <!-- Main Insight -->
          <tr>
            <td style="padding: 0 40px 32px 40px; background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);">
              <div style="background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%); border-right: 5px solid #ff0080; padding: 32px; border-radius: 16px; box-shadow: 0 4px 20px rgba(255, 0, 128, 0.1);">
                <div style="display: inline-block; background: linear-gradient(135deg, #ff0080 0%, #8000ff 100%); color: #ffffff; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; margin-bottom: 16px;">
                  ${insight.type === 'pattern' ? '🔍 דפוס זוהה' : insight.type === 'improvement' ? '📈 שיפור' : insight.type === 'tip' ? '💡 טיפ' : insight.type === 'encouragement' ? '🌟 עידוד' : '📬 התראה'}
                </div>
                <h3 style="margin: 0 0 16px 0; color: #ff0080; font-size: 24px; font-weight: 700; text-align: right; line-height: 1.4;">
                  ${insight.title}
                </h3>
                <p style="margin: 0; color: #555555; font-size: 17px; line-height: 1.9; text-align: right;">
                  ${insight.message}
                </p>
              </div>
            </td>
          </tr>

          ${statsSection}

          ${actionButton}

          <!-- Additional Tips Section -->
          <tr>
            <td style="padding: 0 40px 32px 40px;">
              <div style="background: #f8f9ff; border-radius: 12px; padding: 24px; border: 1px solid #e8e9ff;">
                <p style="margin: 0 0 12px 0; color: #8000ff; font-size: 16px; font-weight: 700; text-align: right;">
                  💡 טיפ חשוב:
                </p>
                <p style="margin: 0; color: #555555; font-size: 15px; line-height: 1.8; text-align: right;">
                  ככל שתמלאי יותר את היומן, כך אוכל לתת לך תובנות מדויקות יותר ומעודכנות. כל רשומה חשובה ומסייעת להבין את המסע שלך טוב יותר.
                </p>
              </div>
            </td>
          </tr>

          <!-- Closing Message -->
          <tr>
            <td style="padding: 32px 40px 40px 40px; background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%); border-top: 1px solid #e5e5e5;">
              <div style="text-align: center; padding: 24px; background: linear-gradient(135deg, #fff5f8 0%, #f8f9ff 100%); border-radius: 12px;">
                <p style="margin: 0 0 8px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                  את לא לבד במסע הזה 💙
                </p>
                <p style="margin: 0; color: #888888; font-size: 14px; line-height: 1.6;">
                  עם אהבה,<br>
                  <strong style="color: #ff0080; font-size: 18px;">עליזה</strong> 🌸
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%); padding: 32px 40px; text-align: center;">
              <p style="margin: 0 0 12px 0; color: #ffffff; font-size: 14px; line-height: 1.6;">
                את תמיד יכולה לשנות את העדפות ההתראות שלך ב<br>
                <a href="${baseUrl}/profile" style="color: #ff0080; text-decoration: none; font-weight: 600;">הפרופיל שלך</a>
              </p>
              <p style="margin: 16px 0 0 0; color: #999999; font-size: 12px; line-height: 1.6;">
                © ${new Date().getFullYear()} מנופאוזית וטוב לה. כל הזכויות שמורות.<br>
                <a href="${baseUrl}" style="color: #888888; text-decoration: none;">${baseUrl}</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  // בניית גרסת טקסט
  let textContent = `
שלום ${userName || 'יקרה'},

${empoweringMessage}

${insight.title}
${'='.repeat(insight.title.length)}

${insight.message}
`;

  if (stats.totalEntries > 0) {
    textContent += `

📊 הנתונים שלך השבוע:
${'-'.repeat(30)}
😴 שינה טובה: ${stats.sleepStats.goodPercentage}% (${stats.sleepStats.good} מתוך ${stats.sleepStats.good + stats.sleepStats.fair + stats.sleepStats.poor} לילות)
💙 מצב רוח דומיננטי: ${stats.moodStats.dominantMood}
⚡ רמת אנרגיה ממוצעת: ${stats.energyStats.average}
🔥 גלי חום: ${stats.symptomStats.hotFlashesPercentage}% (${stats.symptomStats.hotFlashes} ימים מתוך ${stats.totalEntries})
`;

    if (stats.recentTrends.sleepImproving || stats.recentTrends.moodImproving || stats.recentTrends.symptomsDecreasing) {
      textContent += `
✨ מגמות חיוביות:
`;
      if (stats.recentTrends.sleepImproving) textContent += '  - שינה משתפרת! 🌙\n';
      if (stats.recentTrends.moodImproving) textContent += '  - מצב רוח משתפר! 😊\n';
      if (stats.recentTrends.symptomsDecreasing) textContent += '  - תסמינים יורדים! 🎉\n';
    }
  }

  textContent += `

💡 טיפ חשוב:
ככל שתמלאי יותר את היומן, כך אוכל לתת לך תובנות מדויקות יותר ומעודכנות.

${insight.actionUrl ? `לפרטים נוספים: ${baseUrl}${insight.actionUrl}\n` : ''}

את לא לבד במסע הזה 💙

עם אהבה,
עליזה 🌸

---
את תמיד יכולה לשנות את העדפות ההתראות שלך בפרופיל שלך: ${baseUrl}/profile
© ${new Date().getFullYear()} מנופאוזית וטוב לה. כל הזכויות שמורות.
  `.trim();

  const text = textContent;

  return {
    subject: insight.title,
    html,
    text
  };
}

