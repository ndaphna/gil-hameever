import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import MentalHealthClient from './mental-health-client'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gilhameever.com'

export const metadata: Metadata = {
  title: 'בריאות נפשית בגיל המעבר: חרדה, מצבי רוח ואיך לא להרגיש לבד',
  description: 'עצבנות שמגיעה מאין, בכי בלי סיבה, חרדה שלא הייתה קודם. זה לא "בראש שלך", זה גיל המעבר. ואפשר להתמודד.',
  openGraph: {
    title: 'בריאות נפשית בגיל המעבר: חרדה, מצבי רוח ואיך לא להרגיש לבד',
    description: 'עצבנות שמגיעה מאין, בכי בלי סיבה, חרדה שלא הייתה קודם. זה לא "בראש שלך", זה גיל המעבר.',
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'בריאות נפשית בגיל המעבר: חרדה, מצבי רוח ואיך לא להרגיש לבד',
  description: 'עצבנות שמגיעה מאין, בכי בלי סיבה, חרדה שלא הייתה קודם. זה לא "בראש שלך".',
  url: `${siteUrl}/mental-health-mood-menopause`,
  inLanguage: 'he',
  author: { '@type': 'Person', name: 'ענבל' },
  publisher: { '@type': 'Organization', name: 'מנופאוזית וטוב לה', url: siteUrl },
}

export default function Page() {
  return (
    <>
      <JsonLd data={articleSchema} />
      <MentalHealthClient />
    </>
  )
}
