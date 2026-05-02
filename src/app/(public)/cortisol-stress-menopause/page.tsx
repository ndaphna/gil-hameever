import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import ClientComponent from './cortisol-client'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gilhameever.com'

export const metadata: Metadata = {
  title: 'קורטיזול ולחץ בגיל המעבר — איך מורידים את האש',
  description: 'קורטיזול גבוה בגיל המעבר מחמיר תסמינים וגורם ללחץ כרוני. גלי איך לווסת את הורמון הסטרס ולהרגיש טוב יותר.',
  openGraph: {
    title: 'קורטיזול ולחץ בגיל המעבר — איך מורידים את האש',
    description: 'קורטיזול גבוה בגיל המעבר מחמיר תסמינים וגורם ללחץ כרוני. גלי איך לווסת את הורמון הסטרס ולהרגיש טוב יותר.',
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'קורטיזול ולחץ בגיל המעבר — איך מורידים את האש',
  description: 'קורטיזול גבוה בגיל המעבר מחמיר תסמינים וגורם ללחץ כרוני. גלי איך לווסת את הורמון הסטרס ולהרגיש טוב יותר.',
  url: `${siteUrl}/cortisol-stress-menopause`,
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
