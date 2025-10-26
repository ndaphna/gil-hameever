'use client';

import { useState, useEffect } from 'react';
import { DailyEntry } from '@/types/journal';

interface DailyEntryFormProps {
  isOpen: boolean;
  onClose: () => void;
  timeOfDay: 'morning' | 'evening';
  entry?: DailyEntry | null;
  onSave: (data: Partial<DailyEntry>) => void;
}

export default function DailyEntryForm({ 
  isOpen, 
  onClose, 
  timeOfDay, 
  entry, 
  onSave 
}: DailyEntryFormProps) {
  const [formData, setFormData] = useState({
    sleep_quality: 'good' as 'poor' | 'fair' | 'good',
    woke_up_night: false,
    night_sweats: false,
    energy_level: 'medium' as 'low' | 'medium' | 'high',
    mood: 'calm' as 'calm' | 'irritated' | 'sad' | 'happy' | 'frustrated',
    hot_flashes: false,
    dryness: false,
    pain: false,
    bloating: false,
    concentration_difficulty: false,
    sleep_issues: false,
    sexual_desire: false,
    daily_insight: ''
  });

  useEffect(() => {
    if (entry) {
      setFormData({
        sleep_quality: entry.sleep_quality || 'good',
        woke_up_night: entry.woke_up_night || false,
        night_sweats: entry.night_sweats || false,
        energy_level: entry.energy_level || 'medium',
        mood: entry.mood || 'calm',
        hot_flashes: entry.hot_flashes || false,
        dryness: entry.dryness || false,
        pain: entry.pain || false,
        bloating: entry.bloating || false,
        concentration_difficulty: entry.concentration_difficulty || false,
        sleep_issues: entry.sleep_issues || false,
        sexual_desire: entry.sexual_desire || false,
        daily_insight: entry.daily_insight || ''
      });
    } else {
      // Reset form for new entry
      setFormData({
        sleep_quality: 'good',
        woke_up_night: false,
        night_sweats: false,
        energy_level: 'medium',
        mood: 'calm',
        hot_flashes: false,
        dryness: false,
        pain: false,
        bloating: false,
        concentration_difficulty: false,
        sleep_issues: false,
        sexual_desire: false,
        daily_insight: ''
      });
    }
  }, [entry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content daily-form" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {timeOfDay === 'morning' ? '🌅 איך עבר הלילה?' : '🌙 איך עבר היום?'}
          </h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="daily-form-content">
          {timeOfDay === 'morning' && (
            <div className="form-section">
              <h3>שינה</h3>
              <div className="form-group">
                <label>איכות השינה</label>
                <div className="sleep-quality">
                  {[
                    { value: 'poor', emoji: '😫', label: 'גרוע' },
                    { value: 'fair', emoji: '😴', label: 'בינוני' },
                    { value: 'good', emoji: '😊', label: 'טוב' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`sleep-option ${
                        formData.sleep_quality === option.value ? 'selected' : ''
                      }`}
                      onClick={() => setFormData({ ...formData, sleep_quality: option.value as any })}
                    >
                      <span className="emoji">{option.emoji}</span>
                      <span className="label">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.woke_up_night}
                    onChange={(e) => setFormData({ ...formData, woke_up_night: e.target.checked })}
                  />
                  <span>התעוררתי בלילה</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.night_sweats}
                    onChange={(e) => setFormData({ ...formData, night_sweats: e.target.checked })}
                  />
                  <span>הזעות לילה</span>
                </label>
              </div>
            </div>
          )}

          <div className="form-section">
            <h3>אנרגיה ומצב רוח</h3>
            <div className="form-group">
              <label>רמת אנרגיה</label>
              <div className="energy-level">
                {[
                  { value: 'low', emoji: '🔋', label: 'נמוכה' },
                  { value: 'medium', emoji: '⚡', label: 'בינונית' },
                  { value: 'high', emoji: '🚀', label: 'גבוהה' }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`energy-option ${
                      formData.energy_level === option.value ? 'selected' : ''
                    }`}
                    onClick={() => setFormData({ ...formData, energy_level: option.value as any })}
                  >
                    <span className="emoji">{option.emoji}</span>
                    <span className="label">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>מצב רוח</label>
              <div className="mood-options">
                {[
                  { value: 'calm', emoji: '😌', label: 'רגועה' },
                  { value: 'happy', emoji: '😊', label: 'שמחה' },
                  { value: 'sad', emoji: '😢', label: 'עצובה' },
                  { value: 'irritated', emoji: '😤', label: 'עצבנית' },
                  { value: 'frustrated', emoji: '😩', label: 'מתוסכלת' }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`mood-option ${
                      formData.mood === option.value ? 'selected' : ''
                    }`}
                    onClick={() => setFormData({ ...formData, mood: option.value as any })}
                  >
                    <span className="emoji">{option.emoji}</span>
                    <span className="label">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>תסמינים</h3>
            <div className="symptoms-grid">
              {[
                { key: 'hot_flashes', emoji: '🔥', label: 'גלי חום' },
                { key: 'dryness', emoji: '🏜️', label: 'יובש' },
                { key: 'pain', emoji: '🤕', label: 'כאבים' },
                { key: 'bloating', emoji: '💨', label: 'נפיחות' },
                { key: 'concentration_difficulty', emoji: '🧠', label: 'קושי בריכוז' },
                { key: 'sleep_issues', emoji: '😴', label: 'בעיות שינה' },
                { key: 'sexual_desire', emoji: '💕', label: 'תשוקה מינית' }
              ].map((symptom) => (
                <label key={symptom.key} className="symptom-checkbox">
                  <input
                    type="checkbox"
                    checked={formData[symptom.key as keyof typeof formData] as boolean}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      [symptom.key]: e.target.checked 
                    })}
                  />
                  <span className="emoji">{symptom.emoji}</span>
                  <span className="label">{symptom.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>תובנה יומית (אופציונלי)</label>
            <textarea
              value={formData.daily_insight}
              onChange={(e) => setFormData({ ...formData, daily_insight: e.target.value })}
              placeholder="כתבי כאן משהו על איך הרגשת..."
              className="insight-textarea"
              rows={3}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              ביטול
            </button>
            <button type="submit" className="btn btn-primary">
              {entry ? 'עדכן דיווח' : 'שמור דיווח'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
