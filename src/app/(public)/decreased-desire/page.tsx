import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import ClientComponent from './decreased-desire-client'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gilhameever.com'

export const metadata: Metadata = {
  title: 'ירידה בחשק המיני בגיל המעבר — זה נורמלי ויש פתרון',
  description: 'ירידה בחשק מיני בגיל המעבר היא תסמין שכיח לגמרי. גלי את הסיבות ואיך להחזיר את הקשר עם הגוף ועם עצמך.',
  openGraph: {
    title: 'ירידה בחשק המיני בגיל המעבר — זה נורמלי ויש פתרון',
    description: 'ירידה בחשק מיני בגיל המעבר היא תסמין שכיח לגמרי. גלי את הסיבות ואיך להחזיר את הקשר עם הגוף ועם עצמך.',
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'ירידה בחשק המיני בגיל המעבר — זה נורמלי ויש פתרון',
  description: 'ירידה בחשק מיני בגיל המעבר היא תסמין שכיח לגמרי. גלי את הסיבות ואיך להחזיר את הקשר עם הגוף ועם עצמך.',
  url: `${siteUrl}/decreased-desire`,
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
