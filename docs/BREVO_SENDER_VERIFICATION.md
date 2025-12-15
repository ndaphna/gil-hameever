# מדריך אימות Email Sender ב-Brevo

## הבעיה

אם אתה רואה שגיאה:
> "Sending has been rejected because the sender you used `xxx@example.com` is not valid"

זה אומר שה-email sender לא מאומת ב-Brevo.

## פתרון מהיר

### שלב 1: בדוק איזה Email משמש

בדוק את משתנה הסביבה `BREVO_FROM_EMAIL`:
- Vercel Dashboard → Settings → Environment Variables
- או הפעל: `GET /api/notifications/diagnose` ובדוק את `environment.BREVO_FROM_EMAIL`

### שלב 2: אמת את ה-Email ב-Brevo

#### אופציה A: Email בודד (Gmail/Outlook)

1. היכנס ל-[Brevo Dashboard](https://app.brevo.com/)
2. Settings → Senders & IP → **Senders**
3. לחץ על **"Add a sender"**
4. הזן:
   - **Email:** `gil.hameever@gmail.com` (או ה-email שלך)
   - **Name:** `עליזה - מנופאוזית וטוב לה`
5. לחץ **"Send verification email"**
6. פתח את תיבת הדואר של `gil.hameever@gmail.com`
7. לחץ על **קישור האימות** באימייל
8. המתין לאימות (יכול לקחת כמה דקות)

#### אופציה B: Domain (מומלץ למיילים רבים)

אם יש לך domain (למשל `gilhameever.com`):

1. Brevo Dashboard → Settings → Senders & IP → **Domains**
2. לחץ **"Add a domain"**
3. הזן את ה-domain: `gilhameever.com`
4. Brevo יציג לך **3 DNS records** להוספה:
   - **SPF record**
   - **DKIM record** (2 records)
   - **DMARC record** (אופציונלי)
5. היכנס ל-DNS provider שלך (למשל Cloudflare, GoDaddy)
6. הוסף את ה-records האלה
7. חזור ל-Brevo ולחץ **"Verify domain"**
8. המתין לאימות (יכול לקחת עד 24 שעות)

### שלב 3: בדוק שהאימות הצליח

1. Brevo Dashboard → Settings → Senders & IP → Senders
2. בדוק שה-email מופיע עם סטטוס **"Verified"** ✅
3. אם יש **"Pending"** - המתין עוד קצת
4. אם יש **"Failed"** - בדוק את ה-DNS records או נסה שוב

### שלב 4: בדוק שהמיילים נשלחים

1. Brevo Dashboard → Email → **Logs**
2. שלח מייל בדיקה
3. בדוק שהמייל מופיע כ-**"Delivered"** ולא **"Error"**

## פתרונות חלופיים

### אם אין לך גישה ל-Email

אם `gil.hameever@gmail.com` לא שלך:

1. **שנה ל-Email אחר:**
   - Vercel Dashboard → Environment Variables
   - עדכן `BREVO_FROM_EMAIL` ל-email שיש לך גישה אליו
   - אמת את ה-email החדש ב-Brevo
   - Redeploy

2. **השתמש ב-Domain Email:**
   - אם יש לך domain, צור email חדש (למשל `newsletter@gilhameever.com`)
   - אמת את ה-domain ב-Brevo
   - עדכן את `BREVO_FROM_EMAIL`

### אם Domain לא מאומת

אם יש לך domain אבל הוא לא מאומת:

1. בדוק שה-DNS records נוספו נכון
2. השתמש ב-[DNS Checker](https://dnschecker.org/) כדי לבדוק שה-records מופיעים
3. המתין עד 24 שעות (DNS propagation)
4. אם עדיין לא עובד, בדוק עם ה-DNS provider שלך

## בדיקות

### בדיקה 1: האם ה-Email מאומת?

```
Brevo Dashboard → Settings → Senders & IP → Senders
```

חפש את ה-email שלך - צריך להיות **"Verified"** ✅

### בדיקה 2: האם המיילים נשלחים?

```
Brevo Dashboard → Email → Logs
```

בדוק שהמיילים מופיעים כ-**"Delivered"** ולא **"Error"**

### בדיקה 3: האם הקוד משתמש ב-Email הנכון?

```bash
GET /api/notifications/diagnose
```

בדוק את `environment.BREVO_FROM_EMAIL` - צריך להיות ה-email המאומת

## טיפים

1. **Domain verification עדיף** - מאפשר לשלוח מכל email ב-domain
2. **Gmail/Outlook** - דורש אימות ידני (קישור באימייל)
3. **DNS propagation** - יכול לקחת עד 24 שעות
4. **תמיד בדוק את Email Logs** - שם תראה את השגיאות המדויקות

## קישורים שימושיים

- [Brevo Sender Verification Guide](https://help.brevo.com/hc/en-us/articles/209467485)
- [Brevo Domain Verification Guide](https://help.brevo.com/hc/en-us/articles/209467485)
- [DNS Checker](https://dnschecker.org/)

