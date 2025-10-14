import { JournalFormData } from '@/types/journal';
import { EMOTIONS, PASTEL_COLORS } from '@/constants/journal';

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: JournalFormData;
  setFormData: (data: JournalFormData) => void;
  onSave: () => void;
  saving: boolean;
  isEditing?: boolean;
}

export default function JournalModal({ 
  isOpen, 
  onClose, 
  formData, 
  setFormData, 
  onSave, 
  saving,
  isEditing = false
}: JournalModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'עריכת רשומה' : 'הוספת רשומה חדשה'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Emotion Selection */}
          <div className="form-group">
            <label>איך את מרגישה היום?</label>
            <div className="emotion-slider">
              {EMOTIONS.map((emotion) => (
                <button
                  key={emotion.value}
                  className={`emotion-option ${
                    formData.selectedEmotion.value === emotion.value ? 'selected' : ''
                  }`}
                  onClick={() => setFormData({ ...formData, selectedEmotion: emotion })}
                  style={{ backgroundColor: emotion.color }}
                >
                  <span className="emotion-emoji">{emotion.emoji}</span>
                  <span className="emotion-text">{emotion.value}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="form-group">
            <label>בחרי צבע לכרטיס</label>
            <div className="color-picker">
              {PASTEL_COLORS.map((color) => (
                <button
                  key={color.name}
                  className={`color-option ${
                    formData.selectedColor.name === color.name ? 'selected' : ''
                  }`}
                  onClick={() => setFormData({ ...formData, selectedColor: color })}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label>מה את רוצה לכתוב?</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="כתבי כאן את המחשבות, הרגשות והחוויות שלך..."
              className="notes-textarea"
              rows={4}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            ביטול
          </button>
          <button 
            className="btn btn-primary" 
            onClick={onSave}
            disabled={saving || !formData.notes.trim()}
          >
            {saving ? 'שומר...' : (isEditing ? 'עדכן רשומה' : 'שמור רשומה')}
          </button>
        </div>
      </div>
    </div>
  );
}
