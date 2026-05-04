import type { Metadata } from 'next';
import MoodGuideClient from './mood-guide-client';

export const metadata: Metadata = {
  title: 'עזרה ראשונה לנפילת מצב רוח | גיל המעבר',
  description: '5 כלים מיידיים לגיבורה שהגוף שלה מגיב לפני שהמוח מספיק להבין',
  openGraph: {
    title: 'עזרה ראשונה לנפילת מצב רוח',
    description: '5 כלים מיידיים לגיבורה שהגוף שלה מגיב לפני שהמוח מספיק להבין',
    locale: 'he_IL',
  },
};

export default function Page() {
  return <MoodGuideClient />;
}
