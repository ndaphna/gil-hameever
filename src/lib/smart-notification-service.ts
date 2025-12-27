import { supabaseAdmin } from './supabase-server';
import { DailyEntry, CycleEntry } from '@/types/journal';

interface UserInsight {
  type: 'pattern' | 'improvement' | 'tip' | 'encouragement' | 'reminder';
  priority: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  data?: any;
  actionUrl?: string;
}

interface NotificationDecision {
  shouldSend: boolean;
  insight?: UserInsight;
  reason?: string;
  userData?: {
    dailyEntries: DailyEntry[];
    cycleEntries: CycleEntry[];
    lastEntryDate: string | null;
    daysSinceLastEntry: number;
  };
}

export class SmartNotificationService {
  /**
   * בודק אם צריך לשלוח התראה למשתמשת
   * רק אם יש ערך אמיתי - תובנה, דפוס, או טיפ רלוונטי
   */
  async shouldSendNotification(userId: string): Promise<NotificationDecision> {
    // בדוק העדפות המשתמשת
    const preferences = await this.getUserPreferences(userId);
    if (!preferences?.email?.enabled) {
      return { shouldSend: false, reason: 'Email notifications disabled' };
    }

    // בדוק מתי נשלחה ההתראה האחרונה
    const lastNotification = await this.getLastNotification(userId);
    const daysSinceLastNotification = lastNotification
      ? (Date.now() - new Date(lastNotification.sent_at).getTime()) / (1000 * 60 * 60 * 24)
      : 999;

    // לא נשלח יותר מפעם בשבוע (אלא אם יש סיבה חשובה)
    const minDaysBetweenNotifications = preferences.email.frequency === 'daily' ? 1 
      : preferences.email.frequency === 'weekly' ? 7 
      : 30;

    if (daysSinceLastNotification < minDaysBetweenNotifications) {
      return { shouldSend: false, reason: 'Too soon since last notification' };
    }

    // קבל נתונים אחרונים
    const userData = await this.getUserData(userId);
    if (!userData) {
      return { shouldSend: false, reason: 'No user data found' };
    }

    // בדוק אם יש מספיק נתונים לניתוח
    if (userData.dailyEntries.length < 3) {
      return { 
        shouldSend: true, 
        insight: {
          type: 'encouragement',
          priority: 'low',
          title: 'בואי נתחיל את המסע שלך יחד 🌸',
          message: 'אני רואה שהתחלת למלא את היומן. זה נהדר! ככל שתמלאי יותר, כך אוכל לתת לך תובנות מדויקות יותר. בואי נמשיך יחד.',
          actionUrl: '/journal?tab=daily'
        },
        userData
      };
    }

    // ניתוח חכם של הנתונים
    const insight = await this.analyzeUserData(userData);
    
    if (!insight) {
      return { shouldSend: false, reason: 'No valuable insight found' };
    }

    return { shouldSend: true, insight, userData };
  }

  /**
   * מנתח את הנתונים של המשתמשת ויוצר תובנה מותאמת אישית
   */
  private async analyzeUserData(data: {
    dailyEntries: DailyEntry[];
    cycleEntries: CycleEntry[];
    lastEntryDate: string | null;
    daysSinceLastEntry: number;
  }): Promise<UserInsight | null> {
    const { dailyEntries, cycleEntries, lastEntryDate, daysSinceLastEntry } = data;

    // 0. בדוק רציפות דיווחים - זה הקדימות הגבוהה ביותר
    const continuityInsight = await this.checkReportingContinuity(dailyEntries, daysSinceLastEntry);
    if (continuityInsight) {
      return continuityInsight;
    }

    // 1. בדוק אם יש דפוס מעניין
    const pattern = this.detectPattern(dailyEntries);
    if (pattern) {
      return pattern;
    }

    // 2. בדוק אם יש שיפור
    const improvement = this.detectImprovement(dailyEntries);
    if (improvement) {
      return improvement;
    }

    // 3. בדוק אם יש טיפ רלוונטי
    const tip = this.generatePersonalizedTip(dailyEntries, cycleEntries);
    if (tip) {
      return tip;
    }

    // 4. אם לא דיווחה זמן רב - תזכורת עדינה
    if (daysSinceLastEntry > 3) {
      return {
        type: 'reminder',
        priority: 'medium',
        title: 'אני כאן בשבילך 💙',
        message: `עברו ${daysSinceLastEntry} ימים מאז הדיווח האחרון שלך. אני כאן כדי לעזור לך לעקוב אחרי המסע שלך. בואי נעדכן את היומן יחד?`,
        actionUrl: '/journal?tab=daily'
      };
    }

    return null;
  }

  /**
   * בודק רציפות דיווחים ויוצר תובנה מותאמת
   */
  private async checkReportingContinuity(
    dailyEntries: DailyEntry[],
    daysSinceLastEntry: number
  ): Promise<UserInsight | null> {
    if (dailyEntries.length === 0) {
      // אין דיווחים בכלל
      return {
        type: 'encouragement',
        priority: 'high',
        title: 'בואי נתחיל את המסע שלך יחד 🌸',
        message: `אני כאן כדי לעזור לך להבין טוב יותר את הגוף שלך ואת מה שעובר עלייך. מילוי היומן היומי הוא כלי חזק שיעזור לך לזהות דפוסים, להבין מה עוזר לך, ולשפר את אורחות חייך. כל דיווח חשוב ומסייע לי לתת לך תובנות מדויקות יותר. בואי נתחיל יחד?`,
        actionUrl: '/journal?tab=daily'
      };
    }

    // חשב רציפות
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sortedEntries = [...dailyEntries].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    let consecutiveDaysReported = 0;
    let lastCheckedDate: Date | null = null;
    
    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      
      if (lastCheckedDate === null) {
        lastCheckedDate = new Date(entryDate);
        consecutiveDaysReported = 1;
      } else {
        const daysDiff = Math.floor((lastCheckedDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff === 1) {
          consecutiveDaysReported++;
          lastCheckedDate = new Date(entryDate);
        } else {
          break;
        }
      }
    }

    // אם יש חוסר רציפות משמעותי (יותר מ-3 ימים ללא דיווח)
    if (daysSinceLastEntry > 3) {
      // נשתמש ב-AI ליצירת תוכן מעודד ומותאם
      const aiMessage = await this.generateEncouragingMessageForContinuity(
        daysSinceLastEntry,
        consecutiveDaysReported,
        dailyEntries.length
      );

      return {
        type: 'encouragement',
        priority: 'high',
        title: 'אני כאן בשבילך 💙',
        message: aiMessage,
        actionUrl: '/journal?tab=daily',
        data: {
          daysSinceLastEntry,
          consecutiveDaysReported,
          totalEntries: dailyEntries.length
        }
      };
    }

    // אם יש רציפות טובה - נחזיר null כדי לבדוק תובנות אחרות
    if (consecutiveDaysReported >= 7 && daysSinceLastEntry <= 1) {
      return null; // נבדוק תובנות אחרות
    }

    // אם יש רציפות חלקית - נעודד להמשיך
    if (consecutiveDaysReported >= 3 && consecutiveDaysReported < 7) {
      return {
        type: 'encouragement',
        priority: 'medium',
        title: 'את עושה עבודה נהדרת! 🌸',
        message: `אני רואה שאת עקבית בדיווחים - ${consecutiveDaysReported} ימים רצופים! זה נהדר. ככל שתמשיכי למלא את היומן, כך אוכל לתת לך תובנות מדויקות יותר ומותאמות אישית. כל עדכון חשוב ומסייע לי להבין טוב יותר את המסע שלך.`,
        actionUrl: '/journal?tab=daily'
      };
    }

    return null;
  }

  /**
   * יוצר הודעה מעודדת עם AI כשיש חוסר רציפות
   */
  private async generateEncouragingMessageForContinuity(
    daysSinceLastEntry: number,
    consecutiveDaysReported: number,
    totalEntries: number
  ): Promise<string> {
    // ננסה להשתמש ב-AI אם יש API key
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    
    if (OPENAI_API_KEY && OPENAI_API_KEY !== 'dummy-key') {
      try {
        const systemPrompt = `את עליזה, מומחית רפואית ומנטורית חמה ונעימה לנשים בגיל המעבר. את מעודדת, תומכת, ומבינה. את מדברת כמו חברה טובה - חמה, אמפתית, ומעודדת.

תפקידך: ליצור הודעה מעודדת ומכילה למשתמשת שלא דיווחה זמן מה. ההודעה צריכה:
- להיות מעודדת ולא שיפוטית
- להסביר את התועלות במילוי היומן
- להזכיר שיש לה עם מי להתייעץ (עליזה - החברה שלה)
- להיות אישית וחמה
- לא לחזור על עצמה - להיות מקורית ומותאמת

כתבי הודעה קצרה (3-4 משפטים) בעברית, בגוף שני, חמה ומעודדת.`;

        const userPrompt = `שתמשת לא דיווחה ${daysSinceLastEntry} ימים. היא דיווחה ${consecutiveDaysReported} ימים רצופים לפני כן, ויש לה ${totalEntries} דיווחים בסך הכל.

צרי הודעה מעודדת ומכילה שתעודד אותה לחזור למלא את היומן, תסביר את התועלות, ותזכיר שיש לה עם מי להתייעץ (עליזה). ההודעה צריכה להיות מקורית ולא לחזור על עצמה.`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            max_tokens: 200,
            temperature: 0.8
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const aiMessage = data.choices[0]?.message?.content?.trim();
          if (aiMessage) {
            return aiMessage;
          }
        }
      } catch (error) {
        console.error('Error generating AI message for continuity:', error);
      }
    }

    // Fallback - הודעות מגוונות שלא חוזרות על עצמן
    const messages = [
      `עברו ${daysSinceLastEntry} ימים מאז הדיווח האחרון שלך. אני כאן כדי לעזור לך להבין טוב יותר את הגוף שלך ואת מה שעובר עלייך. מילוי היומן היומי הוא כלי חזק שיעזור לך לזהות דפוסים, להבין מה עוזר לך, ולשפר את אורחות חייך. ככל שתמלאי יותר את היומן, כך אוכל לתת לך תובנות מדויקות יותר ומותאמות אישית. כל עדכון חשוב ומסייע לי להבין טוב יותר את המסע שלך. יש לך עם מי להתייעץ - אני כאן בשבילך! 💙`,
      `אני רואה שעברו ${daysSinceLastEntry} ימים מאז הדיווח האחרון שלך. אני מבינה שזה יכול להיות קשה לפעמים, אבל אני כאן כדי לתמוך בך. מילוי היומן היומי עוזר לך להבין את הגוף שלך, לזהות דפוסים, ולראות מה עוזר לך. ככל שתמלאי יותר, כך אוכל לתת לך תובנות מדויקות יותר. זכרי - יש לך עם מי להתייעץ, אני כאן בשבילך! 🌸`,
      `היי! עברו ${daysSinceLastEntry} ימים מאז הדיווח האחרון שלך. אני יודעת שזה יכול להיות מאתגר, אבל מילוי היומן היומי הוא כלי חשוב שיעזור לך להבין טוב יותר את הגוף שלך ואת מה שעובר עלייך. ככל שתמלאי יותר, כך אוכל לתת לך תובנות מדויקות יותר ומותאמות אישית. כל עדכון חשוב ומסייע לי להבין טוב יותר את המסע שלך. יש לך עם מי להתייעץ - אני כאן בשבילך! 💙`,
      `אני רואה שעברו ${daysSinceLastEntry} ימים מאז הדיווח האחרון שלך. אני מבינה שזה יכול להיות קשה לפעמים, אבל אני כאן כדי לתמוך בך. מילוי היומן היומי עוזר לך להבין את הגוף שלך, לזהות דפוסים, ולראות מה עוזר לך. ככל שתמלאי יותר, כך אוכל לתת לך תובנות מדויקות יותר. זכרי - יש לך עם מי להתייעץ, אני כאן בשבילך! 🌸`
    ];

    // נבחר הודעה אקראית שלא חזרה לאחרונה (אם יש היסטוריה)
    return messages[Math.floor(Math.random() * messages.length)];
  }

  /**
   * מזהה דפוסים מעניינים בנתונים
   */
  private detectPattern(entries: DailyEntry[]): UserInsight | null {
    if (entries.length < 7) return null;

    // בדוק דפוס של גלי חום
    const hotFlashDays = entries.filter(e => e.hot_flashes).length;
    const hotFlashPercentage = (hotFlashDays / entries.length) * 100;

    if (hotFlashPercentage > 50) {
      const recentHotFlashes = entries.slice(0, 7).filter(e => e.hot_flashes).length;
      if (recentHotFlashes >= 4) {
        return {
          type: 'pattern',
          priority: 'high',
          title: 'זיהיתי דפוס מעניין 🔥',
          message: `אני רואה שיש לך גלי חום בתדירות גבוהה (${recentHotFlashes} מתוך 7 הימים האחרונים). זה יכול להיות קשור למחזור, למזג האוויר, או למתח. בואי נבין יחד מה יכול לעזור.`,
          data: { pattern: 'hot_flashes', frequency: recentHotFlashes },
          actionUrl: '/heat-waves'
        };
      }
    }

    // בדוק דפוס של שינה
    const goodSleepDays = entries.filter(e => e.sleep_quality === 'good').length;
    const poorSleepDays = entries.filter(e => e.sleep_quality === 'poor').length;
    
    if (poorSleepDays >= 4 && entries.length >= 7) {
      return {
        type: 'pattern',
        priority: 'high',
        title: 'דפוס שינה שכדאי לשים לב אליו 😴',
        message: `אני רואה שיש לך ${poorSleepDays} לילות קשים מתוך 7 הימים האחרונים. שינה טובה חשובה מאוד בגיל המעבר. יש לי כמה טיפים שיכולים לעזור.`,
        data: { pattern: 'poor_sleep', count: poorSleepDays },
        actionUrl: '/menopausal-sleep'
      };
    }

    if (goodSleepDays >= 5 && entries.length >= 7) {
      return {
        type: 'improvement',
        priority: 'low',
        title: 'השינה שלך משתפרת! ✨',
        message: `מצוין! אני רואה שישנת טוב ${goodSleepDays} מתוך 7 לילות. זה נהדר! שימי לב מה עזר לך והמשיכי בזה.`,
        data: { improvement: 'sleep', count: goodSleepDays }
      };
    }

    // בדוק דפוס של מצב רוח
    const lowMoodDays = entries.filter(e => e.mood === 'sad' || e.mood === 'frustrated').length;
    if (lowMoodDays >= 4 && entries.length >= 7) {
      return {
        type: 'pattern',
        priority: 'medium',
        title: 'מצב הרוח שלך זקוק לתשומת לב 💙',
        message: `אני רואה שיש לך ${lowMoodDays} ימים עם מצב רוח נמוך מתוך 7 הימים האחרונים. זה נורמלי בגיל המעבר, ויש דרכים להתמודד. בואי נדבר על זה.`,
        data: { pattern: 'low_mood', count: lowMoodDays },
        actionUrl: '/belonging-sisterhood-emotional-connection'
      };
    }

    return null;
  }

  /**
   * מזהה שיפורים בנתונים
   */
  private detectImprovement(entries: DailyEntry[]): UserInsight | null {
    if (entries.length < 14) return null;

    // השווה שבוע אחרון לשבוע הקודם
    const lastWeek = entries.slice(0, 7);
    const previousWeek = entries.slice(7, 14);

    const lastWeekHotFlashes = lastWeek.filter(e => e.hot_flashes).length;
    const previousWeekHotFlashes = previousWeek.filter(e => e.hot_flashes).length;

    if (previousWeekHotFlashes > lastWeekHotFlashes && previousWeekHotFlashes > 0) {
      return {
        type: 'improvement',
        priority: 'medium',
        title: 'יש שיפור! 🎉',
        message: `מצוין! אני רואה שיש ירידה בגלי החום - מ-${previousWeekHotFlashes} בשבוע הקודם ל-${lastWeekHotFlashes} השבוע. זה נהדר! שימי לב מה עזר לך.`,
        data: { improvement: 'hot_flashes', before: previousWeekHotFlashes, after: lastWeekHotFlashes }
      };
    }

    const lastWeekGoodSleep = lastWeek.filter(e => e.sleep_quality === 'good').length;
    const previousWeekGoodSleep = previousWeek.filter(e => e.sleep_quality === 'good').length;

    if (lastWeekGoodSleep > previousWeekGoodSleep && previousWeekGoodSleep < 4) {
      return {
        type: 'improvement',
        priority: 'medium',
        title: 'השינה שלך משתפרת! 😴✨',
        message: `אני רואה שיפור בשינה שלך - מ-${previousWeekGoodSleep} לילות טובים בשבוע הקודם ל-${lastWeekGoodSleep} השבוע. זה נהדר!`,
        data: { improvement: 'sleep', before: previousWeekGoodSleep, after: lastWeekGoodSleep }
      };
    }

    return null;
  }

  /**
   * יוצר טיפ מותאם אישית על בסיס הנתונים
   */
  private generatePersonalizedTip(
    dailyEntries: DailyEntry[],
    cycleEntries: CycleEntry[]
  ): UserInsight | null {
    if (dailyEntries.length < 5) return null;

    // טיפ על בסיס התסמינים הנפוצים ביותר
    const hotFlashCount = dailyEntries.filter(e => e.hot_flashes).length;
    const poorSleepCount = dailyEntries.filter(e => e.sleep_quality === 'poor').length;
    const lowMoodCount = dailyEntries.filter(e => e.mood === 'sad' || e.mood === 'frustrated').length;

    if (hotFlashCount >= 3) {
      return {
        type: 'tip',
        priority: 'medium',
        title: 'טיפ מיוחד עבורך 🔥',
        message: `אני רואה שיש לך גלי חום. טיפ: נסי להימנע מקפאין אחר הצהריים, תרגלי נשימות עמוקות כשאת מרגישה גל חום מתקרב, והחזיקי מאוורר קטן בתיק. זה יכול לעזור מאוד!`,
        data: { tip: 'hot_flashes' },
        actionUrl: '/heat-waves'
      };
    }

    if (poorSleepCount >= 3) {
      return {
        type: 'tip',
        priority: 'medium',
        title: 'טיפ לשינה טובה יותר 😴',
        message: `אני רואה שיש לך לילות קשים. טיפ: נסי ליצור רוטינת שינה קבועה, הימנעי ממסכים שעה לפני השינה, ודאגי לחדר קריר ונעים. גם פעילות גופנית קלה ביום יכולה לעזור.`,
        data: { tip: 'sleep' },
        actionUrl: '/menopausal-sleep'
      };
    }

    if (lowMoodCount >= 3) {
      return {
        type: 'tip',
        priority: 'medium',
        title: 'טיפ למצב רוח טוב יותר 💙',
        message: `אני רואה שיש לך ימים עם מצב רוח נמוך. טיפ: נסי לצאת לטיול קצר, לדבר עם חברה, או לעשות משהו שאת אוהבת. גם פעילות גופנית קלה משחררת אנדורפינים שעוזרים למצב הרוח.`,
        data: { tip: 'mood' },
        actionUrl: '/belonging-sisterhood-emotional-connection'
      };
    }

    return null;
  }

  /**
   * מקבל נתונים של המשתמשת
   * פונקציה ציבורית כדי שניתן יהיה להשתמש בה גם מחוץ לשירות
   */
  async getUserData(userId: string) {
    const [dailyResult, cycleResult, profileResult] = await Promise.all([
      supabaseAdmin
        .from('daily_entries')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(30),
      supabaseAdmin
        .from('cycle_entries')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(12),
      supabaseAdmin
        .from('user_profile')
        .select('email, subscription_status')
        .eq('id', userId)
        .single()
    ]);

    const dailyEntries = dailyResult.data || [];
    const cycleEntries = cycleResult.data || [];
    const profile = profileResult.data;

    if (!profile) return null;

    // חשב מתי הדיווח האחרון
    const lastEntry = dailyEntries[0];
    const lastEntryDate = lastEntry?.date || null;
    const daysSinceLastEntry = lastEntryDate
      ? Math.floor((Date.now() - new Date(lastEntryDate).getTime()) / (1000 * 60 * 60 * 24))
      : 999;

    return {
      dailyEntries,
      cycleEntries,
      profile,
      lastEntryDate,
      daysSinceLastEntry
    };
  }

  /**
   * מקבל העדפות המשתמשת
   */
  private async getUserPreferences(userId: string) {
    const { data } = await supabaseAdmin
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!data) {
      // יצירת העדפות ברירת מחדל
      return {
        email: { enabled: true, frequency: 'weekly', time: '09:00', newsletter_interval_days: 4 },
        categories: { insights: true, encouragements: true, reminders: true, warnings: true }
      };
    }

    return {
      email: data.email,
      categories: data.categories
    };
  }

  /**
   * מקבל את ההתראה האחרונה שנשלחה
   */
  private async getLastNotification(userId: string) {
    const { data } = await supabaseAdmin
      .from('notification_history')
      .select('sent_at')
      .eq('user_id', userId)
      .eq('channel', 'email')
      .order('sent_at', { ascending: false })
      .limit(1)
      .single();

    return data;
  }

  /**
   * שומר היסטוריית התראה
   */
  async saveNotificationHistory(
    userId: string,
    insight: UserInsight,
    status: 'sent' | 'failed' = 'sent'
  ) {
    await supabaseAdmin
      .from('notification_history')
      .insert({
        user_id: userId,
        type: insight.type,
        title: insight.title,
        message: insight.message,
        channel: 'email',
        status,
        sent_at: new Date().toISOString()
      });
  }
}

