import type { Metadata } from 'next'
import ClientComponent from './privacy-policy-client'

export const metadata: Metadata = {
  title: 'מדיניות פרטיות, מנופאוזית וטוב לה',
  description: 'מדיניות הפרטיות של פלטפורמת מנופאוזית וטוב לה, איך אנחנו מגנות על המידע שלך.',
  openGraph: {
    title: 'מדיניות פרטיות, מנופאוזית וטוב לה',
    description: 'מדיניות הפרטיות של פלטפורמת מנופאוזית וטוב לה, איך אנחנו מגנות על המידע שלך.',
  },
}

export default function Page() {
  return <ClientComponent />
}
