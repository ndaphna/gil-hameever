import { supabase } from './supabase';
import { InsightData, TrendAnalysis, SymptomPattern, HormoneAnalysis, PersonalizedInsight } from '@/types/insights';

export class InsightsAI {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  async generateInsights(): Promise<PersonalizedInsight[]> {
    try {
      // קבלת נתונים מהמסד
      const [dailyEntries, cycleEntries, emotionEntries] = await Promise.all([
        this.getDailyEntries(),
        this.getCycleEntries(),
        this.getEmotionEntries()
      ]);

      const insights: PersonalizedInsight[] = [];

      // ניתוח דפוסי שינה
      const sleepInsights = await this.analyzeSleepPatterns(dailyEntries);
      insights.push(...sleepInsights);

      // ניתוח תסמינים
      const symptomInsights = await this.analyzeSymptoms(dailyEntries);
      insights.push(...symptomInsights);

      // ניתוח מצב רוח
      const moodInsights = await this.analyzeMoodPatterns(emotionEntries);
      insights.push(...moodInsights);

      // ניתוח מחזור
      const cycleInsights = await this.analyzeCyclePatterns(cycleEntries);
      insights.push(...cycleInsights);

      // ניתוח הורמונלי
      const hormoneInsights = await this.analyzeHormonalPhase(dailyEntries, cycleEntries);
      insights.push(...hormoneInsights);

      return insights.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    } catch (error) {
      console.error('Error generating insights:', error);
      return [];
    }
  }

  private async getDailyEntries() {
    const { data, error } = await supabase
      .from('daily_entries')
      .select('*')
      .eq('user_id', this.userId)
      .order('date', { ascending: false })
      .limit(90); // 3 חודשים אחרונים

    if (error) throw error;
    return data || [];
  }

  private async getCycleEntries() {
    const { data, error } = await supabase
      .from('cycle_entries')
      .select('*')
      .eq('user_id', this.userId)
      .order('date', { ascending: false })
      .limit(12); // 12 מחזורים אחרונים

    if (error) throw error;
    return data || [];
  }

  private async getEmotionEntries() {
    const { data, error } = await supabase
      .from('emotion_entry')
      .select('*')
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false })
      .limit(90);

    if (error) throw error;
    return data || [];
  }

  private async analyzeSleepPatterns(entries: any[]): Promise<PersonalizedInsight[]> {
    const insights: PersonalizedInsight[] = [];
    
    if (entries.length < 7) return insights;

    // חישוב איכות שינה ממוצעת
    const sleepQuality = entries
      .filter(e => e.sleep_quality)
      .map(e => ({ quality: e.sleep_quality, date: e.date }));

    if (sleepQuality.length < 5) return insights;

    const qualityScores = { poor: 1, fair: 2, good: 3 };
    const avgQuality = sleepQuality.reduce((sum, entry) => 
      sum + qualityScores[entry.quality as keyof typeof qualityScores], 0) / sleepQuality.length;

    // ניתוח דפוסי שינה
    if (avgQuality < 2) {
      insights.push({
        id: 'sleep-quality-low',
        type: 'warning',
        title: 'איכות שינה נמוכה',
        content: 'זיהיתי דפוס של שינה לא מספקת. זה נפוץ בגיל המעבר ויש דרכים לשפר את זה.',
        priority: 'high',
        category: 'sleep',
        actionable: true,
        relatedData: { avgQuality, sleepQuality },
        alizaMessage: `אני רואה שאת מתמודדת עם שינה לא מספקת. זה אחד התסמינים הכי נפוצים בגיל המעבר. בואי נעבד על זה יחד - יש לי כמה טיפים שיכולים לעזור לך לישון טוב יותר.`
      });
    }

    // ניתוח קשר בין פעילות גופנית לשינה
    const exerciseDays = entries.filter(e => e.energy_level === 'high').length;
    const goodSleepDays = entries.filter(e => e.sleep_quality === 'good').length;
    
    if (exerciseDays > 0 && goodSleepDays > 0) {
      const correlation = this.calculateCorrelation(
        entries.map(e => e.energy_level === 'high' ? 1 : 0),
        entries.map(e => e.sleep_quality === 'good' ? 1 : 0)
      );

      if (correlation > 0.3) {
        insights.push({
          id: 'exercise-sleep-correlation',
          type: 'pattern',
          title: 'פעילות גופנית משפרת שינה',
          content: 'זיהיתי קשר חיובי בין פעילות גופנית לאיכות השינה שלך.',
          priority: 'medium',
          category: 'lifestyle',
          actionable: true,
          relatedData: { correlation, exerciseDays, goodSleepDays },
          alizaMessage: `זה נהדר! אני רואה שכשאת עושה פעילות גופנית, את ישנה טוב יותר. זה בדיוק מה שהמחקרים מראים - פעילות גופנית עוזרת לווסת את ההורמונים ולשפר את איכות השינה.`
        });
      }
    }

    return insights;
  }

  private async analyzeSymptoms(entries: any[]): Promise<PersonalizedInsight[]> {
    const insights: PersonalizedInsight[] = [];
    
    if (entries.length < 14) return insights;

    // ניתוח תסמינים נפוצים
    const symptoms = {
      hot_flashes: entries.filter(e => e.hot_flashes).length,
      night_sweats: entries.filter(e => e.night_sweats).length,
      mood_issues: entries.filter(e => e.mood === 'irritated' || e.mood === 'sad').length,
      sleep_issues: entries.filter(e => e.sleep_issues).length,
      concentration: entries.filter(e => e.concentration_difficulty).length,
      dryness: entries.filter(e => e.dryness).length,
      pain: entries.filter(e => e.pain).length,
      bloating: entries.filter(e => e.bloating).length
    };

    const totalDays = entries.length;
    const symptomFrequency = Object.entries(symptoms).map(([symptom, count]) => ({
      symptom,
      frequency: (count / totalDays) * 100
    }));

    // זיהוי תסמינים דומיננטיים
    const dominantSymptoms = symptomFrequency
      .filter(s => s.frequency > 30)
      .sort((a, b) => b.frequency - a.frequency);

    if (dominantSymptoms.length > 0) {
      const topSymptom = dominantSymptoms[0];
      insights.push({
        id: `symptom-${topSymptom.symptom}`,
        type: 'pattern',
        title: `תסמין דומיננטי: ${this.getSymptomName(topSymptom.symptom)}`,
        content: `זיהיתי ש-${this.getSymptomName(topSymptom.symptom)} מופיע ב-${Math.round(topSymptom.frequency)}% מהימים.`,
        priority: topSymptom.frequency > 50 ? 'high' : 'medium',
        category: 'symptoms',
        actionable: true,
        relatedData: { symptom: topSymptom.symptom, frequency: topSymptom.frequency },
        alizaMessage: `אני רואה ש${this.getSymptomName(topSymptom.symptom)} הוא תסמין שמשפיע עליך הרבה. זה מאוד נפוץ בגיל המעבר, ואני כאן כדי לעזור לך להתמודד איתו. יש לי כמה טכניקות שיכולות לעזור.`
      });
    }

    return insights;
  }

  private async analyzeMoodPatterns(entries: any[]): Promise<PersonalizedInsight[]> {
    const insights: PersonalizedInsight[] = [];
    
    if (entries.length < 7) return insights;

    // ניתוח דפוסי מצב רוח
    const moodCounts = entries.reduce((acc, entry) => {
      acc[entry.emotion] = (acc[entry.emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalEntries = entries.length;
    const negativeMoods = (moodCounts['irritated'] || 0) + (moodCounts['sad'] || 0) + (moodCounts['frustrated'] || 0);
    const negativePercentage = (negativeMoods / totalEntries) * 100;

    if (negativePercentage > 40) {
      insights.push({
        id: 'mood-pattern-negative',
        type: 'warning',
        title: 'דפוסי מצב רוח קשים',
        content: 'זיהיתי דפוס של מצב רוח שלילי. זה נפוץ בגיל המעבר ויש דרכים להתמודד.',
        priority: 'high',
        category: 'mood',
        actionable: true,
        relatedData: { negativePercentage, moodCounts },
        alizaMessage: `אני רואה שאת עוברת תקופה קשה עם מצב הרוח. זה מאוד טבעי בגיל המעבר - השינויים ההורמונליים משפיעים על הרגשות שלנו. אני כאן בשבילך, ואנחנו יכולים לעבוד על זה יחד.`
      });
    }

    // זיהוי שיפור במצב הרוח
    const recentEntries = entries.slice(0, 7);
    const olderEntries = entries.slice(7, 14);
    
    if (recentEntries.length >= 5 && olderEntries.length >= 5) {
      const recentNegative = recentEntries.filter(e => 
        ['irritated', 'sad', 'frustrated'].includes(e.emotion)
      ).length;
      const olderNegative = olderEntries.filter(e => 
        ['irritated', 'sad', 'frustrated'].includes(e.emotion)
      ).length;

      if (recentNegative < olderNegative * 0.7) {
        insights.push({
          id: 'mood-improvement',
          type: 'encouragement',
          title: 'שיפור במצב הרוח!',
          content: 'זיהיתי שיפור במצב הרוח שלך בשבוע האחרון.',
          priority: 'medium',
          category: 'mood',
          actionable: false,
          relatedData: { recentNegative, olderNegative },
          alizaMessage: `זה נהדר! אני רואה שיש שיפור במצב הרוח שלך. זה מראה שהגוף שלך מתחיל להסתגל לשינויים. המשכי עם מה שעובד בשבילך!`
        });
      }
    }

    return insights;
  }

  private async analyzeCyclePatterns(entries: any[]): Promise<PersonalizedInsight[]> {
    const insights: PersonalizedInsight[] = [];
    
    if (entries.length < 3) return insights;

    // ניתוח דפוסי מחזור
    const periodEntries = entries.filter(e => e.is_period);
    const irregularity = this.calculateCycleIrregularity(entries);

    if (irregularity > 0.3) {
      insights.push({
        id: 'cycle-irregularity',
        type: 'pattern',
        title: 'אי סדירות במחזור',
        content: 'זיהיתי דפוס של מחזור לא סדיר, שזה נפוץ בגיל המעבר.',
        priority: 'medium',
        category: 'cycle',
        actionable: true,
        relatedData: { irregularity, periodCount: periodEntries.length },
        alizaMessage: `אני רואה שהמחזור שלך לא סדיר. זה מאוד נפוץ בגיל המעבר - הגוף מתחיל להפחית את ייצור האסטרוגן. זה חלק טבעי מהתהליך, ואני כאן לעזור לך להבין מה קורה.`
      });
    }

    return insights;
  }

  private async analyzeHormonalPhase(entries: any[], cycleEntries: any[]): Promise<PersonalizedInsight[]> {
    const insights: PersonalizedInsight[] = [];
    
    // ניתוח שלב הורמונלי
    const symptoms = entries.reduce((acc, entry) => {
      if (entry.hot_flashes) acc.hotFlashes++;
      if (entry.night_sweats) acc.nightSweats++;
      if (entry.mood === 'irritated' || entry.mood === 'sad') acc.moodIssues++;
      if (entry.sleep_issues) acc.sleepIssues++;
      return acc;
    }, { hotFlashes: 0, nightSweats: 0, moodIssues: 0, sleepIssues: 0 });

    const totalDays = entries.length;
    const symptomScore = (symptoms.hotFlashes + symptoms.nightSweats + symptoms.moodIssues + symptoms.sleepIssues) / (totalDays * 4);

    let phase: 'premenopausal' | 'perimenopausal' | 'menopausal' | 'postmenopausal';
    let confidence: number;

    if (symptomScore > 0.6) {
      phase = 'perimenopausal';
      confidence = 85;
    } else if (symptomScore > 0.3) {
      phase = 'perimenopausal';
      confidence = 70;
    } else {
      phase = 'premenopausal';
      confidence = 60;
    }

    insights.push({
      id: 'hormonal-phase',
      type: 'pattern',
      title: `ניתוח שלב הורמונלי: ${this.getPhaseName(phase)}`,
      content: `תבסס על התסמינים שלך, נראה שאת בשלב ${this.getPhaseName(phase)}.`,
      priority: 'high',
      category: 'hormones',
      actionable: true,
      relatedData: { phase, confidence, symptomScore },
      alizaMessage: `תבסס על מה שאני רואה ביומן שלך, נראה שאת בשלב ${this.getPhaseName(phase)}. זה אומר שהגוף שלך מתחיל לעבור שינויים הורמונליים. אני כאן כדי לעזור לך להבין מה קורה ולמצוא דרכים להתמודד עם התסמינים.`
    });

    return insights;
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length === 0) return 0;
    
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  }

  private calculateCycleIrregularity(entries: any[]): number {
    if (entries.length < 3) return 0;
    
    const periods = entries.filter(e => e.is_period).map(e => new Date(e.date));
    if (periods.length < 3) return 0;
    
    const intervals = [];
    for (let i = 1; i < periods.length; i++) {
      const diff = periods[i].getTime() - periods[i-1].getTime();
      intervals.push(diff / (1000 * 60 * 60 * 24)); // ימים
    }
    
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, interval) => sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length;
    
    return Math.sqrt(variance) / avgInterval;
  }

  private getSymptomName(symptom: string): string {
    const names: Record<string, string> = {
      hot_flashes: 'גלי חום',
      night_sweats: 'הזעות לילה',
      mood_issues: 'בעיות מצב רוח',
      sleep_issues: 'בעיות שינה',
      concentration: 'קשיי ריכוז',
      dryness: 'יובש',
      pain: 'כאבים',
      bloating: 'נפיחות'
    };
    return names[symptom] || symptom;
  }

  private getPhaseName(phase: string): string {
    const names: Record<string, string> = {
      premenopausal: 'טרום גיל המעבר',
      perimenopausal: 'גיל המעבר',
      menopausal: 'גיל המעבר המלא',
      postmenopausal: 'אחרי גיל המעבר'
    };
    return names[phase] || phase;
  }
}
