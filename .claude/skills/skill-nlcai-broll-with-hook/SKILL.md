---
name: skill-nlcai-broll-with-hook
description: Creates a broll reel video (1080x1920 MP4) for Hebrew-speaking students. Student provides a broll video and a hook line. Claude overlays animated white hook cards + black sub-hook pill using Playwright + ffmpeg, outputs MP4 with no audio. Communicates in Hebrew. Output saves to Desktop/CONTENT/CPX-broll.
---

# skill-students-broll-with-hook

Takes a broll video from the student's folder, overlays animated text cards (white hook cards + black sub-hook pill), and renders a finished 1080×1920 MP4 with no audio, ready to post.

**Always communicate with the student in Hebrew.**

---

## The Process

### Step 1 — Check installs, then greet

First, silently check if Playwright is already installed:
```bash
python3 -c "import playwright" 2>/dev/null && echo "installed" || echo "not installed"
```

**If already installed** — skip the install flow entirely. Say:
> "מעולה אני רואה שיש פה סקיל שמייצר ברולים. נראה טוב!"

Then go straight to Step 2.

**If NOT installed** — say:
> "מעולה אני רואה שיש פה סקיל שמייצר ברולים.
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

**3. Install Chromium (all OS):**
```bash
python3 -m playwright install chromium 2>/dev/null || python -m playwright install chromium
```

**4. Install ffmpeg (Mac/Linux):**
```bash
python3 -m pip install imageio-ffmpeg --break-system-packages 2>/dev/null || python3 -m pip install imageio-ffmpeg
```

**Install ffmpeg (Windows):**
```powershell
python -m pip install imageio-ffmpeg
```

Once all four complete with no errors — say:
> "אוקיי מעולה. סיימתי את כל ההתקנות."

Then immediately continue to Step 2.

---

### Step 2 — Get the folder (first time) or just the hook (returning)

**Check for saved folder** — look for `~/.student_broll_folder`:
```bash
cat ~/.student_broll_folder 2>/dev/null
```

**If folder is saved** — skip the folder question. Say:
> "יאלה בוא נייצר לך ברול!
>
> אני צריך ממך כמה דברים:
> 1) הוק — המשפט שיופיע על הברול
> 2) האם יש שורה שנייה להוק — או שזה שורה אחת בלבד? (אם יש — שלח אותה גם)"

**If no saved folder** — ask for both:
> "יאלה בוא נייצר לך ברול!
>
> אני צריך ממך כמה דברים:
> 1) נתיב לתיקייה עם הברול שלך — לדוגמה: /Users/שם/Desktop/הברולים שלי
>    (אני אסתכל על מה יש שם ואבחר או שתגיד לי איזה קובץ לקחת)
> 2) הוק — המשפט שיופיע על הברול
> 3) האם יש שורה שנייה להוק — או שזה שורה אחת בלבד? (אם יש — שלח אותה גם)"

After the student provides the folder path, save it:
```bash
echo "/path/from/student" > ~/.student_broll_folder
```

Only save if the student actually provided a path. If they skipped it, do not save — ask again next time.

Wait for the student to respond before proceeding.

**Folder handling:**
- Run `ls` on the folder and list `.mp4`, `.mov`, `.jpg`, `.jpeg`, `.png` files
- If the student picks a specific file — use it
- If not — pick the first `.mp4` or `.mov` file found
- If the folder doesn't exist or is empty — tell the student and ask again

השורה השחורה is always `פרטים בתיאור 👇` — never ask the student about it. Always call it **השורה השחורה** when talking to students, never "הפיל השחור".

**Second hook line:** If the student provides a second hook line, it goes into a second `.hook-card` div (separate white card below the first), with `<p>` styled `font-weight: 400; font-size: 44px; color: #1A1816; line-height: 1.3;`. If no second line — only show the first `.hook-card`.

**Orphan word prevention:** Never leave a single word alone on the last line of any text block in the hook card. Before finalizing hook_lines, check each line segment. If the last word would sit alone, add `<br>` before the last two words to pair them on one line.

---

### Step 3 — Build and run

No confirmation needed — build immediately once you have the broll file and hook.

**Before writing build.py**, check what folders already exist:
```bash
ls ~/Desktop/CONTENT/ 2>/dev/null
```
- If `CPX-broll` does not exist → use `CPX-broll`
- If it exists → use `CPX-broll_2`; if that also exists → `CPX-broll_3`, and so on
- Create the chosen folder: `mkdir -p ~/Desktop/CONTENT/{chosen-name}`
- Hardcode the chosen name as `DESKTOP` inside build.py

Write `build.py` into the chosen folder and run it immediately.

---

## How it works

Three steps:
1. **Playwright** renders 3 separate 1080×1920 transparent PNGs — one per animated element
2. **ffmpeg** scales+crops the broll video, composites all three overlays with time-based `enable` conditions
3. **Binary patch** zeroes out the tkhd rotation matrix so no player rotates the output

---

## Output format

- Size: **1080×1920** (9:16 vertical)
- Codec: `libx264 -preset fast -crf 18 -pix_fmt yuv420p`
- **No audio** (`-an`) — music is added manually in Instagram
- Frame rate: match source

---

## Animation timing defaults

| Element | Appears at |
|---|---|
| overlay1 — מלבן הוק ראשון | t = 0s (מהתחלה) |
| overlay2 — מלבן הוק שני | t = 2.5s |
| overlay3 — השורה השחורה | t = 5.0s |

---

## Step 1 — Render overlay PNGs (Playwright)

Render **three** separate transparent 1080×1920 PNGs. Each has the full layout (all three elements), but invisible elements use `opacity:0` so spacing is preserved.

```python
def build_html(rubik_css, hook_lines, second_hook, sub_hook, show_card1=True, show_card2=True, show_sub=True):
    card1_style = "" if show_card1 else ' style="opacity:0;"'
    card2_style = "" if show_card2 else ' style="opacity:0;"'
    sub_style   = "" if show_sub   else ' style="opacity:0;"'
    template = """<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<style>
RUBIK_CSS_PLACEHOLDER
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: transparent; display: flex; align-items: flex-start; padding: 0; }
.slide {
  width: 1080px; height: 1920px;
  display: flex; flex-direction: column;
  justify-content: flex-end; align-items: center;
  text-align: center; position: relative;
  direction: rtl; font-family: 'Rubik', sans-serif;
  background: transparent; padding: 40px 80px 90px;
}
.hook-card {
  background: #FFFFFF; border-radius: 24px;
  padding: 32px 48px; max-width: 860px; width: 100%;
  margin-bottom: 14px;
}
.hook-card h1 {
  font-weight: 700; font-size: 64px; line-height: 1.25;
  color: #1A1816; width: 100%;
}
.hook-card p {
  font-weight: 400; font-size: 44px; color: #1A1816; line-height: 1.3;
}
.sub-hook {
  background: #1A1816; color: #FFFFFF;
  font-family: 'Rubik', sans-serif; font-weight: 500; font-size: 42px;
  padding: 18px 48px; border-radius: 24px; margin-top: 0px;
  direction: rtl; display: inline-block;
}
</style>
</head>
<body>
<div class="slide">
  <div class="hook-card"CARD1_STYLE>
    <h1>HOOK_PLACEHOLDER</h1>
  </div>
  <div class="hook-card"CARD2_STYLE>
    <p>SECOND_HOOK_PLACEHOLDER</p>
  </div>
  <div class="sub-hook"SUB_STYLE>SUB_HOOK_PLACEHOLDER</div>
</div>
</body>
</html>"""
    result = template.replace("RUBIK_CSS_PLACEHOLDER", rubik_css)
    result = result.replace("CARD1_STYLE", card1_style)
    result = result.replace("CARD2_STYLE", card2_style)
    result = result.replace("SUB_STYLE", sub_style)
    result = result.replace("SUB_HOOK_PLACEHOLDER", sub_hook)
    result = result.replace("SECOND_HOOK_PLACEHOLDER", second_hook)
    result = result.replace("HOOK_PLACEHOLDER", hook_lines)
    return result
```

Call it three times:
```python
html1 = build_html(rubik_css, HOOK_LINES, SECOND_HOOK, SUB_HOOK, show_card1=True,  show_card2=False, show_sub=False)
html2 = build_html(rubik_css, HOOK_LINES, SECOND_HOOK, SUB_HOOK, show_card1=False, show_card2=True,  show_sub=False)
html3 = build_html(rubik_css, HOOK_LINES, SECOND_HOOK, SUB_HOOK, show_card1=False, show_card2=False, show_sub=True)
```

```python
async def render_overlay(html_path, out_path):
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1080, "height": 1920})
        await page.goto(html_path.as_uri())
        await page.wait_for_timeout(1000)
        await page.evaluate("""
            document.body.style.padding = '0';
            document.body.style.background = 'transparent';
            document.querySelector('.slide').style.background = 'transparent';
        """)
        await page.screenshot(
            path=str(out_path),
            clip={"x": 0, "y": 0, "width": 1080, "height": 1920},
            omit_background=True
        )
        await page.close()
        await browser.close()
    print(f"  {out_path.name} OK")
```

---

## Step 2 — Render video (ffmpeg)

Three overlays, two with time-based `enable`. No audio (`-an`).

```python
def render_video(broll_path, overlay1_path, overlay2_path, overlay3_path, out_path, card2_delay, sub_delay):
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    filter_complex = (
        "[0:v]transpose=2,scale=-2:1920,crop=1080:1920:(iw-1080)/2:0[v];"
        "[v][1:v]overlay=0:0[vv];"
        f"[vv][2:v]overlay=0:0:enable='gte(t,{card2_delay})'[vvv];"
        f"[vvv][3:v]overlay=0:0:enable='gte(t,{sub_delay})'[out]"
    )
    subprocess.run([
        ffmpeg, "-y",
        "-noautorotate",
        "-i", str(broll_path),
        "-i", str(overlay1_path),
        "-i", str(overlay2_path),
        "-i", str(overlay3_path),
        "-filter_complex", filter_complex,
        "-map", "[out]",
        "-an",
        "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p",
        "-map_metadata", "-1",
        str(out_path)
    ], check=True)
    clear_mp4_rotation(out_path)
    print(f"  {out_path.name} OK")
```

### Why `-noautorotate` + `transpose=2` + `clear_mp4_rotation`

Android phones (Xiaomi etc.) record landscape and store `displaymatrix: rotation of 90°` in the tkhd box. ffmpeg copies this side-data to output even with `-map_metadata -1`. Fix:
1. `-noautorotate` — don't let ffmpeg auto-rotate the input
2. `transpose=2` — manually rotate 90° CCW (puts head at top for this phone)
3. `clear_mp4_rotation()` — binary-patch the tkhd matrix to identity after render

```python
def clear_mp4_rotation(filepath):
    data = bytearray(Path(filepath).read_bytes())
    def walk(buf, start, end):
        pos = start
        while pos + 8 <= end:
            size = struct.unpack_from('>I', buf, pos)[0]
            btype = bytes(buf[pos+4:pos+8])
            if size < 8:
                break
            content = pos + 8
            if btype == b'tkhd':
                v = buf[content]
                matrix_off = content + (52 if v == 1 else 40)
                if matrix_off + 36 <= pos + size:
                    struct.pack_into('>9i', buf, matrix_off,
                        0x00010000, 0, 0,
                        0, 0x00010000, 0,
                        0, 0, 0x40000000)
                    print(f"  tkhd rotation cleared (v{v})")
            elif btype in (b'moov', b'trak'):
                walk(buf, content, pos + size)
            pos += size
    walk(data, 0, len(data))
    Path(filepath).write_bytes(bytes(data))
```

---

## Output — Desktop

```
Desktop/
└── CONTENT/
    └── CPX-broll/
        ├── build.py
        ├── overlay1.html / overlay1.png
        ├── overlay2.html / overlay2.png
        ├── overlay3.html / overlay3.png
        ├── version-1/
        │   └── broll.mp4
        ├── version-2/
        └── version-3/
```

```python
CONTENT_DIR = Path.home() / "Desktop" / "CONTENT"
CONTENT_DIR.mkdir(exist_ok=True)
DESKTOP = CONTENT_DIR / "CPX-broll"   # ← exact name set at write time

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

## Auto-Install (safety net in build.py)

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

def ensure_ffmpeg():
    try:
        import imageio_ffmpeg
        return
    except ImportError:
        pass
    if OS == "Windows":
        subprocess.run([sys.executable, "-m", "pip", "install", "imageio-ffmpeg"], check=True)
    else:
        subprocess.run([sys.executable, "-m", "pip", "install", "imageio-ffmpeg", "--break-system-packages"], check=True)

ensure_playwright()
ensure_ffmpeg()
```

---

## Preview After Render

**Windows:**
```python
os.startfile(str(out_dir / "broll.mp4"))
```

**Mac / Linux:**
```python
subprocess.Popen(["open", str(out_dir / "broll.mp4")])
```

**Do NOT delete build.py.** Keep it in `CPX-broll/` after the run — it will be deleted only after the student confirms they are done with all changes.

---

## After Render — Invite Changes

Once the video opens, say:

> "עכשיו מתחיל הכיף. יש איזשהם שינויים שנרצה לעשות בברול?
> גודל טקסט, מיקום, צבע — אני אזכור את השינויים שביקשת ואוסיף לסקיל ככה שהכל יעודכן לפעם הבאה."

When the student requests a change:
1. Write a fresh `build.py` with the changes and re-run immediately
2. Update the relevant default in this skill file

When the student confirms they are done (e.g. "אין", "טוב", "סגורים") — delete build.py from the chosen folder:
```bash
rm ~/Desktop/CONTENT/{chosen-folder-name}/build.py
```

---

## Common Failures

- **Overlay not transparent** — use `omit_background=True` in Playwright screenshot; set `.slide` background to transparent via JS before screenshot
- **Video wrong size** — `scale=-2:1920,crop=1080:1920` always, no exceptions
- **Video rotated / upside-down** — use `-noautorotate` + `transpose=2` + `clear_mp4_rotation()`. `transpose=1` is wrong for Xiaomi portrait videos — always use `transpose=2` (CCW)
- **Rotation metadata persists despite `-map_metadata -1`** — the displaymatrix is stream side-data, not container metadata. Must binary-patch the tkhd box
- **Font not loading** — check `~/.student_carousel_fonts/rubik_embedded.css` exists
- **build.py saved to /tmp** — always save to `Desktop/CONTENT/CPX-broll/build.py`
- **Hook text appears in the black pill** — always replace `SUB_HOOK_PLACEHOLDER` before `HOOK_PLACEHOLDER` in `.replace()` calls; never use f-strings in the HTML template
- **Windows Unicode error** — run with `$env:PYTHONUTF8 = "1"` before calling Python; use "OK" text not ✓ in print statements
- **Python not in PATH on Windows** — use full path: <PYTHON_EXE>
