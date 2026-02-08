import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'לא גיברת, גיבורה! | ספר גיל המעבר',
  description: 'חשיפה ראשונה בישראל: איך לעשות Restart לגוף ולנפש ולהפוך את גיל המעבר ממשבר מפחיד לשדרוג הכי טוב של חייך. פרוטוקול הגיבורה.',
};

export default function BookRevealLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
