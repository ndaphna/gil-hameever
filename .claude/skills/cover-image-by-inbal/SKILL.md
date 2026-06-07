---
name: cover-image-by-inbal
description: יוצר תמונת COVER לסרטון ריל בפיד אינסטגרם (1080×1350, 4:5) עבור ענבל דפנה. מקבל תמונת מקור וטקסט עברי, מרנדר עם פונט Rubik 700 בצבע פוקסיה #FF1493 עם קונטור שחור. Stack: Node.js + Playwright. שומר ב-Cover_Images. מתקשר בעברית.
---

# Cover Image by Inbal

יוצר תמונת COVER מוגמרת לסרטון ריל בפיד אינסטגרם של ענבל דפנה.  
תמיד מתקשר עם ענבל **בעברית**.

---

## מה זה קאבר פיד

תמונת הקאבר (Reel Cover) היא התמונה שמופיעה בפיד האינסטגרם — **לא** הצילום הראשון של הסרטון עצמו.  
גודל: **1080×1350 פיקסלים** (יחס 4:5 — הפורמט הנכון לפיד).  
**לא** 1080×1920 (זה גודל ריל/סטורי, לא קאבר פיד).

---

## תנאים מוקדמים

- **Node.js** — `node --version`
- **Playwright npm** — אם חסר: `npm install --prefix "<PROJECT_ROOT>" playwright`
- **חיבור אינטרנט** — לטעינת פונט Rubik מ-Google Fonts (פעם אחת, אחר כך נשמר)

---

## נתיבים

```
Input photo:  <PROJECT_ROOT>\assets\<שם התמונה>
Output:       <PROJECT_ROOT>\Cover_Images\<שם>_cover.jpg
Script:       <PROJECT_ROOT>\scripts\make_<שם>_cover.js
```

---

## תהליך

### שלב 1 — קבל מענבל

אם הפרטים לא ניתנו כבר בהודעה, שאל:

> "אוקיי! אני צריכה:
> 1. שם הקובץ / נתיב התמונה
> 2. הטקסט (בשורות — כל שורה בנפרד)
> 3. שם לקובץ הפלט (למשל: dumple_cover)"

### שלב 2 — בנה מיד

ברגע שיש תמונה וטקסט — בנה וריצה מיידית, ללא אישור.

---

## כללי עיצוב

### גודל ויחס
- **1080×1350 פיקסלים** (4:5) — זה הגודל היחיד לקאבר פיד
- JPG, quality 95

### פונט
- **Rubik weight 900** — נטען מ-Google Fonts
- פולבק: `'Arial', sans-serif`
- `direction: rtl` לעברית

### צבע טקסט
- **#FF1493** (פוקסיה/ורוד חם) — צבע המותג של ענבל לשורות דגש
- שורות לבנות עם קונטור **שחור**: `-webkit-text-stroke: 5px #000000; paint-order: stroke fill`
- **לא** קונטור לבן — טקסט לבן עם קונטור לבן נראה מבולגן ולא ברור
- `font-weight: 700` (לא 900 — פחות מסורבל, יותר קריא)

### טקסט LTR (כמו "POV:")
- מילים באנגלית או מספרים שצריכים להופיע משמאל לימין — הוסיפי `direction:ltr` ישירות על ה-span:
- `<span class="line" style="direction:ltr;">POV:</span>`

### גדלי פונט לפי אורך שורה
⚠️ **אינסטגרם חותכת טקסט גדול** — השתמשי בגדלים הבאים בלבד:

| אורך השורה | גודל מומלץ |
|------------|-----------|
| קצרה מאוד (~5 תווים, כמו "POV:") | 100–110px |
| קצרה (~10 תווים) | 80–90px |
| בינונית (~14 תווים) | 65–75px |
| ארוכה (~18–22 תווים) | 58–65px |

**כלל:** עדיף לפצל שורה ארוכה ל-2 שורות קצרות יותר.

### מיקום טקסט — Safe Zone חובה
- **top מינימום: 200px** (לא 55-80px — זה מחוץ לאזור הבטוח!)
- sides: `left: 80px; right: 80px; width: calc(100% - 160px)` — חובה לציין במפורש!
- bottom מינימום: 200px
- אם אין מקום — פצל שורה ארוכה ל-2 שורות קצרות, אל תורידי את ה-top
- האדם/נושא ב**חלק התחתון**
- `text-align: center`

### רקע תמונה
- `object-fit: cover` — ממלא את כל 1080×1350
- `object-position: center 60%` — מציג יותר מהחלק התחתון (האדם)
- גרדיאנט עדין מלמעלה לקריאות: `rgba(0,0,0,0.35) → transparent` ב-55% מהגובה

---

## מבנה הסקריפט (Node.js)

```javascript
const { chromium } = require('./node_modules/playwright/index');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1080, height: 1350 });

  // Base64 encode — פותר בעיות ברווחים בשם קובץ
  const imgBuffer = fs.readFileSync('<PROJECT_ROOT>\\assets\\<FILENAME>');
  const ext = '<EXT>'; // png / jpg / jpeg
  const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
  const imgSrc = `data:${mime};base64,${imgBuffer.toString('base64')}`;

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@900&display=swap" rel="stylesheet">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { width:1080px; height:1350px; overflow:hidden; position:relative; background:#111; }

.bg {
  position:absolute; top:0; left:0;
  width:100%; height:100%;
  object-fit:cover;
  object-position:center 60%;
}

/* גרדיאנט עדין מלמעלה */
.overlay {
  position:absolute; top:0; left:0;
  width:100%; height:55%;
  background: linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 100%);
}

.text-wrap {
  position:absolute;
  top:200px;           /* safe zone — אל תשני! */
  left:80px;
  right:80px;
  width:calc(100% - 160px);
  text-align:center;
  direction:rtl;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:6px;
}

.line {
  display:block;
  font-family:'Rubik', 'Arial', sans-serif;
  font-weight:700;           /* לא 900 — פחות מסורבל */
  -webkit-text-stroke:5px #000000;   /* קונטור שחור — לא לבן! */
  paint-order:stroke fill;
  line-height:1.2;
  white-space:nowrap;
  letter-spacing:-1px;
}
</style>
</head>
<body>
<img class="bg" src="${imgSrc}">
<div class="overlay"></div>
<div class="text-wrap">
  <!-- טקסט LTR (אנגלית/מספרים) → הוסיפי direction:ltr על ה-span -->
  <span class="line" style="color:#FFFFFF; font-size:108px; direction:ltr;">POV:</span>
  <!-- שורה עברית לבנה: ~10 תווים → 80-90px -->
  <span class="line" style="color:#FFFFFF; font-size:82px;">שורה קצרה</span>
  <!-- שורה עברית לבנה: ~18 תווים → 62-68px -->
  <span class="line" style="color:#FFFFFF; font-size:65px;">שורה בינונית ארוכה</span>
  <!-- שורה פוקסיה: ~20+ תווים → 58-63px -->
  <span class="line" style="color:#FF1493; font-size:60px;">שורת דגש בפוקסיה.</span>
</div>
</body>
</html>`;

  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  await page.screenshot({
    path: '<PROJECT_ROOT>\\Cover_Images\\<NAME>_cover.jpg',
    type: 'jpeg',
    quality: 95,
    clip: { x: 0, y: 0, width: 1080, height: 1350 }
  });

  await browser.close();
  console.log('Cover saved!');
})();
```

---

## הרצה

```powershell
node "<PROJECT_ROOT>\scripts\make_<name>_cover.js"
```

---

## כללים חשובים

### כאשר התמונה כבר כוללת טקסט צרוב (baked-in text)
אם הרקע הוא פריים מסרטון עם כתוביות צרובות — **אי אפשר להסתיר אותן עם גרדיאנט רגיל**. פתרון:
1. הוסיפי בלוק שחור מלא (opacity 1.0) מ-y=0 עד y≥440 (מעל גובה הטקסט הצרוב)
2. לאחר מכן גרדיאנט חלק מ-y=440 עד y=680 (שחור → שקוף)
3. שימי את הטקסט החדש ב-y≥200 (safe zone) על גבי הבלוק השחור

```javascript
// בלוק שחור מלא לכיסוי טקסט ישן
ctx.fillStyle = '#000000';
ctx.fillRect(0, 0, W, 440);
// גרדיאנט חלק
const grad = ctx.createLinearGradient(0, 440, 0, 680);
grad.addColorStop(0, 'rgba(0,0,0,1)');
grad.addColorStop(0.35, 'rgba(0,0,0,0.6)');
grad.addColorStop(1, 'rgba(0,0,0,0)');
ctx.fillStyle = grad;
ctx.fillRect(0, 440, W, 240);
```

### canvas במקום Playwright (כשתמונה קיימת + אין חיבור אינטרנט)
כלי חלופי: `canvas` npm (גלובלי: `<NPM_GLOBAL>/canvas`)
- פונט זמין: **Heebo-Black** — `<WINDOWS_FONTS>/Heebo-Black.ttf`
- עובד עם Hebrew וזהה ל-Rubik 900 ויזואלית
- **חשוב:** נתיבי קבצים עם עברית נשברים ב-canvas — יש להעתיק לנתיב זמני ללא עברית תחילה

```javascript
const { createCanvas, loadImage, registerFont } = require('<NPM_GLOBAL>/canvas');
registerFont('<WINDOWS_FONTS>/Heebo-Black.ttf', { family: 'Heebo', weight: '900' });
```

### Base64 במקום file://
- **תמיד** לטעון תמונות כ-base64 — קבצי PNG/JPG עם רווח בשם (`Inbal with dumple .png`) נשברים ב-`file://` URL
- שימוש: `fs.readFileSync(path).toString('base64')`

### שורות קצרות
- פצל טקסט ל-3–4 שורות קצרות, לא 2 שורות ארוכות
- שורה ארוכה מ-18 תווים → הורד לגודל 86–95px או פצל

### object-position
- `center 60%` — מוודא שהאדם (בדרך כלל בחלק התחתון) גלוי
- אם האדם באמצע התמונה → `center center`
- אם רוצים לראות פחות מלמעלה → `center 70%` או `center 80%`

### waitUntil: networkidle
- חשוב! מאפשר לפונט Rubik מ-Google Fonts להיטען לפני ה-screenshot
- אחרי זה עוד `waitForTimeout(1500)` לביטחון

### גרדיאנט
- רק אם הרקע בהיר/מנוגד לטקסט. אם הרקע כהה כבר — ניתן להסיר

---

## תמונות קיימות לדוגמה

| קובץ פלט | תמונת מקור | טקסט |
|----------|-----------|------|
| `dumple_cover.jpg` | `Inbal with dumple .png` | גיל המעבר + תפריט שבועות / דורשים אימון כוח דחוף |
| `inbal_walking_cover.jpg` | `inbal_walking.png` | שאלות של אישה בגיל המעבר |

---

## אחרי הרינדור

1. הצג את התמונה בצ'אט (Read tool)
2. שאל: "איך נראה? יש שינויים?"
3. אם יש תיקון — עדכן את הסקריפט והרץ שוב
4. כשאושר — הסקריפט נשאר ב-`scripts/` לשימוש עתידי
