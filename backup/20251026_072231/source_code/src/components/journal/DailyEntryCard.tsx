'use client';

import { DailyEntry } from '@/types/journal';

interface DailyEntryCardProps {
  entry: DailyEntry;
  onEdit: (entry: DailyEntry) => void;
  onDelete: (id: string) => void;
}

export default function DailyEntryCard({ entry, onEdit, onDelete }: DailyEntryCardProps) {
  const getTimeIcon = (timeOfDay: string) => {
    return timeOfDay === 'morning' ? '🌅' : '🌙';
  };

  const getMoodEmoji = (mood: string) => {
    const moodEmojis = {
      calm: '😌',
      happy: '😊',
      sad: '😢',
      irritated: '😤',
      frustrated: '😩'
    };
    return moodEmojis[mood as keyof typeof moodEmojis] || '😐';
  };

  const getEnergyEmoji = (energy: string) => {
    const energyEmojis = {
      low: '🔋',
      medium: '⚡',
      high: '🚀'
    };
    return energyEmojis[energy as keyof typeof energyEmojis] || '⚡';
  };

  const getSleepEmoji = (quality: string) => {
    const sleepEmojis = {
      poor: '😫',
      fair: '😴',
      good: '😊'
    };
    return sleepEmojis[quality as keyof typeof sleepEmojis] || '😴';
  };

  const getSymptomsList = () => {
    const symptoms = [];
    if (entry.hot_flashes) symptoms.push('🔥 גלי חום');
    if (entry.dryness) symptoms.push('🏜️ יובש');
    if (entry.pain) symptoms.push('🤕 כאבים');
    if (entry.bloating) symptoms.push('💨 נפיחות');
    if (entry.concentration_difficulty) symptoms.push('🧠 קושי בריכוז');
    if (entry.sleep_issues) symptoms.push('😴 בעיות שינה');
    if (entry.sexual_desire) symptoms.push('💕 תשוקה מינית');
    return symptoms;
  };

  return (
    <div className="daily-entry-card">
      <div className="entry-header">
        <div className="entry-time">
          <span className="time-icon">{getTimeIcon(entry.time_of_day)}</span>
          <span className="time-label">
            {entry.time_of_day === 'morning' ? 'בוקר' : 'ערב'}
          </span>
        </div>
        <div className="entry-date">
          {new Date(entry.date).toLocaleDateString('he-IL')}
        </div>
        <div className="entry-actions">
          <button 
            className="btn-edit"
            onClick={() => onEdit(entry)}
            title="עריכה"
          >
            ✏️
          </button>
          <button 
            className="btn-delete"
            onClick={() => onDelete(entry.id)}
            title="מחיקה"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="entry-content">
        {/* Mood and Energy */}
        <div className="entry-metrics">
          <div className="metric">
            <span className="metric-icon">{getMoodEmoji(entry.mood || 'calm')}</span>
            <span className="metric-label">מצב רוח</span>
            <span className="metric-value">
              {entry.mood === 'calm' && 'רגועה'}
              {entry.mood === 'happy' && 'שמחה'}
              {entry.mood === 'sad' && 'עצובה'}
              {entry.mood === 'irritated' && 'עצבנית'}
              {entry.mood === 'frustrated' && 'מתוסכלת'}
            </span>
          </div>
          
          <div className="metric">
            <span className="metric-icon">{getEnergyEmoji(entry.energy_level || 'medium')}</span>
            <span className="metric-label">אנרגיה</span>
            <span className="metric-value">
              {entry.energy_level === 'low' && 'נמוכה'}
              {entry.energy_level === 'medium' && 'בינונית'}
              {entry.energy_level === 'high' && 'גבוהה'}
            </span>
          </div>

          {entry.time_of_day === 'morning' && entry.sleep_quality && (
            <div className="metric">
              <span className="metric-icon">{getSleepEmoji(entry.sleep_quality)}</span>
              <span className="metric-label">שינה</span>
              <span className="metric-value">
                {entry.sleep_quality === 'poor' && 'גרוע'}
                {entry.sleep_quality === 'fair' && 'בינוני'}
                {entry.sleep_quality === 'good' && 'טוב'}
              </span>
            </div>
          )}
        </div>

        {/* Symptoms */}
        {getSymptomsList().length > 0 && (
          <div className="entry-symptoms">
            <h4>תסמינים:</h4>
            <div className="symptoms-list">
              {getSymptomsList().map((symptom, index) => (
                <span key={index} className="symptom-tag">
                  {symptom}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Daily Insight */}
        {entry.daily_insight && (
          <div className="entry-insight">
            <h4>תובנה יומית:</h4>
            <p className="insight-text">{entry.daily_insight}</p>
          </div>
        )}

        {/* Night Issues (for morning entries) */}
        {entry.time_of_day === 'morning' && (entry.woke_up_night || entry.night_sweats) && (
          <div className="night-issues">
            <h4>בעיות לילה:</h4>
            <div className="issues-list">
              {entry.woke_up_night && <span className="issue-tag">התעוררתי בלילה</span>}
              {entry.night_sweats && <span className="issue-tag">הזעות לילה</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
