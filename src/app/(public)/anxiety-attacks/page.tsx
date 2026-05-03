import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import ClientComponent from './anxiety-client'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gilhameever.com'

export const metadata: Metadata = {
  title: 'התקפי חרדה בגיל המעבר, איך להכיר ולהתמודד',
  description: 'חרדות פתאומיות בגיל המעבר הן תסמין נפוץ ולא סימן לחולשה. גלי איך לזהות, להבין ולהתמודד עם התקפי חרדה.',
  openGraph: {
    title: 'התקפי חרדה בגיל המעבר, איך להכיר ולהתמודד',
    description: 'חרדות פתאומיות בגיל המעבר הן תסמין נפוץ ולא סימן לחולשה. גלי איך לזהות, להבין ולהתמודד עם התקפי חרדה.',
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'התקפי חרדה בגיל המעבר, איך להכיר ולהתמודד',
  description: 'חרדות פתאומיות בגיל המעבר הן תסמין נפוץ ולא סימן לחולשה. גלי איך לזהות, להבין ולהתמודד עם התקפי חרדה.',
  url: `${siteUrl}/anxiety-attacks`,
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
