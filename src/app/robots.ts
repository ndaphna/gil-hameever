import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gilhameever.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin-setup',
          '/auth',
          '/chat',
          '/dashboard',
          '/forgot-password',
          '/gift-access',
          '/good-sleep-access',
          '/brain-fog-access',
          '/emergency-map-access',
          '/secret-report-access',
          '/sharp-memory-access',
          '/walking-medicine-access',
          '/heroine-checklist-thank-you',
          '/heroine-checklist-valuable-content',
          '/insights',
          '/journal',
          '/lead-gift-8',
          '/login',
          '/members',
          '/profile',
          '/reset-password',
          '/signup',
          '/test-newsletter',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
