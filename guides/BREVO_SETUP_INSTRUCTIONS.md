# 🔧 הוראות הגדרת Brevo (Sendinblue)

## צעדים להגדרת החיבור ל-Brevo

### 1️⃣ קבלת API Key מ-Brevo

1. היכנסי לחשבון Brevo שלך: [https://app.brevo.com](https://app.brevo.com)
2. לחצי על **Settings** (הגדרות) בתפריט העליון
3. בחרי **API Keys** (מפתחות API)
4. לחצי על **Generate a new API key** (צור מפתח API חדש)
5. תני לו שם, לדוגמה: "Gil Hameever Waitlist"
6. העתיקי את ה-API key (חשוב! לא תוכלי לראות אותו שוב)

### 2️⃣ הגדרת ה-API Key בפרויקט

צרי קובץ בשם `.env.local` בתיקייה הראשית של הפרויקט (לצד `package.json`) והוסיפי:

```env
# Brevo API Key
BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# (אופציונלי) אם את רוצה להוסיף אנשים לרשימה ספציפית ב-Brevo:
# BREVO_LIST_ID=12345
```

### 3️⃣ (אופציונלי) יצירת רשימת תפוצה ב-Brevo

אם את רוצה שהנרשמים יתוספו לרשימה ספציפית:

1. ב-Brevo, לכי ל-**Contacts** > **Lists**
2. צרי רשימה חדשה, לדוגמה: "Waitlist - Gil Hameever"
3. העתיקי את ה-List ID (מספר שמופיע ליד שם הרשימה)
4. הוסיפי אותו לקובץ `.env.local`:
   ```env
   BREVO_LIST_ID=12345
   ```

### 4️⃣ הפעלה מחדש של השרת

לאחר הוספת ה-API key, הפעילי מחדש את שרת ה-development:

```bash
npm run dev
```

---

## ✅ מה קורה עכשיו?

כשמישהי ממלאת את הטופס:

1. **הנתונים נשמרים ב-Supabase** (כמו קודם)
2. **הנתונים נשלחים ל-Brevo** עם השדות הבאים:
   - אימייל
   - שם פרטי (חלק ראשון מהשם המלא)
   - שם משפחה (שאר חלקי השם)

3. אם האימייל כבר קיים ב-Brevo, הוא לא יתווסף פעם נוספת

---

## 🔍 בדיקת החיבור

### דרך 1: בדיקה ידנית
1. מלאי את הטופס באתר
2. היכנסי ל-Brevo > **Contacts** > **All Contacts**
3. חפשי את האימייל שמילאת

### דרך 2: בדיקה בלוגים
פתחי את ה-console (Terminal) ותראי הודעות כמו:
```
Successfully added contact to Brevo: test@example.com
```

או אם כבר קיים:
```
Contact already exists in Brevo: test@example.com
```

---

## 🚨 בעיות נפוצות

### הבעיה: "BREVO_API_KEY not set"
**פתרון:** ודאי שיצרת את הקובץ `.env.local` בתיקייה הנכונה והפעלת מחדש את השרת

### הבעיה: "Invalid API key"
**פתרון:** ודאי שהעתקת את כל ה-API key, כולל התחילית `xkeysib-`

### הבעיה: החיבור לא עובד
**פתרון:** 
1. ודאי ש-`.env.local` לא בתוך תיקיית `src` אלא בתיקייה הראשית
2. הפעילי מחדש את השרת (`Ctrl+C` ואז `npm run dev`)
3. נסי שוב למלא את הטופס

---

## 📧 אימיילים אוטומטיים (אופציונלי)

אם את רוצה לשלוח אימייל אוטומטי לנרשמות:

1. ב-Brevo, לכי ל-**Automation** > **Scenarios**
2. צרי תרחיש חדש: "Welcome Email - Waitlist"
3. בחרי טריגר: **Contact added to list** (אם הגדרת List ID)
4. צרי תבנית אימייל עם ההודעה שלך
5. הפעילי את התרחיש

---

💡 **טיפ:** אם הכל עובד כמו שצריך, את יכולה למחוק את הקובץ הזה!


