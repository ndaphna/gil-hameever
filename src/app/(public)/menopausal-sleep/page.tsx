import type { Metadata } from 'next'
import ClientComponent from './menopausal-sleep-client'

export const metadata: Metadata = {
  title: 'הפרעות שינה בגיל המעבר — למה קשה לישון ואיך מתמודדים',
  description: 'לא נרדמת? מתעוררת בלילה? הפרעות שינה בגיל המעבר שכיחות ומתישות. גלי את הסיבות ואיך מחזירים את השינה.',
  openGraph: {
    title: 'הפרעות שינה בגיל המעבר — למה קשה לישון ואיך מתמודדים',
    description: 'לא נרדמת? מתעוררת בלילה? הפרעות שינה בגיל המעבר שכיחות ומתישות. גלי את הסיבות ואיך מחזירים את השינה.',
  },
}

export default function Page() {
  return <ClientComponent />
}
