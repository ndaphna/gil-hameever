# 🚀 התחל כאן - תיקון שגיאת 500

## ❌ הבעיה
הטופס מחזיר שגיאת 500 כי חסרים משתני סביבה.

---

## ✅ הפתרון (3 צעדים פשוטים)

### 1️⃣ צרי קובץ `.env.local`

**איפה?** בתיקייה הראשית (לצד `package.json`)

**שם הקובץ:** בדיוק `.env.local` (עם נקודה בהתחלה)

---

### 2️⃣ העתיקי את זה לתוך הקובץ:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

BREVO_API_KEY=
```

---

### 3️⃣ מלאי את הערכים

#### מאיפה לקבל את ערכי Supabase?

1. לכי ל: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. בחרי את הפרויקט שלך
3. לכי ל: **Settings** > **API**
4. העתיקי 3 ערכים:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

#### Brevo (אופציונלי):

אם את רוצה לחבר ל-Brevo:
1. לכי ל: [https://app.brevo.com/settings/keys/api](https://app.brevo.com/settings/keys/api)
2. צרי API Key חדש
3. העתיקי אותו ל-`BREVO_API_KEY`

---

### 4️⃣ הפעילי מחדש

```bash
# סגרי את השרת (Ctrl+C)
# ואז:
npm run dev
```

---

## 🎉 זהו!

עכשיו הטופס אמור לעבוד!

---

## 📚 מדריכים מפורטים

- **SETUP_COMPLETE_GUIDE.md** - הסבר מלא עם צילומי מסך
- **BREVO_SETUP_INSTRUCTIONS.md** - הכל על Brevo
- **ENV_SETUP_GUIDE.txt** - הוראות פשוטות בעברית

---

## 🆘 עדיין לא עובד?

בדקי בטרמינל (console) - יש שם הודעות שיעזרו לך להבין מה חסר.

---

💡 **טיפ:** אחרי שזה עובד, את יכולה למחוק את כל קבצי ה-README האלה!


