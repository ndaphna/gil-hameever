import type { Metadata } from 'next'
import BrainFogMenopausePage from './brain-fog-client'

export const metadata: Metadata = {
  title: 'ערפל מוחי בגיל המעבר — מה זה ואיך להתמודד',
  description: 'ערפל מוחי בגיל המעבר? זה נפוץ ולא "בראש". גלי למה האסטרוגן משפיע על המוח ואיך מחזירים את הבהירות המחשבתית.',
  openGraph: {
    title: 'ערפל מוחי בגיל המעבר — מה זה ואיך להתמודד',
    description: 'ערפל מוחי בגיל המעבר? זה נפוץ ולא "בראש". גלי למה האסטרוגן משפיע על המוח ואיך מחזירים את הבהירות המחשבתית.',
  },
}

export default function Page() {
  return <BrainFogMenopausePage />
}
