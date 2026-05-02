import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import ClientComponent from './good-sleep-client'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gilhameever.com'

export const metadata: Metadata = {
  title: 'שינה טובה בגיל המעבר — המדריך המעשי',
  description: 'שינה טובה בגיל המעבר אפשרית. גלי מה גיל המעבר עושה לשינה שלך ואיך להחזיר לילות שקטים ומנוחה אמיתית.',
  openGraph: {
    title: 'שינה טובה בגיל המעבר — המדריך המעשי',
    description: 'שינה טובה בגיל המעבר אפשרית. גלי מה גיל המעבר עושה לשינה שלך ואיך להחזיר לילות שקטים ומנוחה אמיתית.',
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'שינה טובה בגיל המעבר — המדריך המעשי',
  description: 'שינה טובה בגיל המעבר אפשרית. גלי מה גיל המעבר עושה לשינה שלך ואיך להחזיר לילות שקטים ומנוחה אמיתית.',
  url: `${siteUrl}/good-sleep-menopause`,
  inLanguage: 'he',
  author: {
    '@type': 'Person',
    name: 'ענבל',
  },
  publisher: {
    '@type': 'Organization',
    name: 'מנופאוזית וטוב לה',
    url: siteUrl,
  },
}

export default function Page() {
  return (
    <>
      <JsonLd data={articleSchema} />
      <ClientComponent />
    </>
  )
}
