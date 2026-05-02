import type { Metadata } from 'next'
import ClientComponent from './hormones-client'

export const metadata: Metadata = {
  title: 'הורמונים בגיל המעבר — כל מה שצריך לדעת',
  description: 'אסטרוגן, פרוגסטרון, טסטוסטרון — מה קורה להורמונים שלך בגיל המעבר? מדריך ברור ופשוט בלי בלבול.',
  openGraph: {
    title: 'הורמונים בגיל המעבר — כל מה שצריך לדעת',
    description: 'אסטרוגן, פרוגסטרון, טסטוסטרון — מה קורה להורמונים שלך בגיל המעבר? מדריך ברור ופשוט בלי בלבול.',
  },
}

export default function Page() {
  return <ClientComponent />
}
