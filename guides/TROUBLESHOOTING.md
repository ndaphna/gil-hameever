# מדריך פתרון בעיות - Troubleshooting Guide

## בעיה: "Error creating profile: {}" ביומן הרגשות

### סיבות אפשריות:
1. ❌ משתני הסביבה לא מוגדרים (`.env.local`)
2. ❌ למשתמש אין פרופיל בטבלת `user_profile`
3. ❌ הטבלאות בבסיס הנתונים לא מסונכרנות
4. ❌ RLS policies לא מוגדרות נכון

### פתרון צעד אחר צעד:

---

## שלב 1: הגדרת משתני הסביבה ⚙️

### בדיקה: האם קיים קובץ `.env.local`?
אם לא - **עקבי אחר ההוראות ב-`SETUP.md`**

קובץ `.env.local` צריך להכיל:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

⚠️ **אחרי יצירת הקובץ - חובה לאתחל את השרת:**
```bash
# עצרי את השרת (Ctrl+C)
npm run dev
```

---

## שלב 2: בדיקת מצב בסיס הנתונים 🔍

1. **היכנסי ל-Supabase Dashboard**
   - https://supabase.com/dashboard
   
2. **פתחי SQL Editor**
   - לחצי על "SQL Editor" בתפריט השמאלי
   - לחצי על "New Query"

3. **הריצי את סקריפט הבדיקה**
   ```sql
   -- העתיקי את כל התוכן מהקובץ:
   supabase/migrations/check_database_status.sql
   ```
   
4. **בדקי את התוצאות:**
   - ✓ האם כל הטבלאות קיימות?
   - ✓ האם RLS מופעל על כל הטבלאות?
   - ✓ האם יש משתמשים ללא פרופילים?

---

## שלב 3: תיקון בסיס הנתונים 🔧

אם מצאת בעיות בשלב 2, הריצי את סקריפט התיקון:

1. **ב-SQL Editor, פתחי New Query**

2. **העתיקי את כל התוכן מהקובץ:**
   ```
   supabase/migrations/verify_and_fix_schema.sql
   ```

3. **לחצי Run (או Ctrl+Enter)**

הסקריפט יתקן אוטומטית:
- ✅ שמות עמודות שגויים
- ✅ יצירת פרופילים חסרים
- ✅ הוספת עמודת color
- ✅ הגדרת RLS policies
- ✅ תיקון foreign keys

4. **הריצי שוב את סקריפט הבדיקה** לאימות שהכל תקין

---

## שלב 4: בדיקת הפתרון ✅

1. **רענני את הדפדפן** (F5)
2. **נסי להוסיף רשומת רגשות ביומן**
3. **בדקי את הקונסול** (F12) - לא אמורות להיות שגיאות

---

## שגיאות נפוצות נוספות

### 1. "new row violates row-level security policy"

**משמעות:** המשתמש לא יכול להכניס נתונים בגלל RLS

**פתרון:**
```sql
-- בדקי שהמשתמש מחובר ויש לו פרופיל:
SELECT * FROM auth.users;
SELECT * FROM public.user_profile;

-- אם יש משתמש ללא פרופיל, הריצי:
-- verify_and_fix_schema.sql
```

---

### 2. "relation 'emotion_entry' does not exist"

**משמעות:** הטבלה לא קיימת

**פתרון:** הריצי את כל ה-migrations בסדר:
1. `20241013_initial_schema.sql`
2. `20241013_fix_schema_consistency.sql`
3. `20241013_add_color_to_emotion_entry.sql`
4. `verify_and_fix_schema.sql`

---

### 3. "column 'color' does not exist"

**משמעות:** עמודת color חסרה בטבלה

**פתרון:**
```sql
-- הריצי:
ALTER TABLE public.emotion_entry ADD COLUMN color TEXT;

-- או פשוט הריצי:
-- verify_and_fix_schema.sql
```

---

### 4. "Missing Supabase environment variables"

**משמעות:** קובץ `.env.local` לא קיים או לא נטען

**פתרון:**
1. ✅ ודאי שהקובץ `.env.local` קיים בתיקייה `gil-hameever`
2. ✅ ודאי שהשרת אותחל מחדש אחרי יצירת הקובץ
3. ✅ ודאי שהערכים נכונים (ללא רווחים, ללא גרשיים)

---

### 5. הכרטיס נשמר אבל הצבע לא משתנה

**סיבה:** השדה `color` לא נשמר בבסיס הנתונים

**פתרון זה כבר תוקן!** אבל אם עדיין יש בעיה:
1. ✅ ודאי שהקוד מכיל: `color: selectedColor.value` (ללא הערה)
2. ✅ ודאי שעמודת color קיימת: הריצי `check_database_status.sql`

---

## בדיקת התקינות - Checklist מלא

נעברי על הרשימה הזו:

### משתני סביבה
- [ ] קובץ `.env.local` קיים
- [ ] `NEXT_PUBLIC_SUPABASE_URL` מוגדר
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` מוגדר
- [ ] `SUPABASE_SERVICE_ROLE_KEY` מוגדר
- [ ] השרת אותחל מחדש אחרי יצירת הקובץ

### בסיס נתונים
- [ ] כל ה-migrations הורצו
- [ ] טבלת `user_profile` קיימת
- [ ] טבלת `emotion_entry` קיימת
- [ ] עמודת `color` קיימת ב-`emotion_entry`
- [ ] RLS מופעל על כל הטבלאות
- [ ] למשתמש שלי יש פרופיל ב-`user_profile`

### קוד
- [ ] `journal/page.tsx` כולל `color: selectedColor.value`
- [ ] `api/create-profile/route.ts` בודק משתני סביבה

### בדיקת פונקציונליות
- [ ] אני יכולה להתחבר
- [ ] אני רואה את עמוד היומן
- [ ] אני יכולה להוסיף רשומה חדשה
- [ ] הצבע שבחרתי נשמר
- [ ] אין שגיאות בקונסול

---

## עדיין לא עובד? 🆘

אם עברת על כל השלבים והבעיה נמשכת:

1. **ייצא את הלוגים:**
   - פתחי את Console בדפדפן (F12)
   - העתיקי את כל השגיאות

2. **בדקי בטבלה ישירות:**
   ```sql
   -- ב-SQL Editor, הריצי:
   SELECT * FROM auth.users;
   SELECT * FROM public.user_profile;
   SELECT * FROM public.emotion_entry;
   ```

3. **נסי ליצור פרופיל ידנית:**
   ```sql
   INSERT INTO public.user_profile (id, email, name, subscription_status, current_tokens)
   VALUES (
     'YOUR-USER-ID-HERE',
     'your-email@example.com',
     'השם שלך',
     'free',
     500
   );
   ```

4. **פנה לתמיכה** עם:
   - הלוגים מהקונסול
   - תוצאות `check_database_status.sql`
   - צילום מסך של השגיאה




