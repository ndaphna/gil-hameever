'use client';

import { useState } from 'react';
import { CycleEntry, DailyEntry } from '@/types/journal';
import DailyTracking from './DailyTracking';
import CycleTracking from './CycleTracking';
import AlizaMessages from './AlizaMessages';
import './MenopauseJournal.css';

interface MenopauseJournalProps {
  userId: string;
}

export default function MenopauseJournal({ userId }: MenopauseJournalProps) {
  const [activeTab, setActiveTab] = useState<'daily' | 'cycle' | 'insights'>('daily');
  const [cycleEntries, setCycleEntries] = useState<CycleEntry[]>([]);
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);

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
            onEntriesChange={setDailyEntries}
          />
        )}
        
        {activeTab === 'cycle' && (
          <CycleTracking 
            userId={userId}
            entries={cycleEntries}
            onEntriesChange={setCycleEntries}
          />
        )}
        
        {activeTab === 'insights' && (
          <AlizaMessages 
            userId={userId}
            dailyEntries={dailyEntries}
            cycleEntries={cycleEntries}
          />
        )}
      </div>
    </div>
  );
}
