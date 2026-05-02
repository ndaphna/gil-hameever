import type { Metadata } from 'next';
import ClientComponent from './hot-flash-zoom-client';

export const metadata: Metadata = {
  title: 'עזרה ראשונה לגל חום באמצע זום | גיל המעבר',
  description: 'בלי "סליחה". בלי לכבות מצלמה ולהיעלם. רק פרוטוקול שעובד תוך 60 שניות.',
  openGraph: {
    title: 'עזרה ראשונה לגל חום באמצע זום',
    description: 'בלי "סליחה". בלי לכבות מצלמה ולהיעלם. רק פרוטוקול שעובד תוך 60 שניות.',
    locale: 'he_IL',
  },
};

export default function Page() {
  return <ClientComponent />;
}
