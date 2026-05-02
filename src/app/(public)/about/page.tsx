import type { Metadata } from 'next'
import ClientComponent from './about-client'

export const metadata: Metadata = {
  title: 'אודות מנופאוזית וטוב לה, הסיפור שלנו',
  description: 'מי אנחנו, למה זה קיים ואיזו נשים מגיעות לכאן? הכירי את הפלטפורמה שמלווה נשים בגיל המעבר בישראל.',
  openGraph: {
    title: 'אודות מנופאוזית וטוב לה, הסיפור שלנו',
    description: 'מי אנחנו, למה זה קיים ואיזו נשים מגיעות לכאן? הכירי את הפלטפורמה שמלווה נשים בגיל המעבר בישראל.',
  },
}

export default function Page() {
  return <ClientComponent />
}
