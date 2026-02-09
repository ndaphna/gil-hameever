import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'לא גיברת, גיבורה! | ספר גיל המעבר',
  description: 'חשיפה ראשונה בישראל: איך לעשות Restart לגוף ולנפש ולהפוך את גיל המעבר ממשבר מפחיד לשדרוג הכי טוב של חייך. פרוטוקול הגיבורה.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export default function BookRevealLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
