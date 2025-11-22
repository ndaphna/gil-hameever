# 📧 מדריך בדיקת שליחת ניוזלטר

## סקירה כללית

מדריך זה מסביר כיצד לבדוק את תקינות שליחת הניוזלטר למשתמשות הרשומות במערכת באמצעות Brevo.

## 🚀 התחלה מהירה

### שלב 1: עדכן משתני סביבה

ב-`.env.local`, ודא שיש לך:

```bash
# Brevo API Key
BREVO_API_KEY=xkeysib-your_api_key_here

# Sender Information (המייל החדש מדומיין gilhameever.com)
BREVO_FROM_EMAIL=newsletter@gilhameever.com
BREVO_FROM_NAME=עליזה - מנופאוזית וטוב לה

# או אם אתה משתמש במייל אחר:
# BREVO_FROM_EMAIL=noreply@gilhameever.com
# או
# BREVO_FROM_EMAIL=aliza@gilhameever.com
```

### שלב 2: הפעל את השרת

```bash
npm run dev
```

### שלב 3: פתח את דף הבדיקה

נווט ל: **http://localhost:3000/test-newsletter**

## 📋 איך להשתמש בדף הבדיקה

דף הבדיקה מציע שתי אפשרויות:

### אפשרות 1: שליחה למייל ספציפי (מומלץ!)

1. הכנס כתובת מייל בשדה "שליחה למייל ספציפי"
2. לחץ על "📧 שלח ניוזלטר"
3. המערכת תשלח ניוזלטר לכתובת זו (גם אם היא לא רשומה במערכת)

**שימוש מומלץ**: שלח למייל האישי שלך כדי לבדוק את עיצוב המייל וקבלתו.

> 💡 **זו הדרך הכי פשוטה לבדיקה** - לא צריך גישת admin או משתמשים רשומים!

### אפשרות 2: שליחה למשתמשת רשומה (דורש גישת admin)

1. בטבלה מופיעות כל המשתמשות הרשומות במערכת (רק אם יש לך גישת admin)
2. לחץ על כפתור "שלח" ליד המשתמשת הרצויה
3. המערכת תשלח ניוזלטר מותאם אישית בהתאם לנתונים שלה

> ⚠️ **שים לב**: רשימת המשתמשות זמינה רק למנהלי המערכת. אם אתה לא רואה את הרשימה - זה בסדר! השתמש באפשרות 1.

## 🔍 איך לבדוק שהמייל נשלח

### 1. בדוק את הקונסול של השרת (חובה!)

בטרמינל שבו רץ `npm run dev`, תראה לוגים מפורטים:

```
============================================================
📧 Sending newsletter email via Brevo
============================================================
🔑 Checking Brevo configuration...
   BREVO_API_KEY: ✅ Set
   BREVO_FROM_EMAIL: newsletter@gilhameever.com
   BREVO_FROM_NAME: עליזה - מנופאוזית וטוב לה
📤 Sending email:
   From: עליזה - מנופאוזית וטוב לה <newsletter@gilhameever.com>
   To: user@example.com
   Subject: ✨ עדכון חדש עבורך מעליזה
   HTML length: 15234 chars
   Text length: 3456 chars
🌐 Calling Brevo API...
📥 Brevo API response status: 201
✅ Newsletter demo sent via Brevo successfully!
   Message ID: abc123xyz456
============================================================
```

### 2. בדוק את ה-Dashboard של Brevo

1. היכנס ל-Brevo: https://app.brevo.com
2. עבור ל-**Email** → **Statistics**
3. אמור לראות את המייל שנשלח עם הסטטוס שלו

### 3. בדוק את תיבת הדואר

בדוק את תיבת הדואר של הכתובת שאליה שלחת. המייל אמור להגיע תוך דקות ספורות.

## ⚠️ פתרון בעיות נפוצות

### בעיה: "BREVO_API_KEY: ❌ Missing"

**פתרון**:
1. הוסף את `BREVO_API_KEY` ל-`.env.local`
2. הפעל מחדש את השרver (`npm run dev`)

### בעיה: "Brevo API error: 401 Unauthorized"

**סיבות אפשריות**:
- API Key לא תקין
- API Key פג תוקף

**פתרון**:
1. הכנס ל-Brevo → Settings → SMTP & API → API Keys
2. צור מפתח חדש (v3)
3. עדכן ב-`.env.local`

### בעיה: "Brevo API error: 400 Bad Request - sender not authorized"

**סיבה**: כתובת ה-sender לא מאומתת ב-Brevo

**פתרון**:
1. הכנס ל-Brevo → **Settings** → **Senders & IP**
2. ודא ש-`newsletter@gilhameever.com` (או המייל שבחרת) מאומת
3. אם לא - לחץ "Add a new sender" ואמת את הכתובת
4. בדוק את תיבת הדואר של המייל ולחץ על לינק האימות

### בעיה: המייל לא מגיע

**בדיקות**:
1. **ספאם/זבל**: בדוק בתיקיית הספאם
2. **סטטוס ב-Brevo**: בדוק ב-Dashboard אם המייל נשלח
3. **Sender מאומת**: ודא שה-sender email מאומת
4. **Quota**: בדוק שלא עברת את המכסה החודשית של Brevo

### בעיה: המייל נראה לא נכון

**פתרון**: המיילים נוצרים על ידי `src/lib/email-templates.ts`. אפשר לערוך את התבניות שם.

### בעיה: "User not found"

**פתרון**:
- כשמשתמשים באפשרות "שליחה למייל ספציפי" - המייל לא חייב להיות רשום במערכת
- המערכת תיצור ניוזלטר כללי עבור משתמשים לא רשומים

### בעיה: "403 Forbidden" או "Failed to fetch users"

**זה לא באמת בעיה!**
- רשימת המשתמשות זמינה רק למנהלי המערכת
- אם אתה רואה את ההודעה הזו - פשוט השתמש בשדה "שליחה למייל ספציפי" במקום
- הפונקציונליות העיקרית (שליחת מייל) עובדת מצוין גם בלי גישה לרשימת המשתמשים

## 📊 מה הניוזלטר מכיל?

הניוזלטר מותאם אישית לכל משתמשת:

1. **למשתמשת עם נתונים**: תובנות מבוססות על היומנים שלה
2. **למשתמשת חדשה**: מסר מעודד להתחיל למלא נתונים
3. **למייל לא רשום**: ניוזלטר כללי מעודד

התוכן נוצר על ידי:
- **SmartNotificationService** - מנתח את נתוני המשתמשת
- **createInsightEmail** - יוצר את תבנית המייל

## 🎨 התאמה אישית של המיילים

אם ברצונך לשנות את עיצוב או תוכן המיילים:

1. פתח את `src/lib/email-templates.ts`
2. מצא את הפונקציה `createInsightEmail`
3. ערוך את ה-HTML/CSS לפי הצורך

## 🔐 אבטחה

⚠️ **חשוב**: דף הבדיקה (`/test-newsletter`) צריך להיות מוגן!

הוסף authentication לפני production:

```typescript
// בתחילת src/app/test-newsletter/page.tsx
export const metadata = {
  robots: 'noindex, nofollow'
};

// או השתמש ב-middleware לבדוק admin access
```

## 📝 רישום אירועים

כל שליחת ניוזלטר נרשמת ב:
- **Console של השרת** - לוגים מפורטים
- **Brevo Dashboard** - סטטוס שליחה
- **טבלת notification_history** - היסטוריה במסד נתונים

## 🔗 API Endpoints קשורים

- **`POST /api/notifications/send-newsletter-demo`** - שליחת ניוזלטר בדיקה
- **`POST /api/notifications/newsletter-scheduler`** - שליחה מתוזמנת אוטומטית
- **`POST /api/notifications/send-smart-email`** - שליחת מייל חכם למשתמש

## ✅ Checklist לפני Production

- [ ] משתני סביבה מוגדרים ב-`.env.local`
- [ ] Sender email מאומת ב-Brevo
- [ ] בדיקת שליחה למייל אישי - הצלחה ✓
- [ ] בדיקת שליחה למשתמשת רשומה - הצלחה ✓
- [ ] עיצוב המייל נראה טוב בנייד ובדסקטופ ✓
- [ ] הלוגים בקונסול מראים הצלחה ✓
- [ ] דף הבדיקה מוגן/מוסתר מהציבור ✓

## 💡 טיפים

1. **בדוק בספאם**: לפעמים מיילים חדשים נופלים לספאם. סמן כ"לא ספאם" כדי לשפר את ה-reputation
2. **Warm-up**: אם זה דומיין חדש, שלח בהדרגה (10-20 מיילים ביום בהתחלה)
3. **תיעוד שליחות**: שמור לוגים של כל השליחות לצורך ניטור
4. **Monitoring**: הגדר התראות ב-Brevo על שיעורי bounce/complaint גבוהים

## 📞 תמיכה

אם יש בעיות:
1. בדוק את הלוגים בקונסול של השרver
2. בדוק את ה-Dashboard של Brevo
3. ראה את `src/app/api/notifications/send-newsletter-demo/README.md` (אם קיים)
4. בדוק את תיעוד Brevo: https://developers.brevo.com

