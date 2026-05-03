import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import ClientComponent from './hot-flashes-client'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gilhameever.com'

export const metadata: Metadata = {
  title: 'גלי חום בגיל המעבר, טיפים לשמור על הקרירות',
  description: 'גלי חום בגיל המעבר מרגישים כמו מדורה פרטית? גלי מה גורם להם ואיך להקל, טיפים מעשיים שעובדים.',
  openGraph: {
    title: 'גלי חום בגיל המעבר, טיפים לשמור על הקרירות',
    description: 'גלי חום בגיל המעבר מרגישים כמו מדורה פרטית? גלי מה גורם להם ואיך להקל, טיפים מעשיים שעובדים.',
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'גלי חום בגיל המעבר, טיפים לשמור על הקרירות',
  description: 'גלי חום בגיל המעבר מרגישים כמו מדורה פרטית? גלי מה גורם להם ואיך להקל, טיפים מעשיים שעובדים.',
  url: `${siteUrl}/hot-flashes-menopause`,
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
