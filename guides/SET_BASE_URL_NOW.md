# 🌐 הגדרת URL הבסיסי של האתר

## ⚠️ חשוב - עשה את זה עכשיו!

### שלב 1: ערוך את הקובץ `.env.local`

פתח את הקובץ `.env.local` והוסף/עדכן את השורה הבאה:

```env
NEXT_PUBLIC_BASE_URL=https://gil-hameever.vercel.app
```

### שלב 2: הקובץ המלא שלך צריך להיראות כך:

```env
# ========================================
# BREVO API CONFIGURATION
# ========================================
BREVO_API_KEY=xkeysib-your-actual-key-here
BREVO_FROM_EMAIL=gil.hameever@gmail.com
BREVO_FROM_NAME=מנופאוזית וטוב לה

# ========================================
# SITE URL (for email links and absolute URLs)
# ========================================
NEXT_PUBLIC_BASE_URL=https://gil-hameever.vercel.app
```

### שלב 3: הפעל מחדש את השרת

```bash
# עצור את השרת (Ctrl+C)
npm run dev
```

---

## ✅ מה זה עושה?

המשתנה `NEXT_PUBLIC_BASE_URL` משמש ב:

1. **מיילים מ-Brevo** - הקישור למפת החירום
   - במקום: `http://localhost:3000/emergency-map`
   - יהיה: `https://gil-hameever.vercel.app/emergency-map`

2. **כל קישור אבסולוטי באתר** שצריך URL מלא

3. **שיתופים ברשתות חברתיות** (אם תוסיפי בעתיד)

---

## 🚀 הערות חשובות

- ⚠️ אל תוסיפי `/` בסוף ה-URL - הקוד מוסיף אותו אוטומטית
- ✅ השתמשי ב-`https://` (לא `http://`)
- ✅ ללא `/` בסוף
- ✅ נכון: `https://gil-hameever.vercel.app`
- ❌ לא נכון: `https://gil-hameever.vercel.app/`

---

## 📋 כדי לבדוק שזה עובד

1. עשי רישום חדש ב-`/lead-gift-8`
2. בדקי את המייל שמגיע
3. הקישור למפת החירום צריך להיות:
   ```
   https://gil-hameever.vercel.app/emergency-map
   ```

---

## 🔄 אם תשני את הדומיין בעתיד

פשוט עדכני את הערך ב-`.env.local` והפעילי מחדש את השרת.

