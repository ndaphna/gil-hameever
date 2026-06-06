import type { Metadata } from 'next'
import ClientComponent from './menopause-book-client'

export const metadata: Metadata = {
  title: 'לא גברת, גיבורה! | ספר גיל המעבר',
  description: 'הספר שיעזור לך להפסיק להרגיש לבד בתוך גיל המעבר, להבין מה עובר עלייך, לצחוק קצת בדרך ולהיזכר באישה שאת באמת.',
  icons: {
    icon: [{ url: '/logo.png', type: 'image/png' }],
    apple: '/logo.png',
  },
  openGraph: {
    title: 'לא גברת, גיבורה! | ספר גיל המעבר',
    description: 'הספר שיעזור לך להפסיק להרגיש לבד בתוך גיל המעבר, להבין מה עובר עלייך, לצחוק קצת בדרך ולהיזכר באישה שאת באמת.',
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
