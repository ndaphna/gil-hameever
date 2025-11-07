'use client';

import { useState, useEffect } from 'react';
import { CycleEntry } from '@/types/journal';

interface CycleEntryFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  entry?: CycleEntry | null;
  onSave: (data: Partial<CycleEntry>) => void;
}

const SYMPTOM_OPTIONS = [
  { id: 'cramps', label: 'כאבי בטן', emoji: '🤕', category: 'pain' },
  { id: 'back_pain', label: 'גב תחתון', emoji: '🦴', category: 'pain' },
  { id: 'headache', label: 'כאבי ראש', emoji: '🤯', category: 'pain' },
  { id: 'bloating', label: 'נפיחות', emoji: '💨', category: 'physical' },
  { id: 'fatigue', label: 'עייפות', emoji: '😴', category: 'energy' },
  { id: 'mood_irritable', label: 'עצבנות', emoji: '😤', category: 'mood' },
  { id: 'mood_sensitive', label: 'רגישות', emoji: '🥺', category: 'mood' },
  { id: 'mood_sad', label: 'עצב', emoji: '😢', category: 'mood' },
  { id: 'mood_anxious', label: 'דכדוך', emoji: '😰', category: 'mood' },
  { id: 'breast_tenderness', label: 'רגישות בחזה', emoji: '🤱', category: 'physical' },
  { id: 'increased_desire', label: 'חשק מיני מוגבר', emoji: '💕', category: 'physical' },
  { id: 'cravings', label: 'תשוקות אוכל', emoji: '🍫', category: 'physical' },
  { id: 'acne', label: 'פצעונים', emoji: '🔴', category: 'physical' },
  { id: 'sleep_issues', label: 'בעיות שינה', emoji: '😵', category: 'sleep' }
];

const SYMPTOM_CATEGORIES = {
  pain: { label: 'כאבים', emoji: '🤕' },
  mood: { label: 'מצב רוח', emoji: '😊' },
  physical: { label: 'תסמינים פיזיים', emoji: '💪' },
  energy: { label: 'אנרגיה', emoji: '⚡' },
  sleep: { label: 'שינה', emoji: '😴' }
};

export default function CycleEntryForm({ 
  isOpen, 
  onClose, 
  selectedDate, 
  entry, 
  onSave 
}: CycleEntryFormProps) {
  const [formData, setFormData] = useState({
    is_period: false,
    bleeding_intensity: 'medium' as 'light' | 'medium' | 'heavy',
    symptoms: [] as string[],
    notes: ''
  });

  useEffect(() => {
    if (entry) {
      setFormData({
        is_period: entry.is_period,
        bleeding_intensity: entry.bleeding_intensity || 'medium',
        symptoms: entry.symptoms || [],
        notes: entry.notes || ''
      });
    } else {
      // Reset form for new entry
      setFormData({
        is_period: false,
        bleeding_intensity: 'medium',
        symptoms: [],
        notes: ''
      });
    }
  }, [entry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const toggleSymptom = (symptomId: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptomId)
        ? prev.symptoms.filter(s => s !== symptomId)
        : [...prev.symptoms, symptomId]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content cycle-form" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <span className="modal-title-emoji">🌸</span>
            {new Date(selectedDate).toLocaleDateString('he-IL')} - מעקב מחזור
          </h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="cycle-form-content">
          {/* Period Check */}
          <div className="form-section">
            <h3>האם יש מחזור?</h3>
            <div className="period-toggle">
              <button
                type="button"
                className={`toggle-btn ${formData.is_period ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Toggle: יש מחזור');
                  setFormData({ ...formData, is_period: true });
                }}
              >
                <span className="emoji">🌸</span>
                <span>כן, יש מחזור</span>
              </button>
              <button
                type="button"
                className={`toggle-btn ${!formData.is_period ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Toggle: אין מחזור');
                  setFormData({ ...formData, is_period: false });
                }}
              >
                <span className="emoji">❌</span>
                <span>לא, אין מחזור</span>
              </button>
            </div>
          </div>

          {/* Bleeding Intensity (only if period) */}
          {formData.is_period && (
            <div className="form-section">
              <h3>עוצמת הדימום</h3>
              <div className="bleeding-intensity">
                {[
                  { value: 'light', emoji: '🌸', label: 'קל', description: 'דימום קל' },
                  { value: 'medium', emoji: '🌺', label: 'בינוני', description: 'דימום רגיל' },
                  { value: 'heavy', emoji: '🌹', label: 'חזק', description: 'דימום חזק' }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`intensity-option ${
                      formData.bleeding_intensity === option.value ? 'selected' : ''
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Intensity:', option.value);
                      setFormData({ ...formData, bleeding_intensity: option.value as 'light' | 'medium' | 'heavy' });
                    }}
                  >
                    <span className="emoji">{option.emoji}</span>
                    <span className="label">{option.label}</span>
                    <span className="description">{option.description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Symptoms by Category */}
          <div className="form-section">
            <h3>תסמינים נלווים</h3>
            {Object.entries(SYMPTOM_CATEGORIES).map(([categoryKey, category]) => {
              const categorySymptoms = SYMPTOM_OPTIONS.filter(s => s.category === categoryKey);
              if (categorySymptoms.length === 0) return null;
              
              return (
                <div key={categoryKey} className="symptom-category">
                  <h4 className="category-title">
                    <span className="category-emoji">{category.emoji}</span>
                    {category.label}
                  </h4>
                  <div className="symptoms-grid">
                    {categorySymptoms.map((symptom) => (
                      <button
                        key={symptom.id}
                        type="button"
                        className={`symptom-option ${
                          formData.symptoms.includes(symptom.id) ? 'selected' : ''
                        }`}
                        onClick={() => toggleSymptom(symptom.id)}
                      >
                        <span className="emoji">{symptom.emoji}</span>
                        <span className="label">{symptom.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Insight */}
          <div className="form-group">
            <label>
              🖋️ תוסיפי כמה מילים על איך הרגשת
              <span className="optional"> (אופציונלי)</span>
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="לדוגמה: הרגשתי עייפה במיוחד היום, אבל המצב רוח דווקא טוב..."
              className="notes-textarea insight-textarea"
              rows={3}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              ביטול
            </button>
            <button type="submit" className="btn btn-primary">
              {entry ? 'עדכן רשומה' : 'שמור רשומה'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
