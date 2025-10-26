'use client';

import { useState, useEffect } from 'react';
import { CycleEntry, DailyEntry } from '@/types/journal';
import DailyTracking from './DailyTracking';
import CycleTracking from './CycleTracking';
import AlizaMessages from './AlizaMessages';
import InsightsDashboard from './InsightsDashboard';
import { supabase } from '@/lib/supabase';
// import WelcomeScreen from './WelcomeScreen'; // Disabled for cleaner UX
import './MenopauseJournalRefined.css';

interface MenopauseJournalProps {
  userId: string;
}

export default function MenopauseJournal({ userId }: MenopauseJournalProps) {
  const [activeTab, setActiveTab] = useState<'daily' | 'cycle' | 'insights'>('daily');
  const [cycleEntries, setCycleEntries] = useState<CycleEntry[]>([]);
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);

  // Load data when component mounts or userId changes
  useEffect(() => {
    if (userId) {
      loadDailyEntries();
      loadCycleEntries();
    }
  }, [userId]);

  const loadDailyEntries = async () => {
    try {
      // Check if this is a mock user
      if (userId.startsWith('mock-user-')) {
        console.log('MenopauseJournal: Using mock data for mock user');
        // Generate comprehensive mock entries for demo
        const today = new Date();
        const mockEntries: DailyEntry[] = [
          // Today
          {
            id: 'mock-1',
            user_id: userId,
            date: today.toISOString().split('T')[0],
            time_of_day: 'morning',
            sleep_quality: 'good',
            woke_up_night: false,
            night_sweats: false,
            energy_level: 'high',
            mood: 'happy',
            hot_flashes: false,
            dryness: false,
            pain: false,
            bloating: false,
            concentration_difficulty: false,
            sleep_issues: false,
            sexual_desire: true,
            daily_insight: 'בוקר מצוין! מרגישה מלאת אנרגיה ומוכנה ליום חדש.',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          // Yesterday
          {
            id: 'mock-2',
            user_id: userId,
            date: new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time_of_day: 'morning',
            sleep_quality: 'fair',
            woke_up_night: true,
            night_sweats: false,
            energy_level: 'medium',
            mood: 'neutral',
            hot_flashes: false,
            dryness: false,
            pain: false,
            bloating: false,
            concentration_difficulty: false,
            sleep_issues: false,
            sexual_desire: false,
            daily_insight: 'התעוררתי פעם אחת בלילה, אבל בסך הכל שינה סבירה.',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'mock-3',
            user_id: userId,
            date: new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time_of_day: 'evening',
            sleep_quality: null,
            woke_up_night: false,
            night_sweats: false,
            energy_level: 'medium',
            mood: 'calm',
            hot_flashes: true,
            dryness: false,
            pain: false,
            bloating: false,
            concentration_difficulty: false,
            sleep_issues: false,
            sexual_desire: false,
            daily_insight: 'גלי חום קלים בערב, אבל לא מפריעים.',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          // 2 days ago
          {
            id: 'mock-4',
            user_id: userId,
            date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time_of_day: 'morning',
            sleep_quality: 'poor',
            woke_up_night: true,
            night_sweats: true,
            energy_level: 'low',
            mood: 'frustrated',
            hot_flashes: false,
            dryness: true,
            pain: true,
            bloating: true,
            concentration_difficulty: true,
            sleep_issues: true,
            sexual_desire: false,
            daily_insight: 'לילה קשה עם הזעות לילה והתעוררויות. מרגישה מתוסכלת ועייפה.',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'mock-5',
            user_id: userId,
            date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time_of_day: 'evening',
            sleep_quality: null,
            woke_up_night: false,
            night_sweats: false,
            energy_level: 'low',
            mood: 'sad',
            hot_flashes: true,
            dryness: true,
            pain: true,
            bloating: true,
            concentration_difficulty: true,
            sleep_issues: true,
            sexual_desire: false,
            daily_insight: 'יום קשה עם הרבה תסמינים. מקווה שמחר יהיה טוב יותר.',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          // 3 days ago
          {
            id: 'mock-6',
            user_id: userId,
            date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time_of_day: 'morning',
            sleep_quality: 'excellent',
            woke_up_night: false,
            night_sweats: false,
            energy_level: 'high',
            mood: 'happy',
            hot_flashes: false,
            dryness: false,
            pain: false,
            bloating: false,
            concentration_difficulty: false,
            sleep_issues: false,
            sexual_desire: true,
            daily_insight: 'בוקר מושלם! השינה הייתה עמוקה ומרגישה מלאת אנרגיה.',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'mock-7',
            user_id: userId,
            date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time_of_day: 'evening',
            sleep_quality: null,
            woke_up_night: false,
            night_sweats: false,
            energy_level: 'high',
            mood: 'happy',
            hot_flashes: false,
            dryness: false,
            pain: false,
            bloating: false,
            concentration_difficulty: false,
            sleep_issues: false,
            sexual_desire: true,
            daily_insight: 'יום נפלא! הרגשה טובה כל היום.',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          // 4 days ago
          {
            id: 'mock-8',
            user_id: userId,
            date: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time_of_day: 'morning',
            sleep_quality: 'good',
            woke_up_night: false,
            night_sweats: false,
            energy_level: 'high',
            mood: 'happy',
            hot_flashes: false,
            dryness: false,
            pain: false,
            bloating: false,
            concentration_difficulty: false,
            sleep_issues: false,
            sexual_desire: true,
            daily_insight: 'בוקר נהדר! השינה הייתה טובה ואני מלאת אנרגיה.',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'mock-9',
            user_id: userId,
            date: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time_of_day: 'evening',
            sleep_quality: null,
            woke_up_night: false,
            night_sweats: false,
            energy_level: 'high',
            mood: 'happy',
            hot_flashes: false,
            dryness: false,
            pain: false,
            bloating: false,
            concentration_difficulty: false,
            sleep_issues: false,
            sexual_desire: true,
            daily_insight: 'יום מושלם! הרגשה נהדרת כל היום.',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          // 5 days ago
          {
            id: 'mock-10',
            user_id: userId,
            date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time_of_day: 'morning',
            sleep_quality: 'fair',
            woke_up_night: true,
            night_sweats: false,
            energy_level: 'medium',
            mood: 'neutral',
            hot_flashes: false,
            dryness: false,
            pain: false,
            bloating: false,
            concentration_difficulty: false,
            sleep_issues: false,
            sexual_desire: false,
            daily_insight: 'התעוררתי פעם אחת בלילה, אבל בסך הכל שינה סבירה.',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'mock-11',
            user_id: userId,
            date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time_of_day: 'evening',
            sleep_quality: null,
            woke_up_night: false,
            night_sweats: false,
            energy_level: 'medium',
            mood: 'calm',
            hot_flashes: true,
            dryness: false,
            pain: false,
            bloating: false,
            concentration_difficulty: false,
            sleep_issues: false,
            sexual_desire: false,
            daily_insight: 'גלי חום קלים בערב, אבל לא מפריעים.',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        setDailyEntries(mockEntries);
        return;
      }
      
      const { data, error } = await supabase
        .from('daily_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDailyEntries(data || []);
    } catch (error) {
      console.error('Error loading daily entries:', error);
    }
  };

  const loadCycleEntries = async () => {
    try {
      // Check if this is a mock user
      if (userId.startsWith('mock-user-')) {
        console.log('MenopauseJournal: Using mock cycle data for mock user');
        // Generate mock cycle entries
        const today = new Date();
        const mockCycleEntries: CycleEntry[] = [
          {
            id: 'cycle-mock-1',
            user_id: userId,
            date: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            is_period: true,
            bleeding_intensity: 'medium',
            symptoms: ['cramps', 'fatigue'],
            notes: 'מחזור רגיל, קצת עייפות',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'cycle-mock-2',
            user_id: userId,
            date: new Date(today.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            is_period: true,
            bleeding_intensity: 'light',
            symptoms: ['cramps'],
            notes: 'מחזור קל',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        setCycleEntries(mockCycleEntries);
        return;
      }
      
      const { data, error } = await supabase
        .from('cycle_entries')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) throw error;
      setCycleEntries(data || []);
    } catch (error) {
      console.error('Error loading cycle entries:', error);
    }
  };

  return (
    <div className="menopause-journal">
      {/* Header */}
      <div className="journal-header">
        <h1>🌸 היומן שלי</h1>
        <p className="subtitle">מרחב אישי למעקב אחר המסע שלך</p>
      </div>

      {/* Navigation Tabs */}
      <div className="journal-tabs">
        <button 
          className={`tab ${activeTab === 'daily' ? 'active' : ''}`}
          onClick={() => setActiveTab('daily')}
        >
          🌅 מעקב יומי
        </button>
        <button 
          className={`tab ${activeTab === 'cycle' ? 'active' : ''}`}
          onClick={() => setActiveTab('cycle')}
        >
          🌸 מעקב מחזור
        </button>
        <button 
          className={`tab ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          💡 תובנות
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'daily' && (
          <DailyTracking 
            userId={userId}
            entries={dailyEntries}
            onEntriesChange={(newEntries) => {
              setDailyEntries(newEntries);
              // Reload data to ensure consistency
              loadDailyEntries();
            }}
          />
        )}
        
        {activeTab === 'cycle' && (
          <CycleTracking 
            userId={userId}
            entries={cycleEntries}
            onEntriesChange={(newEntries) => {
              setCycleEntries(newEntries);
              // Reload data to ensure consistency
              loadCycleEntries();
            }}
          />
        )}
        
        {activeTab === 'insights' && (
          <div className="insights-tab-content">
            <InsightsDashboard 
              dailyEntries={dailyEntries}
              cycleEntries={cycleEntries}
            />
            <AlizaMessages 
              userId={userId}
              dailyEntries={dailyEntries}
              cycleEntries={cycleEntries}
            />
          </div>
        )}
      </div>
    </div>
  );
}
