import type { Metadata } from 'next';
import WalkingGuideClient from './walking-guide-client';

export const metadata: Metadata = {
  title: 'עזרה ראשונה להתחיל ללכת, ולהישאר הולכת | גיל המעבר',
  description: 'פרוטוקול 5 צעדים לנשים שיודעות שהליכה חשובה, אבל לא מצליחות להתחיל',
  openGraph: {
    title: 'עזרה ראשונה להתחיל ללכת, ולהישאר הולכת',
    description: 'פרוטוקול 5 צעדים לנשים שיודעות שהליכה חשובה, אבל לא מצליחות להתחיל',
    locale: 'he_IL',
  },
};

export default function Page() {
  return <WalkingGuideClient />;
}
