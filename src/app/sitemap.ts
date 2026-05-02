import type { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gilhameever.com'

const symptomPages = [
  'anxiety-attacks',
  'belly-fat-hormones-menopause',
  'brain-fog-menopause',
  'cortisol-stress-menopause',
  'decreased-desire',
  'dr-sims-supplements-menopause',
  'good-sleep-menopause',
  'heat-waves',
  'hormones',
  'hot-flashes-menopause',
  'intermittent-fasting-menopause',
  'menopausal-sleep',
  'mindset-changes-weight-loss-50s',
  'muscle-mass-menopause',
  'physical-activity',
  'preparing-for-menopause',
  'proven-tools-belly-fat-menopause',
  'sharp-memory-menopause',
  'walking-benefits-menopause',
  'walking-medicine-menopause',
  'weight-gain',
]

const landingPages = [
  'gibora',
  'earlyadopter',
  'heroine-checklist-landing',
  'menopause-roadmap',
  'waitlist',
]

const contentPages = [
  'about',
  'articles',
  'book-preview',
  'book-upgrade',
  'menopause-book',
  'pricing',
  'privacy-policy',
]

const topicPages = [
  'belonging-sisterhood-emotional-connection',
  'building-safe-routine',
  'certainty-peace-security',
  'community-new-connections',
  'emotional-regulation',
  'fears-guilt-self-doubt',
  'female-friendship-healing-space',
  'giving-from-fullness',
  'honest-communication',
  'how-to-build-practical-dream',
  'how-to-discover-what-i-want',
  'impulsivity-to-calm',
  'inspiration-waves',
  'inspire',
  'letting-go-toxic-relationships',
  'making-change-50-plus',
  'passing-it-on',
  'self-worth',
  'sense-of-meaning',
  'setting-boundaries',
  'the-body-whispers',
  'what-did-i-leave-here',
  'what-going-on',
  'what-is-belonging',
  'what-is-feminine-wisdom',
  'what-is-self-fulfillment',
  'wisdom-giving',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...symptomPages.map((slug) => ({
      url: `${baseUrl}/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
    ...landingPages.map((slug) => ({
      url: `${baseUrl}/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...contentPages.map((slug) => ({
      url: `${baseUrl}/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...topicPages.map((slug) => ({
      url: `${baseUrl}/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
