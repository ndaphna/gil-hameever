import { Emotion, PastelColor } from '@/types/journal';

export const PASTEL_COLORS: PastelColor[] = [
  { name: 'ורוד', value: '#F8F0F2', light: '#FDF8FA' },
  { name: 'סגול', value: '#F0E8F2', light: '#F8F4F9' },
  { name: 'כחול', value: '#E8F2FF', light: '#F4F8FF' },
  { name: 'ירוק', value: '#F0F8F0', light: '#F8FCF8' },
  { name: 'צהוב', value: '#FFFEF0', light: '#FFFEF8' },
  { name: 'אפרסק', value: '#FFF8F0', light: '#FFFCF8' },
];

export const EMOTIONS: Emotion[] = [
  { value: 'עצובה מאוד', intensity: 1, emoji: '😢', color: '#F0F4F8' },
  { value: 'עצובה', intensity: 2, emoji: '😔', color: '#F2F4F8' },
  { value: 'רגועה', intensity: 3, emoji: '😌', color: '#F4F2F8' },
  { value: 'טוב', intensity: 4, emoji: '🙂', color: '#F6F8F4' },
  { value: 'מאושרת', intensity: 5, emoji: '😊', color: '#F8F6F2' },
];
