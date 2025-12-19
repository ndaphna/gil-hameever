# מדריך Refactor לניוזלטרים

## מבנה הקבצים

### 1. `newsletter-template-base.html`
**קובץ Template בסיסי** - מכיל את כל המבנה המשותף:
- DOCTYPE ו-Head
- Header עם gradient
- Footer
- Signature
- הערות והנחיות לשימוש

**איך להשתמש:**
1. העתק את הקובץ
2. שנה את הכותרת ב-`<title>`
3. הוסף את התוכן שלך בין `<!-- CONTENT START -->` ל-`<!-- CONTENT END -->`
4. שמור בשם חדש

### 2. `newsletter-snippets.html`
**קובץ Snippets** - מכיל רכיבים מוכנים לשימוש חוזר:
- Sections (רקע לבן, gradient קל, gradient חזק)
- Highlight boxes
- Numbered tips
- Next email preview
- Closing messages

**איך להשתמש:**
1. פתח את `newsletter-snippets.html`
2. העתק את ה-snippet שאתה צריך
3. הדבק ב-`newsletter-template-base.html`
4. מלא את התוכן במקומות המסומנים ב-`[Your content here]`

## יתרונות ה-Refactor

✅ **DRY (Don't Repeat Yourself)** - אין קוד חוזר
✅ **עקביות** - כל הניוזלטרים נראים אותו דבר
✅ **תחזוקה קלה** - שינוי אחד משפיע על הכל
✅ **יצירה מהירה** - העתק-הדבק-מלא תוכן
✅ **תיעוד** - כל snippet מתועד

## דוגמת שימוש

### שלב 1: יצירת ניוזלטר חדש
```bash
# העתק את ה-template
cp newsletter-template-base.html newsletter-new.html
```

### שלב 2: הוספת תוכן
1. פתח את `newsletter-new.html`
2. שנה את הכותרת: `<title>מנופאוזית וטוב לה - [הנושא שלך]</title>`
3. פתח את `newsletter-snippets.html`
4. העתק את ה-snippets שאתה צריך
5. הדבק במקום המתאים
6. מלא את התוכן

### שלב 3: בדיקה
- פתח בדפדפן
- בדוק RTL
- בדוק responsive
- בדוק ב-Outlook (אם אפשר)

## Snippets זמינים

### Sections
- **White Section** - רקע לבן, לתוכן רגיל
- **Light Gradient Section** - רקע gradient עדין, למסרים חשובים
- **Strong Gradient Section** - רקע gradient חזק, ל-CTAs

### Components
- **Highlight Box** - קופסה צהובה למסרים מודגשים
- **Numbered Tip** - טיפ ממוספר (1, 2, 3...)
- **Tip with Sub-Highlight** - טיפ עם קופסה צהובה נוספת
- **Next Email Preview** - תצוגה מקדימה למייל הבא
- **Closing Message Box** - הודעת סיכום עם רקע gradient

## כללי עיצוב

### Padding
- **כל ה-sections**: `30px 3px` (30px למעלה/למטה, 3px מימין/משמאל)
- **Padding פנימי של paragraphs**: `padding-bottom: 20px` או `24px`

### Font Sizes
- **H1**: `32px` (רק ב-header)
- **H2 Center**: `26px` (לכותרות מרכזיות)
- **H2 Right**: `22px` (לכותרות מימין)
- **H3**: `20px` (לכותרות טיפים)
- **Regular text**: `17px`
- **Bold text**: `18px`
- **Small text**: `14px-16px`

### Colors
- **Text**: `#1A1A1A`
- **Magenta**: `#FF0080`
- **Purple**: `#9D4EDD`
- **Background**: `#F5F5F5`
- **White**: `#FFFFFF`

### Line Heights
- **Headings**: `1.3-1.4`
- **Text**: `1.9`
- **Small text**: `1.6-1.8`

## טיפים ליצירה מהירה

1. **התחל מה-template** - תמיד התחל מ-`newsletter-template-base.html`
2. **השתמש ב-snippets** - אל תכתוב הכל מחדש
3. **שמור על עקביות** - השתמש באותם styles
4. **בדוק ב-Gmail** - תמיד בדוק איך זה נראה ב-Gmail
5. **שמור גרסאות** - שמור גרסאות ישנות למקרה שצריך לחזור

## תחזוקה

### עדכון Template
אם צריך לעדכן משהו ב-template (למשל, שינוי צבע או font):
1. עדכן את `newsletter-template-base.html`
2. עדכן את `newsletter-snippets.html` (אם רלוונטי)
3. עדכן את כל הניוזלטרים הקיימים (או צור script לעדכון אוטומטי)

### הוספת Snippet חדש
1. פתח את `newsletter-snippets.html`
2. הוסף את ה-snippet החדש
3. תיעד אותו במדריך הזה

## שאלות נפוצות

**Q: איך אני יודע איזה snippet להשתמש?**
A: תלוי בתוכן:
- תוכן רגיל → White Section
- מסר חשוב → Light Gradient Section
- CTA → Strong Gradient Section
- טיפים → Numbered Tip

**Q: מה אם אני צריך משהו שלא קיים?**
A: צור snippet חדש ב-`newsletter-snippets.html` ותעד אותו כאן.

**Q: איך אני מעדכן ניוזלטר קיים?**
A: עדכן ישירות את הקובץ, או העתק את התוכן ל-template חדש.

---

**עודכן לאחרונה**: לאחר Refactor של כל הניוזלטרים

