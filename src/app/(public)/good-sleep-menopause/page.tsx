import type { Metadata } from 'next'
import ClientComponent from './good-sleep-client'

export const metadata: Metadata = {
  title: 'שינה טובה בגיל המעבר — המדריך המעשי',
  description: 'שינה טובה בגיל המעבר אפשרית. גלי מה גיל המעבר עושה לשינה שלך ואיך להחזיר לילות שקטים ומנוחה אמיתית.',
  openGraph: {
    title: 'שינה טובה בגיל המעבר — המדריך המעשי',
    description: 'שינה טובה בגיל המעבר אפשרית. גלי מה גיל המעבר עושה לשינה שלך ואיך להחזיר לילות שקטים ומנוחה אמיתית.',
  },
}

export default function Page() {
  return <ClientComponent />
}
