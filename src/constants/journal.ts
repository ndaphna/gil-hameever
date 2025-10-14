import { Emotion, PastelColor } from '@/types/journal';

export const PASTEL_COLORS: PastelColor[] = [
  { name: 'ורוד', value: '#FFD1DC', light: '#FFF0F3' },
  { name: 'סגול', value: '#E0BBE4', light: '#F5EAF7' },
  { name: 'כחול', value: '#B4D4FF', light: '#E8F2FF' },
  { name: 'ירוק', value: '#C1F0C1', light: '#E8F8E8' },
  { name: 'צהוב', value: '#FFF5BA', light: '#FFFCE8' },
  { name: 'אפרסק', value: '#FFDAB9', light: '#FFF3E6' },
];

export const EMOTIONS: Emotion[] = [
  { value: 'עצובה מאוד', intensity: 1, emoji: '😢', color: '#B4D4FF' },
  { value: 'עצובה', intensity: 2, emoji: '😔', color: '#C9E4FF' },
  { value: 'רגועה', intensity: 3, emoji: '😌', color: '#E0BBE4' },
  { value: 'טוב', intensity: 4, emoji: '🙂', color: '#C1F0C1' },
  { value: 'מאושרת', intensity: 5, emoji: '😊', color: '#FFF5BA' },
];
