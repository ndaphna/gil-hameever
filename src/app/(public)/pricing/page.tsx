import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'מחירים ומנויים, מנופאוזית וטוב לה',
  description: 'בחרי את התכנית המתאימה לך, גישה לכלים, מאמרים ו-AI אישי לגיל המעבר. מחירים שקופים, ללא הפתעות.',
  openGraph: {
    title: 'מחירים ומנויים, מנופאוזית וטוב לה',
    description: 'בחרי את התכנית המתאימה לך, גישה לכלים, מאמרים ו-AI אישי לגיל המעבר. מחירים שקופים, ללא הפתעות.',
  },
}

export default function PricingPage() {
  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1>מחירים</h1>
      <p className="mb-4">
        עמוד מחירים ציבורי עם פירוט מסלולים.
      </p>
      <ul className="space-y-2">
        <li className="rounded border border-neutral-200 dark:border-neutral-800 p-4">
          <strong>חינמי</strong>, גישה לתכנים ציבוריים
        </li>
        <li className="rounded border border-neutral-200 dark:border-neutral-800 p-4">
          <strong>פרימיום</strong>, תכנים וכלים לנשות המועדון בלבד
        </li>
      </ul>
    </main>
  );
}


