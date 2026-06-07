---
name: story-pip-by-inbal
description: Creates a Picture-in-Picture Instagram Story (1080×1920px) for Inbal Daphna. Background image fills the screen, a smaller overlay image sits centered with a fuchsia border. Hook text above the frame, sub-hook below, footer at bottom. White text with black outline. Node.js + Playwright. Output saves to Desktop/CONTENT/CPX-story/pip and archives to Stories-Output.
---

# story-pip-by-inbal

Builds a Picture-in-Picture (PiP) Instagram Story (1080×1920, 9:16) as HTML/CSS rendered to PNG via Playwright.

**Always communicate with the user in Hebrew.**

---

## What it produces

- Background image: fills full screen (background-size: cover)
- Overlay/PiP image: centered, max-width 860px, with 8px fuchsia (#FF1493) border + glow
- Hook text: **above** the PiP frame — white, Heebo Black, black outline
- Sub-hook text: **below** the PiP frame — white, Heebo Bold, black outline
- Footer text: bottom of screen (above Instagram safe zone) — white, Heebo Bold, black outline
- Subtle dark overlay on background for text readability
- All text inside safe zones: top 260px, bottom 360px

---

## Inputs

1. **Background image** (full-screen) — path to JPG/PNG
2. **Overlay image** (PiP) — path to JPG/PNG (infographic, smaller photo, etc.)
3. **Hook text** — multiline, above the PiP frame
4. **Sub-hook text** — multiline, below the PiP frame
5. **Footer text** — 1 line, bottom strip

---

## The Process

### Step 1 — Check Playwright
```
node -e "require('playwright')" 
```
If not found: `cd <PROJECT_ROOT> && npm install playwright`

### Step 2 — Build and run

Write a Node.js build script to `Desktop/CONTENT/CPX-story/pip/build.js` (UTF-8).

Script must:
1. Read both images as base64 (`fs.readFileSync(path).toString('base64')`)
2. Read Heebo fonts from `<PROJECT_ROOT>\fonts\` as base64
3. Auto-increment version: check `pip-version-N` folders in output dir
4. Create `<PROJECT_ROOT>\content\Story posts\pip-version-N\`
5. Build the full HTML string with inline base64 images and fonts
6. Write HTML to `pip-version-N\story.html`
7. Launch Playwright Chromium, navigate to `file:///...story.html`
8. `waitForTimeout(2000)` for font render
9. Screenshot at 1080×1920 → save as `pip-version-N\story.png`

Run with:
```
node build.js
```
from the script's directory (uses absolute paths internally)

---

## Layout (flexbox column)

```
[slide 1080×1920]
  padding: 290px 60px 390px   ← safe zones (top 260+30, bottom 360+30)
  display: flex; flex-direction: column; align-items: center; justify-content: space-between

  ┌─────────────────┐
  │   HOOK TEXT     │  ← white + black stroke, ~52px, Heebo Black, multiline
  ├─────────────────┤
  │  ┌───────────┐  │
  │  │  PiP IMG  │  │  ← max-width 860px, border 8px #FF1493, border-radius 12px
  │  └───────────┘  │
  ├─────────────────┤
  │  SUB-HOOK TEXT  │  ← white + black stroke, ~40px, Heebo Bold, multiline
  ├─────────────────┤
  │  FOOTER TEXT    │  ← white + black stroke, ~36px, Heebo Bold
  └─────────────────┘
```

---

## CSS Template

```css
@font-face {
  font-family: 'Heebo';
  font-weight: 900;
  src: url('data:font/ttf;base64,HEEBO_BLACK_B64') format('truetype');
}
@font-face {
  font-family: 'Heebo';
  font-weight: 700;
  src: url('data:font/ttf;base64,HEEBO_BOLD_B64') format('truetype');
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body { width: 1080px; height: 1920px; overflow: hidden; background: #111; }

.slide {
  width: 1080px;
  height: 1920px;
  position: relative;
  overflow: hidden;
  direction: rtl;
  font-family: 'Heebo', sans-serif;
  background-image: url('data:image/jpeg;base64,BG_B64');
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 290px 60px 390px;
}

.slide::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.22);
  z-index: 0;
}

.hook-text, .pip-frame, .sub-hook, .footer {
  position: relative;
  z-index: 1;
}

.hook-text {
  font-weight: 900;
  font-size: 52px;
  line-height: 1.35;
  color: white;
  -webkit-text-stroke: 3px black;
  paint-order: stroke fill;
  text-align: center;
  direction: rtl;
  width: 100%;
}

.pip-frame {
  border: 8px solid #FF1493;
  border-radius: 12px;
  box-shadow: 0 0 40px rgba(255, 20, 147, 0.55);
  overflow: hidden;
  max-width: 860px;
  width: 860px;
  flex-shrink: 1;
}

.pip-frame img {
  width: 100%;
  height: auto;
  max-height: 600px;
  object-fit: contain;
  background: white;
  display: block;
}

.sub-hook {
  font-weight: 700;
  font-size: 40px;
  line-height: 1.4;
  color: white;
  -webkit-text-stroke: 2px black;
  paint-order: stroke fill;
  text-align: center;
  direction: rtl;
  width: 100%;
}

.footer {
  font-weight: 700;
  font-size: 36px;
  line-height: 1.2;
  color: white;
  -webkit-text-stroke: 2px black;
  paint-order: stroke fill;
  text-align: center;
  direction: rtl;
}
```

---

## Key Notes

- **Hebrew text**: embed directly in the JS string (Node.js uses UTF-8 by default). Use `\n` or `<br>` for line breaks in the HTML.
- **Fonts**: load from `<PROJECT_ROOT>\fonts\Heebo-Black.ttf` and `Heebo-Bold.ttf` as base64 — never from Google Fonts (may not load in Playwright file:// context)
- **Images**: always base64-encoded inline — never file:// references
- **Background**: MIME type `image/jpeg` or `image/png` based on file extension
- **Playwright launch**: `chromium.launch({ args: ['--font-render-hinting=none'] })` for crisp text

---

## Output

```
<PROJECT_ROOT>\content\Story posts\
└── pip-version-1\
    ├── story.html
    └── story.png
```

Single output folder only — no Desktop copy, no separate archive.

---

## After Render

Say: "הסטורי מוכן! רוצה לעשות שינויים?"

When done — delete `build.js` and `story.html`, keep only the `version-N/` folders.
