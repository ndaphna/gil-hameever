import { JournalEntry } from '@/types/journal';
import { EMOTIONS } from '@/constants/journal';
import { formatDate, formatTime } from '@/utils/date';

interface JournalEntryCardProps {
  entry: JournalEntry;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
}

export default function JournalEntryCard({ entry, onEdit, onDelete }: JournalEntryCardProps) {
  const intensityColor = EMOTIONS.find(e => e.intensity === entry.intensity)?.color || '#E0BBE4';
  const cardColor = entry.color || intensityColor;
  
  return (
    <div
      className="entry-card"
      style={{
        backgroundColor: cardColor,
        borderColor: cardColor,
      }}
    >
      <div className="entry-header">
        <div className="entry-date">
          {formatDate(entry.created_at)}
        </div>
        <div className="entry-actions">
          <button
            className="action-btn edit-btn"
            onClick={() => onEdit(entry)}
            aria-label="ערוך רשומה"
            title="ערוך"
          >
            ✏️
          </button>
          <button
            className="action-btn delete-btn"
            onClick={() => onDelete(entry.id)}
            aria-label="מחק רשומה"
            title="מחק"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <div className="entry-emotion">
        <span className="emotion-emoji">
          {EMOTIONS.find(e => e.intensity === entry.intensity)?.emoji || '😌'}
        </span>
        <span className="emotion-text">{entry.emotion}</span>
      </div>

      <div className="entry-notes">{entry.notes}</div>

      <div className="entry-time">
        {formatTime(entry.created_at)}
      </div>
    </div>
  );
}
