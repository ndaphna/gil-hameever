import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import BrainFogMenopausePage from './brain-fog-client'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gilhameever.com'

export const metadata: Metadata = {
  title: 'ערפל מוחי בגיל המעבר, מה זה ואיך להתמודד',
  description: 'ערפל מוחי בגיל המעבר? זה נפוץ ולא "בראש". גלי למה האסטרוגן משפיע על המוח ואיך מחזירים את הבהירות המחשבתית.',
  openGraph: {
    title: 'ערפל מוחי בגיל המעבר, מה זה ואיך להתמודד',
    description: 'ערפל מוחי בגיל המעבר? זה נפוץ ולא "בראש". גלי למה האסטרוגן משפיע על המוח ואיך מחזירים את הבהירות המחשבתית.',
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'ערפל מוחי בגיל המעבר, מה זה ואיך להתמודד',
  description: 'ערפל מוחי בגיל המעבר? זה נפוץ ולא "בראש". גלי למה האסטרוגן משפיע על המוח ואיך מחזירים את הבהירות המחשבתית.',
  url: `${siteUrl}/brain-fog-menopause`,
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
      <BrainFogMenopausePage />
    </>
  )
}
