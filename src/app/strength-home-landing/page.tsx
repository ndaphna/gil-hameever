import type { Metadata } from 'next';
import StrengthHomeClient from './strength-home-client';

export const metadata: Metadata = {
  title: 'האם גיל המעבר שלך קורא לך להרים משקולות? | גיל המעבר',
  description: '7 סימנים שכדאי להכיר, ופרוטוקול 20 דקות להתחיל בבית',
  openGraph: {
    title: 'האם גיל המעבר שלך קורא לך להרים משקולות?',
    description: '7 סימנים שכדאי להכיר, ופרוטוקול 20 דקות להתחיל בבית',
    locale: 'he_IL',
  },
};

export default function Page() {
  return <StrengthHomeClient />;
}
