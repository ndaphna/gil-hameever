import type { Metadata } from 'next'
import ClientComponent from './articles-client'

export const metadata: Metadata = {
  title: 'מאמרים על גיל המעבר, מידע ותסמינים',
  description: 'מאמרים מקיפים על גיל המעבר: גלי חום, ערפל מוחי, שינה, משקל, הורמונים ועוד. כל מה שצריך לדעת בשפה שמובנת.',
  openGraph: {
    title: 'מאמרים על גיל המעבר, מידע ותסמינים',
    description: 'מאמרים מקיפים על גיל המעבר: גלי חום, ערפל מוחי, שינה, משקל, הורמונים ועוד. כל מה שצריך לדעת בשפה שמובנת.',
  },
}

export default function Page() {
  return <ClientComponent />
}
