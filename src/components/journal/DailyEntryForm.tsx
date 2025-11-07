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
    morning_energy_level: 'medium' as 'low' | 'medium' | 'high',
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
      // Use energy_level for morning_energy_level if time_of_day is morning
      // Otherwise use it for general energy_level
      const morningEnergy = entry.time_of_day === 'morning' ? (entry.energy_level || 'medium') : 'medium';
      const generalEnergy = entry.time_of_day === 'evening' ? (entry.energy_level || 'medium') : 'medium';
      
      setFormData({
        sleep_quality: entry.sleep_quality || 'good',
        woke_up_night: entry.woke_up_night || false,
        night_sweats: entry.night_sweats || false,
        morning_energy_level: morningEnergy as 'low' | 'medium' | 'high',
        energy_level: generalEnergy as 'low' | 'medium' | 'high',
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
        morning_energy_level: 'medium',
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
    // Prepare data based on time of day
    const submitData: Partial<DailyEntry> = {
      ...formData,
      // For morning entries, save morning_energy_level as energy_level
      // For evening entries, use the general energy_level
      energy_level: timeOfDay === 'morning' ? formData.morning_energy_level : formData.energy_level
    };
    // Remove morning_energy_level from submission as it's not in the database schema
    delete (submitData as any).morning_energy_level;
    
    console.log('📝 DailyEntryForm: Submitting form with data:', submitData);
    console.log('🕐 Time of day:', timeOfDay);
    onSave(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content daily-form" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <span className="emoji">{timeOfDay === 'morning' ? '🌅' : '🌙'}</span>
            {timeOfDay === 'morning' ? 'איך עבר הלילה?' : 'איך עבר היום?'}
          </h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="daily-form-content">
          {timeOfDay === 'morning' && (
            <div className="form-section">
              <h3>🌙 איך עבר הלילה?</h3>
              <div className="form-group">
                <div className="field-label">איכות השינה</div>
                <div className="sleep-quality" role="radiogroup" aria-label="איכות השינה">
                  {[
                    { value: 'poor', emoji: '😫', label: 'גרועה', description: 'לילה קשה מאוד' },
                    { value: 'fair', emoji: '😴', label: 'סבירה', description: 'התעוררתי כמה פעמים' },
                    { value: 'good', emoji: '💤', label: 'טובה', description: 'ישנתי טוב' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`sleep-option ${
                        formData.sleep_quality === option.value ? 'selected' : ''
                      }`}
                      onClick={() => setFormData({ ...formData, sleep_quality: option.value as any })}
                      aria-label={`איכות שינה ${option.label}`}
                      role="radio"
                      aria-checked={formData.sleep_quality === option.value}
                    >
                      <span className="emoji">{option.emoji}</span>
                      <span className="label">{option.label}</span>
                      <span className="description">{option.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <div className="field-label">האם חווית בלילה?</div>
                <div className="night-symptoms">
                  <label className="symptom-night-checkbox">
                    <input
                      id="woke-up-night"
                      name="woke_up_night"
                      type="checkbox"
                      checked={formData.woke_up_night}
                      onChange={(e) => setFormData({ ...formData, woke_up_night: e.target.checked })}
                    />
                    <span className="checkbox-content">
                      <span className="emoji">🌃</span>
                      <span className="label">התעוררתי בלילה</span>
                    </span>
                  </label>
                  <label className="symptom-night-checkbox">
                    <input
                      id="night-sweats"
                      name="night_sweats"
                      type="checkbox"
                      checked={formData.night_sweats}
                      onChange={(e) => setFormData({ ...formData, night_sweats: e.target.checked })}
                    />
                    <span className="checkbox-content">
                      <span className="emoji">💧</span>
                      <span className="label">הזעת לילה</span>
                    </span>
                  </label>
                </div>
              </div>
              
              <div className="form-group">
                <div className="field-label">אנרגיה בבוקר</div>
                <div className="energy-level morning-energy" role="radiogroup" aria-label="אנרגיה בבוקר">
                  {[
                    { value: 'low', emoji: '😴', label: 'עייפה', description: 'הראש כבד' },
                    { value: 'medium', emoji: '☀️', label: 'בסדר', description: 'מתעוררת לאט' },
                    { value: 'high', emoji: '🌟', label: 'מלאת אנרגיה', description: 'קמתי רעננה' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`energy-option ${
                        formData.morning_energy_level === option.value ? 'selected' : ''
                      }`}
                      onClick={() => setFormData({ ...formData, morning_energy_level: option.value as any })}
                      aria-label={`אנרגיה בבוקר ${option.label}`}
                      role="radio"
                      aria-checked={formData.morning_energy_level === option.value}
                      name="morning_energy_level"
                    >
                      <span className="emoji">{option.emoji}</span>
                      <span className="label">{option.label}</span>
                      <span className="description">{option.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="form-section">
            <h3>אנרגיה ומצב רוח</h3>
            <div className="form-group">
              <div className="field-label">רמת אנרגיה</div>
              <div className="energy-level" role="radiogroup" aria-label="רמת אנרגיה">
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
                    aria-label={`רמת אנרגיה ${option.label}`}
                    role="radio"
                    aria-checked={formData.energy_level === option.value}
                    name="energy_level"
                  >
                    <span className="emoji">{option.emoji}</span>
                    <span className="label">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <div className="field-label">מצב רוח</div>
              <div className="mood-options" role="radiogroup" aria-label="מצב רוח">
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
                    aria-label={`מצב רוח ${option.label}`}
                    role="radio"
                    aria-checked={formData.mood === option.value}
                  >
                    <span className="emoji">{option.emoji}</span>
                    <span className="label">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>סימפטומים פיזיים</h3>
            <div className="symptoms-grid">
              {[
                { key: 'hot_flashes', emoji: '🔥', label: 'גלי חום' },
                { key: 'dryness', emoji: '🏜️', label: 'יובש' },
                { key: 'pain', emoji: '🤕', label: 'כאבים' },
                { key: 'bloating', emoji: '💨', label: 'נפיחות' },
                { key: 'concentration_difficulty', emoji: '🧠', label: 'קושי בריכוז' },
                { key: 'sleep_issues', emoji: '😴', label: 'חוסר שינה' },
                { key: 'sexual_desire', emoji: '💕', label: 'תשוקה מינית' }
              ].map((symptom) => (
                <label key={symptom.key} className="symptom-checkbox">
                  <input
                    id={symptom.key}
                    name={symptom.key}
                    type="checkbox"
                    checked={formData[symptom.key as keyof typeof formData] as boolean}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      [symptom.key]: e.target.checked 
                    })}
                  />
                  <span className="checkbox-content">
                    <span className="emoji">{symptom.emoji}</span>
                    <span className="label">{symptom.label}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="daily-insight">
              {timeOfDay === 'morning' ? '💭 תובנה של הבוקר' : '🌟 תובנה יומית'}
              <span className="optional"> (אופציונלי)</span>
            </label>
            <textarea
              id="daily-insight"
              name="daily_insight"
              value={formData.daily_insight}
              onChange={(e) => setFormData({ ...formData, daily_insight: e.target.value })}
              placeholder={timeOfDay === 'morning' 
                ? "לדוגמה: ישנתי סביר אבל הראש כבד..." 
                : "לדוגמה: גם אם היום היה מלא גלים, את עדיין שוחה!"}
              className="insight-textarea"
              rows={3}
              maxLength={200}
            />
            <span className="char-count">{formData.daily_insight.length}/200</span>
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
    </div>
  );
}
