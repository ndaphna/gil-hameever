import type { Metadata } from 'next'
import ClientComponent from './muscle-mass-client'

export const metadata: Metadata = {
  title: 'שימור מסת שריר בגיל המעבר — המדריך המלא',
  description: 'מסת שריר יורדת בגיל המעבר? לא חייב להיות. המדריך המלא לשמירה על שרירים חזקים וגוף אנרגטי גם אחרי 50.',
  openGraph: {
    title: 'שימור מסת שריר בגיל המעבר — המדריך המלא',
    description: 'מסת שריר יורדת בגיל המעבר? לא חייב להיות. המדריך המלא לשמירה על שרירים חזקים וגוף אנרגטי גם אחרי 50.',
  },
}

export default function Page() {
  return <ClientComponent />
}
