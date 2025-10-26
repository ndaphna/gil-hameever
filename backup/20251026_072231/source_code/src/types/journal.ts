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

// New types for the menopause journal
export interface CycleEntry {
  id: string;
  user_id: string;
  date: string;
  is_period: boolean;
  bleeding_intensity?: 'light' | 'medium' | 'heavy';
  symptoms?: string[];
  notes?: string;
  created_at: string;
}

export interface DailyEntry {
  id: string;
  user_id: string;
  date: string;
  time_of_day: 'morning' | 'evening';
  sleep_quality?: 'poor' | 'fair' | 'good';
  woke_up_night?: boolean;
  night_sweats?: boolean;
  energy_level?: 'low' | 'medium' | 'high';
  mood?: 'calm' | 'irritated' | 'sad' | 'happy' | 'frustrated';
  hot_flashes?: boolean;
  dryness?: boolean;
  pain?: boolean;
  bloating?: boolean;
  concentration_difficulty?: boolean;
  sleep_issues?: boolean;
  sexual_desire?: boolean;
  daily_insight?: string;
  created_at: string;
}

export interface SymptomOption {
  id: string;
  label: string;
  emoji: string;
  category: 'physical' | 'emotional' | 'sleep' | 'energy';
}

export interface AlizaMessage {
  id: string;
  type: 'morning' | 'evening' | 'cycle' | 'encouragement' | 'tip';
  message: string;
  emoji: string;
  action_url?: string;
  created_at: string;
}



