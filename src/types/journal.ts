export interface JournalEntry {
  id: string;
  date: string;
  emotion: string;
  intensity: number;
  notes: string;
  color?: string;
  created_at: string;
}

export interface Emotion {
  value: string;
  intensity: number;
  emoji: string;
  color: string;
}

export interface PastelColor {
  name: string;
  value: string;
  light: string;
}

export interface JournalFormData {
  selectedEmotion: Emotion;
  selectedColor: PastelColor;
  notes: string;
}
