/**
 * ╫¬╫æ╫á╫Ö╫ò╫¬ ╫₧╫Ö╫Ö╫£ ╫æ╫ó╫æ╫¿╫Ö╫¬ ╫ó╫æ╫ò╫¿ ╫ö╫¬╫¿╫É╫ò╫¬ ╫ù╫¢╫₧╫ò╫¬
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
 * ╫₧╫ù╫⌐╫æ ╫í╫ÿ╫ÿ╫Ö╫í╫ÿ╫Ö╫º╫ò╫¬ ╫₧╫ö╫á╫¬╫ò╫á╫Ö╫¥ ╫⌐╫£ ╫ö╫₧╫⌐╫¬╫₧╫⌐╫¬
 */
export function calculateUserStatistics(
  dailyEntries: DailyEntry[],
  cycleEntries: CycleEntry[]
): UserStatistics {
  const totalEntries = dailyEntries.length;
  const uniqueDates = new Set(dailyEntries.map(e => e.date)).size;
  
  // ╫í╫ÿ╫ÿ╫Ö╫í╫ÿ╫Ö╫º╫ò╫¬ ╫⌐╫Ö╫á╫ö
  const sleepEntries = dailyEntries.filter(e => e.sleep_quality);
  const goodSleep = sleepEntries.filter(e => e.sleep_quality === 'good').length;
  const fairSleep = sleepEntries.filter(e => e.sleep_quality === 'fair').length;
  const poorSleep = sleepEntries.filter(e => e.sleep_quality === 'poor').length;
  const goodSleepPercentage = sleepEntries.length > 0 
    ? Math.round((goodSleep / sleepEntries.length) * 100) 
    : 0;

  // ╫í╫ÿ╫ÿ╫Ö╫í╫ÿ╫Ö╫º╫ò╫¬ ╫₧╫ª╫æ ╫¿╫ò╫ù
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
    calm: 'רגועה 😌',
    sad: 'עצובה 😢',
    frustrated: 'מתוסכלת 😤',
    irritated: 'עצבנית 😠'
  };

  // ╫í╫ÿ╫ÿ╫Ö╫í╫ÿ╫Ö╫º╫ò╫¬ ╫¬╫í╫₧╫Ö╫á╫Ö╫¥
  const hotFlashes = dailyEntries.filter(e => e.hot_flashes).length;
  const hotFlashesPercentage = totalEntries > 0 
    ? Math.round((hotFlashes / totalEntries) * 100) 
    : 0;
  const nightSweats = dailyEntries.filter(e => e.night_sweats).length;
  const poorSleepDays = dailyEntries.filter(e => e.sleep_quality === 'poor').length;
  const lowEnergy = dailyEntries.filter(e => e.energy_level === 'low').length;

  // ╫í╫ÿ╫ÿ╫Ö╫í╫ÿ╫Ö╫º╫ò╫¬ ╫É╫á╫¿╫Æ╫Ö╫ö
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

  // ╫₧╫Æ╫₧╫ò╫¬ ╫É╫ù╫¿╫ò╫á╫ò╫¬ (╫ö╫⌐╫ò╫ò╫É╫ö ╫æ╫Ö╫ƒ ╫⌐╫æ╫ò╫ó ╫É╫ù╫¿╫ò╫ƒ ╫£╫⌐╫æ╫ò╫ó ╫ö╫º╫ò╫ô╫¥)
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

  // ╫₧╫Ö╫ô╫ó ╫ó╫£ ╫₧╫ù╫û╫ò╫¿
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
      dominantMood: moodLabels[dominantMood] || 'רגועה 😌'
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
 * יוצר טיפ יומי מעשי בהתאם לסטטיסטיקות
 */
function generateDailyTip(stats: UserStatistics): string {
  const tips: string[] = [];
  
  // טיפים לפי שינה
  if (stats.sleepStats.goodPercentage < 50) {
    tips.push(`
      <div style="margin-bottom: 16px; padding: 16px; background: rgba(255, 193, 7, 0.1); border-right: 4px solid #ffc107; border-radius: 8px; direction: rtl;" dir="rtl">
        <p style="margin: 0; color: #555555; font-size: 15px; line-height: 1.8; text-align: right; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl;">
          <strong style="color: #ff6f00; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">🌙 לשיפור השינה:</strong> נסי ליצור שגרת שינה קבועה - לכי לישון והתעוררי באותן שעות גם בסופי שבוע. הימנעי ממסכים שעה לפני השינה, ונסי תרגילי נשימה או מדיטציה קצרה.
        </p>
      </div>
    `);
  }
  
  // טיפים לפי תסמינים
  if (stats.symptomStats.hotFlashesPercentage > 30) {
    tips.push(`
      <div style="margin-bottom: 16px; padding: 16px; background: rgba(255, 87, 34, 0.1); border-right: 4px solid #ff5722; border-radius: 8px; direction: rtl;" dir="rtl">
        <p style="margin: 0; color: #555555; font-size: 15px; line-height: 1.8; text-align: right; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl;">
          <strong style="color: #ff6f00; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">🔥 לניהול גלי חום:</strong> לבושי שכבות שאפשר להסיר בקלות, שמרי בקבוק מים קרירים לידך, ונשמי עמוק כשמתחיל גל חום. הימנעי מטריגרים כמו קפאין, אלכוהול, ומזון חריף.
        </p>
      </div>
    `);
  }
  
  // טיפים לפי אנרגיה
  if (stats.energyStats.average === 'נמוכה') {
    tips.push(`
      <div style="margin-bottom: 16px; padding: 16px; background: rgba(76, 175, 80, 0.1); border-right: 4px solid #4caf50; border-radius: 8px; direction: rtl;" dir="rtl">
        <p style="margin: 0; color: #555555; font-size: 15px; line-height: 1.8; text-align: right; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl;">
          <strong style="color: #2e7d32; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">⚡ להעלאת האנרגיה:</strong> נסי פעילות גופנית קלה כמו הליכה של 10-15 דקות, הוסיפי מזונות עשירים בברזל ו-B12, ושמרי על שתייה מספקת של מים. גם נשימות עמוקות יכולות לעזור.
        </p>
      </div>
    `);
  }
  
  // טיפ כללי אם אין טיפים ספציפיים
  if (tips.length === 0) {
    tips.push(`
      <div style="margin-bottom: 16px; padding: 16px; background: rgba(156, 39, 176, 0.1); border-right: 4px solid #9c27b0; border-radius: 8px; direction: rtl;" dir="rtl">
        <p style="margin: 0; color: #555555; font-size: 15px; line-height: 1.8; text-align: right; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl;">
          <strong style="color: #7b1fa2; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">🌸 טיפ כללי:</strong> זכרי שגיל המעבר הוא מסע אישי, וכל אחת חווה אותו אחרת. הקפידי על פעילות גופנית מתונה, תזונה מאוזנת, ושינה מספקת. והכי חשוב - הקשיבי לגוף שלך.
        </p>
      </div>
    `);
  }
  
  return tips.join('');
}

/**
 * ╫Ö╫ò╫ª╫¿ ╫₧╫í╫¿ ╫₧╫ó╫ª╫Ö╫¥ ╫ô╫Ö╫á╫₧╫Ö ╫ó╫£ ╫æ╫í╫Ö╫í ╫ö╫í╫ÿ╫ÿ╫Ö╫í╫ÿ╫Ö╫º╫ò╫¬
 */
function generateEmpoweringMessage(stats: UserStatistics, insight: { type: string; title: string }): string {
  const messages: string[] = [];
  
  if (stats.sleepStats.goodPercentage >= 60) {
    messages.push('את עושה עבודה נהדרת בהקפדה על איכות שינה טובה! 🌸💪');
  }
  
  if (stats.recentTrends.sleepImproving) {
    messages.push('אני רואה שהשינה שלך משתפרת - זה נהדר! המשכי כך! 🌙');
  }
  
  if (stats.recentTrends.moodImproving) {
    messages.push('מצב הרוח שלך משתפר - את בדרך הנכונה! 😊');
  }
  
  if (stats.recentTrends.symptomsDecreasing) {
    messages.push('יש ירידה בתסמינים - זה סימן טוב! 🔥');
  }
  
  if (stats.totalEntries >= 20) {
    messages.push(`את עקבית ומסורה - ${stats.totalEntries} רשומות זה הישג! 💪`);
  }
  
  if (stats.energyStats.average === 'גבוהה') {
    messages.push('רמת האנרגיה שלך גבוהה - את מלאת כוח! ⚡');
  }
  
  if (messages.length === 0) {
    messages.push('כל צעד קטן בדרך הוא התחלה. את עושה את מה נכון! 🌸');
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
  
  // ╫ù╫Ö╫⌐╫ò╫æ ╫í╫ÿ╫ÿ╫Ö╫í╫ÿ╫Ö╫º╫ò╫¬ ╫É╫¥ ╫£╫É ╫í╫ò╫ñ╫º╫ò
  const stats = statistics || {
    totalEntries: 0,
    daysTracked: 0,
    lastEntryDate: null,
    sleepStats: { good: 0, fair: 0, poor: 0, goodPercentage: 0 },
    moodStats: { happy: 0, calm: 0, sad: 0, frustrated: 0, irritated: 0, dominantMood: 'רגועה 😌' },
    symptomStats: { hotFlashes: 0, hotFlashesPercentage: 0, nightSweats: 0, poorSleep: 0, lowEnergy: 0 },
    energyStats: { high: 0, medium: 0, low: 0, average: 'בינונית' },
    recentTrends: { sleepImproving: false, moodImproving: false, symptomsDecreasing: false }
  };
  
  const empoweringMessage = generateEmpoweringMessage(stats, insight);
  
  // ╫º╫æ╫ó ╫É╫¬ ╫ÿ╫º╫í╫ÿ ╫ö╫¢╫ñ╫¬╫ò╫¿ ╫£╫ñ╫Ö ╫ö-actionUrl
  const actionButtonText = insight.actionUrl?.includes('/journal') 
    ? 'עדכני את היומן היומי שלך →'
    : insight.actionUrl?.includes('/profile')
    ? 'להגדרות שלי →'
    : 'לפרטים נוספים →';
  
  const actionButton = insight.actionUrl
    ? `
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0; direction: rtl;" dir="rtl">
        <tr>
          <td align="center" dir="rtl">
            <a href="${baseUrl}${insight.actionUrl}" 
               style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #ff0080 0%, #8000ff 100%); color: #ffffff; text-decoration: none; font-weight: 700; border-radius: 30px; font-size: 16px; box-shadow: 0 4px 15px rgba(255, 0, 128, 0.3); font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
              ${actionButtonText}
            </a>
          </td>
        </tr>
      </table>
    `
    : '';

  // ╫æ╫á╫Ö╫Ö╫¬ ╫í╫º╫⌐╫ƒ ╫ö╫í╫ÿ╫ÿ╫Ö╫í╫ÿ╫Ö╫º╫ò╫¬
  const statsSection = stats.totalEntries > 0 ? `
    <!-- Statistics Section -->
    <tr>
      <td dir="rtl" style="padding: 0 32px 32px 32px; direction: rtl;">
        <h3 style="margin: 0 0 24px 0; color: #333333; font-size: 22px; font-weight: 700; text-align: right; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl;">
          📊 ההתקדמות שלך השבוע
        </h3>
        
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" dir="rtl" style="direction: rtl;">
          <tr>
            <!-- Sleep Stats -->
            <td width="50%" dir="rtl" style="padding: 0 8px 16px 8px; vertical-align: top; direction: rtl;">
              <div style="background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%); border-radius: 12px; padding: 20px; border: 2px solid #e8e9ff; text-align: center; direction: rtl;">
                <div style="font-size: 36px; margin-bottom: 8px;">🌙</div>
                <div style="font-size: 32px; font-weight: 700; color: #ff0080; margin-bottom: 4px; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${stats.sleepStats.goodPercentage}%</div>
                <div style="font-size: 14px; color: #666666; margin-bottom: 8px; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">שינה טובה</div>
                <div style="font-size: 12px; color: #999999; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${stats.sleepStats.good} מתוך ${stats.sleepStats.good + stats.sleepStats.fair + stats.sleepStats.poor} לילות</div>
              </div>
            </td>
            
            <!-- Mood Stats -->
            <td width="50%" dir="rtl" style="padding: 0 8px 16px 8px; vertical-align: top; direction: rtl;">
              <div style="background: linear-gradient(135deg, #fff5f8 0%, #ffffff 100%); border-radius: 12px; padding: 20px; border: 2px solid #ffe8f0; text-align: center; direction: rtl;">
                <div style="font-size: 36px; margin-bottom: 8px;">😊</div>
                <div style="font-size: 18px; font-weight: 700; color: #8000ff; margin-bottom: 4px; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${stats.moodStats.dominantMood}</div>
                <div style="font-size: 14px; color: #666666; margin-bottom: 8px; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">מצב רוח דומיננטי</div>
                <div style="font-size: 12px; color: #999999; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${stats.moodStats.happy + stats.moodStats.calm} ימים חיוביים</div>
              </div>
            </td>
          </tr>
          
          <tr>
            <!-- Energy Stats -->
            <td width="50%" dir="rtl" style="padding: 0 8px 16px 8px; vertical-align: top; direction: rtl;">
              <div style="background: linear-gradient(135deg, #f0fff4 0%, #ffffff 100%); border-radius: 12px; padding: 20px; border: 2px solid #e0f5e8; text-align: center; direction: rtl;">
                <div style="font-size: 36px; margin-bottom: 8px;">⚡</div>
                <div style="font-size: 20px; font-weight: 700; color: #00c853; margin-bottom: 4px; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${stats.energyStats.average}</div>
                <div style="font-size: 14px; color: #666666; margin-bottom: 8px; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">רמת אנרגיה ממוצעת</div>
                <div style="font-size: 12px; color: #999999; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${stats.energyStats.high} גבוהה, ${stats.energyStats.medium} בינונית</div>
              </div>
            </td>
            
            <!-- Symptoms Stats -->
            <td width="50%" dir="rtl" style="padding: 0 8px 16px 8px; vertical-align: top; direction: rtl;">
              <div style="background: linear-gradient(135deg, #fff8e1 0%, #ffffff 100%); border-radius: 12px; padding: 20px; border: 2px solid #ffe0b2; text-align: center; direction: rtl;">
                <div style="font-size: 36px; margin-bottom: 8px;">🔥</div>
                <div style="font-size: 32px; font-weight: 700; color: #ff6f00; margin-bottom: 4px; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${stats.symptomStats.hotFlashesPercentage}%</div>
                <div style="font-size: 14px; color: #666666; margin-bottom: 8px; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">גלי חום</div>
                <div style="font-size: 12px; color: #999999; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${stats.symptomStats.hotFlashes} ימים מתוך ${stats.totalEntries}</div>
              </div>
            </td>
          </tr>
        </table>
        
        ${stats.recentTrends.sleepImproving || stats.recentTrends.moodImproving || stats.recentTrends.symptomsDecreasing ? `
        <div style="background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%); border-right: 4px solid #4caf50; padding: 20px; border-radius: 8px; margin-top: 16px; direction: rtl;" dir="rtl">
          <div style="font-size: 18px; font-weight: 700; color: #2e7d32; margin-bottom: 8px; text-align: right; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">✅ מגמות משתפרות:</div>
          <ul style="margin: 0; padding-right: 20px; color: #555555; font-size: 14px; line-height: 1.8; text-align: right; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            ${stats.recentTrends.sleepImproving ? '<li>שינה משתפרת! 🌙</li>' : ''}
            ${stats.recentTrends.moodImproving ? '<li>מצב רוח משתפר! 😊</li>' : ''}
            ${stats.recentTrends.symptomsDecreasing ? '<li>תסמינים יורדים! 🔥</li>' : ''}
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
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      direction: rtl;
      text-align: right;
    }
    body, table, td, div, p, h1, h2, h3, ul, li {
      direction: rtl;
      text-align: right;
    }
    [dir="rtl"] {
      direction: rtl;
      text-align: right;
    }
  </style>
  <title>${insight.title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #f5f5f5 0%, #e8e9ff 100%);">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #f5f5f5 0%, #e8e9ff 100%); padding: 40px 20px; direction: rtl;">
    <tr>
      <td align="center" dir="rtl">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="650" style="max-width: 650px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.15); direction: rtl;" dir="rtl">
          
          <!-- Premium Header -->
          <tr>
            <td dir="rtl" style="background: linear-gradient(135deg, #ff0080 0%, #8000ff 100%); padding: 50px 40px; text-align: center; position: relative; overflow: hidden; direction: rtl;">
              <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 20px 20px; opacity: 0.3; pointer-events: none;"></div>
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; position: relative; z-index: 1; text-shadow: 0 2px 10px rgba(0,0,0,0.2); font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                🌸 מנופאוזית וטוב לה
              </h1>
              <p style="margin: 12px 0 0 0; color: rgba(255,255,255,0.95); font-size: 16px; position: relative; z-index: 1; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                ${currentDate}
              </p>
            </td>
          </tr>

          <!-- Personal Greeting -->
          <tr>
            <td dir="rtl" style="padding: 40px 40px 24px 40px; background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%); direction: rtl;">
              <h2 style="margin: 0 0 8px 0; color: #333333; font-size: 28px; font-weight: 700; text-align: right; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                שלום ${userName || 'יקרה'} 👋
              </h2>
              <p style="margin: 0; color: #666666; font-size: 16px; text-align: right; line-height: 1.6; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                ${empoweringMessage}
              </p>
            </td>
          </tr>

          <!-- Main Insight -->
          <tr>
            <td dir="rtl" style="padding: 0 40px 32px 40px; background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%); direction: rtl;">
              <div style="background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%); border-right: 5px solid #ff0080; padding: 32px; border-radius: 16px; box-shadow: 0 4px 20px rgba(255, 0, 128, 0.1); direction: rtl;">
                <h3 style="margin: 0 0 16px 0; color: #ff0080; font-size: 24px; font-weight: 700; text-align: right; line-height: 1.4; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                  ${insight.title}
                </h3>
                <p style="margin: 0; color: #555555; font-size: 17px; line-height: 1.9; text-align: right; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                  ${insight.message}
                </p>
              </div>
            </td>
          </tr>

          ${statsSection}

          ${actionButton}

          <!-- Daily Tips Section -->
          <tr>
            <td dir="rtl" style="padding: 0 40px 24px 40px; direction: rtl;">
              <div style="background: linear-gradient(135deg, #fff8e1 0%, #ffffff 100%); border-radius: 16px; padding: 28px; border: 2px solid #ffe0b2; box-shadow: 0 4px 12px rgba(255, 193, 7, 0.1); direction: rtl;">
                <h3 style="margin: 0 0 20px 0; color: #ff6f00; font-size: 22px; font-weight: 700; text-align: right; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl;">
                  💡 טיפ יומי מעשי
                </h3>
                ${generateDailyTip(stats)}
              </div>
            </td>
          </tr>

          <!-- Health Resources Section -->
          <tr>
            <td dir="rtl" style="padding: 0 40px 24px 40px; direction: rtl;">
              <div style="background: linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%); border-radius: 16px; padding: 28px; border: 2px solid #c8e6c9; box-shadow: 0 4px 12px rgba(76, 175, 80, 0.1); direction: rtl;">
                <h3 style="margin: 0 0 20px 0; color: #2e7d32; font-size: 22px; font-weight: 700; text-align: right; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl;">
                  📚 משאבים ומאמרים
                </h3>
                <div style="color: #555555; font-size: 15px; line-height: 1.9; text-align: right; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                  <p style="margin: 0 0 12px 0; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                    <strong style="color: #2e7d32; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">• ניהול גלי חום:</strong> נסי טכניקות נשימה, לבוש שכבות, והימנעות מטריגרים כמו קפאין ואלכוהול.
                  </p>
                  <p style="margin: 0 0 12px 0; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                    <strong style="color: #2e7d32; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">• שיפור השינה:</strong> שמרי על שגרה קבועה, הימנעי ממסכים לפני השינה, ושקלי תרגילי הרפיה.
                  </p>
                  <p style="margin: 0; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                    <strong style="color: #2e7d32; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">• תמיכה תזונתית:</strong> הוסיפי מזונות עשירים בסידן, ויטמין D, ואומגה 3 לתזונה היומית שלך.
                  </p>
                </div>
              </div>
            </td>
          </tr>

          <!-- Reminders Section -->
          <tr>
            <td dir="rtl" style="padding: 0 40px 24px 40px; direction: rtl;">
              <div style="background: linear-gradient(135deg, #f3e5f5 0%, #ffffff 100%); border-radius: 16px; padding: 28px; border: 2px solid #e1bee7; box-shadow: 0 4px 12px rgba(156, 39, 176, 0.1); direction: rtl;">
                <h3 style="margin: 0 0 20px 0; color: #7b1fa2; font-size: 22px; font-weight: 700; text-align: right; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl;">
                  ⏰ תזכורות חשובות
                </h3>
                <ul style="margin: 0; padding-right: 20px; color: #555555; font-size: 15px; line-height: 2; text-align: right; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                  <li>עדכני את היומן היומי שלך - זה לוקח רק כמה דקות</li>
                  <li>שמרי על שגרת פעילות גופנית - גם הליכה קצרה עוזרת</li>
                  <li>שתי מספיק מים - חשוב במיוחד בגיל המעבר</li>
                  <li>הקפידי על בדיקות רפואיות תקופתיות</li>
                </ul>
              </div>
            </td>
          </tr>

          <!-- Additional Tips Section -->
          <tr>
            <td dir="rtl" style="padding: 0 40px 32px 40px; direction: rtl;">
              <div style="background: #f8f9ff; border-radius: 12px; padding: 24px; border: 1px solid #e8e9ff; direction: rtl;">
                <p style="margin: 0 0 12px 0; color: #8000ff; font-size: 16px; font-weight: 700; text-align: right; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                  💙 טיפ נוסף:
                </p>
                <p style="margin: 0; color: #555555; font-size: 15px; line-height: 1.8; text-align: right; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                  ככל שתמלאי יותר את היומן, כך אוכל לתת לך תובנות מדויקות יותר ומותאמות אישית. כל עדכון חשוב ומסייע לי להבין טוב יותר את המסע שלך.
                </p>
              </div>
            </td>
          </tr>

          <!-- Closing Message -->
          <tr>
            <td dir="rtl" style="padding: 32px 40px 40px 40px; background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%); border-top: 1px solid #e5e5e5; direction: rtl;">
              <div style="text-align: center; padding: 24px; background: linear-gradient(135deg, #fff5f8 0%, #f8f9ff 100%); border-radius: 12px; direction: rtl;">
                <p style="margin: 0 0 8px 0; color: #666666; font-size: 16px; line-height: 1.6; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                  את לא לבד במסע הזה 💙
                </p>
                <p style="margin: 0; color: #888888; font-size: 14px; line-height: 1.6; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                  באהבה,<br>
                  <strong style="color: #ff0080; font-size: 18px; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">עליזה</strong> 🌸
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td dir="rtl" style="background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%); padding: 32px 40px; text-align: center; direction: rtl;">
              <p style="margin: 0 0 12px 0; color: #ffffff; font-size: 14px; line-height: 1.6; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                את יכולה להפסיק לקבל את ההתראות האלה ב<br>
                <a href="${baseUrl}/profile" style="color: #ff0080; text-decoration: none; font-weight: 600; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">ההגדרות שלך</a>
              </p>
              <p style="margin: 16px 0 0 0; color: #999999; font-size: 12px; line-height: 1.6; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                © ${new Date().getFullYear()} מנופאוזית וטוב לה. כל הזכויות שמורות.<br>
                <a href="${baseUrl}" style="color: #888888; text-decoration: none; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${baseUrl}</a>
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

  // ╫æ╫á╫Ö╫Ö╫¬ ╫Æ╫¿╫í╫¬ ╫ÿ╫º╫í╫ÿ
  let textContent = `
שלום ${userName || 'יקרה'},

${empoweringMessage}

${insight.title}
${'='.repeat(insight.title.length)}

${insight.message}
`;

  if (stats.totalEntries > 0) {
    textContent += `

📊 ההתקדמות שלך השבוע:
${'-'.repeat(30)}
🌙 שינה טובה: ${stats.sleepStats.goodPercentage}% (${stats.sleepStats.good} מתוך ${stats.sleepStats.good + stats.sleepStats.fair + stats.sleepStats.poor} לילות)
😊 מצב רוח דומיננטי: ${stats.moodStats.dominantMood}
⚡ רמת אנרגיה ממוצעת: ${stats.energyStats.average}
🔥 גלי חום: ${stats.symptomStats.hotFlashesPercentage}% (${stats.symptomStats.hotFlashes} ימים מתוך ${stats.totalEntries})
`;

    if (stats.recentTrends.sleepImproving || stats.recentTrends.moodImproving || stats.recentTrends.symptomsDecreasing) {
      textContent += `
✅ מגמות משתפרות:
`;
      if (stats.recentTrends.sleepImproving) textContent += '  - שינה משתפרת! 🌙\n';
      if (stats.recentTrends.moodImproving) textContent += '  - מצב רוח משתפר! 😊\n';
      if (stats.recentTrends.symptomsDecreasing) textContent += '  - תסמינים יורדים! 🔥\n';
    }
  }

  textContent += `

💡 טיפ נוסף:
ככל שתמלאי יותר את היומן, כך אוכל לתת לך תובנות מדויקות יותר ומותאמות אישית. כל עדכון חשוב ומסייע לי להבין טוב יותר את המסע שלך.

${insight.actionUrl ? `לפרטים נוספים: ${baseUrl}${insight.actionUrl}\n` : ''}

את לא לבד במסע הזה 💙

באהבה,
עליזה 🌸

---
את יכולה להפסיק לקבל את ההתראות האלה בהגדרות שלך: ${baseUrl}/profile
© ${new Date().getFullYear()} מנופאוזית וטוב לה. כל הזכויות שמורות.
  `.trim();

  const text = textContent;

  return {
    subject: insight.title,
    html,
    text
  };
}

