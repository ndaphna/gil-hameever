import type { Metadata } from 'next';
import MorningResetClient from './morning-reset-client';

export const metadata: Metadata = {
  title: 'פרוטוקול הבוקר של הגיבורה | גיל המעבר',
  description: '5 דקות. 5 פעולות. יום שלם שונה.',
  openGraph: {
    title: 'פרוטוקול הבוקר של הגיבורה',
    description: '5 דקות. 5 פעולות. יום שלם שונה.',
    locale: 'he_IL',
  },
};

export default function Page() {
  return <MorningResetClient />;
}
