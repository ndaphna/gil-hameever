import type { Metadata } from 'next'
import ClientComponent from './data-deletion-client'

export const metadata: Metadata = {
  title: 'מחיקת נתונים, מנופאוזית וטוב לה',
  description: 'הוראות למחיקת הנתונים האישיים שלך מפלטפורמת מנופאוזית וטוב לה.',
  openGraph: {
    title: 'מחיקת נתונים, מנופאוזית וטוב לה',
    description: 'הוראות למחיקת הנתונים האישיים שלך מפלטפורמת מנופאוזית וטוב לה.',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function Page() {
  return <ClientComponent />
}
