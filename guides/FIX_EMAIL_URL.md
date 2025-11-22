# 🔗 תיקון URL במיילים - מדריך מהיר

## 🔴 הבעיה

המיילים מפנים ל-`http://localhost:3000/emergency-map` במקום ל-URL האמיתי של האתר.

---

## ✅ הפתרון

עדכני את הקובץ `.env.local` עם ה-URL האמיתי של האתר שלך.

### שלב 1: פתחי את `.env.local`

### שלב 2: מצאי את השורה:
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### שלב 3: החליפי לאחד מהאפשרויות הבאות:

#### אם האתר ב-Vercel:
```env
NEXT_PUBLIC_BASE_URL=https://your-project-name.vercel.app
```

#### אם יש לך דומיין משלך:
```env
NEXT_PUBLIC_BASE_URL=https://menopause-il.com
```
(או כל דומיין אחר שיש לך)

#### אם האתר ב-Netlify:
```env
NEXT_PUBLIC_BASE_URL=https://your-site-name.netlify.app
```

---

## 🚀 אחרי העדכון

1. **עצרי את השרת** (Ctrl+C)

2. **הפעילי מחדש:**
```bash
npm run dev
```

3. **בדקי שזה עובד:**
   - עשי רישום מבחן ב-`/lead-gift-8`
   - בדקי את המייל
   - הקישור צריך להיות: `https://your-domain.com/emergency-map`

---

## 📝 דוגמה למבנה מלא של .env.local:

```env
# Brevo API
BREVO_API_KEY=xkeysib-abc123...
BREVO_FROM_EMAIL=gil.hameever@gmail.com
BREVO_FROM_NAME=מנופאוזית וטוב לה

# Site URL (for email links)
NEXT_PUBLIC_BASE_URL=https://menopause-il.com
```

---

## ⚠️ חשוב!

- אם את עדיין בפיתוח (localhost), השאירי: `http://localhost:3000`
- רק כשאת מעלה לפרודקשן, שני ל-URL האמיתי
- אחרי שינוי ב-.env.local תמיד צריך לעצור ולהפעיל מחדש את השרת!

---

## 🎯 איך לדעת מה ה-URL שלי?

### אם פרסמת ב-Vercel:
1. כנסי ל-[Vercel Dashboard](https://vercel.com/dashboard)
2. לחצי על הפרויקט שלך
3. תראי את ה-URL למעלה (לדוגמה: `https://gil-hameever.vercel.app`)

### אם פרסמת ב-Netlify:
1. כנסי ל-[Netlify Dashboard](https://app.netlify.com/)
2. לחצי על האתר שלך
3. תראי את ה-URL למעלה (לדוגמה: `https://menopause-il.netlify.app`)

### אם יש לך דומיין משלך:
- פשוט השתמשי בו: `https://yourdomain.com`

---

**לאחר התיקון, כל המיילים יפנו ל-URL הנכון! ✅**


