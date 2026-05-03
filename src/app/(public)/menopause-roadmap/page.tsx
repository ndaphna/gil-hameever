import type { Metadata } from 'next'
import ClientComponent from './menopause-roadmap-client'

export const metadata: Metadata = {
  title: 'מפת הדרכים לגיל המעבר, המדריך המקיף',
  description: 'המדריך המקיף לגיל המעבר: תסמינים, שלבים, כלים ותמיכה. הצעד הראשון להבין מה קורה ואיך ממשיכים.',
  openGraph: {
    title: 'מפת הדרכים לגיל המעבר, המדריך המקיף',
    description: 'המדריך המקיף לגיל המעבר: תסמינים, שלבים, כלים ותמיכה. הצעד הראשון להבין מה קורה ואיך ממשיכים.',
  },
}

export default function Page() {
  return <ClientComponent />
}
