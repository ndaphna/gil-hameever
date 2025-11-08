'use client';

import { useState, useEffect } from 'react';
import { CycleEntry, DailyEntry } from '@/types/journal';
import DailyTracking from './DailyTracking';
import CycleTracking from './CycleTracking';
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

  // Read tab parameter from URL on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'daily' || tabParam === 'cycle' || tabParam === 'insights') {
        setActiveTab(tabParam);
      }
    }
  }, []);

  // Load data when component mounts or userId changes
  useEffect(() => {
    if (userId) {
      loadDailyEntries();
      loadCycleEntries();
    }
  }, [userId]);

  const loadDailyEntries = async () => {
    try {
      // Load real data from database only
      console.log('MenopauseJournal: Loading real data from database for user:', userId);
      
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
      // Load real data from database only
      console.log('MenopauseJournal: Loading real cycle data from database for user:', userId);
      
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
          </div>
        )}
      </div>
    </div>
  );
}
