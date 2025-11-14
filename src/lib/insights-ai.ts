import { supabase } from './supabase';
import { PersonalizedInsight, ChartData } from '@/types/insights';
import type { DailyEntry, CycleEntry } from '@/types/journal';
import type { EmotionEntry } from '@/types';

export class InsightsAI {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  async generateInsights(): Promise<PersonalizedInsight[]> {
    try {
      console.log('📊 InsightsAI: Starting data fetch for user:', this.userId);
      
      // קבלת נתונים מהמסד - רק נתונים אמיתיים
      const [dailyEntries, cycleEntries, emotionEntries, userProfile] = await Promise.all([
        this.getDailyEntries(),
        this.getCycleEntries(),
        this.getEmotionEntries(),
        this.getUserProfile()
      ]);

      console.log('📊 InsightsAI: Data fetched:', {
        dailyEntries: dailyEntries.length,
        cycleEntries: cycleEntries.length,
        emotionEntries: emotionEntries.length,
        hasUserProfile: !!userProfile
      });

      // אם אין מספיק נתונים, נחזיר רשימה ריקה
      if (dailyEntries.length === 0 && cycleEntries.length === 0 && emotionEntries.length === 0) {
        console.log('⚠️ InsightsAI: No data available for insights generation');
        return [];
      }

      console.log('🤖 InsightsAI: Calling analyzeWithOpenAI...');
      // שימוש ב-OpenAI API לניתוח מעמיק
      const insights = await this.analyzeWithOpenAI({
        dailyEntries,
        cycleEntries,
        emotionEntries,
        userProfile
      });

      console.log('✅ InsightsAI: Received insights from API:', insights.length);

      // הוספת נתונים ויזואליים לכל תובנה
      const insightsWithVisuals = await Promise.all(
        insights.map(insight => this.addVisualDataToInsight(insight, dailyEntries))
      );

      const sorted = insightsWithVisuals.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });

      console.log('✅ InsightsAI: Returning', sorted.length, 'sorted insights');
      return sorted;
    } catch (error) {
      console.error('❌ InsightsAI: Error generating insights:', error);
      if (error instanceof Error) {
        console.error('❌ Error details:', error.message, error.stack);
      }
      return [];
    }
  }

  private async analyzeWithOpenAI(data: {
    dailyEntries: DailyEntry[];
    cycleEntries: CycleEntry[];
    emotionEntries: EmotionEntry[];
    userProfile: Record<string, unknown>;
  }): Promise<PersonalizedInsight[]> {
    try {
      console.log('🌐 InsightsAI: Calling /api/analyze-insights...');
      console.log('📤 Sending data:', {
        userId: this.userId,
        dailyEntriesCount: data.dailyEntries.length,
        cycleEntriesCount: data.cycleEntries.length,
        emotionEntriesCount: data.emotionEntries.length
      });
      
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

      console.log('📥 InsightsAI: API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ InsightsAI: API error response:', errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ InsightsAI: API response:', {
        success: result.success,
        insightsCount: result.insights?.length || 0,
        hasError: !!result.error
      });
      
      if (result.error) {
        console.error('❌ InsightsAI: API returned error:', result.error);
      }
      
      return result.insights || [];
    } catch (error) {
      console.error('❌ InsightsAI: Error calling OpenAI analysis API:', error);
      if (error instanceof Error) {
        console.error('❌ Error details:', error.message, error.stack);
      }
      // במקרה של שגיאה, נחזיר רשימה ריקה (לא mock data)
      return [];
    }
  }

  private async addVisualDataToInsight(
    insight: PersonalizedInsight,
    dailyEntries: DailyEntry[]
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
    try {
      const { data, error } = await supabase
        .from('daily_entries')
        .select('*')
        .eq('user_id', this.userId)
        .order('date', { ascending: false })
        .limit(90); // 3 חודשים אחרונים

      if (error) {
        console.error('❌ InsightsAI: Error loading daily entries:', error);
        return [];
      }
      console.log('✅ InsightsAI: Loaded', data?.length || 0, 'daily entries');
      return data || [];
    } catch (error) {
      console.error('❌ InsightsAI: Exception loading daily entries:', error);
      return [];
    }
  }

  private async getCycleEntries() {
    try {
      const { data, error } = await supabase
        .from('cycle_entries')
        .select('*')
        .eq('user_id', this.userId)
        .order('date', { ascending: false })
        .limit(12); // 12 מחזורים אחרונים

      if (error) {
        console.error('❌ InsightsAI: Error loading cycle entries:', error);
        return [];
      }
      console.log('✅ InsightsAI: Loaded', data?.length || 0, 'cycle entries');
      return data || [];
    } catch (error) {
      console.error('❌ InsightsAI: Exception loading cycle entries:', error);
      return [];
    }
  }

  private async getEmotionEntries() {
    try {
      const { data, error } = await supabase
        .from('emotion_entry')
        .select('*')
        .eq('user_id', this.userId)
        .order('created_at', { ascending: false })
        .limit(90);

      if (error) {
        console.error('❌ InsightsAI: Error loading emotion entries:', error);
        return [];
      }
      console.log('✅ InsightsAI: Loaded', data?.length || 0, 'emotion entries');
      return data || [];
    } catch (error) {
      console.error('❌ InsightsAI: Exception loading emotion entries:', error);
      return [];
    }
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
  private generateSleepVisualData(entries: DailyEntry[]): ChartData {
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

  private generateSymptomVisualData(entries: DailyEntry[], symptom: string): ChartData {
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

  private generateMoodVisualData(entries: DailyEntry[]): ChartData {
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
