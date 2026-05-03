import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import ClientComponent from './menopausal-sleep-client'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gilhameever.com'

export const metadata: Metadata = {
  title: 'הפרעות שינה בגיל המעבר, למה קשה לישון ואיך מתמודדים',
  description: 'לא נרדמת? מתעוררת בלילה? הפרעות שינה בגיל המעבר שכיחות ומתישות. גלי את הסיבות ואיך מחזירים את השינה.',
  openGraph: {
    title: 'הפרעות שינה בגיל המעבר, למה קשה לישון ואיך מתמודדים',
    description: 'לא נרדמת? מתעוררת בלילה? הפרעות שינה בגיל המעבר שכיחות ומתישות. גלי את הסיבות ואיך מחזירים את השינה.',
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'הפרעות שינה בגיל המעבר, למה קשה לישון ואיך מתמודדים',
  description: 'לא נרדמת? מתעוררת בלילה? הפרעות שינה בגיל המעבר שכיחות ומתישות. גלי את הסיבות ואיך מחזירים את השינה.',
  url: `${siteUrl}/menopausal-sleep`,
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
