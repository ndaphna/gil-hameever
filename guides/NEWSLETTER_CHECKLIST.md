# ✅ Checklist: בדיקת שליחת ניוזלטר

השתמש ב-checklist זה כדי לוודא ששליחת הניוזלטר עובדת כראוי.

## 🔧 Setup (חד-פעמי)

- [ ] **יצרתי API key ב-Brevo**
  - היכנס ל: https://app.brevo.com
  - Settings → SMTP & API → API Keys
  - צור מפתח חדש (v3)
  
- [ ] **אימתתי את כתובת ה-sender ב-Brevo**
  - Settings → Senders & IP
  - הוסף את `newsletter@gilhameever.com` (או המייל שלך)
  - בדוק תיבת דואר ולחץ על לינק האימות
  - ✅ סטטוס אמור להיות: "Verified"

- [ ] **הוספתי משתני סביבה ל-.env.local**
  ```bash
  BREVO_API_KEY=xkeysib-...
  BREVO_FROM_EMAIL=newsletter@gilhameever.com
  BREVO_FROM_NAME=עליזה - מנופאוזית וטוב לה
  ```

- [ ] **הפעלתי מחדש את השרת**
  ```bash
  npm run dev
  ```

## 🧪 בדיקות תקינות

### בדיקה 1: בדוק תצורה

- [ ] פתח את http://localhost:3000/test-newsletter
- [ ] דף הבדיקה נטען בהצלחה
- [ ] אין הודעות שגיאה באדום

### בדיקה 2: שלח למייל אישי

- [ ] הכנס את המייל האישי שלך בשדה העליון
- [ ] לחץ "שלח ניוזלטר"
- [ ] בדוק את הקונסול של השרת (טרמינל):
  - [ ] רואה: `🔑 Checking Brevo configuration...`
  - [ ] רואה: `BREVO_API_KEY: ✅ Set`
  - [ ] רואה: `BREVO_FROM_EMAIL: newsletter@gilhameever.com`
  - [ ] רואה: `📥 Brevo API response status: 201`
  - [ ] רואה: `✅ Newsletter demo sent via Brevo successfully!`
- [ ] בדוק את תיבת הדואר שלך:
  - [ ] המייל הגיע (בדוק גם ספאם!)
  - [ ] המייל נראה טוב (עיצוב תקין)
  - [ ] ה-sender הוא: `עליזה - מנופאוזית וטוב לה <newsletter@gilhameever.com>`

### בדיקה 3: בדוק ב-Brevo Dashboard

- [ ] היכנס ל: https://app.brevo.com
- [ ] עבור ל: Email → Statistics
- [ ] המייל שנשלח מופיע ברשימה
- [ ] הסטטוס הוא: "Delivered" או "Sent"

### בדיקה 4: שלח למשתמשת רשומה (אם יש)

- [ ] בדף http://localhost:3000/test-newsletter גלול לטבלה
- [ ] יש משתמשות ברשימה
- [ ] לחץ "שלח" ליד משתמשת
- [ ] התוצאה: ✅ "נשלח"
- [ ] בדוק קונסול השרת - לוגים מפורטים
- [ ] (אופציונלי) בקש מהמשתמשת לבדוק אם קיבלה

## 🎨 בדיקות נוספות (רצוי)

### עיצוב ותצוגה

- [ ] **נייד**: פתח את המייל בנייד - נראה טוב
- [ ] **דסקטופ**: פתח במחשב - נראה טוב
- [ ] **תמונות**: כל התמונות נטענות
- [ ] **קישורים**: כל הקישורים עובדים
- [ ] **RTL**: הטקסט בעברית מוצג נכון (ימין לשמאל)

### Deliverability

- [ ] המייל לא נפל לספאם
- [ ] אם נפל - סמן כ"לא ספאם" כדי לשפר את ה-reputation
- [ ] שלח ל-2-3 כתובות מייל שונות (Gmail, Outlook, etc.)
- [ ] כולם קיבלו בהצלחה

## 🐛 פתרון בעיות

### אם הבדיקות נכשלו:

#### ❌ "BREVO_API_KEY: ❌ Missing"

**פתרון:**
1. הוסף `BREVO_API_KEY` ל-`.env.local`
2. הפעל מחדש: `npm run dev`

#### ❌ "401 Unauthorized" מ-Brevo

**פתרון:**
1. ודא שה-API key נכון
2. צור מפתח חדש אם צריך
3. ודא שזה מפתח v3 (לא v2)

#### ❌ "sender not authorized" מ-Brevo

**פתרון:**
1. עבור ל-Brevo → Settings → Senders & IP
2. ודא ש-`newsletter@gilhameever.com` מאומת
3. אם לא - אמת אותו עכשיו

#### ❌ המייל לא מגיע

**בדיקות:**
1. בדוק בספאם/זבל
2. בדוק ב-Brevo Dashboard שהמייל נשלח
3. ודא שה-sender מאומת
4. חכה 5-10 דקות (לפעמים יש עיכוב)

#### ❌ המייל נראה שבור

**פתרון:**
1. התבניות ב-`src/lib/email-templates.ts`
2. בדוק שאין שגיאות HTML
3. בדוק שכל התמונות/CSS בסדר

## 📊 סטטוס סופי

לאחר השלמת כל הבדיקות:

- [ ] ✅ כל הבדיקות עברו בהצלחה
- [ ] ✅ המיילים נשלחים ומגיעים
- [ ] ✅ העיצוב נראה טוב בכל הפלטפורמות
- [ ] ✅ הלוגים בקונסול מראים הצלחה
- [ ] ✅ Brevo Dashboard מראה "Delivered"

**🎉 מעולה! המערכת מוכנה לשליחת ניוזלטרים!**

## 📝 הערות חשובות

1. **לפני Production**: 
   - הגן על דף `/test-newsletter` (הוסף authentication)
   - הגדר SPF/DKIM לדומיין שלך
   - התחל עם warm-up (10-20 מיילים ביום)

2. **ניטור שוטף**:
   - עקוב אחרי שיעורי bounce ב-Brevo
   - בדוק complaints (דיווחי ספאם)
   - שמור לוגים של כל השליחות

3. **תחזוקה**:
   - בדוק מדי פעם שה-sender עדיין מאומת
   - עקוב אחרי quota ב-Brevo
   - עדכן תבניות לפי משוב משתמשות

## 📚 משאבים נוספים

- **מדריך מפורט**: [NEWSLETTER_TEST_GUIDE.md](NEWSLETTER_TEST_GUIDE.md)
- **הגדרת Brevo**: [BREVO_SETUP_GUIDE.md](BREVO_SETUP_GUIDE.md)
- **API Documentation**: [src/app/api/notifications/send-newsletter-demo/README.md](src/app/api/notifications/send-newsletter-demo/README.md)
- **Brevo Docs**: https://developers.brevo.com

