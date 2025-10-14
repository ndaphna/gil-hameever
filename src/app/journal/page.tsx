'use client';

import DashboardLayout from '../components/DashboardLayout';
import JournalEntryCard from '@/components/journal/JournalEntryCard';
import JournalModal from '@/components/journal/JournalModal';
import { useJournal } from '@/hooks/useJournal';
import '@/components/journal/Journal.css';

export default function JournalPage() {
  const {
    entries,
    loading,
    showModal,
    saving,
    formData,
    setFormData,
    setShowModal,
    handleSaveEntry,
    handleDeleteEntry,
    handleEditEntry,
  } = useJournal();

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
              {entries.map((entry) => (
                <JournalEntryCard
                  key={entry.id}
                  entry={entry}
                  onEdit={handleEditEntry}
                  onDelete={handleDeleteEntry}
                />
              ))}
            </div>
          )}

          {/* FAB */}
          <button 
            className="fab" 
            onClick={() => setShowModal(true)}
            aria-label="הוסף רשומה חדשה"
          >
            <span className="fab-icon">+</span>
          </button>

          {/* Modal */}
          <JournalModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            formData={formData}
            setFormData={setFormData}
            onSave={handleSaveEntry}
            saving={saving}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}