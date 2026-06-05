import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import NaturalRemediesClient from './natural-remedies-client'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gilhameever.com'

export const metadata: Metadata = {
  title: 'מרווה, לבנדר וצמחי מרפא: פתרונות טבעיים לתסמיני גיל המעבר',
  description: 'מרווה לגלי חום, לבנדר לשינה, ג\'ינג\'ר לעייפות. אילו צמחי מרפא יכולים לעזור בגיל המעבר ואיפה הם לא מחליפים רופא.',
  openGraph: {
    title: 'מרווה, לבנדר וצמחי מרפא: פתרונות טבעיים לתסמיני גיל המעבר',
    description: 'אילו צמחי מרפא יכולים לעזור בגיל המעבר ואיפה הם לא מחליפים רופא.',
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'מרווה, לבנדר וצמחי מרפא: פתרונות טבעיים לתסמיני גיל המעבר',
  description: 'אילו צמחי מרפא יכולים לעזור בגיל המעבר ואיפה הם לא מחליפים רופא.',
  url: `${siteUrl}/natural-menopause-relief-sage-herbs`,
  inLanguage: 'he',
  author: { '@type': 'Person', name: 'ענבל' },
  publisher: { '@type': 'Organization', name: 'מנופאוזית וטוב לה', url: siteUrl },
}

export default function Page() {
  return (
    <>
      <JsonLd data={articleSchema} />
      <NaturalRemediesClient />
    </>
  )
}
