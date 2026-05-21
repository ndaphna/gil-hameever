# Next Session Handoff — Phase 2 (continued)

**Closed:** 2026-05-21
**Status of `/`:** rebuilt and live at `http://localhost:3001/`
**Phase 2 progress:** Home `/` done · `/about`, `/pricing`, `/menopause-roadmap` pending

---

## Start here

1. `npm run dev` (port 3001 if 3000 is taken)
2. Open `http://localhost:3001/` — current home
3. If you want to remember the *design intent*: open [`design/preparation-preview.html`](preparation-preview.html) in a browser
4. If you want to touch copy or write a section from scratch: read [`About Me/inbal-character.md`](../About%20Me/inbal-character.md) and [`About Me/inbal-style-guide.md`](../About%20Me/inbal-style-guide.md) first

---

## What was decided in the last session

| Question | Answer |
|---|---|
| Home page page-order | 11 sections per [`design/strategic-brief.md`](strategic-brief.md) (Hero → Pain → Big Idea → Three Worlds → Meet Inbal → Book → Roadmap → Aliza → Articles → Newsletter → Footer) |
| Hero copy | **Variant B**: "את לא משתגעת. את במעבר." |
| Hero background | **Light cream** (Tamsen-style), photo bleeds edge-to-edge |
| Photo style | Inbal upscaled 4× + background removed (transparent PNG), positioned bottom |
| Hand-drawn accents in Hero | Scribble underline ✓ · Gold pulse ring ✓ · Hearts ✗ (decided against) |
| Animation discipline | Subtle, GPU-only, `prefers-reduced-motion` honored |
| Aliza assets | 28 illustrations in `public/aliza/` with semantic English names |

---

## Open decisions (not yet answered)

### 1. Funnel order
The current `/` follows the brief's order. There was an aggressive alternative: push the Roadmap CTA earlier (after Three Worlds, before Meet Inbal). Defers the "who's writing this?" moment in exchange for earlier conversion. **Defer to live data — leave as-is until we see scroll-depth and CTR.**

### 2. Section-by-section QA
The home page was built from the approved draft but **was not reviewed section-by-section on the real site**. Each section's spacing, image scale, and rhythm needs eyes on it (especially on mobile).

### 3. Aliza visual integration
The Aliza section currently shows 3 quote cards on `--brand-fuchsia-light`. There are 28 illustrations available — none are used yet in the live `/`. Question for next session: do we add an Aliza illustration to the Aliza section, the Three Worlds card, or save them for `/about`, blog, and ads?

---

## Known issues / debt

- **Mobile not verified.** Only desktop was checked via curl. Need a real mobile test.
- **CLS may still be elevated** — the legacy `.hero::before` animation was bypassed by renaming to `.home-hero`, but `next/image` with `fill` can shift if the container reserves less space than the image needs. Worth a Lighthouse pass.
- **`public/inbal-hero.png` is 3.4MB** — transparent PNG, can't be JPG. Next.js Image will optimize for delivery, but the source file is heavy. Acceptable for now.
- **`public/aliza/` is ~80MB** — 28 PNGs at 2-3MB each. Vercel will serve them fine but git operations will be slow. Convert to WebP before next deploy if we hit a problem.
- **Global `.hero` rule in `globals.css`** still exists (lines 309-317) — it's used by `/menopause-roadmap` and probably elsewhere. When we rebrand those pages, kill the global rule.
- **TypeScript errors exist in `backup/` and unrelated routes** — none are regressions from this session. Pre-existing.

---

## Next session targets (in order of impact)

### Pass 1 — Finish the home page properly
- Section-by-section QA on the live site (desktop + mobile + real phone)
- Lighthouse + Core Web Vitals check
- Fix anything that breaks the rhythm

### Pass 2 — `/pricing` (highest leverage, lowest current quality)
The current page is 30 lines of Tailwind placeholder. Build from scratch using the same token system. Probably 3 tiers + a "what's included" matrix. Pull copy from the brief's tone-shift table.

### Pass 3 — `/about`
Already has tokens. Needs the brief's "Meet Inbal" treatment expanded — the current `/about` is a thin product page, not the deep story the brand needs. See [`design/strategic-brief.md`](strategic-brief.md) section "The four needs the site serves" for what `/about` should anchor to.

### Pass 4 — `/menopause-roadmap`
Already a 413-line client. Decide if it needs rebuilding or just polish. Recent commits already applied tokens. Probably just visual QA + photo integration.

---

## Source-of-truth map

| What | Where |
|---|---|
| Brand design system | [`DESIGN.md`](../DESIGN.md) |
| Page-level strategic brief | [`design/strategic-brief.md`](strategic-brief.md) |
| Approved home copy | [`design/home-copy-draft.md`](home-copy-draft.md) |
| Visual reference (approved preview) | [`design/preparation-preview.html`](preparation-preview.html) |
| Inbal's voice corpus | [`About Me/inbal-character.md`](../About%20Me/inbal-character.md) + [`About Me/inbal-style-guide.md`](../About%20Me/inbal-style-guide.md) |
| Tokens | [`src/styles/variables.css`](../src/styles/variables.css) (`--brand-*`) |
| Current home code | [`src/app/home-client.tsx`](../src/app/home-client.tsx) + [`src/app/home.css`](../src/app/home.css) |
| Inbal photos | `public/inbal-*.{jpg,png}` (6 files) |
| Aliza illustrations | `public/aliza/*.{png,jpg}` (28 files) |

---

## Workflow reminders (from this session)

- **Never rewrite copy without asking.** Voice changes go through Nitzan first.
- **One primary CTA per section.** Multiple primaries cancel each other.
- **No em-dashes.** Commas, periods, or short dashes only ([`writingrules.md`](../About%20Me/writingrules.md)).
- **No "גיל הבלות".** Always "גיל הַמֵעֵבֶר".
- **Aliza injection only where humor works.** Big Idea + Meet Inbal stay clean.
- **`.home .selector` for safety.** Global CSS in this repo has legacy rules — scope new styles or rename classes.
