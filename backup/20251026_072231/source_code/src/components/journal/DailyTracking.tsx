'use client';

import { useState, useEffect } from 'react';
import { DailyEntry } from '@/types/journal';
import DailyEntryForm from './DailyEntryForm';
import DailyEntryCard from './DailyEntryCard';
import MoodCards from './MoodCards';
import { supabase } from '@/lib/supabase';

interface DailyTrackingProps {
  userId: string;
  entries: DailyEntry[];
  onEntriesChange: (entries: DailyEntry[]) => void;
}

export default function DailyTracking({ userId, entries, onEntriesChange }: DailyTrackingProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DailyEntry | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'evening'>('morning');

  // Check if user has already logged today
  const today = new Date().toISOString().split('T')[0];
  const todayMorningEntry = entries.find(entry => 
    entry.date === today && entry.time_of_day === 'morning'
  );
  const todayEveningEntry = entries.find(entry => 
    entry.date === today && entry.time_of_day === 'evening'
  );

  const loadEntries = async () => {
    try {
      // Check if this is a mock user
      if (userId.startsWith('mock-user-')) {
        console.log('DailyTracking: Using mock data for mock user');
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
        onEntriesChange(mockEntries);
        return;
      }
      
      const { data, error } = await supabase
        .from('daily_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      onEntriesChange(data || []);
    } catch (error) {
      console.error('Error loading daily entries:', error);
    }
  };

  useEffect(() => {
    loadEntries();
  }, [userId]);

  const handleSaveEntry = async (entryData: Partial<DailyEntry>) => {
    try {
      // Check if this is a mock user
      if (userId.startsWith('mock-user-')) {
        console.log('DailyTracking: Mock save for mock user');
        // For mock users, just add to local state
        const newEntry: DailyEntry = {
          id: 'mock-' + Date.now(),
          user_id: userId,
          date: today,
          time_of_day: timeOfDay,
          sleep_quality: entryData.sleep_quality || 'good',
          woke_up_night: entryData.woke_up_night || false,
          night_sweats: entryData.night_sweats || false,
          energy_level: entryData.energy_level || 'medium',
          mood: entryData.mood || 'neutral',
          hot_flashes: entryData.hot_flashes || false,
          dryness: entryData.dryness || false,
          pain: entryData.pain || false,
          bloating: entryData.bloating || false,
          concentration_difficulty: entryData.concentration_difficulty || false,
          sleep_issues: entryData.sleep_issues || false,
          sexual_desire: entryData.sexual_desire || false,
          daily_insight: entryData.daily_insight || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        onEntriesChange([newEntry, ...entries]);
        setShowForm(false);
        setEditingEntry(null);
        return;
      }
      
      if (editingEntry) {
        // Update existing entry
        const { error } = await supabase
          .from('daily_entries')
          .update({
            ...entryData,
            time_of_day: timeOfDay
          })
          .eq('id', editingEntry.id);

        if (error) throw error;
      } else {
        // Create new entry
        const { error } = await supabase
          .from('daily_entries')
          .insert({
            user_id: userId,
            date: today,
            time_of_day: timeOfDay,
            ...entryData
          });

        if (error) throw error;
      }

      await loadEntries();
      setShowForm(false);
      setEditingEntry(null);
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  const handleEditEntry = (entry: DailyEntry) => {
    setEditingEntry(entry);
    setTimeOfDay(entry.time_of_day);
    setShowForm(true);
  };

  const handleDeleteEntry = async (id: string) => {
    if (!confirm('את בטוחה שברצונך למחוק רשומה זו?')) return;

    try {
      // Check if this is a mock user
      if (userId.startsWith('mock-user-')) {
        console.log('DailyTracking: Mock delete for mock user');
        // For mock users, just remove from local state
        const updatedEntries = entries.filter(entry => entry.id !== id);
        onEntriesChange(updatedEntries);
        return;
      }
      
      const { error } = await supabase
        .from('daily_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  return (
    <div className="daily-tracking-container">
      {/* Row 1: Time Selection + Quick Stats */}
      <div className="daily-tracking-row-1">
        <div className="time-selection">
          <h2>איך עבר עלייך?</h2>
          <div className="time-buttons">
            <button 
              className={`time-btn ${timeOfDay === 'morning' ? 'active' : ''}`}
              onClick={() => setTimeOfDay('morning')}
              disabled={todayMorningEntry && !editingEntry}
            >
              🌅 בוקר
              {todayMorningEntry && !editingEntry && <span className="completed">✓</span>}
            </button>
            <button 
              className={`time-btn ${timeOfDay === 'evening' ? 'active' : ''}`}
              onClick={() => setTimeOfDay('evening')}
              disabled={todayEveningEntry && !editingEntry}
            >
              🌙 ערב
              {todayEveningEntry && !editingEntry && <span className="completed">✓</span>}
            </button>
          </div>
        </div>
        
        <div className="quick-stats">
          <div className="stat-card">
            <span className="stat-number">{entries.length}</span>
            <span className="stat-label">דיווחים השבוע</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {entries.filter(e => e.hot_flashes).length}
            </span>
            <span className="stat-label">גלי חום</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {entries.filter(e => e.sleep_quality === 'good').length}
            </span>
            <span className="stat-label">לילות טובים</span>
          </div>
        </div>
      </div>

      {/* Row 2: Mood Cards */}
      <div className="daily-tracking-row-2">
        {/* Mood Cards - Desktop Only */}
        <div className="mood-cards-desktop">
          <MoodCards entries={entries} />
        </div>

        {/* Mood Cards - Mobile Only */}
        <div className="mood-cards-mobile">
          <MoodCards entries={entries} />
        </div>
      </div>

      {/* Row 3: Entries List */}
      <div className="daily-tracking-row-3">
        <div className="entries-list">
          <h3>הדיווחים שלך</h3>
          {entries.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <p>עדיין לא דיווחת היום</p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                התחילי עכשיו
              </button>
            </div>
          ) : (
            <div className="entries-grid">
              {entries.slice(0, 10).map((entry) => (
                <DailyEntryCard
                  key={entry.id}
                  entry={entry}
                  onEdit={handleEditEntry}
                  onDelete={handleDeleteEntry}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <DailyEntryForm
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingEntry(null);
          }}
          timeOfDay={timeOfDay}
          entry={editingEntry}
          onSave={handleSaveEntry}
        />
      )}

      {/* Quick Add Button */}
      <button 
        className="fab"
        onClick={() => setShowForm(true)}
        aria-label="הוסף דיווח חדש"
      >
        <span className="fab-icon">+</span>
      </button>
    </div>
  );
}
