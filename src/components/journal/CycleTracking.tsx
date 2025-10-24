'use client';

import { useState, useEffect } from 'react';
import { CycleEntry } from '@/types/journal';
import CycleEntryForm from './CycleEntryForm';
import CycleCalendar from './CycleCalendar';
import { supabase } from '@/lib/supabase';

interface CycleTrackingProps {
  userId: string;
  entries: CycleEntry[];
  onEntriesChange: (entries: CycleEntry[]) => void;
}

export default function CycleTracking({ userId, entries, onEntriesChange }: CycleTrackingProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CycleEntry | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const loadEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('cycle_entries')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) throw error;
      onEntriesChange(data || []);
    } catch (error) {
      console.error('Error loading cycle entries:', error);
    }
  };

  useEffect(() => {
    loadEntries();
  }, [userId]);

  const handleSaveEntry = async (entryData: Partial<CycleEntry>) => {
    try {
      if (editingEntry) {
        // Update existing entry
        const { error } = await supabase
          .from('cycle_entries')
          .update(entryData)
          .eq('id', editingEntry.id);

        if (error) throw error;
      } else {
        // Create new entry
        const { error } = await supabase
          .from('cycle_entries')
          .insert({
            user_id: userId,
            date: selectedDate,
            ...entryData
          });

        if (error) throw error;
      }

      await loadEntries();
      setShowForm(false);
      setEditingEntry(null);
    } catch (error) {
      console.error('Error saving cycle entry:', error);
    }
  };

  const handleEditEntry = (entry: CycleEntry) => {
    setEditingEntry(entry);
    setSelectedDate(entry.date);
    setShowForm(true);
  };

  const handleDeleteEntry = async (id: string) => {
    if (!confirm('את בטוחה שברצונך למחוק רשומה זו?')) return;

    try {
      const { error } = await supabase
        .from('cycle_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadEntries();
    } catch (error) {
      console.error('Error deleting cycle entry:', error);
    }
  };

  const handleDateClick = (date: string) => {
    const existingEntry = entries.find(entry => entry.date === date);
    if (existingEntry) {
      handleEditEntry(existingEntry);
    } else {
      setSelectedDate(date);
      setEditingEntry(null);
      setShowForm(true);
    }
  };

  // Calculate cycle statistics
  const cycleStats = calculateCycleStats(entries);

  return (
    <div className="cycle-tracking">
      <div className="cycle-header">
        <h2>🌸 מעקב מחזור</h2>
        <p className="subtitle">תעדי את המחזור שלך ותקבלי תובנות חכמות</p>
      </div>

      {/* Statistics */}
      <div className="cycle-stats">
        <div className="stat-card">
          <span className="stat-number">{cycleStats.totalCycles}</span>
          <span className="stat-label">מחזורים תועדו</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{cycleStats.averageLength} ימים</span>
          <span className="stat-label">אורך ממוצע</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{cycleStats.lastPeriod}</span>
          <span className="stat-label">מחזור אחרון</span>
        </div>
      </div>

      {/* Calendar */}
      <div className="calendar-section">
        <h3>לוח שנה</h3>
        <CycleCalendar
          entries={entries}
          onDateClick={handleDateClick}
        />
      </div>

      {/* Recent Entries */}
      <div className="recent-entries">
        <h3>רשומות אחרונות</h3>
        {entries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🌸</div>
            <p>עדיין לא תיעדת מחזור</p>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setSelectedDate(new Date().toISOString().split('T')[0]);
                setShowForm(true);
              }}
            >
              התחילי עכשיו
            </button>
          </div>
        ) : (
          <div className="entries-list">
            {entries.slice(0, 5).map((entry) => (
              <div key={entry.id} className="cycle-entry-card">
                <div className="entry-date">
                  {new Date(entry.date).toLocaleDateString('he-IL')}
                </div>
                <div className="entry-details">
                  {entry.is_period ? (
                    <div className="period-info">
                      <span className="period-icon">🌸</span>
                      <span>מחזור - {entry.bleeding_intensity}</span>
                    </div>
                  ) : (
                    <div className="no-period">
                      <span>ללא מחזור</span>
                    </div>
                  )}
                  {entry.symptoms && entry.symptoms.length > 0 && (
                    <div className="symptoms">
                      {entry.symptoms.map((symptom, index) => (
                        <span key={index} className="symptom-tag">
                          {symptom}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="entry-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => handleEditEntry(entry)}
                  >
                    עריכה
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDeleteEntry(entry.id)}
                  >
                    מחיקה
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <CycleEntryForm
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingEntry(null);
          }}
          selectedDate={selectedDate}
          entry={editingEntry}
          onSave={handleSaveEntry}
        />
      )}
    </div>
  );
}

function calculateCycleStats(entries: CycleEntry[]) {
  const periodEntries = entries.filter(entry => entry.is_period);
  
  if (periodEntries.length === 0) {
    return {
      totalCycles: 0,
      averageLength: 0,
      lastPeriod: 'לא תועד'
    };
  }

  // Calculate cycle lengths
  const cycleLengths: number[] = [];
  for (let i = 1; i < periodEntries.length; i++) {
    const prevDate = new Date(periodEntries[i - 1].date);
    const currDate = new Date(periodEntries[i].date);
    const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
    cycleLengths.push(diffDays);
  }

  const averageLength = cycleLengths.length > 0 
    ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
    : 0;

  const lastPeriod = periodEntries.length > 0 
    ? new Date(periodEntries[0].date).toLocaleDateString('he-IL')
    : 'לא תועד';

  return {
    totalCycles: periodEntries.length,
    averageLength,
    lastPeriod
  };
}
