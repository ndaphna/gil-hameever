import type { Metadata } from 'next'
import ClientComponent from './menopause-book-client'

export const metadata: Metadata = {
  title: 'לא גברת, גיבורה! | ספר גיל המעבר',
  description: 'הספר שיעזור לך להבין מה קורה לגוף ולנפש בגיל המעבר ולחיות טוב יותר. 204 עמודים, 24 פרקים, 4 חלקים.',
  openGraph: {
    title: 'לא גברת, גיבורה! | ספר גיל המעבר',
    description: 'הספר שיעזור לך להבין מה קורה לגוף ולנפש בגיל המעבר ולחיות טוב יותר.',
  },
}

export default function Page() {
  return <ClientComponent />
}
