import type { Metadata } from 'next';
import IdentityGuideClient from './identity-guide-client';

export const metadata: Metadata = {
  title: 'ברגע שהחלטתי: לא גברת. גיבורה. | גיל המעבר',
  description: 'ברגע שהפסקתי לחכות שהחיים יחזרו להרגיש נורמלים, התחיל המסע שלי',
  openGraph: {
    title: 'ברגע שהחלטתי: לא גברת. גיבורה.',
    description: 'ברגע שהפסקתי לחכות שהחיים יחזרו להרגיש נורמלים, התחיל המסע שלי',
    locale: 'he_IL',
  },
};

export default function Page() {
  return <IdentityGuideClient />;
}
