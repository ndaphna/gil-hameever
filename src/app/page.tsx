import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import Home from './home-client'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gilhameever.com'

export const metadata: Metadata = {
  title: 'מנופאוזית וטוב לה, הבית לנשים בגיל המעבר',
  description: 'המקום של נשים בגיל המעבר, מידע, כלים ותמיכה לחיות טוב יותר בגיל 50 ומעלה. גלי חום, ערפל מוחי, שינה, הורמונים ועוד.',
  openGraph: {
    title: 'מנופאוזית וטוב לה, הבית לנשים בגיל המעבר',
    description: 'המקום של נשים בגיל המעבר, מידע, כלים ותמיכה לחיות טוב יותר בגיל 50 ומעלה.',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'מנופאוזית וטוב לה',
  url: siteUrl,
  description: 'המקום של נשים בגיל המעבר, מידע, כלים ותמיכה',
  inLanguage: 'he',
  logo: `${siteUrl}/logo-main.png`,
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'מנופאוזית וטוב לה',
  url: siteUrl,
  inLanguage: 'he',
}

export default function Page() {
  return (
    <>
      <JsonLd data={[organizationSchema, websiteSchema]} />
      <Home />
    </>
  )
}
