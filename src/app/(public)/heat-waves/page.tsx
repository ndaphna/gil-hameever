import type { Metadata } from 'next'
import ClientComponent from './heat-waves-client'

export const metadata: Metadata = {
  title: 'גלי חום והזעות לילה בגיל המעבר — המדריך המלא',
  description: 'גלי חום והזעות לילה הם מהתסמינים הנפוצים ביותר בגיל המעבר. כאן תמצאי הסברים ופתרונות מעשיים.',
  openGraph: {
    title: 'גלי חום והזעות לילה בגיל המעבר — המדריך המלא',
    description: 'גלי חום והזעות לילה הם מהתסמינים הנפוצים ביותר בגיל המעבר. כאן תמצאי הסברים ופתרונות מעשיים.',
  },
}

export default function Page() {
  return <ClientComponent />
}
