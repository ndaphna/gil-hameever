# Talking to Aliza - שיחה עם עליזה

פלטפורמה דיגיטלית לתמיכה במהלך גיל המעבר, עם יומן רגשות אישי וצ'אט AI.

---

## ✨ עיצוב חדש ומשודרג!

### 🎨 עיצוב מוקפד ומרגיע ליומן
**👉 ראי: [`REFINED_DESIGN_SUMMARY.md`](REFINED_DESIGN_SUMMARY.md)**

עיצוב נקי, מינימליסטי ויוקרתי עם גלילה חלקה

### 🔧 תיקוני עיצוב אחרונים
**👉 [`DAILY_TRACKING_DESIGN_FIX.md`](DAILY_TRACKING_DESIGN_FIX.md)**
תיקון כפתור בוקר/ערב + עיצוב כרטיסי סטטיסטיקה

**👉 [`MODAL_DESIGN_FIX.md`](MODAL_DESIGN_FIX.md)**
תיקון פופאפים - גלילה חלקה ועיצוב מודרני

**👉 [`PROGRESS_CHART_DESIGN_FIX.md`](PROGRESS_CHART_DESIGN_FIX.md)**
גרף התקדמות חדש + תיקון חפיפת בועות

**👉 [`FIX_PERIOD_BUTTONS.md`](FIX_PERIOD_BUTTONS.md)**
תיקון כפתורי תקופה - עכשיו עובדים!

**👉 [`FIX_MOOD_CARDS_DUPLICATE.md`](FIX_MOOD_CARDS_DUPLICATE.md)**
תיקון כפילות + גיימיפיקציה מתקדמת

**👉 [`FIX_DAILY_TRACKING_ROW1_DESIGN.md`](FIX_DAILY_TRACKING_ROW1_DESIGN.md)**
עיצוב יוקרתי ומאוזן ל-row-1

**👉 [`FIX_DAILY_ENTRY_SAVING.md`](FIX_DAILY_ENTRY_SAVING.md)**
תיקון בעיות שמירת דיווחים יומיים

**👉 [`FIX_ACCESSIBILITY_REALTIME_UPDATE.md`](FIX_ACCESSIBILITY_REALTIME_UPDATE.md)**
תיקון נגישות ועדכון בזמן אמת

**👉 [`FIX_FORM_FINAL.md`](FIX_FORM_FINAL.md)** ⭐
תיקון סופי לטופס + לוגים מפורטים לאיתור בעיות

---

## 🚨 יש שגיאה? תקני עכשיו!

### 🆘 דיווחים לא נשמרים ביומן?
**👉 פתחי מיד: [`FIX_SAVING_ISSUES_NOW.md`](FIX_SAVING_ISSUES_NOW.md)** 🔥

תיקון ב-1 דקה - בעיות שמירה ב-DB!

### 🆘 שגיאה: "column full_name does not exist"?
**👉 פתחי מיד: [`FIX_FULL_NAME_COLUMN_NOW.md`](FIX_FULL_NAME_COLUMN_NOW.md)** ⚡

תיקון ב-1 דקה - הוספת עמודות חסרות ל-user_profile!

### 🆘 שגיאה: "null value in column email violates not-null constraint"?
**👉 פתחי מיד: [`FIX_EMAIL_CONSTRAINT_NOW.md`](FIX_EMAIL_CONSTRAINT_NOW.md)** ⚡

תיקון ב-1 דקה - בעיית email ב-user_profile!

### ❌ "column cycle_entries.date does not exist"
**👉 פתחי: [`URGENT_FIX_CYCLE_ENTRIES.md`](URGENT_FIX_CYCLE_ENTRIES.md)**

תיקון מהיר ב-3 דקות!

### 🎯 רוצה נתוני דמה לבדיקה?
**👉 התחל כאן: [`READY_TO_INSERT_MOCK_DATA.md`](READY_TO_INSERT_MOCK_DATA.md)** ⭐

הכנסת 29 דיווחים + 15 רשומות מחזור + 6 הודעות למשתמשת `inbald@sapir.ac.il`

**מדריך מפורט:** [`INSERT_MOCK_DATA_INSTRUCTIONS.md`](INSERT_MOCK_DATA_INSTRUCTIONS.md)  
**שגיאה בהכנסה?** [`FIX_MOCK_DATA_ERROR.md`](FIX_MOCK_DATA_ERROR.md)  
**סקריפט מהיר:** [`QUICK_INSERT_MOCK_DATA.sql`](QUICK_INSERT_MOCK_DATA.sql)

---

## ⚡ התחלה מהירה - Quick Start

### 1. התקנת תלויות
```bash
npm install
```

### 2. הגדרת משתני סביבה (חובה!)
**⚠️ לפני הרצה ראשונה - קראי את [`SETUP.md`](SETUP.md)**

צרי קובץ `.env.local` בתיקייה הראשית עם:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. הגדרת בסיס נתונים
הריצי את ה-SQL migrations ב-Supabase Dashboard:
- ראי הוראות מפורטות ב-[`supabase/migrations/README.md`](supabase/migrations/README.md)

### 4. הרצת שרת הפיתוח
```bash
npm run dev
```

פתחי [http://localhost:3000](http://localhost:3000) בדפדפן.

---

## 📁 מבנה הפרויקט

```
gil-hameever/
├── src/
│   ├── app/
│   │   ├── (public)/          # עמודים ציבוריים (מאמרים, מידע)
│   │   ├── (members)/         # עמודים למנויים בלבד
│   │   ├── api/              # API routes (login, create-profile)
│   │   ├── auth/             # Supabase auth callback
│   │   ├── components/       # רכיבים משותפים
│   │   ├── dashboard/        # דשבורד ראשי
│   │   ├── journal/          # יומן רגשות ⭐
│   │   ├── login/            # התחברות/הרשמה
│   │   └── profile/          # פרופיל משתמש
│   └── lib/
│       ├── supabase.ts       # Supabase client
│       └── supabase-server.ts # Server-side client
├── supabase/
│   └── migrations/           # SQL schema migrations
├── SETUP.md                  # 📖 הוראות הגדרה מפורטות
├── TROUBLESHOOTING.md        # 🔧 פתרון בעיות
└── README.md                 # המסמך הזה
```

---

## 🌟 פיצ׳רים מרכזיים

### ✅ יומן רגשות
- תיעוד רגשות יומיומי עם אימוג'ים
- בחירת צבעים פסטליים לכל כרטיס
- הצגה ויזואלית של ההיסטוריה הרגשית
- מחיקה ועריכה של רשומות

### ✅ מערכת משתמשים
- התחברות/הרשמה עם Supabase Auth
- יצירת פרופיל אוטומטית
- RLS (Row Level Security) - כל משתמש רואה רק את הנתונים שלו

### ✅ מאמרים ותכנים
- מאמרים על גיל המעבר
- מידע על תסמינים ופתרונות
- ניווט נוח בין נושאים

---

## 🚨 פתרון בעיות נפוצות

### "Error creating profile: {}"
**פתרון:** קראי את [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md) - מדריך מפורט

**קיצור:**
1. ✅ ודאי שיש קובץ `.env.local` עם כל המשתנים
2. ✅ הריצי את `verify_and_fix_schema.sql` ב-Supabase
3. ✅ אתחלי מחדש את שרת הפיתוח

### לא רואה כרטיסים ביומן
1. ✅ ודאי שהתחברת למערכת
2. ✅ בדקי Console (F12) לשגיאות
3. ✅ ודאי שהרצת את כל ה-migrations

### הצבע של הכרטיס לא משתנה
✅ **זה כבר תוקן!** ודאי שיש לך את הגרסה האחרונה של `journal/page.tsx`

---

## 🛠️ טכנולוגיות

- **Framework:** Next.js 15.5.4 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Styling:** CSS Modules + Styled JSX
- **Language:** TypeScript
- **Deployment:** Vercel (recommended)

---

## 📚 מסמכים נוספים

- [`SETUP.md`](SETUP.md) - הוראות הגדרה מפורטות כולל משתני סביבה
- [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md) - פתרון בעיות וחוקי בדיקה
- [`supabase/migrations/README.md`](supabase/migrations/README.md) - הוראות migrations

---

## 🔐 אבטחה

- ✅ RLS מופעל על כל הטבלאות
- ✅ Service role key רק ב-API routes
- ✅ `.env.local` לא מועלה ל-Git
- ✅ Validation של משתמשים בכל endpoint

---

## 🚀 פריסה (Deployment)

### Vercel (מומלץ)
1. חברי את ה-repository ל-Vercel
2. הוסיפי משתני סביבה ב-Vercel Dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Deploy!

### הגדרות נוספות
ראי [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)

---

## 🤝 תרומה לפרויקט

לפני שליחת Pull Request:
1. ✅ ודאי שהקוד עובד מקומית
2. ✅ בדקי שאין linter errors
3. ✅ עדכני מסמכים אם נדרש
4. ✅ בדקי שכל ה-migrations עובדים

---

## 📄 רישיון

© 2024 Talking to Aliza. All rights reserved.

---

## 📞 תמיכה

אם נתקלת בבעיה:
1. קראי את [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md)
2. בדקי את [`supabase/migrations/README.md`](supabase/migrations/README.md)
3. הריצי את `check_database_status.sql`

---

## Learn More about Next.js

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub repository](https://github.com/vercel/next.js)
