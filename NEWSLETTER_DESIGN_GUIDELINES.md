# כללי עיצוב ויצירת HTML לניוזלטרים - מנופאוזית וטוב לה

## תוכן עניינים
1. [מבנה בסיסי](#מבנה-בסיסי)
2. [טיפוגרפיה ופונטים](#טיפוגרפיה-ופונטים)
3. [RTL ותמיכה בעברית](#rtl-ותמיכה-בעברית)
4. [צבעים וסגנון](#צבעים-וסגנון)
5. [מבנה Layout](#מבנה-layout)
6. [תאימות Email](#תאימות-email)
7. [מבנה Sections](#מבנה-sections)

---

## מבנה בסיסי

### DOCTYPE ו-Head
```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>מנופאוזית וטוב לה - [כותרת הניוזלטר]</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
```

### Body Base Styles
```html
<body style="margin: 0; padding: 0; background-color: #F5F5F5; font-family: 'Assistant', 'Segoe UI', Arial, sans-serif; direction: rtl; text-align: right;">
```

---

## טיפוגרפיה ופונטים

### פונט ראשי
- **פונט**: `Assistant` (מ-Google Fonts)
- **Fallback**: `'Segoe UI', Arial, sans-serif`
- **Weights זמינים**: 400, 500, 600, 700

### גדלי טקסט
- **כותרות H1**: `32px`, `font-weight: 700`
- **כותרות H2**: `26px`, `font-weight: 700`
- **כותרות H3**: `20px`, `font-weight: 700`
- **טקסט רגיל**: `17px`, `line-height: 1.9`
- **טקסט מודגש**: `18px`, `font-weight: 500-700`
- **טקסט קטן**: `14px-16px`

### Line Height
- **כותרות**: `1.3-1.4`
- **טקסט רגיל**: `1.9`
- **טקסט קטן**: `1.6-1.8`

---

## RTL ותמיכה בעברית

### CSS ל-RTL
```html
<style>
    /* RTL Support for punctuation */
    body, p, h1, h2, h3, div, span {
        direction: rtl;
        text-align: right;
        unicode-bidi: embed;
    }
    /* Ensure proper punctuation placement */
    * {
        unicode-bidi: embed;
    }
</style>
```

### כללים חשובים
- **כל ה-elements** חייבים להיות עם `direction: rtl` ו-`text-align: right`
- **unicode-bidi: embed** חיוני לסימני פיסוק נכונים
- **כל ה-tables** חייבים להיות עם `dir="rtl"` או `direction: rtl`

---

## צבעים וסגנון

### צבעי המותג
- **Magenta**: `#FF0080`
- **Purple**: `#9D4EDD`
- **Black**: `#1A1A1A`
- **White**: `#FFFFFF`
- **Background**: `#F5F5F5`

### Gradients
- **Gradient ראשי**: `linear-gradient(135deg, #FF0080 0%, #9D4EDD 100%)`
- **Gradient עדין**: `linear-gradient(135deg, rgba(255, 0, 128, 0.08) 0%, rgba(157, 78, 221, 0.08) 100%)`
- **Gradient בינוני**: `linear-gradient(135deg, rgba(255, 0, 128, 0.1) 0%, rgba(157, 78, 221, 0.1) 100%)`

### מרקרים (Highlights)
- **רקע צהוב זהב**: `linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0.25) 100%)`
- **Border-radius**: `12px`
- **Font-weight**: `700` לטקסט מודגש

---

## מבנה Layout

### Wrapper Table
```html
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F5F5F5;">
    <tr>
        <td align="center" style="padding: 0;">
            <!-- Main Container -->
        </td>
    </tr>
</table>
```

### Main Container
```html
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="width: 100%; background-color: #FFFFFF; margin: 0 auto;">
```

**חשוב:**
- **רוחב**: `100%` (לא 90% או 600px)
- **Padding חיצוני**: `0` (לא 20px)
- **Padding פנימי של sections**: `30px 3px` (30px למעלה/למטה, 3px מימין/משמאל)

---

## תאימות Email

### Outlook Support
```html
<!--[if mso]>
<style type="text/css">
    body, table, td {font-family: Arial, sans-serif !important;}
</style>
<![endif]-->
```

### Conditional Comments ל-Outlook
```html
<!--[if mso]>
<td style="background-color: #FF0080; padding: 30px 3px; text-align: center;">
<![endif]-->
<!-- תוכן רגיל -->
<!--[if mso]>
</td>
<![endif]-->
```

### Table Structure
- **תמיד** להשתמש ב-`<table>` ל-layout (לא divs)
- **role="presentation"** לכל ה-tables
- **cellspacing="0" cellpadding="0" border="0"** לכל ה-tables
- **Inline styles** בלבד (לא external CSS)

---

## מבנה Sections

### 1. Header עם Gradient
```html
<tr>
    <td style="padding: 0;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
                <td style="background: linear-gradient(135deg, #FF0080 0%, #9D4EDD 100%); padding: 30px 3px; text-align: center; position: relative; overflow: hidden;">
                    <!--[if mso]>
                    <td style="background-color: #FF0080; padding: 30px 3px; text-align: center;">
                    <![endif]-->
                    <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 20px 20px; opacity: 0.3; pointer-events: none;"></div>
                    <h1 style="margin: 0; padding: 0; font-size: 32px; font-weight: 700; color: #FFFFFF; line-height: 1.3; font-family: 'Assistant', 'Segoe UI', Arial, sans-serif; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); position: relative; z-index: 1;">
                        🌸 מנופאוזית וטוב לה
                    </h1>
                    <!--[if mso]>
                    </td>
                    <![endif]-->
                </td>
            </tr>
        </table>
    </td>
</tr>
```

### 2. Content Section (רקע לבן)
```html
<tr>
    <td style="padding: 30px 3px; background-color: #FFFFFF;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
                <td style="padding-bottom: 20px;">
                    <p style="margin: 0; padding: 0; font-size: 17px; color: #1A1A1A; line-height: 1.9; font-family: 'Assistant', 'Segoe UI', Arial, sans-serif; text-align: right;">
                        <!-- תוכן -->
                    </p>
                </td>
            </tr>
        </table>
    </td>
</tr>
```

### 3. Highlight Section (רקע gradient עדין)
```html
<tr>
    <td style="padding: 30px 3px; background: linear-gradient(135deg, rgba(255, 0, 128, 0.08) 0%, rgba(157, 78, 221, 0.08) 100%);">
        <!--[if mso]>
        <td style="padding: 30px 3px; background-color: #FFF0F7;">
        <![endif]-->
        <!-- תוכן -->
        <!--[if mso]>
        </td>
        <![endif]-->
    </td>
</tr>
```

### 4. Tips Section (עם מספרים)
```html
<tr>
    <td style="padding-bottom: 30px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
                <td style="padding-bottom: 12px; vertical-align: top; width: 40px;">
                    <span style="color: #FF0080; font-size: 24px; font-weight: 700;">1.</span>
                </td>
                <td style="padding-bottom: 12px;">
                    <h3 style="margin: 0; padding: 0; font-size: 20px; font-weight: 700; color: #1A1A1A; line-height: 1.4; font-family: 'Assistant', 'Segoe UI', Arial, sans-serif; text-align: right;">
                        כותרת הטיפ
                    </h3>
                </td>
            </tr>
            <tr>
                <td></td>
                <td>
                    <p style="margin: 0; padding: 0; font-size: 17px; color: #1A1A1A; line-height: 1.9; font-family: 'Assistant', 'Segoe UI', Arial, sans-serif; text-align: right;">
                        תוכן הטיפ
                    </p>
                </td>
            </tr>
        </table>
    </td>
</tr>
```

### 5. Highlight Box (מרקר צהוב)
```html
<p style="margin: 0; padding: 16px 20px; font-size: 17px; color: #1A1A1A; line-height: 1.9; font-family: 'Assistant', 'Segoe UI', Arial, sans-serif; text-align: right; background: linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0.25) 100%); border-radius: 12px; font-weight: 700;">
    טקסט מודגש
</p>
```

### 6. Footer
```html
<tr>
    <td style="padding: 30px 3px; background-color: #1A1A1A; text-align: center;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
                <td style="padding-bottom: 20px;">
                    <p style="margin: 0; padding: 0; font-size: 18px; font-weight: 700; color: #FF0080; line-height: 1.3; font-family: 'Assistant', 'Segoe UI', Arial, sans-serif;">
                        מנופאוזית וטוב לה
                    </p>
                </td>
            </tr>
            <tr>
                <td style="padding-bottom: 20px;">
                    <p style="margin: 0; padding: 0; font-size: 14px; color: #FFFFFF; line-height: 1.6; font-family: 'Assistant', 'Segoe UI', Arial, sans-serif;">
                        קהילה של נשים שמבינות שגיל המעבר זה לא הסוף, זו התחלה חדשה
                    </p>
                </td>
            </tr>
            <tr>
                <td style="padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.2);">
                    <p style="margin: 0; padding: 0; font-size: 12px; color: rgba(255, 255, 255, 0.6); line-height: 1.6; font-family: 'Assistant', 'Segoe UI', Arial, sans-serif;">
                        אם אינך מעוניינת לקבל עוד מיילים מאיתנו, תוכלי <a href="{{ unsubscribe }}" style="color: #FF0080; text-decoration: underline;">לבטל את המנוי כאן</a>.
                    </p>
                </td>
            </tr>
        </table>
    </td>
</tr>
```

---

## כללים חשובים

### ✅ DO
- ✅ רוחב 100% לכל ה-container
- ✅ Padding של 3px מימין ומשמאל
- ✅ שימוש ב-tables ל-layout
- ✅ Inline styles בלבד
- ✅ תמיכה ב-Outlook עם conditional comments
- ✅ RTL מלא עם unicode-bidi: embed
- ✅ פונט Assistant עם fallbacks
- ✅ שימוש ב-gradients לצבעי המותג

### ❌ DON'T
- ❌ אל תשתמש ב-divs ל-layout
- ❌ אל תשתמש ב-external CSS
- ❌ אל תגביל את הרוחב ל-600px או 90%
- ❌ אל תשתמש ב-padding גדול מ-3px מימין/משמאל
- ❌ אל תשכח conditional comments ל-Outlook
- ❌ אל תשכח unicode-bidi: embed ל-RTL

---

## דוגמאות לסגנונות נפוצים

### כותרת H2 במרכז
```html
<h2 style="margin: 0; padding: 0; font-size: 26px; font-weight: 700; color: #1A1A1A; line-height: 1.3; font-family: 'Assistant', 'Segoe UI', Arial, sans-serif; text-align: center;">
    כותרת
</h2>
```

### כותרת H2 מימין
```html
<h2 style="margin: 0; padding: 0; font-size: 22px; font-weight: 700; color: #1A1A1A; line-height: 1.3; font-family: 'Assistant', 'Segoe UI', Arial, sans-serif; text-align: right;">
    כותרת
</h2>
```

### פסקה רגילה
```html
<p style="margin: 0; padding: 0; font-size: 17px; color: #1A1A1A; line-height: 1.9; font-family: 'Assistant', 'Segoe UI', Arial, sans-serif; text-align: right;">
    טקסט רגיל
</p>
```

### פסקה מודגשת
```html
<p style="margin: 0; padding: 0; font-size: 17px; color: #1A1A1A; line-height: 1.9; font-family: 'Assistant', 'Segoe UI', Arial, sans-serif; text-align: right; font-weight: 500;">
    טקסט מודגש
</p>
```

### חתימה
```html
<p style="margin: 0; padding: 0; font-size: 18px; color: #1A1A1A; line-height: 1.9; font-family: 'Assistant', 'Segoe UI', Arial, sans-serif; text-align: right; font-weight: 500;">
    ניפגש במייל הבא.<br>
    חיבוק,<br>
    <span style="color: #FF0080; font-weight: 700;">ענבל 💗</span>
</p>
```

---

## בדיקות לפני שליחה

1. ✅ רוחב 100% - התוכן תופס את כל המסך
2. ✅ Padding של 3px מימין ומשמאל בלבד
3. ✅ RTL נכון - כל הטקסט מימין לשמאל
4. ✅ סימני פיסוק במקום הנכון
5. ✅ פונט Assistant נטען
6. ✅ תמיכה ב-Outlook (conditional comments)
7. ✅ צבעים נכונים (magenta, purple, black)
8. ✅ Gradients עובדים
9. ✅ Links עם צבע נכון (#FF0080)
10. ✅ Unsubscribe link קיים ב-footer

---

## הערות נוספות

- **תמיד** לבדוק את הניוזלטר ב-Gmail, Outlook, ו-Apple Mail לפני שליחה
- **לשמור** על עקביות בסגנון בין כל הניוזלטרים
- **לבדוק** שהטקסט קריא ולא מתפרק לשתי מילים בכל שורה
- **לוודא** שכל ה-images יש להן alt text
- **לבדוק** שהקישורים עובדים

---

**עודכן לאחרונה**: בהתבסס על הניוזלטרים הקיימים בפרויקט

