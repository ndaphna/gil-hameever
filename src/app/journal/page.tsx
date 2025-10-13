'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../components/DashboardLayout';

interface JournalEntry {
  id: string;
  date: string;
  emotion: string;
  intensity: number;
  notes: string;
  color?: string;
  created_at: string;
}

const PASTEL_COLORS = [
  { name: 'ורוד', value: '#FFD1DC', light: '#FFF0F3' },
  { name: 'סגול', value: '#E0BBE4', light: '#F5EAF7' },
  { name: 'כחול', value: '#B4D4FF', light: '#E8F2FF' },
  { name: 'ירוק', value: '#C1F0C1', light: '#E8F8E8' },
  { name: 'צהוב', value: '#FFF5BA', light: '#FFFCE8' },
  { name: 'אפרסק', value: '#FFDAB9', light: '#FFF3E6' },
];

const EMOTIONS = [
  { value: 'עצובה מאוד', intensity: 1, emoji: '😢', color: '#B4D4FF' },
  { value: 'עצובה', intensity: 2, emoji: '😔', color: '#C9E4FF' },
  { value: 'רגועה', intensity: 3, emoji: '😌', color: '#E0BBE4' },
  { value: 'טוב', intensity: 4, emoji: '🙂', color: '#C1F0C1' },
  { value: 'מאושרת', intensity: 5, emoji: '😊', color: '#FFF5BA' },
];

export default function JournalPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [selectedEmotion, setSelectedEmotion] = useState(EMOTIONS[2]); // Default: רגועה
  const [selectedColor, setSelectedColor] = useState(PASTEL_COLORS[0]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadEntries();
  }, []);

  async function loadEntries() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('emotion_entry')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setEntries(data || []);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveEntry() {
    if (!notes.trim()) {
      alert('אנא כתבי משהו ביומן');
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      // Ensure user_profile exists - use API to bypass RLS
      const { data: profile } = await supabase
        .from('user_profile')
        .select('id')
        .eq('id', user.id)
        .single();

      // Create profile if it doesn't exist
      if (!profile) {
        const response = await fetch('/api/create-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'משתמשת',
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error creating profile:', errorData);
          throw new Error('לא הצלחנו ליצור פרופיל. אנא נסי שוב.');
        }
      }

      const { error } = await supabase
        .from('emotion_entry')
        .insert({
          user_id: user.id,
          date: new Date().toISOString().split('T')[0],
          emotion: selectedEmotion.value,
          intensity: selectedEmotion.intensity,
          notes: notes,
          // color: selectedColor.value, // TODO: Add color column to Supabase first
        });

      if (error) throw error;

      // Reset form
      setNotes('');
      setSelectedEmotion(EMOTIONS[2]);
      setSelectedColor(PASTEL_COLORS[0]);
      setShowModal(false);
      
      // Reload entries
      loadEntries();
    } catch (error: any) {
      console.error('Error saving entry:', error);
      const errorMessage = error?.message || error?.error_description || 'שגיאה לא ידועה';
      alert(`שגיאה בשמירת הרשומה: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteEntry(id: string) {
    if (!confirm('את בטוחה שברצונך למחוק רשומה זו?')) return;

    try {
      const { error } = await supabase
        .from('emotion_entry')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      loadEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('שגיאה במחיקת הרשומה');
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading-container">
          <div className="loading">טוען...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="journal-page">
        <div className="journal-container">
          <div className="journal-header">
            <h1>📔 היומן שלי</h1>
            <p className="subtitle">מרחב אישי לתיעוד רגשות, תחושות וחוויות</p>
          </div>

          {/* Entries Grid */}
          {entries.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h2>היומן שלך ריק</h2>
              <p>התחילי לתעד את המסע שלך בלחיצה על הכפתור למטה</p>
            </div>
          ) : (
            <div className="entries-grid">
              {entries.map((entry) => {
                // Map intensity to pastel color
                const intensityColor = PASTEL_COLORS[Math.min(entry.intensity - 1, PASTEL_COLORS.length - 1)];
                const cardColor = entry.color || intensityColor.value;
                
                return (
                <div
                  key={entry.id}
                  className="entry-card"
                  style={{
                    backgroundColor: cardColor,
                    borderColor: cardColor,
                  }}
                >
                  <div className="entry-header">
                    <div className="entry-date">
                      {new Date(entry.created_at).toLocaleDateString('he-IL', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteEntry(entry.id)}
                      aria-label="מחק רשומה"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="entry-emotion">
                    <span className="emotion-emoji">
                      {EMOTIONS.find(e => e.intensity === entry.intensity)?.emoji || '😌'}
                    </span>
                    <span className="emotion-text">{entry.emotion}</span>
                  </div>

                  <div className="entry-notes">{entry.notes}</div>

                  <div className="entry-time">
                    {new Date(entry.created_at).toLocaleTimeString('he-IL', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                );
              })}
            </div>
          )}

          {/* Floating Action Button */}
          <button
            className="fab"
            onClick={() => setShowModal(true)}
            aria-label="הוסף רשומה חדשה"
          >
            <span className="fab-icon">+</span>
          </button>

          {/* Modal */}
          {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>רשומה חדשה</h2>
                  <button
                    className="modal-close"
                    onClick={() => setShowModal(false)}
                  >
                    ✕
                  </button>
                </div>

                <div className="modal-body">
                  {/* Emotion Selector */}
                  <div className="form-section">
                    <label>איך את מרגישה?</label>
                    <div className="emotion-slider">
                      {EMOTIONS.map((emotion) => (
                        <div
                          key={emotion.value}
                          className={`emotion-option ${
                            selectedEmotion.value === emotion.value ? 'active' : ''
                          }`}
                          onClick={() => setSelectedEmotion(emotion)}
                        >
                          <div className="emotion-emoji">{emotion.emoji}</div>
                          <div className="emotion-label">{emotion.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Color Selector */}
                  <div className="form-section">
                    <label>בחרי צבע לכרטיסייה</label>
                    <div className="color-picker">
                      {PASTEL_COLORS.map((color) => (
                        <div
                          key={color.value}
                          className={`color-option ${
                            selectedColor.value === color.value ? 'active' : ''
                          }`}
                          onClick={() => setSelectedColor(color)}
                        >
                          <div
                            className="color-circle"
                            style={{ backgroundColor: color.value }}
                          />
                          <div className="color-name">{color.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="form-section">
                    <label>מה עובר עליך?</label>
                    <textarea
                      className="notes-input"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="שתפי את המחשבות, התחושות והחוויות שלך..."
                      rows={6}
                    />
                  </div>

                  {/* Actions */}
                  <div className="modal-actions">
                    <button
                      className="btn-cancel"
                      onClick={() => setShowModal(false)}
                    >
                      ביטול
                    </button>
                    <button
                      className="btn-save"
                      onClick={handleSaveEntry}
                      disabled={saving}
                    >
                      {saving ? 'שומר...' : 'שמור'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          .journal-page {
            min-height: 100vh;
            background: var(--gray-light);
            padding: 40px 20px 100px 20px;
          }

          .journal-container {
            max-width: 1200px;
            margin: 0 auto;
          }

          .journal-header {
            margin-bottom: 40px;
            text-align: center;
          }

          .journal-header h1 {
            font-size: 32px;
            font-weight: 700;
            color: var(--black);
            margin: 0 0 12px 0;
          }

          .subtitle {
            font-size: 16px;
            color: var(--gray);
            margin: 0;
          }

          .loading-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }

          .loading {
            text-align: center;
            padding: 40px;
            font-size: 18px;
            color: var(--gray);
          }

          /* Empty State */
          .empty-state {
            text-align: center;
            padding: 80px 20px;
          }

          .empty-icon {
            font-size: 80px;
            margin-bottom: 24px;
          }

          .empty-state h2 {
            font-size: 24px;
            font-weight: 700;
            color: var(--black);
            margin: 0 0 12px 0;
          }

          .empty-state p {
            font-size: 16px;
            color: var(--gray);
            margin: 0;
          }

          /* Entries Grid */
          .entries-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 24px;
            margin-bottom: 40px;
          }

          .entry-card {
            background: white;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
            border: 2px solid;
            position: relative;
          }

          .entry-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          }

          .entry-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
          }

          .entry-date {
            font-size: 14px;
            font-weight: 600;
            color: rgba(0, 0, 0, 0.7);
          }

          .delete-btn {
            background: rgba(0, 0, 0, 0.1);
            border: none;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            cursor: pointer;
            color: rgba(0, 0, 0, 0.6);
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
          }

          .delete-btn:hover {
            background: rgba(0, 0, 0, 0.2);
            color: rgba(0, 0, 0, 0.8);
          }

          .entry-emotion {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
          }

          .entry-emotion .emotion-emoji {
            font-size: 32px;
          }

          .entry-emotion .emotion-text {
            font-size: 18px;
            font-weight: 700;
            color: rgba(0, 0, 0, 0.8);
          }

          .entry-notes {
            font-size: 15px;
            line-height: 1.6;
            color: rgba(0, 0, 0, 0.7);
            margin-bottom: 16px;
            white-space: pre-wrap;
            text-align: right;
          }

          .entry-time {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.5);
            text-align: left;
          }

          /* FAB */
          .fab {
            position: fixed;
            bottom: 32px;
            left: 32px;
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--magenta) 0%, var(--purple) 100%);
            color: white;
            border: none;
            box-shadow: 0 4px 16px rgba(255, 0, 128, 0.4);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            z-index: 100;
          }

          .fab:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 24px rgba(255, 0, 128, 0.5);
          }

          .fab-icon {
            font-size: 32px;
            line-height: 1;
          }

          /* Modal */
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 20px;
          }

          .modal {
            background: white;
            border-radius: 16px;
            width: 100%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px;
            border-bottom: 2px solid var(--gray-light);
          }

          .modal-header h2 {
            font-size: 24px;
            font-weight: 700;
            color: var(--black);
            margin: 0;
          }

          .modal-close {
            background: var(--gray-light);
            border: none;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            cursor: pointer;
            color: var(--gray);
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
          }

          .modal-close:hover {
            background: #e0e0e0;
            color: var(--black);
          }

          .modal-body {
            padding: 24px;
          }

          .form-section {
            margin-bottom: 32px;
          }

          .form-section label {
            display: block;
            font-size: 16px;
            font-weight: 600;
            color: var(--black);
            margin-bottom: 16px;
            text-align: right;
          }

          /* Emotion Slider */
          .emotion-slider {
            display: flex;
            gap: 12px;
            justify-content: space-between;
          }

          .emotion-option {
            flex: 1;
            text-align: center;
            padding: 12px 8px;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid transparent;
          }

          .emotion-option:hover {
            background: var(--gray-light);
          }

          .emotion-option.active {
            background: linear-gradient(135deg, var(--magenta) 0%, var(--purple) 100%);
            border-color: var(--magenta);
            color: white;
          }

          .emotion-option .emotion-emoji {
            font-size: 36px;
            margin-bottom: 8px;
          }

          .emotion-option .emotion-label {
            font-size: 12px;
            font-weight: 600;
          }

          .emotion-option.active .emotion-label {
            color: white;
          }

          /* Color Picker */
          .color-picker {
            display: flex;
            gap: 16px;
            flex-wrap: wrap;
          }

          .color-option {
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .color-circle {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            margin-bottom: 8px;
            border: 3px solid transparent;
            transition: all 0.3s ease;
          }

          .color-option:hover .color-circle {
            transform: scale(1.1);
          }

          .color-option.active .color-circle {
            border-color: var(--magenta);
            box-shadow: 0 0 0 4px rgba(255, 0, 128, 0.2);
          }

          .color-name {
            font-size: 12px;
            font-weight: 600;
            color: var(--gray);
          }

          /* Notes Input */
          .notes-input {
            width: 100%;
            padding: 16px;
            border: 2px solid var(--gray-light);
            border-radius: 12px;
            font-size: 15px;
            font-family: inherit;
            resize: vertical;
            transition: border-color 0.3s ease;
            text-align: right;
          }

          .notes-input:focus {
            outline: none;
            border-color: var(--magenta);
          }

          /* Modal Actions */
          .modal-actions {
            display: flex;
            gap: 12px;
            margin-top: 24px;
          }

          .btn-cancel,
          .btn-save {
            flex: 1;
            padding: 14px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            border: none;
            font-family: inherit;
          }

          .btn-cancel {
            background: var(--gray-light);
            color: var(--black);
          }

          .btn-cancel:hover {
            background: #e0e0e0;
          }

          .btn-save {
            background: linear-gradient(135deg, var(--magenta) 0%, var(--purple) 100%);
            color: white;
          }

          .btn-save:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 0, 128, 0.3);
          }

          .btn-save:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          /* Responsive */
          @media (max-width: 768px) {
            .journal-header h1 {
              font-size: 24px;
            }

            .entries-grid {
              grid-template-columns: 1fr;
            }

            .emotion-slider {
              flex-wrap: wrap;
            }

            .emotion-option {
              flex-basis: calc(33.333% - 8px);
            }

            .fab {
              bottom: 24px;
              left: 50%;
              transform: translateX(-50%);
            }

            .fab:hover {
              transform: translateX(-50%) scale(1.1);
            }
          }
        `}</style>
      </div>
    </DashboardLayout>
  );
}

