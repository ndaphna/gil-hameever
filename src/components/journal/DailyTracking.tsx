'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { DailyEntry } from '@/types/journal';
import DailyEntryForm from './DailyEntryForm';
import DailyEntryCard from './DailyEntryCard';
import MoodCards from './MoodCards';
import DailyProgress from './DailyProgress';
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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Check if user has already logged today
  const today = new Date().toISOString().split('T')[0];
  const todayMorningEntry = entries.find(entry => 
    entry.date === today && entry.time_of_day === 'morning'
  );
  const todayEveningEntry = entries.find(entry => 
    entry.date === today && entry.time_of_day === 'evening'
  );

  // Calculate weekly stats (Israeli week: Sunday to Saturday)
  const weeklyStats = useMemo(() => {
    const nowDate = new Date();
    const currentDayOfWeek = nowDate.getDay(); // 0 = Sunday
    
    // Find last Sunday (start of current Israeli week)
    const lastSunday = new Date(nowDate);
    lastSunday.setDate(nowDate.getDate() - currentDayOfWeek);
    lastSunday.setHours(0, 0, 0, 0);
    
    const weeklyEntries = entries.filter(e => new Date(e.date) >= lastSunday);
    
    return {
      totalReports: weeklyEntries.length,
      hotFlashes: weeklyEntries.filter(e => e.hot_flashes).length,
      goodNights: weeklyEntries.filter(e => e.sleep_quality === 'good').length
    };
  }, [entries]);

  // Pagination calculations
  const totalPages = Math.ceil(entries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEntries = entries.slice(startIndex, endIndex);

  // Reset to page 1 when itemsPerPage changes
  const handleItemsPerPageChange = (newValue: number) => {
    setItemsPerPage(newValue);
    setCurrentPage(1);
  };

  const loadEntries = async () => {
    console.log('🔍 DailyTracking: loadEntries called');
    console.log('👤 Loading entries for userId:', userId);
    
    try {
      // Check if this is a mock user
      if (userId.startsWith('mock-user-')) {
        console.log('🎭 DailyTracking: Using mock data for mock user');
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
      
      console.log('📡 Loading from Supabase for real user...');
      console.log('🔍 User ID for query:', userId);
      console.log('🔍 User ID type:', typeof userId);
      
      const { data, error } = await supabase
        .from('daily_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      console.log('📦 Supabase response:', { data, error });
      console.log('📦 Data length:', data?.length || 0);
      console.log('📦 Error details:', error);
      
      if (error) {
        console.error('❌ Error from Supabase:', error);
        throw error;
      }
      
      console.log('✅ Loaded entries count:', data?.length || 0);
      console.log('📋 Loaded entries:', data);
      onEntriesChange(data || []);
    } catch (error) {
      console.error('💥 Error loading daily entries:', error);
    }
  };

  useEffect(() => {
    loadEntries();
  }, [userId]);

  const handleSaveEntry = async (entryData: Partial<DailyEntry>) => {
    console.log('💾 DailyTracking: handleSaveEntry called');
    console.log('📊 Entry data:', entryData);
    console.log('👤 User ID:', userId);
    console.log('🕐 Time of day:', timeOfDay);
    console.log('📅 Today:', today);
    
    try {
      // Check if this is a mock user
      if (userId.startsWith('mock-user-')) {
        console.log('🎭 Mock user detected - using local storage');
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
          mood: entryData.mood || 'calm',
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
        
        // Update local state immediately
        const updatedEntries = [newEntry, ...entries];
        console.log('✅ Mock entry created:', newEntry);
        console.log('📋 Updated entries count:', updatedEntries.length);
        onEntriesChange(updatedEntries);
        setShowForm(false);
        setEditingEntry(null);
        console.log('✨ Mock save completed successfully');
        return;
      }
      
      console.log('🔒 Real user - saving to Supabase...');
      
      if (editingEntry) {
        console.log('✏️ Updating existing entry:', editingEntry.id);
        // Update existing entry
        const { error } = await supabase
          .from('daily_entries')
          .update({
            ...entryData,
            time_of_day: timeOfDay
          })
          .eq('id', editingEntry.id);

        if (error) {
          console.error('❌ Error updating entry:', error);
          throw error;
        }
        console.log('✅ Entry updated successfully');
      } else {
        console.log('➕ Creating new entry...');
        const insertData = {
          user_id: userId,
          date: today,
          time_of_day: timeOfDay,
          ...entryData
        };
        console.log('📤 Insert data:', insertData);
        console.log('📤 Insert data type:', typeof insertData);
        console.log('📤 Insert data keys:', Object.keys(insertData));
        
        // Create new entry
        const { data, error } = await supabase
          .from('daily_entries')
          .insert(insertData)
          .select();

        console.log('📤 Insert response:', { data, error });
        console.log('📤 Insert error details:', error);
        
        if (error) {
          console.error('❌ Error creating entry:', error);
          console.error('❌ Error code:', error.code);
          console.error('❌ Error message:', error.message);
          console.error('❌ Error details:', error.details);
          throw error;
        }
        console.log('✅ Entry created successfully:', data);
      }

      // Reload entries to get fresh data from database
      console.log('🔄 Reloading entries from database...');
      await loadEntries();
      console.log('✅ Entries reloaded');
      setShowForm(false);
      setEditingEntry(null);
      console.log('✨ Real user save completed successfully');
    } catch (error) {
      console.error('💥 Error saving entry:', error);
      alert(`שגיאה בשמירת הדיווח: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
              className={`time-btn ${timeOfDay === 'morning' ? 'active' : ''} ${todayMorningEntry ? 'has-entry' : ''}`}
              onClick={() => {
                setTimeOfDay('morning');
                if (todayMorningEntry) {
                  handleEditEntry(todayMorningEntry);
                } else {
                  setShowForm(true);
                }
              }}
              aria-label={`דיווח בוקר${todayMorningEntry ? ' - קיים דיווח' : ''}`}
            >
              <span className="time-icon">🌅</span>
              <span className="time-label">בוקר</span>
              {todayMorningEntry && timeOfDay === 'morning' && <span className="active-indicator">✓</span>}
              {todayMorningEntry && timeOfDay !== 'morning' && <span className="entry-dot"></span>}
            </button>
            <button 
              className={`time-btn ${timeOfDay === 'evening' ? 'active' : ''} ${todayEveningEntry ? 'has-entry' : ''}`}
              onClick={() => {
                setTimeOfDay('evening');
                if (todayEveningEntry) {
                  handleEditEntry(todayEveningEntry);
                } else {
                  setShowForm(true);
                }
              }}
              aria-label={`דיווח ערב${todayEveningEntry ? ' - קיים דיווח' : ''}`}
            >
              <span className="time-icon">🌙</span>
              <span className="time-label">ערב</span>
              {todayEveningEntry && timeOfDay === 'evening' && <span className="active-indicator">✓</span>}
              {todayEveningEntry && timeOfDay !== 'evening' && <span className="entry-dot"></span>}
            </button>
          </div>
        </div>
        
          <div className="quick-stats-container">
            <div className="stats-explanation">
              <h3>📈 סיכום השבוע</h3>
              <p>דיווח יומי: בוקר + ערב כדי לעקוב אחר התהליך שלך. כל דיווח ניתן לעדכון.</p>
            </div>
            <div className="quick-stats">
            <div className="stat-card" role="button" tabIndex={0}>
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <div className="stat-number">{weeklyStats.totalReports}</div>
                <div className="stat-label">דיווחים השבוע</div>
              </div>
            </div>
            <div className="stat-card" role="button" tabIndex={0}>
              <div className="stat-icon">🔥</div>
              <div className="stat-content">
                <div className="stat-number">{weeklyStats.hotFlashes}</div>
                <div className="stat-label">גלי חום</div>
              </div>
            </div>
            <div className="stat-card" role="button" tabIndex={0}>
              <div className="stat-icon">😴</div>
              <div className="stat-content">
                <div className="stat-number">{weeklyStats.goodNights}</div>
                <div className="stat-label">לילות טובים</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Mood Cards */}
      <div className="daily-tracking-row-2">
        <h3 className="section-title">📊 סיכום נתוני התסמינים שלך</h3>
        <MoodCards entries={entries} />
      </div>

      {/* Row 3: Progress Chart */}
      <div className="daily-tracking-row-3">
        <DailyProgress entries={entries} />
      </div>

      {/* Row 4: Entries List */}
      <div className="daily-tracking-row-4">
        <div className="entries-list">
          <div className="entries-list-header">
            <h3>הדיווחים שלך</h3>
            <div className="pagination-controls">
              <span className="entries-count">
                {entries.length} דיווחים | מציג {startIndex + 1}-{Math.min(endIndex, entries.length)}
              </span>
              <div className="items-per-page">
                <label htmlFor="items-per-page">דיווחים לדף:</label>
                <select 
                  id="items-per-page"
                  value={itemsPerPage} 
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="items-per-page-select"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </div>
          
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
            <>
              <div className="entries-grid">
                {paginatedEntries.map((entry) => (
                  <DailyEntryCard
                    key={entry.id}
                    entry={entry}
                    onEdit={handleEditEntry}
                    onDelete={handleDeleteEntry}
                  />
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    aria-label="עמוד ראשון"
                  >
                    ««
                  </button>
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    aria-label="עמוד קודם"
                  >
                    «
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // Show first page, last page, current page, and 2 pages around current
                      return (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 2 && page <= currentPage + 2)
                      );
                    })
                    .map((page, index, array) => {
                      // Add ellipsis if there's a gap
                      const prevPage = array[index - 1];
                      const showEllipsis = prevPage && page - prevPage > 1;
                      
                      return (
                        <React.Fragment key={page}>
                          {showEllipsis && <span className="pagination-ellipsis">...</span>}
                          <button
                            className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                            onClick={() => setCurrentPage(page)}
                            aria-label={`עמוד ${page}`}
                            aria-current={currentPage === page ? 'page' : undefined}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      );
                    })}
                  
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    aria-label="עמוד הבא"
                  >
                    »
                  </button>
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    aria-label="עמוד אחרון"
                  >
                    »»
                  </button>
                </div>
              )}
            </>
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
