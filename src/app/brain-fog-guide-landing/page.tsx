import type { Metadata } from 'next';
import BrainFogGuideClient from './brain-fog-guide-client';

export const metadata: Metadata = {
  title: 'הערפל הזה הוא לא את. | גיל המעבר',
  description: '5 כלים שעוזרים לך לחשוב בבהירות שוב',
  openGraph: {
    title: 'הערפל הזה הוא לא את.',
    description: '5 כלים שעוזרים לך לחשוב בבהירות שוב',
    locale: 'he_IL',
  },
};

export default function Page() {
  return <BrainFogGuideClient />;
}
