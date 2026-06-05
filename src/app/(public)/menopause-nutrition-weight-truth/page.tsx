import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import NutritionClient from './nutrition-client'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gilhameever.com'

export const metadata: Metadata = {
  title: 'למה הדיאטה לא עובדת בגיל המעבר ומה כן עובד: האמת על תזונה ומשקל',
  description: 'עשית הכול נכון ועדיין עלית במשקל? זה לא כישלון שלך. כך משתנה חילוף החומרים בגיל המעבר ומה באמת עובד.',
  openGraph: {
    title: 'למה הדיאטה לא עובדת בגיל המעבר ומה כן עובד',
    description: 'עשית הכול נכון ועדיין עלית במשקל? כך משתנה חילוף החומרים בגיל המעבר ומה באמת עובד.',
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'למה הדיאטה לא עובדת בגיל המעבר ומה כן עובד',
  description: 'עשית הכול נכון ועדיין עלית במשקל? כך משתנה חילוף החומרים בגיל המעבר.',
  url: `${siteUrl}/menopause-nutrition-weight-truth`,
  inLanguage: 'he',
  author: { '@type': 'Person', name: 'ענבל' },
  publisher: { '@type': 'Organization', name: 'מנופאוזית וטוב לה', url: siteUrl },
}

export default function Page() {
  return (
    <>
      <JsonLd data={articleSchema} />
      <NutritionClient />
    </>
  )
}
