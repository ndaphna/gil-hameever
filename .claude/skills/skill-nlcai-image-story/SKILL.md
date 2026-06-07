---
name: skill-nlcai-image-story
description: Creates a single static Instagram Story image (1080x1920px) for Hebrew-speaking students. Student provides a photo and hook text. Claude overlays text, renders to PNG via Playwright. Communicates in Hebrew. Output saves to Desktop/CPX-story and archives to Story posts folder.
---

# skill-nlcai-image-story

Builds a single static Instagram Story image (1080×1920, 9:16) as HTML/CSS rendered to PNG via Playwright.

**Always communicate with the student in Hebrew.**

Companion to `skill-nlcai-image-static` (feed posts, 1080×1350).

---

## The Process

### Step 1 — Check installs

Silently verify Playwright is installed. If not, install it (see skill-nlcai-image-static for install steps).

### Step 2 — Get content

Check for saved folder: `~/.student_image_folder`

Ask the student for:
1. Photo (or pick from saved folder)
2. Hook text (top of story, large)
3. Sub-hook text (bottom of story, smaller pill) — optional, default: `פרטים בתיאור`

### Step 3 — Build and run

**IMPORTANT — Hebrew text encoding:**
Write hook text to `hook.txt` in the output folder (pipe `|` as line separator), then read from build.py. This avoids Windows cp1255 console encoding crashes.

hook.txt format:
```
שורה ראשונה|שורה שנייה|שורה שלישית
שורת סאב-הוק ראשונה|שנייה|שלישית
```

---

## Design Rules

- **Size**: 1080×1920 (9:16 Instagram Story)
- **Safe zone top**: 260px (Instagram profile bar)
- **Safe zone bottom**: 360px (Instagram reply bar)
- **Hook**: positioned at top (below safe zone), fuchsia #FF1493, black outline, no background card
- **Sub-hook**: positioned at bottom (above safe zone), semi-transparent fuchsia pill, white text
- **Center of image is kept clear** so the subject (photo) is visible
- **Background**: photo as base64, `background-size: 115%` to push dark edges out of frame

---

## Output

```
Desktop/CONTENT/CPX-story/
├── build.py
├── hook.txt          ← Hebrew text source (avoids encoding issues)
├── story.html
└── version-1/
    └── story.png
```

Archive copy: `<PROJECT_ROOT>\content\Story posts\version-N\story.png`

---

## CSS

```css
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  background: #111;
  display: flex;
  align-items: flex-start;
  padding: 40px;
}

.slide {
  width: 1080px;
  height: 1920px;
  position: relative;
  overflow: hidden;
  direction: rtl;
  font-family: 'Rubik', sans-serif;
  background-image: url('DATA_URI');
  background-size: 115%;
  background-position: center;
}

/* Hook — fuchsia with black outline, top of story */
.hook-text {
  position: absolute;
  top: 260px;
  left: 90px;
  right: 90px;
  font-weight: 700;
  font-size: 72px;
  line-height: 1.3;
  color: #FF1493;
  -webkit-text-stroke: 4px black;
  paint-order: stroke fill;
  text-align: center;
  direction: rtl;
}

/* Sub-hook — semi-transparent fuchsia pill, bottom of story */
.sub-hook {
  position: absolute;
  bottom: 360px;
  left: 50%;
  transform: translateX(-50%);
  width: fit-content;
  max-width: 860px;
  background: rgba(255, 20, 147, 0.28);
  color: #FFFFFF;
  font-family: 'Rubik', sans-serif;
  font-weight: 500;
  font-size: 38px;
  padding: 16px 48px;
  border-radius: 24px;
  direction: rtl;
  text-align: center;
  line-height: 1.4;
}
```

HTML structure:
```html
<div class="slide">
  <div class="hook-text">HOOK</div>
  <div class="sub-hook">SUB_HOOK</div>
</div>
```

---

## Key build.py Patterns

```python
# Read Hebrew text from hook.txt (avoids Windows encoding crash)
lines    = (DESKTOP / "hook.txt").read_text(encoding="utf-8").splitlines()
HOOK     = "<br>".join(lines[0].split("|"))
SUB_HOOK = "<br>".join(lines[1].split("|"))

# Render at story dimensions
page = await browser.new_page(viewport={"width": 1080, "height": 1920})
await page.screenshot(path=str(out), clip={"x": 0, "y": 0, "width": 1080, "height": 1920})

# Archive copy
STORY_POSTS = Path(r"<PROJECT_ROOT>\content\Story posts")
STORY_POSTS.mkdir(parents=True, exist_ok=True)
dest = STORY_POSTS / result.parent.name
dest.mkdir(exist_ok=True)
shutil.copy2(str(result), str(dest / "story.png"))
```

---

## After Render

Say: "עכשיו מתחיל הכיף. יש שינויים שנרצה לעשות?"

When done (student says "אין", "טוב", "סגורים") — delete build.py, hook.txt, story.html from CPX-story.

---

## Common Failures

- **Hebrew garbled in Python strings** — always write Hebrew to hook.txt and read from file; never embed Hebrew in Python string literals
- **Text covers the subject** — keep hook at top (260px), sub-hook at bottom (360px from bottom)
- **Safe zone violations** — top 260px and bottom 360px offsets cover Instagram UI areas
- **Black borders** — use `html_path.as_uri()`, never `f"file://..."`
- **Dark photo edges** — `background-size: 115%`, never `cover`
