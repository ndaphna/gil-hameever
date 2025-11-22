# ⚡ Quick Start: בדיקת ניוזלטר

## 3 שלבים פשוטים

### 1️⃣ הוסף משתני סביבה

ב-`.env.local` הוסף:

```bash
BREVO_API_KEY=xkeysib-your_key_here
BREVO_FROM_EMAIL=newsletter@gilhameever.com
BREVO_FROM_NAME=עליזה - מנופאוזית וטוב לה
```

> 💡 **איך לקבל את הערכים?**
> - **API Key**: https://app.brevo.com → Settings → SMTP & API → API Keys
> - **Email**: חייב להיות מאומת ב-Brevo (Settings → Senders & IP)

### 2️⃣ הפעל את השרת

```bash
npm run dev
```

### 3️⃣ פתח את דף הבדיקה

נווט ל: **http://localhost:3000/test-newsletter**

---

## 🎯 בדיקה ראשונה

1. **הכנס את המייל שלך** בשדה "שליחה למייל ספציפי"
2. **לחץ "📧 שלח ניוזלטר"**
3. **צפה בקונסול של השרת** (הטרמינל שבו רץ `npm run dev`) - אמור לראות:
   ```
   ============================================================
   📧 Sending newsletter email via Brevo
   ============================================================
   🔑 Checking Brevo configuration...
   ...
   ✅ Newsletter demo sent via Brevo successfully!
   ============================================================
   ```
4. **בדוק את תיבת הדואר שלך** - המייל אמור להגיע תוך 1-5 דקות

> 💡 **שים לב**: רשימת המשתמשות במערכת זמינה רק למנהלים. אבל זה לא משנה - השדה העליון מספיק לבדיקה!

---

## ✅ הצלחה? הבא:

- 📋 **Checklist מלא**: [NEWSLETTER_CHECKLIST.md](NEWSLETTER_CHECKLIST.md)
- 📖 **מדריך מפורט**: [NEWSLETTER_TEST_GUIDE.md](NEWSLETTER_TEST_GUIDE.md)
- 📊 **סיכום**: [NEWSLETTER_TESTING_SUMMARY.md](NEWSLETTER_TESTING_SUMMARY.md)

---

## ❌ בעיות? פתרונות מהירים:

### "BREVO_API_KEY: ❌ Missing"
→ הוסף ל-`.env.local` והפעל מחדש: `npm run dev`

### "sender not authorized"
→ אמת את המייל ב-Brevo: Settings → Senders & IP

### המייל לא מגיע
→ בדוק בספאם + ודא ש-sender מאומת ב-Brevo

---

**צריך עזרה נוספת?** ראה [NEWSLETTER_TEST_GUIDE.md](NEWSLETTER_TEST_GUIDE.md#-פתרון-בעיות-נפוצות)

