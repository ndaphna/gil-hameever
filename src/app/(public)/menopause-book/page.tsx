import type { Metadata } from 'next'
import ClientComponent from './menopause-book-client'

export const metadata: Metadata = {
  title: 'לא גברת, גיבורה! | ספר גיל המעבר',
  description: 'הספר שיעזור לך להבין מה קורה לגוף ולנפש בגיל המעבר ולחיות טוב יותר. 204 עמודים, 24 פרקים, 4 חלקים.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'לא גברת, גיבורה! | ספר גיל המעבר',
    description: 'הספר שיעזור לך להבין מה קורה לגוף ולנפש בגיל המעבר ולחיות טוב יותר.',
    images: [{ url: '/logo.png', width: 800, height: 800, alt: 'לא גברת, גיבורה!' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/logo.png'],
  },
}

export default function Page() {
  return <ClientComponent />
}
