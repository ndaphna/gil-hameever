---
name: skill-nlcai-image-static
description: Creates a single static Instagram image (1080x1350px) for Hebrew-speaking students. Student provides a photo and a hook line. Claude overlays the text, renders to PNG via Playwright. Communicates in Hebrew. Output saves to Desktop/CPX.
---

# skill-nlcai-image-static

Builds a single static Instagram image as HTML/CSS rendered to PNG via Playwright.
The student provides a photo and a hook line. Claude handles the rest.

**Always communicate with the student in Hebrew.**

---

## The Process

### Step 1 — Check installs, then greet

First, silently check if Playwright is already installed:
```bash
python3 -c "import playwright" 2>/dev/null && echo "installed" || echo "not installed"
```

**If already installed** — skip the install flow entirely. Say:
> "מעולה אני רואה שיש פה סקיל שמייצר תמונות לאינסטגרם. נראה טוב!"

Then go straight to Step 2.

**If NOT installed** — say:
> "מעולה אני רואה שיש פה סקיל שמייצר תמונות לאינסטגרם.
> נראה טוב!
> תן לי כמה דקות אני צריך קודם לעשות כמה התקנות כדי לוודא שהכל יעבוד."

Then immediately run all installs — do not wait for the student to reply.

**1. Check Python:**
```bash
python3 --version 2>/dev/null || python --version 2>/dev/null
```

If Python is NOT found:

Mac:
```bash
/usr/bin/python3 --version
```
Python ships with macOS — will always work. If somehow missing:
```bash
xcode-select --install
```

Windows:
```powershell
winget install -e --id Python.Python.3.12 --silent --accept-package-agreements --accept-source-agreements
```

**→ Windows Python install requires a restart.** If this happened, say:
> "אוקיי מעולה. סיימתי את כל ההתקנות.
> אני צריך שנייה אחת שתעשה לי ריסטארט של המחשב כדי לוודא שהכל הותקן כמו שצריך."

Wait for the student to confirm restart and reopen Claude Code, then continue the installs below.

**2. Install Playwright (Mac/Linux):**
```bash
python3 -m pip install playwright --break-system-packages 2>/dev/null || python3 -m pip install playwright
```

**Install Playwright (Windows):**
```powershell
python -m pip install playwright
```

**3. Install Chromium browser (all OS):**
```bash
python3 -m playwright install chromium 2>/dev/null || python -m playwright install chromium
```

Once all three complete with no errors — say:
> "אוקיי מעולה. סיימתי את כל ההתקנות."

Then immediately continue to Step 2.

---

### Step 2 — Get the folder (first time) or just the hook (returning)

**Check for saved folder** — look for `~/.student_image_folder`:
```bash
cat ~/.student_image_folder 2>/dev/null
```

**If folder is saved** — skip the folder question. Say:
> "יאלה בוא נייצר לך תמונה סטטית!
>
> אני צריך ממך:
> 1) שורת ההוק שתרצה לשים על התמונה
> 2) אם יש לך שורה נוספת שתרצי לשים מתחת (השורה השחורה) — תגידי לי. אם לא, אני אכניס משהו כללי"

**If no saved folder** — ask for all three:
> "יאלה בוא נייצר לך תמונה סטטית.
> אני צריך ממך:
>
> 1) תמונה להשתמש בה או שם של תיקייה שבה יש את כל התמונות שלך (ספריית מדיה) שממנה אוכל לבחור תמונה בעצמי
> 2) שורת ההוק שתרצי לשים על התמונה
> 3) אם יש לך שורה נוספת לשים מתחת (השורה השחורה) — תגידי לי. אם לא, אני אכניס משהו כללי"

After the student provides the folder, save it:
```bash
echo "/path/from/student" > ~/.student_image_folder
```

**השורה השחורה (sub-hook):** if the student provided a second line — use it. If not — default to `* פרטים בתיאור`. Always call it **השורה השחורה** when talking to students, never "הפיל השחור".

**Student terminology mapping:**
- "שורת ההוק הראשונה" = the white card (hook text, h1)
- "שורת ההוק השנייה" = the black pill (sub-hook, `.sub-hook`)

Wait for the student to respond before proceeding.

**Photo handling:**
- Search for the folder using: `find ~ -maxdepth 8 -type d -name "[folder name]" 2>/dev/null | head -1`
- This finds the folder anywhere — Desktop, Google Drive, Documents, iCloud, etc.
- List the image files found (`.jpg`, `.jpeg`, `.png`)
- If the student specified an image name → use it
- If not → pick one at random from the folder
- If the folder is not found → ask the student where it is

---

### Step 3 — Build and run

No confirmation needed — build immediately once you have the photo and hook.

**Before writing build.py**, check what folders already exist:
```bash
ls ~/Desktop/CONTENT/ 2>/dev/null
```
- If `CPX-image` does not exist → use `CPX-image`
- If it exists → use `CPX-image_2`; if that also exists → `CPX-image_3`, and so on
- Create the chosen folder: `mkdir -p ~/Desktop/CONTENT/{chosen-name}`
- Hardcode the chosen name as `DESKTOP` inside build.py

Write `build.py` into the chosen folder and run it immediately.

---

## Design Rules

Layout matches the reference design:
- Background fills the full slide (photo or color)
- Content sits in the **center** of the slide
- **Hook**: fuchsia (#FF1493) text directly on the photo — NO white card background. White outline stroke around letters using `-webkit-text-stroke` + `paint-order: stroke fill`
- **Sub-hook**: fuchsia pill with 70% opacity (`rgba(255,20,147,0.70)`) — transparent so photo shows through, white text. Multi-line centered.
- **Size**: always 1080×1350px (4:5 Instagram feed ratio)
- **Safe zone**: `padding: 108px 90px` on `.slide` — keeps all text within Instagram safe zone on both mobile and desktop

## After Render — Copy to Archive

After every render, copy the output image to the image posts archive:
```python
IMAGE_POSTS = Path(r"<PROJECT_ROOT>\content\Image posts")
IMAGE_POSTS.mkdir(parents=True, exist_ok=True)
dest = IMAGE_POSTS / result.parent.name   # e.g. "version-2"
dest.mkdir(exist_ok=True)
shutil.copy2(str(result), str(dest / "image.png"))
```
Always import `shutil` at the top of build.py.

---

## Photo Handling

Encode the photo as base64 and embed directly in the HTML:

```python
from pathlib import Path
import base64

def b64(path):
    path = Path(path)
    ext = path.suffix.lstrip(".").lower()
    mime = "jpeg" if ext in ("jpg", "jpeg") else "png"
    return "data:image/" + mime + ";base64," + base64.b64encode(path.read_bytes()).decode()
```

Use `background-size: 115%` not `cover` — the extra zoom pushes dark photo edges out of frame.

If no photo provided — use `background: #F2F2F2` (light grey default).

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
  height: 1350px;
  padding: 108px 90px;   /* 108px = Instagram safe zone top/bottom */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  direction: rtl;
  font-family: 'Rubik', sans-serif;
  background-image: url('DATA_URI');
  background-size: 115%;
  background-position: center;
}

/* Hook text — fuchsia with white outline, no card background */
.hook-text {
  font-weight: 700;
  font-size: 72px;
  line-height: 1.3;
  color: #FF1493;
  -webkit-text-stroke: 4px white;
  paint-order: stroke fill;
  text-align: center;
  direction: rtl;
  max-width: 860px;
  width: 100%;
}

/* Sub-hook pill — semi-transparent fuchsia, pinned to bottom, wraps text */
.sub-hook {
  position: absolute;
  bottom: 108px;
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
  <div class="hook-text">הטקסט של ההוק כאן</div>
  <!-- only if student provided sub-hook: -->
  <div class="sub-hook">הסאב-הוק כאן</div>
</div>
```

**Student terminology mapping (updated):**
- "שורת ההוק הראשונה" / "הטקסט הגדול" = `.hook-text` (fuchsia, no background)
- "שורת ההוק השנייה" / "השורה הוורודה" = `.sub-hook` (semi-transparent fuchsia pill)

**Windows encoding note:** Do NOT use raw emoji or ✓ in `print()` statements — Windows console (cp1255) will crash. Use ASCII-only print strings. For emoji inside HTML, use HTML entities: `⬇️` = `&#11015;&#65039;`

---

## Rubik Font — Local Cache

```python
import urllib.request, re, base64
from pathlib import Path

FONT_DIR = Path.home() / ".student_carousel_fonts"

def get_rubik_css():
    cache = FONT_DIR / "rubik_embedded.css"
    if cache.exists():
        return cache.read_text()
    print("מוריד פונט Rubik — פעם אחת בלבד...")
    FONT_DIR.mkdir(exist_ok=True)
    req = urllib.request.Request(
        "https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap",
        headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"}
    )
    css = urllib.request.urlopen(req).read().decode()
    def embed_font(m):
        data = urllib.request.urlopen(m.group(1)).read()
        return f"url('data:font/woff2;base64,{base64.b64encode(data).decode()}')"
    css_embedded = re.sub(r"url\((https://[^)]+)\)", embed_font, css)
    cache.write_text(css_embedded)
    print("פונט Rubik נשמר מקומית ✓")
    return css_embedded
```

Shared cache with the carousel skill — if the student already used `skill-students-carousel-static`, the font is already downloaded.

---

## Auto-Install Playwright (safety net in build.py)

```python
def ensure_playwright():
    try:
        from playwright.async_api import async_playwright
        return
    except ImportError:
        pass
    if OS == "Windows":
        subprocess.run([sys.executable, "-m", "pip", "install", "playwright"], check=True)
    else:
        subprocess.run([sys.executable, "-m", "pip", "install", "playwright", "--break-system-packages"], check=True)
    subprocess.run([sys.executable, "-m", "playwright", "install", "chromium"], check=True)

ensure_playwright()
from playwright.async_api import async_playwright
```

---

## Output — Desktop

```
Desktop/
└── CONTENT/
    └── CPX-image/
        ├── build.py
        ├── image.html
        ├── version-1/
        │   └── image.png
        ├── version-2/
        └── version-3/
```

```python
CONTENT_DIR = Path.home() / "Desktop" / "CONTENT"
CONTENT_DIR.mkdir(exist_ok=True)
# DESKTOP is set by Claude at write time — may be CPX-image, CPX-image_2, etc.
DESKTOP = CONTENT_DIR / "CPX-image"   # ← exact name set at write time (never created here — already exists)

def next_version_folder():
    existing = [d for d in DESKTOP.iterdir() if d.is_dir()]
    nums = []
    for d in existing:
        parts = d.name.split("-")
        if len(parts) == 2 and parts[0] == "version" and parts[1].isdigit():
            nums.append(int(parts[1]))
    next_num = max(nums, default=0) + 1
    folder = DESKTOP / f"version-{next_num}"
    folder.mkdir()
    return folder
```

---

## Rendering

```python
import asyncio

async def render(html_path, out_dir):
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1080, "height": 1350})
        await page.goto(html_path.as_uri())
        await page.wait_for_timeout(1000)
        await page.evaluate("""
            document.body.style.padding = '0';
            document.body.style.background = 'transparent';
        """)
        out = out_dir / "image.png"
        await page.screenshot(
            path=str(out),
            clip={"x": 0, "y": 0, "width": 1080, "height": 1350}
        )
        print("  image.png ✓")
        await page.close()
        await browser.close()

asyncio.run(render(html_path, out_dir))
```

---

## Preview After Render

**Mac / Linux:**
```python
subprocess.Popen(["open", str(out_dir / "image.png")])
```

**Windows:**
```python
os.startfile(str(out_dir / "image.png"))
```

**Do NOT delete build.py.** Keep it in `CPX-image/` after the run — it will be deleted only after the student confirms they are done with all changes.

---

## After Render — Invite Changes

Once the image opens, say:

> "עכשיו מתחיל הכיף. יש איזשהם שינויים שנרצה לעשות בתמונה?
> גודל טקסט, מיקום, צבע — אני אזכור את השינויים שביקשת ואוסיף לסקיל ככה שהכל יעודכן לפעם הבאה."

When the student requests a change:
1. Write a fresh `build.py` with the changes and re-run immediately
2. Update the relevant default in this skill file so the next image starts with those preferences

When the student confirms they are done (e.g. "אין", "טוב", "סגורים") — delete build.py from the chosen folder:
```bash
rm ~/Desktop/CONTENT/{chosen-folder-name}/build.py
```

---

## Common Failures

- **Black borders** — use `html_path.as_uri()`, never `f"file://{html_path}"`. Render at exact 1080×1350 viewport.
- **Dark edges on photo** — use `background-size: 115%`, never `cover`
- **Text hard to read** — `text-shadow: 0 2px 8px rgba(0,0,0,0.65)` on all text. Never outline.
- **build.py saved to /tmp** — always save to `CPX/build.py` on Desktop
- **Font not loading** — check `~/.student_carousel_fonts/rubik_embedded.css` exists
