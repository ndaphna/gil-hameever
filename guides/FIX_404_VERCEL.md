# 🔴 Troubleshooting: 404 על דפי הנחיתה ב-Vercel

## הבעיה
הדפים `/lead-gift-8` ו-`/waitlist` מחזירים 404 ב-production (Vercel).

## 🔍 סיבות אפשריות ופתרונות

### 1️⃣ ה-Deployment עדיין לא הסתיים
- ✅ לך ל-[Vercel Dashboard](https://vercel.com/dashboard)
- ✅ בדוק את סטטוס הdeployment
- ✅ חכה ש"Building..." יסתיים
- ✅ רענן את הדף אחרי שה-deployment מוכן

### 2️⃣ Build נכשל
**איך לבדוק:**
1. לך ל-Vercel Dashboard
2. לחץ על ה-deployment האחרון
3. בדוק את ה-"Build Logs"
4. חפש שגיאות (אדום)

**שגיאות נפוצות:**
- ❌ TypeScript errors
- ❌ Missing dependencies
- ❌ CSS import errors

### 3️⃣ קבצים לא הועלו נכון
**איך לבדוק:**
```bash
git ls-files src/app/(public)/lead-gift-8/
git ls-files src/app/waitlist/
```

אם הקבצים לא מופיעים - צריך commit נוסף.

### 4️⃣ Cache של Vercel
**פתרון:**
1. לך ל-Vercel Dashboard
2. Deployments → ... (menu) → Redeploy
3. ✅ סמן "Use existing build cache" = **OFF**
4. לחץ "Redeploy"

### 5️⃣ Route Group `(public)` גורם בעיות
**הפתרון הטוב ביותר - להזיז החוצה:**

```bash
# הזז את lead-gift-8 מחוץ ל-(public)
git mv src/app/(public)/lead-gift-8 src/app/lead-gift-8
git mv src/app/(public)/thank-you src/app/thank-you
git mv src/app/(public)/emergency-map src/app/emergency-map
git commit -m "fix: move pages out of (public) route group"
git push
```

### 6️⃣ בדיקה מקומית
**קודם בדוק שזה עובד locally:**
```bash
npm run build
npm start
```

אז נסה לגשת ל:
- `http://localhost:3000/lead-gift-8`
- `http://localhost:3000/waitlist`

אם לא עובד locally - יש בעיה בקוד.
אם עובד locally אבל לא ב-Vercel - בעיית deployment.

---

## 🚀 הפתרון המהיר ביותר:

### אופציה A: Redeploy
1. Vercel Dashboard → הפרויקט שלך
2. Deployments → האחרון
3. ... → Redeploy (ללא cache)

### אופציה B: הזז דפים מחוץ ל-(public)
הרוב סיכוי שזו הבעיה - route group `(public)` גורם לבעיות ב-production.

---

## 📋 מה לשלוח לי כדי שאעזור:

1. Screenshot של Build Logs מ-Vercel
2. מה קורה כשאת מריצה `npm run build` locally?
3. האם הדפים עובדים ב-localhost?

---

**אני חושב שהבעיה היא route group `(public)` - בוא נזיז את הדפים! 🔧**

