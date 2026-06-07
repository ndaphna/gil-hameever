---
name: reel-for-instagram-by-inbal
description: יוצר ריל אינסטגרם (1080×1920 MP4, ללא אודיו) מוידאו גולמי. מחלץ קליפים, מגביר מהירות, מוסיף טקסט עברי בפונט Gisha Bold עם הדגשות פוקסיה, עם מעברים ו-color grade. Stack: Node.js + Playwright + FFmpeg.
---

# Reel for Instagram — Hebrew RTL Text Overlay

יוצר ריל מוגמר לאינסטגרם מוידאו גולמי.  
תמיד מתקשר עם המשתמשת **בעברית**.

---

## תנאים מוקדמים

- **Node.js** מותקן (`node --version`)
- **FFmpeg** מותקן ונגיש ב-PATH (`ffmpeg -version`)
- **Playwright** — אם חסר: `npm install playwright` מתיקיית הפרויקט
- **פונט Gisha Bold** — `C:\Windows\Fonts\gishabd.ttf` (קיים בWindows)

---

## הגדרת נתיבים לפני כל שימוש

**בתחילת כל שימוש בסקיל — שאלי את המשתמשת:**
1. מה הנתיב לתיקיית הפרויקט? (PROJECT_ROOT)
2. מה שם קובץ הוידאו הגולמי?
3. מה הטקסט לכל קליפ?

> **ברירת מחדל מומלצת:** תיקיית Google Drive המשותפת.  
> ניתן לסנכרן אותה מ: [https://drive.google.com/drive/folders/1sIXqKmT4xpWbrAZWWz5ogmB9FlTwb21e](https://drive.google.com/drive/folders/1sIXqKmT4xpWbrAZWWz5ogmB9FlTwb21e)

---

## המבנה הטכני

### נתיבים (לפי PROJECT_ROOT שהמשתמשת תציין)

```
Input:   <PROJECT_ROOT>/Raw material videos/<שם הסרטון>.mp4
OutDir:  <PROJECT_ROOT>/content/reels/
Temp:    <PROJECT_ROOT>/Reels/temp_<שם>/
Script:  <PROJECT_ROOT>/<שם>_reel.js
```

### Stack

| כלי | שימוש |
|-----|-------|
| **FFmpeg** | חיתוך, speedup, overlay, concat, color grade |
| **Node.js + Playwright** | רינדור HTML→PNG שקוף לטקסט עברי RTL |
| **Gisha Bold** | פונט עברי — `C:\Windows\Fonts\gishabd.ttf` |

---

## מבנה הסקריפט

```javascript
const { chromium } = require('playwright');
const { execSync } = require('child_process');
const fs = require('fs');

const PROJECT_ROOT = '<PROJECT_ROOT>';  // ← מחליפים בנתיב שהמשתמשת ציינה
const INPUT   = `${PROJECT_ROOT}/Raw material videos/<FILE>.mp4`;
const OUT_DIR = `${PROJECT_ROOT}/content/reels`;
const TEMP    = `${PROJECT_ROOT}/Reels/temp_<NAME>`;
const OUTPUT  = `${OUT_DIR}/<NAME>_reel.mp4`;

const FUCHSIA = '#FF1493';
const WHITE   = '#FFFFFF';

// כל segment = קליפ אחד
const SEGMENTS = [
  {
    id: 'hook',
    rawStart: 27,   // שניות בסרטון המקורי
    rawEnd:   33,
    speed: 2,       // x2 = מהיר פי 2
    position: 'top', // 'top' = טקסט למעלה | ברירת מחדל = center
    lines: [
      { text: 'שורה ראשונה',  color: WHITE,   size: 66 },
      { text: 'שורה שנייה',   color: FUCHSIA, size: 76 },
    ]
  },
  {
    id: 'clip_cta',
    rawStart: 418, rawEnd: 420,
    speed: 1,       // x1 = מהירות רגילה (לCTA)
    lines: [
      { text: 'תגיבי כוח',         color: FUCHSIA, size: 76 },
      { text: 'ותקבלי הכל בפרטי.', color: WHITE,   size: 60 },
    ]
  },
];
```

### generateHTML — עיצוב הטקסט

```javascript
function generateHTML(seg) {
  const posStyle = seg.position === 'top'
    ? 'justify-content:flex-start;padding-top:90px;'
    : 'justify-content:center;';

  const lineEls = seg.lines.map(l => {
    const shadow = l.color === WHITE
      ? 'rgba(0,0,0,0.9)'
      : 'rgba(255,255,255,0.95)';
    const ts = `2px 2px 0 ${shadow},-2px 2px 0 ${shadow},2px -2px 0 ${shadow},-2px -2px 0 ${shadow},3px 0 0 ${shadow},-3px 0 0 ${shadow},0 3px 0 ${shadow},0 -3px 0 ${shadow},0 0 10px rgba(0,0,0,0.5)`;
    return `<div class="line" style="color:${l.color};font-size:${l.size}px;text-shadow:${ts};">${l.text}</div>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
@font-face {
  font-family:'Gisha';
  src:url('file:///C:/Windows/Fonts/gishabd.ttf') format('truetype');
  font-weight:bold;
}
body {
  width:1080px; height:1920px;
  background:transparent;
  display:flex; flex-direction:column;
  align-items:center;
  ${posStyle}
  font-family:'Gisha',sans-serif;
  direction:rtl;
}
.card {
  background:rgba(0,0,0,0.36);
  border-radius:20px;
  padding:26px 48px;
  text-align:center;
  max-width:960px;
}
.line {
  display:block;
  font-weight:bold;
  line-height:1.35;
  margin-bottom:8px;
}
</style>
</head>
<body>
<div class="card">
${lineEls}
</div>
</body></html>`;
}
```

### main() — הלולאה הראשית

```javascript
async function main() {
  fs.mkdirSync(TEMP,    { recursive: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page    = await browser.newPage();
  const finalClips = [];

  for (const seg of SEGMENTS) {
    const rawDur = seg.rawEnd - seg.rawStart;
    const outDur = rawDur / seg.speed;

    // 1. חיתוך + speedup (autorotate מטפל בסיבוב הטלפון אוטומטית)
    const rawClip = `${TEMP}/raw_${seg.id}.mp4`;
    execSync(`ffmpeg -y -ss ${seg.rawStart} -t ${rawDur} -i "${INPUT}" `
      + `-vf "setpts=PTS/${seg.speed}" `
      + `-an -vcodec libx264 -preset ultrafast -crf 18 -pix_fmt yuv420p `
      + `-metadata:s:v:0 rotate=0 "${rawClip}"`, { stdio: 'pipe' });

    // 2. רינדור טקסט → PNG שקוף
    const htmlFile   = `${TEMP}/text_${seg.id}.html`;
    const overlayPng = `${TEMP}/overlay_${seg.id}.png`;
    fs.writeFileSync(htmlFile, generateHTML(seg), 'utf8');
    await page.setViewportSize({ width: 1080, height: 1920 });
    await page.goto(`file:///${htmlFile.replace(/\//g, '/')}`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(600);
    await page.screenshot({ path: overlayPng, omitBackground: true });

    // 3. Composite — overlay + fade
    const finalClip = `${TEMP}/final_${seg.id}.mp4`;
    const fadeOut   = Math.max(0, outDur - 0.15).toFixed(3);
    execSync(`ffmpeg -y -i "${rawClip}" -i "${overlayPng}" `
      + `-filter_complex "[0:v]fade=t=in:st=0:d=0.15,fade=t=out:st=${fadeOut}:d=0.15[fv];[fv][1:v]overlay=0:0[out]" `
      + `-map "[out]" -vcodec libx264 -preset ultrafast -crf 18 -pix_fmt yuv420p "${finalClip}"`,
      { stdio: 'pipe' });

    finalClips.push(finalClip);
  }

  await browser.close();

  // 4. Concat + color grade
  const concatTxt = `${TEMP}/concat.txt`;
  fs.writeFileSync(concatTxt, finalClips.map(p => `file '${p}'`).join('\n'), 'utf8');
  execSync(`ffmpeg -y -f concat -safe 0 -i "${concatTxt}" `
    + `-vf "eq=saturation=1.2:contrast=1.05" `
    + `-vcodec libx264 -preset medium -crf 20 -movflags +faststart -pix_fmt yuv420p "${OUTPUT}"`,
    { stdio: 'pipe' });
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
```

---

## כללים חשובים

### סיבוב וידאו
- טלפון מצלם landscape 1920×1080 עם metadata `rotation: 90`
- FFmpeg autorotate פועל ברירת מחדל → פלט 1080×1920 נכון
- **לא** להוסיף `-noautorotate` ולא `transpose`

### מהירות
- `speed: 2` → `setpts=PTS/2` → קליפ של 4 שניות גולמי = 2 שניות פלט
- `speed: 1` → ללא שינוי מהירות (לקליפ CTA בסוף)

### טקסט עברי
- חייב Playwright (לא FFmpeg drawtext) — FFmpeg לא מטפל ב-RTL
- `direction: rtl` ב-CSS
- פונט Gisha Bold בלבד — `C:\Windows\Fonts\gishabd.ttf`
- קונטור: white text → `rgba(0,0,0,0.9)` shadow | fuchsia text → `rgba(255,255,255,0.95)` shadow

### צבעים
- פוקסיה: `#FF1493`
- לבן: `#FFFFFF`
- כרטיס רקע: `rgba(0,0,0,0.36)`

### פלט
- רזולוציה: 1080×1920
- אין אודיו (`-an`)
- ריל עד ~25 שניות

---

## הרצה

```powershell
node "<PROJECT_ROOT>\<name>_reel.js"
```
