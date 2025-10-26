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
  { id: 'cramps', label: 'כאבי בטן', emoji: '🤕' },
  { id: 'back_pain', label: 'כאבי גב', emoji: '🦴' },
  { id: 'headache', label: 'כאבי ראש', emoji: '🤯' },
  { id: 'bloating', label: 'נפיחות', emoji: '💨' },
  { id: 'fatigue', label: 'עייפות', emoji: '😴' },
  { id: 'mood_swings', label: 'שינויי מצב רוח', emoji: '😤' },
  { id: 'breast_tenderness', label: 'רגישות בחזה', emoji: '🤱' },
  { id: 'cravings', label: 'תשוקות אוכל', emoji: '🍫' },
  { id: 'acne', label: 'פצעונים', emoji: '🔴' },
  { id: 'sleep_issues', label: 'בעיות שינה', emoji: '😵' }
];

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
            {new Date(selectedDate).toLocaleDateString('he-IL')} - מעקב מחזור
          </h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="cycle-form-content">
          {/* Period Check */}
          <div className="form-section">
            <h3>האם יש מחזור?</h3>
            <div className="period-toggle">
              <button
                type="button"
                className={`toggle-btn ${formData.is_period ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, is_period: true })}
              >
                <span className="emoji">🌸</span>
                <span>כן, יש מחזור</span>
              </button>
              <button
                type="button"
                className={`toggle-btn ${!formData.is_period ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, is_period: false })}
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
                    onClick={() => setFormData({ ...formData, bleeding_intensity: option.value as any })}
                  >
                    <span className="emoji">{option.emoji}</span>
                    <span className="label">{option.label}</span>
                    <span className="description">{option.description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Symptoms */}
          <div className="form-section">
            <h3>תסמינים נלווים</h3>
            <div className="symptoms-grid">
              {SYMPTOM_OPTIONS.map((symptom) => (
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

          {/* Notes */}
          <div className="form-group">
            <label>הערות נוספות (אופציונלי)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="כתבי כאן משהו על איך הרגשת..."
              className="notes-textarea"
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
  );
}
