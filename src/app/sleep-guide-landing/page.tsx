import type { Metadata } from 'next';
import SleepGuideClient from './sleep-guide-client';

export const metadata: Metadata = {
  title: 'המדריך שרציתי שיהיה לי לפני שנתיים: 5 צעדים להחזיר לעצמך את הלילה | גיל המעבר',
  description: 'לא ספירת כבשים. לא "הירגעי". פרוטוקול מדעי פשוט שמלמד את הגוף שלך לישון שוב, גם בזמן גיל המעבר.',
  openGraph: {
    title: 'המדריך שרציתי שיהיה לי לפני שנתיים: 5 צעדים להחזיר לעצמך את הלילה',
    description: 'לא ספירת כבשים. לא "הירגעי". פרוטוקול מדעי פשוט שמלמד את הגוף שלך לישון שוב, גם בזמן גיל המעבר.',
    locale: 'he_IL',
  },
};

export default function Page() {
  return <SleepGuideClient />;
}
