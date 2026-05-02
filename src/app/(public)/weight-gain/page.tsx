import type { Metadata } from 'next'
import ClientComponent from './weight-gain-client'

export const metadata: Metadata = {
  title: 'עלייה במשקל בגיל המעבר — תזונה ופתרונות מעשיים',
  description: '"אבל אני לא אוכלת יותר!" — עלייה במשקל בגיל המעבר היא הורמונלית, לא עניין של רצון. גלי איך לתמוך בגוף שלך.',
  openGraph: {
    title: 'עלייה במשקל בגיל המעבר — תזונה ופתרונות מעשיים',
    description: '"אבל אני לא אוכלת יותר!" — עלייה במשקל בגיל המעבר היא הורמונלית, לא עניין של רצון. גלי איך לתמוך בגוף שלך.',
  },
}

export default function Page() {
  return <ClientComponent />
}
