import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import ClientComponent from './muscle-mass-client'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gilhameever.com'

export const metadata: Metadata = {
  title: 'שימור מסת שריר בגיל המעבר — המדריך המלא',
  description: 'מסת שריר יורדת בגיל המעבר? לא חייב להיות. המדריך המלא לשמירה על שרירים חזקים וגוף אנרגטי גם אחרי 50.',
  openGraph: {
    title: 'שימור מסת שריר בגיל המעבר — המדריך המלא',
    description: 'מסת שריר יורדת בגיל המעבר? לא חייב להיות. המדריך המלא לשמירה על שרירים חזקים וגוף אנרגטי גם אחרי 50.',
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'שימור מסת שריר בגיל המעבר — המדריך המלא',
  description: 'מסת שריר יורדת בגיל המעבר? לא חייב להיות. המדריך המלא לשמירה על שרירים חזקים וגוף אנרגטי גם אחרי 50.',
  url: `${siteUrl}/muscle-mass-menopause`,
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
