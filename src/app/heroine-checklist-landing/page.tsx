import type { Metadata } from 'next'
import ClientComponent from './heroine-checklist-client'

export const metadata: Metadata = {
  title: 'הצ׳קליסט של הגיבורה — גיל המעבר',
  description: 'קבלי את הצ׳קליסט המלא לגיל המעבר — כלים מעשיים, תסמינים וצעדים ראשונים להרגיש טוב יותר כבר עכשיו.',
  openGraph: {
    title: 'הצ׳קליסט של הגיבורה — גיל המעבר',
    description: 'קבלי את הצ׳קליסט המלא לגיל המעבר — כלים מעשיים, תסמינים וצעדים ראשונים להרגיש טוב יותר כבר עכשיו.',
  },
}

export default function Page() {
  return <ClientComponent />
}
