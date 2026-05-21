# DESIGN.md — Gil HaMeever Brand Design System

**Source of truth** for visual language. Brand reference HTML: [design/brand-design-system.html](design/brand-design-system.html).

This system replaces the legacy magenta/purple-gradient + Assistant-only design with a **dark editorial luxe** language: deep wine-black backgrounds, fuchsia primary, gold accents, three-font hierarchy.

---

## Aesthetic Direction

**Editorial Dark Luxe.** Inspired by premium women's print magazines (Vogue, Harper's Bazaar Hebrew editions). Feminine, mature (50+), authoritative, intimate. Not "playful pink" — confident, refined, with weight.

- Backgrounds: deep wine-black `#1A0A12` for hero sections + cream `#FBF6F0` for editorial spreads, white only when content needs maximum air.
- Accents: fuchsia primary for action, gold for prestige/quotes, never together at full strength.
- Mood: warm, intimate, premium. No "cheerful pink gradients" — those read as juvenile.

---

## Color Palette (locked)

```css
/* Primary — Fuchsia */
--brand-fuchsia:       #D4167A;  /* CTAs, accents, key highlights */
--brand-fuchsia-dark:  #9E0F5B;  /* hover states, deep accents */
--brand-fuchsia-light: #F7C5DF;  /* soft backgrounds, tints */

/* Secondary — Gold */
--brand-gold:       #C4922A;     /* badges, premium markers, quote glyphs */
--brand-gold-light: #E8C97A;     /* text on dark backgrounds */
--brand-gold-pale:  #F5EDD8;     /* warm tinted backgrounds */

/* Neutrals — Dark */
--brand-black: #1A0A12;          /* primary dark, hero backgrounds */
--brand-dark:  #2C1420;          /* secondary dark, subtle layering */

/* Neutrals — Light */
--brand-cream:     #FBF6F0;      /* warm body backgrounds */
--brand-white:     #FFFFFF;
--brand-warm-gray: #8C7882;      /* meta text, captions */
```

**60-30-10 rule:** 60% neutral (dark/cream/white) · 30% secondary (cream/gold tints) · 10% fuchsia accent. Fuchsia is the spice — 1–3 instances per visible viewport, never more.

---

## Typography (3-font system, locked)

| Role | Font | Use |
|---|---|---|
| **Display** (oversized headlines, hero) | `Secular One` 64–96px | Once per page, max. The headline that defines the moment. |
| **Headings + Body** (H1/H2/H3, paragraphs, CTA, captions) | `Heebo` 12–48px, weights 300/400/700/800/900 | The workhorse — 95% of text. |
| **Literary** (quotes, sub-eyebrows, signatures, FAQ stems) | `Frank Ruhl Libre` 13–24px, weights 300/400/500 italic | Editorial moments only. Light weight (300) is the signature look. |

**4–5 sizes per page maximum** (per design-triggers skill):

| Role | Size | Weight |
|---|---|---|
| Eyebrow/Caption | 11–13px | 700 + uppercase + letter-spacing 2–3px |
| Body | 16px | 400 |
| Lead / Subhead | 20–24px | 400–500 (or Frank Ruhl 300 italic for quotes) |
| H2 / Section Header | 28–42px | 700–900 Heebo |
| Display / H1 | 44–80px | 900 Heebo (or Secular One for "moment" headlines) |

**Hebrew rule:** never italic on Hebrew body text. Italic reserved for Latin/transliterated terms or Frank Ruhl literary moments where it reads as intentional editorial.

---

## Spacing (8-point grid)

All spacing in multiples of 4: `4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 56 · 64 · 80`.

Section vertical rhythm: 48–80px mobile, 80–120px desktop. Margin between elements = 1.5× margin inside elements (Gestalt proximity).

---

## Component Library

**Component reuse is mandatory** (design-triggers rule 9). Build once, use everywhere.

### Cards
- Base: cream/white background, 14–20px radius, **4px right border** in fuchsia/gold/black to signal category.
- Hover: `translateY(-4px)` + shadow lift, 300ms `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- Max 2 card variants per page.

### Buttons
Two variants only:
- **Primary:** filled fuchsia background, white text, 32px radius (pill), 14–15px Heebo 800, ≥52px touch target. Idle gold glow ring on hero CTAs (`box-shadow: 0 0 22px rgba(196,146,42,0.45)`).
- **Ghost/Secondary:** transparent + 1.5px fuchsia border, fuchsia text. Same dimensions.

One primary per section, max.

### Eyebrows
Single style — 11px Heebo 700 uppercase, letter-spacing 2–3px, gold color on dark / warm-gray on light. Reused across every section.

### Badges
Pill shape, gold-pale background `#F5EDD8`, gold text `#C4922A`, 9–11px Heebo 700 uppercase, letter-spacing 1–2px.

### Quote marks
Frank Ruhl Libre `"` glyph at 80px, fuchsia, opacity 0.6, positioned absolute.

---

## Motion (design-triggers rule 11)

GPU-only (`transform` + `opacity`). Honor `prefers-reduced-motion`.

- **Entry:** `opacity: 0 → 1` + `translateY(24px → 0)`, 600–800ms, easing `cubic-bezier(0.2, 0.8, 0.2, 1)`, stagger 80–120ms in grids. Once per element.
- **Hover:** cards `translateY(-4px)` + shadow, buttons `scale(1.02)` + brightness, 200–300ms.
- **Idle:** one element per section max. Primary hero CTA gets gold pulse ring (3–5s loop). Subtle gradient drift on dark hero backgrounds (40s+ loop).

**Forbidden:** parallax, auto-scroll, loop-everywhere animations, easing `linear`, anything > 1s.

---

## Foundation Patterns

### Hero (`above-the-fold`)
- Background: deep dark `#1A0A12` with subtle radial fuchsia glow, OR layered gradient `145deg #2C1420 0% #1A0A12 100%`.
- Eyebrow (gold, uppercase, 11px) → Display headline (Secular One or Heebo 900) → 1-line Frank Ruhl 300 italic subhead → primary CTA with gold glow.
- One focus only (design-triggers rule 10).

### Editorial Section (content cards)
- Background: cream `#FBF6F0` or white.
- Card right border 4px to signal category — fuchsia (primary), gold (premium), black (editorial).
- Heebo Black 18px title → warm-gray 13px body.

### Member Area
Same brand language, lower contrast. Sidebar uses dark `#2C1420` with gold-light text + fuchsia active state. Content area cream/white with same card system.

---

## Anti-Patterns (forbidden)

- ❌ Magenta-to-purple gradients (legacy look)
- ❌ Pure white backgrounds for hero sections
- ❌ More than 2 font families per page (Secular One + Heebo, or Heebo + Frank Ruhl — never all three loud)
- ❌ Italic on Hebrew body text
- ❌ Drop shadows on everything
- ❌ More than 3 colors per section
- ❌ Animation on `width`/`height`/`top`/`left`/`color`/`shadow`
- ❌ Stock photos of women in pink hugging themselves (replace with editorial photography only)

---

## Implementation Notes

- All tokens land in `src/styles/variables.css` (replace existing `--color-primary`/`--color-secondary` aliases).
- Page-level CSS continues to use the `lock font + descendants inherit` pattern from `about.css`.
- Admin area (`src/app/admin/_design/`) keeps its separate token system — out of scope.
- Aliza chat / journal / insights inside member area get the same brand application but with lower-contrast variants.

---

## Workflow

For every new design/redesign:
1. Read this file + brand reference HTML.
2. Read `design-triggers` skill (router → format-specific file).
3. Apply 6 triggers checklist before declaring done.
4. Verify in browser at mobile + desktop.
