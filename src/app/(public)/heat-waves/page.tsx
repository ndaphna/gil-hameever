import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import ClientComponent from './heat-waves-client'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gilhameever.com'

export const metadata: Metadata = {
  title: 'גלי חום והזעות לילה בגיל המעבר — המדריך המלא',
  description: 'גלי חום והזעות לילה הם מהתסמינים הנפוצים ביותר בגיל המעבר. כאן תמצאי הסברים ופתרונות מעשיים.',
  openGraph: {
    title: 'גלי חום והזעות לילה בגיל המעבר — המדריך המלא',
    description: 'גלי חום והזעות לילה הם מהתסמינים הנפוצים ביותר בגיל המעבר. כאן תמצאי הסברים ופתרונות מעשיים.',
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'גלי חום והזעות לילה בגיל המעבר — המדריך המלא',
  description: 'גלי חום והזעות לילה הם מהתסמינים הנפוצים ביותר בגיל המעבר. כאן תמצאי הסברים ופתרונות מעשיים.',
  url: `${siteUrl}/heat-waves`,
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
