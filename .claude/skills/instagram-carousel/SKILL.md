---
name: instagram-carousel
description: "יצירת קרוסלות אינסטגרם למותג גיל המעבר של ענבל דפנה. השתמש בסקיל זה בכל פעם שהמשתמש מבקש קרוסלה, תוכן לאינסטגרם, שקפים, פוסט מרובה שקפים, או אומר 'צרי קרוסלה', 'בני לי קרוסלה', 'תוכן לאינסטה'. הסקיל מייצר גם קובץ טקסט (script.md) וגם עיצוב ויזואלי (carousel.html) מותאמים למותג."
---

# סקיל: קרוסלת אינסטגרם — גיל המעבר

## לפני הכל

קרא את `<PROJECT_ROOT>\CLAUDE.md` — שם נמצאים כל כללי המותג, שפת הכתיבה, האווטאר "מיכל", וכללי הברזל. כל הכתיבה חייבת לעמוד בהם.

> **PROJECT_ROOT** = הנתיב המקומי לתיקיית הפרויקט (ב-Google Drive המשותף או מקומית).  
> לינק Google Drive: [https://drive.google.com/drive/folders/1sIXqKmT4xpWbrAZWWz5ogmB9FlTwb21e](https://drive.google.com/drive/folders/1sIXqKmT4xpWbrAZWWz5ogmB9FlTwb21e)

## קלט נדרש

שאלי את המשתמשת (אם לא סופק):
1. **נושא** — על מה הקרוסלה? (חובה)
2. **קהל ספציפי** — מיכל "הכללית", או זיווג ספציפי? (לדוגמה: "אישה שרק גילתה שהיא בגיל המעבר", "אישה שעייפה מדיאטות") — אם לא ציינה, השתמשי באווטאר הבסיסי מהCLAUDE.md
3. **קול** — ענבל / עליזה / שניהם (ברירת מחדל: שניהם לפי מבנה הזהב)

## מבנה הקרוסלה — 7 שקפים

### שקף 1: הוק (חובה — שיטת יהב)

**זה השקף החשוב ביותר.** השתמשי באחת מ-11 הזוויות מסקיל `yahav-copy-agent`, ובחרי את המתאימה ביותר לנושא ולקהל.

**11 הזוויות — בחרי לפי הנושא:**

| # | זווית | מתי מתאים | פתיחה לדוגמה |
|---|-------|-----------|--------------|
| 1 | הודעת פטירה | המוצר/הגישה הישנה מתה | "בצער רב — שנות הסבל הסתיימו" |
| 2 | וידוי / חשיפה | אמת שלא אמרו לה | "אני הולכת להגיד משהו שאף אחד לא אמר לך..." |
| 3 | מכתב אישי | קשר אישי, חמימות | "יש משהו שאני חייבת לספר לך..." |
| 4 | מודעת דרושים הפוכה | אישה שמחפשת פתרון | "דרושה: אישה שעייפה להתעורר עייפה" |
| 5 | כתב אישום | יש אויב ברור (תרבות, מיתוס) | "כתב אישום נגד: הדיאטה שעשתה לך את זה" |
| 6 | דו"ח חקירה | עובדות מפתיעות | "חקירה: למה את ישנה 8 שעות ועדיין עייפה?" |
| 7 | מכתב פרידה | פרידה מהגוף הישן / מהתחושה | "מכתב פרידה לגלי החום של 3 בלילה" |
| 8 | שידור חדשות | חשיפה מפתיעה | "בשורות 2025: מה שהרופא לא אמר לך" |
| 9 | מה אם... | הפיכת אמונה מגבילה | "מה אם גל החום הוא לא אויב?" |
| 10 | סיפור עם טוויסט | רגע ספציפי שמשנה הכל | "בשעה 3:47 בלילה הבנתי שהכל היה הפוך" |
| 11 | הייתי בדיוק כמוך | הזדהות ישירה | "גם אני חשבתי שזה רק עייפות" |

**כללים לשקף ההוק:**
- משפט אחד או שניים — קצר וחד
- חייב לגרום לה לעצור בגלילה
- אסור להשתמש בשפה קלינית ("תסמינים הורמונליים") — ראי CLAUDE.md
- תמיד בעברית נשית
- אסור להתחיל ב"אני"

**hook-tag (כשמשתמשים בפורמט "פרק X"):**
```css
.hook-tag {
  font-family: 'Secular One', sans-serif;
  font-size: 54px;
  font-weight: 700;
  letter-spacing: 8px;
  margin-top: 36px;
  background: rgba(255,255,255,0.18);
  padding: 10px 48px;
  border-radius: 6px;
  display: inline-block;
}
```

**swipe-hint** — רמז החלקה בתחתית שקף 1 (מעל הפוטר):
```html
<div class="swipe-hint">← החליקי לקרוא</div>
```
```css
.swipe-hint {
  position: absolute;
  bottom: 116px;
  width: 100%;
  text-align: center;
  font-family: 'Heebo', sans-serif;
  font-size: 26px;
  direction: rtl;
  opacity: 0.55;
}
```

### Pattern Interrupt — לפחות 2 מהטכניקות בכל הוק

המוח של הצופה על טייס אוטומטי בזמן גלילה. שקף 1 יש לו 0.7 שניות לשבור את האוטומט. לפחות 2 מהטכניקות הבאות חייבות להופיע בהוק (בטקסט ובעיצוב):

1. **המספר הלא נכון** — סטטיסטיקה שנשמעת בלתי אפשרית ("97% מהנשים לא יודעות שזה גיל המעבר")
2. **פתיחה סותרת** — סותרת את מה שכולם חושבים ("תפסיקי לשתות מים לפני שינה")
3. **שבירת פורמט** — נראה כמו הודעת WhatsApp, מסך נוטס, צילום מסך
4. **אי-התאמה ויזואלית** — משהו שלא "שייך" לשקף מקצועי (עמיד, צבע קיצוני)
5. **פנייה ישירה** — שוברת את הקיר הרביעי ("את ביל 40 פוסטים בשעה האחרונה")
6. **טקסט חתוך בקצה** — טקסט שנחתך פיזית בקצה הימני — מאלץ החלקה
7. **הוק שלילי** — "3 דברים שהפסקתי לעשות שהכפילו את האנרגיה שלי"
8. **וידוי מפורק** — כנות קיצונית: "נכשלתי בזה שנתיים לפני שהבנתי"
9. **ספירה לאחור עם פיתוי** — "5 דברים... אבל מספר 3 יפתיע אותך"
10. **שחור-לבן עם הבזק צבע** — שקף 1 בשחור-לבן מלא עם אקסנט אחד צבעוני

### שקף 2 — כלל עצמאות

**אינסטגרם מציגה מחדש קרוסלות החל מהשקף השני.** שקף 2 חייב לעמוד לבד — סטט מפתיע, שאלה אמיצה, או נוסחה ויזואלית. אסור שיהיה "ברוכות הבאות" או "הנה מה שנלמד".

### שקפים 2–6: תוכן לפי מבנה הזהב

```
שקף 2: חיבור רגשי (קול ענבל) — גע בכאב, בגובה העיניים
שקף 3: זיהוי עמוק (קול ענבל) — "אני יודעת בדיוק איך זה מרגיש"
שקף 4: שבירה הומוריסטית (קול עליזה) — טוויסט קל, ישיר, מעיר
שקף 5: תובנה (קול ענבל) — מבט חדש, "זה לא תקלה"
שקף 6: פעולה קטנה / כלי / טיפ — משהו שאפשר לעשות כבר היום
```

### עיקרון Dual-Narrative — חובה בשקפי הגוף (2-6)

כל שקף גוף מכיל שני שכבות:

**שכבה 1 — כותרת/גוף:** התוכן הראשי. מה הצופה רואה קודם.

**שכבה 2 — Annotation:** משפט קטן מתחת לגוף שלא חוזר על השכבה הראשונה — מוסיף מתח, סקרנות, או דחיפות. אותו צבע כמו גוף הטקסט באותו שקף.

| הכותרת אומרת... | ה-Annotation מוסיף... |
|---|---|
| "גל חום לא פוגע בכולן אותו דבר" | "אצלי זה קרה בגיל 43 — מוקדם ממה שציפיתי" |
| "הגוף שלך לא מתקלקל" | "הוא עושה בדיוק מה שהוא אמור לעשות" |

ה-Annotation לעולם לא מנסח מחדש את הכותרת. הוא מוסיף מימד חדש. בשקף עליזה — המשפט ההומוריסטי שלה ממלא את תפקיד ה-Annotation.

### גבולות מילים לשקף (מניעת גלישה — לא רישיון לקצץ)

| סוג שקף | מקסימום מילים |
|---|---|
| שקף הוק | 12 מילים |
| שקפי גוף (ענבל) | 30 מילים סך הכל |
| שקף עליזה | 20 מילים |
| שקף CTA | 15 מילים |

מעל המכסה וייגלש ויזואלית? פצלי לשני שקפים. **אל תקצרי את המילים של ענבל — השתמשי בהן כלשונן.**

### שקף CTA (אחרון)

- ענבל — רכה אבל ברורה
- אפשר **dual CTA** — שניים נפרדים: אחד פעולה ("בואי לתיאור 👇") ואחד שיתוף ("שלחי לחברה שמחזיקה הכל 💌"), מופרדים בקו דק. מגדיל reach.
- לדוגמה בודד: "שמרי את הפוסט הזה", "כתבי לי בתגובות", "שתפי עם חברה שצריכה לקרוא את זה"
- אסור: "לחצי כאן", "לרכישה", "לפרטים"

## פלט — 2 קבצים

### 1. `script.md`

שמרי בנתיב: `<PROJECT_ROOT>\content\carousels\[שם-נושא]\script.md`

פורמט:
```markdown
# קרוסלה: [נושא]
**קהל:** [קהל ספציפי]
**זווית הוק:** [מספר + שם הזווית]
**Pattern Interrupt:** [2 הטכניקות שנבחרו]
**קול:** [ענבל / עליזה / שניהם]

---

## שקף 1 — הוק
[טקסט]

## שקף 2 — חיבור רגשי
[טקסט]
_annotation: [משפט ה-annotation]_
...
## שקף 7 — CTA
[טקסט]
```

### 2. `carousel.html`

שמרי בנתיב: `<PROJECT_ROOT>\content\carousels\[שם-נושא]\carousel.html`

#### צבעים וטיפוגרפיה

```css
--fuchsia: #D4167A;
--gold: #C4922A;
--dark: #1A0A12;
--cream: #FBF6F0;
```

פונטים מ-Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Secular+One&family=Heebo:wght@300;400;500;700&family=Frank+Ruhl+Libre:wght@300;400;700&display=swap" rel="stylesheet">
```

#### רקעים לפי קול

| שקף | רקע | טקסט | פונט כותרת |
|-----|-----|------|------------|
| הוק (שקף 1) | **משתנה לפי קרוסלה** (ראי הערה) | שמנת / לבן | Secular One |
| ענבל | `#FBF6F0` (שמנת) | כהה | Frank Ruhl Libre |
| עליזה | `#D4167A` (פוקסיה) | לבן | Secular One |
| CTA | `#C4922A` (זהב) | כהה | Secular One |

**הערה — שקף 1:** כדי שבפיד אינסטגרם הקרוסלות ייראו מגוונות, אל תשתמשי תמיד באותו רקע. הסתובבי בין: `--dark` / `--fuchsia` / `--cream`. בחרי לפי הטון הרגשי של הקרוסלה ומה השתמשת בה בפעם הקודמת.

**פונט גוף שקף עליזה: `Narkisim`** (פונט כתב יד עברי, מותקן על Windows)

#### גדלי טקסט — ערכי ייחוס (רצפות — אל תרדי מתחת)

| אלמנט | גודל |
|-------|------|
| h1 שקף הוק (Secular One) | `72px`, line-height `1.22` |
| hook-tag ("פרק X") | `54px` bold, Secular One, letter-spacing 8px, רקע semi-transparent |
| big-stmt — משפט גדול בולט | `90px`, Frank Ruhl Libre bold |
| h2 שקפי ענבל (Frank Ruhl Libre) | `62px` מינימום |
| p גוף שקפי ענבל | `44px`, line-height `1.6` מינימום |
| annotation (שכבה 2) | `38px`, אותו צבע כמו גוף הטקסט, לא opacity |
| p שקף עליזה (Narkisim, inline style) | `42px`, line-height `1.65` |
| cta-q — שאלת CTA | `72px`, Secular One |
| cta-sub — טקסט CTA | `46px` |
| מונה שקפים | `13px` |

**אם כתבת `font-size: 20px` לכותרת — עצרי. זה כתב יד של שוליים, לא כותרת.**

#### מבנה HTML של שקף — כללים

- כל שקף: `aspect-ratio: 4/5`, padding **`36px 44px 108px`**, `dir="rtl"`
- מונה שקפים: פינה שמאל-עליון, `direction: ltr` (חשוב — בלי זה מספרים מתהפכים ב-RTL)
- **אין תוויות** על השקפים — אל תוסיפי "ענבל" / "עליזה" / "גיל המעבר" / hook-label כלשהו
- **יישור אנכי מרכזי תמיד** — `justify-content: center` על `.slide`. בלי זה הטקסט יושב למעלה

#### פוטר (bottom-bar) — כללים קריטיים

הפוטר מופיע בכל שקף, ממוקם `position: absolute; bottom: 0`, padding **`18px 44px`**.

**סדר מימין לשמאל** (הדף הוא `direction: ltr`):
- **שמאל** — פרופיל: תמונה + שם + כינוי
- **ימין** — אייקוני שיתוף ושמירה

```css
.profile-pic    { width: 54px; height: 54px; border-radius: 50%; border: 2px solid currentColor; }
.profile-name   { font-size: 19px; font-weight: 700; }
.profile-handle { font-size: 15px; direction: ltr; opacity: 0.75; }
.profile-sub    { font-size: 15px; opacity: 0.7; }
.profile-info   { gap: 14px; }
.profile-text   { gap: 2px; }
/* SVG אייקונים: width="26" height="30" ו-width="20" height="28" */
```

#### שקף עליזה — כותרת

**אין voice-tag נפרד.** הכותרת עצמה היא: `<h2>עליזה אומרת:</h2>`

#### דמות עליזה (שקף עליזה בלבד)

**בחירת תמונה:** לפני כתיבת ה-HTML, רשמי את תוכן שקף עליזה ואחר כך עיברי על רשימת הקבצים בתיקייה `<PROJECT_ROOT>\assets\eliza` ובחרי את התמונה שהכי מתאימה לתוכן — לפי מה שעליזה אומרת, הרגש, או הסיטואציה. אם עליזה מדברת על עייפות — בחרי תמונה עייפה, אם מדברת על חום — תמונת גל חום, וכן הלאה.

כשיש שקף עליזה — **לייאאוט מרכזי (image on top, text below)**:

```html
<div class="eliza-center">
  <img class="eliza-img" src="../../../assets/eliza/[שם-הקובץ-שנבחר]" alt="עליזה שנקין">
</div>
<div style="width:100%; text-align:center; direction:rtl;">
  <h2>עליזה אומרת:</h2>
  <p style="font-family:'Narkisim',serif; font-size:32px; line-height:1.7; color:[צבע לפי רקע]; margin-top:16px;">
    "[הציטוט]"
  </p>
</div>
```

CSS:
```css
.eliza-center {
  width: 340px;
  height: 340px;
  border-radius: 50%;
  background: #FDE8F2;
  overflow: hidden;
  box-shadow: 0 6px 32px rgba(0,0,0,0.35);
  border: 5px solid rgba(255,255,255,0.35);
  flex-shrink: 0;
  margin-bottom: 36px;
}
.eliza-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}
```

הלייאאוט מרכזי: התמונה במרכז למעלה, טקסט מתחת. **לא** absolute-positioned. גודל 280px מבטיח שהכל נשאר באזור הבטוח (80px מרג'ין מכל צד).

#### ניווט

חצים + נקודות בתחתית, גם ניווט מקלדת (ArrowLeft/ArrowRight).

## תוספות ויראליות — שלושה כלים מוכחים

### 1. Save Prompt — על השקף הכי ציטוטי

בשקף שמכיל annotation חזק במיוחד (משפט שהצופה תרצה לשמור), הוסיפי save prompt מתחתיו:

```html
<div class="save-prompt">
  <svg width="24" height="28" viewBox="0 0 20 28" fill="none">
    <path d="M2 2h16v24l-8-6-8 6V2z" stroke="#D4167A" stroke-width="2.2" stroke-linejoin="round"/>
  </svg>
  שמרי את זה
</div>
```
```css
.save-prompt {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 36px;
  font-family: 'Heebo', sans-serif;
  font-size: 30px;
  font-weight: 600;
  color: #D4167A;
  direction: rtl;
}
```
**מתי:** על שקף cream עם annotation שהוא משפט "לשמור" — ניגוד בין הרקע הבהיר לפוקסיה מושך עין.

---

### 2. שקף זיהוי עצמי — מניע תגובות

שקף ביניים (בין תוכן לעליזה) — רקע כהה, שאלה + 3 סימני ✓:

```html
<div class="slide bg-dark" id="slide-X">
  <div class="counter">X / N</div>
  <h2>את מזהה את עצמך?</h2>
  <div class="check-list">
    <div class="check-item">
      <span class="check-icon">✓</span>
      <span>[תיאור 1 קצר]</span>
    </div>
    <div class="check-item">
      <span class="check-icon">✓</span>
      <span>[תיאור 2 קצר]</span>
    </div>
    <div class="check-item">
      <span class="check-icon">✓</span>
      <span>[תיאור 3 קצר]</span>
    </div>
  </div>
  <p class="ann">כתבי בתגובות כמה מהן מתאימות לך</p>
  [footer]
</div>
```
```css
.check-list {
  width: 100%;
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}
.check-item {
  font-family: 'Heebo', sans-serif;
  font-size: 40px;
  line-height: 1.4;
  direction: rtl;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 16px;
}
.check-icon {
  color: #D4167A;
  font-size: 44px;
  line-height: 1.2;
  flex-shrink: 0;
}
```
**מתי:** כשהתוכן עוסק בזיהוי עצמי (עייפות, דפוסים, תחושות). השקף מניע תגובות ("כל השלוש!") שמגדילות reach.

---

### 3. Dual CTA — פעולה + שיתוף

בשקף CTA אחרון, שני CTAs מופרדים בקו דק:

```html
<p class="cta-q">[שאלה / הוק]</p>
<p class="cta-sub">בואי לתיאור 👇</p>
<div class="divider" style="background:currentColor; margin-top:32px;"></div>
<p class="cta-sub" style="font-size:38px; margin-top:28px;">שלחי לחברה ש[מצב רלוונטי] 💌</p>
```
```css
.divider {
  width: 80px;
  height: 3px;
  opacity: 0.3;
  margin: 28px auto 0;
  border-radius: 2px;
}
```
**מתי:** תמיד. CTA1 = המרה (bio link), CTA2 = viral sharing. הפרדה ב-divider מונעת עומס ויזואלי.

---

## ייצוא ל-PNG — build.js

**Python לא מותקן.** משתמשים ב-Node.js + Puppeteer שנמצא ב-`<PROJECT_ROOT>\node_modules\puppeteer`.

כתבי `build.js` באותה תיקייה כמו `carousel.html`:

```js
const path = require('path');
const OUT_DIR = __dirname;
const HTML_PATH = path.join(OUT_DIR, 'carousel.html');
const NUM_SLIDES = 5; // לשנות

async function run() {
  const PROJECT_ROOT = path.resolve(OUT_DIR, '..', '..', '..');
  const puppeteer = require(path.join(PROJECT_ROOT, 'node_modules', 'puppeteer'));
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

  for (let i = 1; i <= NUM_SLIDES; i++) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1350 });
    await page.goto('file:///' + HTML_PATH.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2000));
    await page.evaluate((idx) => {
      document.querySelectorAll('.slide').forEach((s, j) => {
        s.style.display = j === idx ? 'flex' : 'none';
      });
      document.body.style.padding = '0';
      document.body.style.background = 'transparent';
      const nav = document.querySelector('.nav-bar');
      if (nav) nav.style.display = 'none';
    }, i - 1);
    const out = path.join(OUT_DIR, `slide-${i}.png`);
    await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1080, height: 1350 } });
    console.log(`  slide-${i}.png ✓`);
    await page.close();
  }
  await browser.close();
}

run().catch(err => { console.error(err); process.exit(1); });
```

הרצה: `node build.js` מתוך תיקיית הקרוסלה. כל שקף מורנדר בנפרד — ללא גבולות שחורים.

## כללי ברזל

1. אל תשתמשי במקף ארוך (—) — ראי CLAUDE.md
2. לא "תסמינים הורמונליים", "תהליך", "התפתחות אישית" — ראי טבלת האיסורים ב-CLAUDE.md
3. לא טקסט שנשמע כמו AI
4. תמיד עברית נשית
5. בדקי שה-HTML נפתח ונראה טוב לפני שאמרי "סיימתי"
6. **אסור לשנות או לקצר את דברי ענבל** — השתמשי בהם כלשונם

## בדיקה עצמית לפני אישור — 2 סיבובים

### סיבוב 1 — עין היוצרת:
- [ ] יש Pattern Interrupt ויזואלי בשקף 1?
- [ ] כל שקף גוף כולל Annotation (שכבה 2)?
- [ ] שקף 2 עומד לבד ללא הקשר לשקף 1?
- [ ] כל גדלי הטקסט מעל הרצפות?
- [ ] אין מילה בודדת בשורה אחרונה (orphan word)?
- [ ] ה-Annotation לא חוזר על הכותרת?

### סיבוב 2 — עין הצופה (גללי כצופה חיצונית):
1. האם הייתי עוצרת בגלילה בשקף 1?
2. האם הבנתי את הערך תוך 0.7 שניות?
3. האם היה לי חשק להחליק לשקף 2?
4. האם הייתי שומרת את הקרוסלה?
5. האם הייתי שולחת לחברה?

**2 תשובות "לא" — אל תאשרי. תתקני קודם.**

## כשלים נפוצים — פתרונות

| בעיה | סיבה | פתרון |
|---|---|---|
| טקסט יושב למעלה | חסר `justify-content: center` | הוסיפי לכל `.slide` |
| מילה בודדת בשורה אחרונה | עיצוב לא נשלט | הוסיפי `<br>` בנקודת שבירה טבעית |
| רווחים משתנים בין אלמנטים | שימוש ב-`space-evenly` | עברי ל-`gap` קבוע על `.slide` |
| ה-Annotation חוזר על הכותרת | כפילות | הוסיפי מימד חדש — מידע שלא נאמר |
| שקף עליזה גולש מה-max-width | שורות ארוכות | שמרי על ~20 תווים לשורה |
| המספרים במונה שקפים הפוכים | חסר `direction: ltr` | הוסיפי ל-`.counter` |

## תזרים עבודה

1. קבלי קלט (נושא + קהל + קול)
2. בחרי זווית הוק — הסבירי בקצרה למה, וציינו אילו 2 Pattern Interrupt תשתמשי בהן
3. כתבי `script.md` כולל annotation לכל שקף גוף
4. אם יש שקף עליזה — עיברי על `<PROJECT_ROOT>\assets\eliza`, קראי את שמות הקבצים ובחרי את התמונה המתאימה ביותר לתוכן שלה
5. צרי `carousel.html` עם הנתיב המלא לתמונה שנבחרה
6. עשי את 2 סיבובי הבדיקה העצמית לפני שפותחת בדפדפן
7. פתחי בדפדפן (`start carousel.html`) ואמתי
8. דווחי: "קרוסלה מוכנה — [נושא], זווית [X], Pattern Interrupt: [2 הטכניקות], תמונת עליזה: [שם הקובץ], שמורה ב-[נתיב]"
