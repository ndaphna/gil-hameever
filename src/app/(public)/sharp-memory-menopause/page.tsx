import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import ClientComponent from './sharp-memory-client'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gilhameever.com'

export const metadata: Metadata = {
  title: 'זיכרון חד בגיל המעבר, המדריך השלם',
  description: 'נכנסת לחדר ושכחת למה? המוח שלך לא נעלם, הוא בשיפוצים. גלי איך לשמור על זיכרון חד גם בגיל המעבר.',
  openGraph: {
    title: 'זיכרון חד בגיל המעבר, המדריך השלם',
    description: 'נכנסת לחדר ושכחת למה? המוח שלך לא נעלם, הוא בשיפוצים. גלי איך לשמור על זיכרון חד גם בגיל המעבר.',
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'זיכרון חד בגיל המעבר, המדריך השלם',
  description: 'נכנסת לחדר ושכחת למה? המוח שלך לא נעלם, הוא בשיפוצים. גלי איך לשמור על זיכרון חד גם בגיל המעבר.',
  url: `${siteUrl}/sharp-memory-menopause`,
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
