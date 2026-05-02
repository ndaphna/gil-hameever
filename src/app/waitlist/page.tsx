import type { Metadata } from 'next'
import ClientComponent from './waitlist-client'

export const metadata: Metadata = {
  title: 'הצטרפי לרשימת ההמתנה, מנופאוזית וטוב לה',
  description: 'הצטרפי לרשימת ההמתנה לפלטפורמת גיל המעבר. קבלי גישה מוקדמת לכלים, מידע ותמיכה לגיל המעבר.',
  openGraph: {
    title: 'הצטרפי לרשימת ההמתנה, מנופאוזית וטוב לה',
    description: 'הצטרפי לרשימת ההמתנה לפלטפורמת גיל המעבר. קבלי גישה מוקדמת לכלים, מידע ותמיכה לגיל המעבר.',
  },
}

export default function Page() {
  return <ClientComponent />
}
