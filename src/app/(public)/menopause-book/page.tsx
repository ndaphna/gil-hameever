import type { Metadata } from 'next'
import ClientComponent from './menopause-book-client'

export const metadata: Metadata = {
  title: 'ספר גיל המעבר, לא גיברת, גיבורה!',
  description: 'הספר הראשון בישראל לנשים בגיל המעבר שרוצות להבין מה קורה לגוף ולנפש ולחיות טוב יותר.',
  openGraph: {
    title: 'ספר גיל המעבר, לא גיברת, גיבורה!',
    description: 'הספר הראשון בישראל לנשים בגיל המעבר שרוצות להבין מה קורה לגוף ולנפש ולחיות טוב יותר.',
  },
}

export default function Page() {
  return <ClientComponent />
}
