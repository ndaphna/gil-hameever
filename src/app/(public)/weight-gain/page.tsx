import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import ClientComponent from './weight-gain-client'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gilhameever.com'

export const metadata: Metadata = {
  title: 'עלייה במשקל בגיל המעבר, תזונה ופתרונות מעשיים',
  description: '"אבל אני לא אוכלת יותר!", עלייה במשקל בגיל המעבר היא הורמונלית, לא עניין של רצון. גלי איך לתמוך בגוף שלך.',
  openGraph: {
    title: 'עלייה במשקל בגיל המעבר, תזונה ופתרונות מעשיים',
    description: '"אבל אני לא אוכלת יותר!", עלייה במשקל בגיל המעבר היא הורמונלית, לא עניין של רצון. גלי איך לתמוך בגוף שלך.',
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'עלייה במשקל בגיל המעבר, תזונה ופתרונות מעשיים',
  description: '"אבל אני לא אוכלת יותר!", עלייה במשקל בגיל המעבר היא הורמונלית, לא עניין של רצון. גלי איך לתמוך בגוף שלך.',
  url: `${siteUrl}/weight-gain`,
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
