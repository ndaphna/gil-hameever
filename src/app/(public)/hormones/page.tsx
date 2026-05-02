import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import ClientComponent from './hormones-client'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gilhameever.com'

export const metadata: Metadata = {
  title: 'הורמונים בגיל המעבר — כל מה שצריך לדעת',
  description: 'אסטרוגן, פרוגסטרון, טסטוסטרון — מה קורה להורמונים שלך בגיל המעבר? מדריך ברור ופשוט בלי בלבול.',
  openGraph: {
    title: 'הורמונים בגיל המעבר — כל מה שצריך לדעת',
    description: 'אסטרוגן, פרוגסטרון, טסטוסטרון — מה קורה להורמונים שלך בגיל המעבר? מדריך ברור ופשוט בלי בלבול.',
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'הורמונים בגיל המעבר — כל מה שצריך לדעת',
  description: 'אסטרוגן, פרוגסטרון, טסטוסטרון — מה קורה להורמונים שלך בגיל המעבר? מדריך ברור ופשוט בלי בלבול.',
  url: `${siteUrl}/hormones`,
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
