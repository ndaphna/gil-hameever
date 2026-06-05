import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import Perimenopause40sClient from './perimenopause-40s-client'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gilhameever.com'

export const metadata: Metadata = {
  title: 'פרימנופאוזה בגיל 40: הסימנים המוקדמים שאף אחת לא מספרת עליהם',
  description: 'גיל המעבר לא מתחיל ב-50. לפעמים הגוף מתחיל לשלוח הודעות כבר בגיל 40. כל מה שצריך לדעת על פרימנופאוזה מוקדמת.',
  openGraph: {
    title: 'פרימנופאוזה בגיל 40: הסימנים המוקדמים שאף אחת לא מספרת עליהם',
    description: 'גיל המעבר לא מתחיל ב-50. לפעמים הגוף מתחיל לשלוח הודעות כבר בגיל 40.',
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'פרימנופאוזה בגיל 40: הסימנים המוקדמים שאף אחת לא מספרת עליהם',
  description: 'גיל המעבר לא מתחיל ב-50. לפעמים הגוף מתחיל לשלוח הודעות כבר בגיל 40.',
  url: `${siteUrl}/perimenopause-40s-early-signs`,
  inLanguage: 'he',
  author: { '@type': 'Person', name: 'ענבל' },
  publisher: { '@type': 'Organization', name: 'מנופאוזית וטוב לה', url: siteUrl },
}

export default function Page() {
  return (
    <>
      <JsonLd data={articleSchema} />
      <Perimenopause40sClient />
    </>
  )
}
