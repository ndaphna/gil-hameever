# SEO Optimization — Design Spec
**Project:** gil-hameever  
**Date:** 2026-05-02  
**Approach:** Full-Stack SEO (long-term)

---

## Context

The site has 68+ public content pages in Hebrew covering perimenopause/menopause topics, built on Next.js App Router. The content is strong but SEO infrastructure is almost entirely absent. This spec covers all five phases of a full-stack SEO rollout.

**Current state (baseline):**
- `sitemap.xml` — missing
- `robots.txt` — missing
- Page metadata — 4 of 68+ pages covered (~6%)
- OpenGraph tags — missing
- Structured Data / JSON-LD — missing
- Canonical URLs — missing (metadataBase not set)
- Google Search Console — not connected
- Most pages: `'use client'` — cannot export `metadata` directly

---

## Phase 1 — Technical Foundation

### 1.1 Google Search Console
Verify site ownership via DNS TXT record in Vercel DNS settings. Submit sitemap after Phase 1 is deployed.

### 1.2 `robots.ts`
Create `src/app/robots.ts` using Next.js `MetadataRoute.Robots`. Rules:
- Allow: all public routes under `/(public)/`
- Disallow: `/admin`, `/members`, `/dashboard`, `/chat`, `/journal`, `/insights`, `/profile`, `/login`, `/signup`, `/forgot-password`, `/reset-password`, all `/gift-access/*` gated pages, all `*-access` gated pages
- Sitemap pointer: `${NEXT_PUBLIC_SITE_URL}/sitemap.xml`

### 1.3 `sitemap.ts`
Create `src/app/sitemap.ts` using `MetadataRoute.Sitemap`. Include all routes under `/(public)/` except thank-you pages and gated-access pages (`*-access`, `gift-access`, `test-lead-gift`, `secret-report`). Priority scale:
- Homepage: `1.0`, weekly
- Symptom/topic pages (brain-fog-menopause, hot-flashes-menopause, anxiety-attacks, weight-gain, menopausal-sleep, etc.): `0.9`, weekly
- Landing pages (/gibora, /earlyadopter): `0.8`, monthly
- Articles / about / pricing: `0.7`, monthly
- Other public pages: `0.5`, monthly

### 1.4 Root Layout — `metadataBase` + OpenGraph defaults
Update `src/app/layout.tsx`:
- Add `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gil-hameever.co.il')` — set `NEXT_PUBLIC_SITE_URL` in Vercel env vars to the confirmed production domain
- Add default `openGraph` block: `title`, `description`, `locale: 'he_IL'`, `type: 'website'`, `siteName`, default OG image
- Add default `twitter` card block: `card: 'summary_large_image'`
- Keep existing GA4 script

### 1.5 `'use client'` split pattern
Pages that are currently `'use client'` cannot export `metadata`. Fix pattern:

```
// page.tsx (server component — exports metadata)
import { Metadata } from 'next'
import BrainFogClient from './brain-fog-client'

export const metadata: Metadata = { title: '...', description: '...' }
export default function Page() { return <BrainFogClient /> }

// brain-fog-client.tsx (client component — all existing logic)
'use client'
// ... existing page content unchanged
```

Apply this pattern to all pages that need metadata. No logic changes — only file split.

---

## Phase 2 — Keyword Mapping + Per-Page Metadata

### 2.1 Keyword Research
Expand the seed list using Google Search (autocomplete + People Also Ask) and free tools (Google Keyword Planner). Target: Hebrew long-tail queries with local intent.

**Seed keywords:**
גיל המעבר, גלי חום, מנופאוזה, פרי מנופאוזה, זיעת לילה, יובש ואגינלי, ערפל מוחי

**Expansion directions:**
- Symptom + context: "גלי חום בלילה", "ערפל מוחי איך להתמודד", "חרדות גיל המעבר"
- Information-seeking: "תסמיני פרי מנופאוזה", "כמה זמן נמשך גיל המעבר"
- Solution-seeking: "עזרה בגיל המעבר", "תמיכה נשים גיל המעבר ישראל"
- Brand-adjacent: "גיבורה ספר גיל המעבר", "אינבל גיל המעבר"

### 2.2 Keyword → Page Mapping
Each page gets one primary keyword and 2–3 secondary keywords. No keyword cannibalization — one primary per page.

**Priority tier 1 (symptom pages — confirmed existing):**
| Page | Primary Keyword |
|------|----------------|
| `/brain-fog-menopause` | ערפל מוחי גיל המעבר |
| `/anxiety-attacks` | חרדות גיל המעבר |
| `/hot-flashes-menopause` | גלי חום גיל המעבר |
| `/heat-waves` | גלי חום מנופאוזה |
| `/weight-gain` | עלייה במשקל גיל המעבר |
| `/menopausal-sleep` | שינה גיל המעבר |
| `/sharp-memory-menopause` | זיכרון גיל המעבר |
| `/muscle-mass-menopause` | אובדן מסת שריר גיל המעבר |
| `/cortisol-stress-menopause` | קורטיזול סטרס גיל המעבר |
| `/hormones` | הורמונים גיל המעבר |

**Content gaps identified (no existing page — candidates for Phase 5):**
- זיעת לילה (night sweats) — no dedicated page
- יובש ואגינלי (vaginal dryness) — no dedicated page
- דיכאון גיל המעבר — verify coverage

**Priority tier 2 (landing pages):**
| Page | Primary Keyword |
|------|----------------|
| `/gibora` | ספר גיל המעבר |
| `/earlyadopter` | פלטפורמת גיל המעבר |

**Priority tier 3 (content pages):**
| Page | Primary Keyword |
|------|----------------|
| `/about` | גיל המעבר ישראל |
| `/articles` | מאמרים גיל המעבר |
| `/pricing` | מנוי גיל המעבר |

### 2.3 Metadata Standards
- **Title format:** `[מילת מפתח ראשית] | מנופאוזית וטוב לה` — max 60 chars
- **Description:** 120–160 chars, Hebrew, includes primary keyword, in Inbal's voice — conversational, empowering, not clinical
- **`generateMetadata`** for any page with dynamic content (e.g., articles)

---

## Phase 3 — Structured Data / JSON-LD

Implemented as React server components rendering `<script type="application/ld+json">`.

### Schema by page type:

**Homepage:**
```json
{
  "@type": "Organization",
  "name": "מנופאוזית וטוב לה",
  "url": "https://gil-hameever.co.il",
  "description": "...",
  "inLanguage": "he"
}
```
+ `WebSite` with `SearchAction` (sitelinks search box potential)

**Symptom pages:**
- `Article` schema: headline, description, author (Inbal), datePublished, inLanguage
- `FAQPage` schema: if page contains Q&A sections — high value for featured snippets

**Book landing page (`/gibora`):**
- `Book` schema: name, author, description, inLanguage

**Articles listing + individual articles:**
- `ItemList` on `/articles`
- `Article` on individual article pages

**All public pages:**
- `BreadcrumbList` for navigation hierarchy

---

## Phase 4 — Internal Linking Strategy

### 4.1 Hub Pages
Create or designate one hub page per major topic cluster:
- **Hub: גיל המעבר** — links to all symptom pages, articles, and tools
- **Hub: תסמינים** — aggregates all symptom-specific pages
- **Hub: כלים ותמיכה** — links to AI chat, journal, insights

Hub pages carry the highest domain authority signal and distribute it to leaf pages.

### 4.2 Breadcrumbs
Add visible breadcrumb navigation on all public pages (pairs with `BreadcrumbList` schema). Example: `דף הבית > תסמינים > ערפל מוחי`

### 4.3 Related Content Links
Add "מאמרים קשורים" or "קראי גם" sections to symptom and article pages, linking to topically related pages. Minimum 3 internal links per content page.

---

## Phase 5 — Content Gap Analysis

Runs after Search Console has 4–8 weeks of data.

### 5.1 Inputs
- Search Console: queries with impressions but low CTR (page 2+ rankings)
- Search Console: queries driving traffic with no dedicated page (opportunity)
- Manual review: competitor sites ranking for Hebrew menopause keywords

### 5.2 Outputs
- List of missing keyword topics → new page recommendations
- List of underperforming pages → metadata/content improvement tasks
- Cannibalization report: pages competing for the same keyword

### 5.3 New Content Criteria
A new page is justified if:
- Keyword has measurable search volume in Israel
- No existing page covers it as primary topic
- Fits the site's brand and Inbal's voice

---

## Implementation Order

```
Phase 1: robots.ts + sitemap.ts + metadataBase + OG defaults   (1–2 days)
         → Deploy + submit to Search Console

Phase 2: Keyword mapping doc + metadata for all tier 1 pages   (3–5 days)
         → Tier 2 + tier 3 pages

Phase 3: JSON-LD components per page type                      (2–3 days)

Phase 4: Hub pages + breadcrumbs + related content links       (2–3 days)

Phase 5: Content gap analysis (after 4–8 weeks of SC data)     (ongoing)
```

---

## Out of Scope

- Hreflang / multi-language (site is Hebrew-only for now)
- Page speed optimization (separate concern)
- Link building / off-page SEO
- Paid search / Google Ads
