import { supabase } from './supabase';
import { PersonalizedInsight, ChartData } from '@/types/insights';

export class InsightsAI {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  async generateInsights(): Promise<PersonalizedInsight[]> {
    try {
      // קבלת נתונים מהמסד - רק נתונים אמיתיים
      const [dailyEntries, cycleEntries, emotionEntries, userProfile] = await Promise.all([
        this.getDailyEntries(),
        this.getCycleEntries(),
        this.getEmotionEntries(),
        this.getUserProfile()
      ]);

      // אם אין מספיק נתונים, נחזיר רשימה ריקה
      if (dailyEntries.length === 0 && cycleEntries.length === 0 && emotionEntries.length === 0) {
        console.log('No data available for insights generation');
        return [];
      }

      // שימוש ב-OpenAI API לניתוח מעמיק
      const insights = await this.analyzeWithOpenAI({
        dailyEntries,
        cycleEntries,
        emotionEntries,
        userProfile
      });

      // הוספת נתונים ויזואליים לכל תובנה
      const insightsWithVisuals = await Promise.all(
        insights.map(insight => this.addVisualDataToInsight(insight, dailyEntries))
      );

      return insightsWithVisuals.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    } catch (error) {
      console.error('Error generating insights:', error);
      return [];
    }
  }

  private async analyzeWithOpenAI(data: {
    dailyEntries: any[];
    cycleEntries: any[];
    emotionEntries: any[];
    userProfile: any;
  }): Promise<PersonalizedInsight[]> {
    try {
      // קריאה ל-API route החדש
      const response = await fetch('/api/analyze-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId,
          analysisType: 'comprehensive',
          data: {
            dailyEntries: data.dailyEntries,
            cycleEntries: data.cycleEntries,
            emotionEntries: data.emotionEntries,
            userProfile: data.userProfile
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      return result.insights || [];
    } catch (error) {
      console.error('Error calling OpenAI analysis API:', error);
      // במקרה של שגיאה, נחזיר רשימה ריקה (לא mock data)
      return [];
    }
  }

  private async addVisualDataToInsight(
    insight: PersonalizedInsight,
    dailyEntries: any[]
  ): Promise<PersonalizedInsight> {
    // הוספת נתונים ויזואליים לפי קטגוריה
    if (insight.category === 'sleep' && !insight.visualData) {
      insight.visualData = {
        chartType: 'line',
        data: this.generateSleepVisualData(dailyEntries)
      };
    } else if (insight.category === 'symptoms' && !insight.visualData) {
      const symptomName = insight.relatedData?.symptom || 'hot_flashes';
      insight.visualData = {
        chartType: 'line',
        data: this.generateSymptomVisualData(dailyEntries, symptomName)
      };
    } else if (insight.category === 'mood' && !insight.visualData) {
      insight.visualData = {
        chartType: 'bar',
        data: this.generateMoodVisualData(dailyEntries)
      };
    }

    return insight;
  }

  private async getDailyEntries() {
    const { data, error } = await supabase
      .from('daily_entries')
      .select('*')
      .eq('user_id', this.userId)
      .order('date', { ascending: false })
      .limit(90); // 3 חודשים אחרונים

    if (error) {
      console.error('Error loading daily entries:', error);
      return [];
    }
    return data || [];
  }

  private async getCycleEntries() {
    const { data, error } = await supabase
      .from('cycle_entries')
      .select('*')
      .eq('user_id', this.userId)
      .order('date', { ascending: false })
      .limit(12); // 12 מחזורים אחרונים

    if (error) {
      console.error('Error loading cycle entries:', error);
      return [];
    }
    return data || [];
  }

  private async getEmotionEntries() {
    const { data, error } = await supabase
      .from('emotion_entry')
      .select('*')
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false })
      .limit(90);

    if (error) {
      console.error('Error loading emotion entries:', error);
      return [];
    }
    return data || [];
  }

  private async getUserProfile() {
    const { data, error } = await supabase
      .from('user_profile')
      .select('*')
      .eq('id', this.userId)
      .single();

    if (error) {
      console.warn('Could not load user profile:', error);
      return null;
    }
    return data;
  }

  // Helper functions for visual data
  private generateSleepVisualData(entries: any[]): ChartData {
    const sleepEntries = entries
      .filter(e => e.sleep_quality)
      .slice(0, 30)
      .reverse();
    
    const qualityScores: Record<string, number> = { poor: 1, fair: 2, good: 3 };
    
    return {
      labels: sleepEntries.map(e => {
        const date = new Date(e.date);
        return date.toLocaleDateString('he-IL', { month: 'short', day: 'numeric' });
      }),
      datasets: [{
        label: 'איכות שינה',
        data: sleepEntries.map(e => qualityScores[e.sleep_quality] || 2),
        backgroundColor: 'rgba(69, 183, 209, 0.2)',
        borderColor: '#45b7d1',
        tension: 0.4
      }]
    };
  }

  private generateSymptomVisualData(entries: any[], symptom: string): ChartData {
    const recentEntries = entries.slice(0, 30).reverse();
    
    return {
      labels: recentEntries.map(e => {
        const date = new Date(e.date);
        return date.toLocaleDateString('he-IL', { month: 'short', day: 'numeric' });
      }),
      datasets: [{
        label: this.getSymptomName(symptom),
        data: recentEntries.map(e => e[symptom] ? 1 : 0),
        backgroundColor: 'rgba(255, 107, 107, 0.2)',
        borderColor: '#ff6b6b',
        tension: 0.4
      }]
    };
  }

  private generateMoodVisualData(entries: any[]): ChartData {
    const moodScores: Record<string, number> = {
      happy: 5,
      calm: 4,
      sad: 2,
      irritated: 2,
      frustrated: 1
    };

    const moodEntries = entries
      .filter(e => e.mood)
      .slice(0, 30)
      .reverse();
    
    return {
      labels: moodEntries.map(e => {
        const date = new Date(e.date || e.created_at);
        return date.toLocaleDateString('he-IL', { month: 'short', day: 'numeric' });
      }),
      datasets: [{
        label: 'מצב רוח',
        data: moodEntries.map(e => moodScores[e.mood] || 3),
        backgroundColor: 'rgba(78, 205, 196, 0.2)',
        borderColor: '#4ecdc4',
        tension: 0.4
      }]
    };
  }

  private getSymptomName(symptom: string): string {
    const names: Record<string, string> = {
      hot_flashes: 'גלי חום',
      night_sweats: 'הזעות לילה',
      mood_issues: 'בעיות מצב רוח',
      sleep_issues: 'בעיות שינה',
      concentration: 'קשיי ריכוז',
      concentration_difficulty: 'קשיי ריכוז',
      dryness: 'יובש',
      pain: 'כאבים',
      bloating: 'נפיחות'
    };
    return names[symptom] || symptom;
  }
}
