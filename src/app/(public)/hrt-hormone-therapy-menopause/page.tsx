import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import HrtClient from './hrt-client'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gilhameever.com'

export const metadata: Metadata = {
  title: 'טיפול הורמונלי HRT בגיל המעבר: מה שלא סיפרו לנו',
  description: 'HRT בגיל המעבר: הסיכונות, היתרונות, ומה שכדאי לשאול את הרופאה שלך לפני שמחליטים. מדריך כנה ומעשי מאישה שעברה את זה.',
  openGraph: {
    title: 'טיפול הורמונלי HRT בגיל המעבר: מה שלא סיפרו לנו',
    description: 'HRT בגיל המעבר: הסיכונות, היתרונות, ומה שכדאי לשאול את הרופאה שלך לפני שמחליטים. מדריך כנה ומעשי מאישה שעברה את זה.',
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'טיפול הורמונלי HRT בגיל המעבר: מה שלא סיפרו לנו',
  description: 'HRT בגיל המעבר: הסיכונות, היתרונות, ומה שכדאי לשאול את הרופאה שלך לפני שמחליטים.',
  url: `${siteUrl}/hrt-hormone-therapy-menopause`,
  inLanguage: 'he',
  author: { '@type': 'Person', name: 'ענבל' },
  publisher: { '@type': 'Organization', name: 'מנופאוזית וטוב לה', url: siteUrl },
}

export default function Page() {
  return (
    <>
      <JsonLd data={articleSchema} />
      <HrtClient />
    </>
  )
}
