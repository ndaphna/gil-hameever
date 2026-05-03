import type { Metadata } from 'next';
import ProteinGuideClient from './protein-guide-client';

export const metadata: Metadata = {
  title: 'רשימת הגיבורה לחלבון | גיל המעבר',
  description: 'כל מה שצריך לדעת כדי לאכול מספיק חלבון בגיל המעבר',
  openGraph: {
    title: 'רשימת הגיבורה לחלבון',
    description: 'כל מה שצריך לדעת כדי לאכול מספיק חלבון בגיל המעבר',
    locale: 'he_IL',
  },
};

export default function Page() {
  return <ProteinGuideClient />;
}
