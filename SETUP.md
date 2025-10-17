# הגדרת משתני סביבה - Setup Instructions

## שלב 1: יצירת קובץ משתני סביבה

צרי קובץ בשם `.env.local` בתיקייה הראשית של הפרויקט (`gil-hameever`).

## שלב 2: קבלת ערכי Supabase

1. היכנסי ל-[Supabase Dashboard](https://supabase.com/dashboard)
2. בחרי את הפרויקט שלך
3. לחצי על **Settings** (הגדרות) בתפריט השמאלי
4. לחצי על **API**
5. תראי את הערכים הבאים:

### Project URL
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
```

### anon/public key
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### service_role key (⚠️ סודי מאוד!)
```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

## שלב 3: העתיקי את התוכן הבא לקובץ `.env.local`

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**החליפי** את הערכים:
- `https://your-project-id.supabase.co` - ב-Project URL שלך
- `your-anon-key-here` - ב-anon key שלך
- `your-service-role-key-here` - ב-service_role key שלך

## שלב 4: הרצת סקריפט SQL לתיקון הטבלאות

1. היכנסי ל-Supabase Dashboard
2. לחצי על **SQL Editor** בתפריט השמאלי
3. לחצי על **New Query**
4. פתחי את הקובץ `supabase/migrations/verify_and_fix_schema.sql`
5. העתיקי את כל התוכן והדביקי ב-SQL Editor
6. לחצי על **Run** (או Ctrl+Enter)

הסקריפט יתקן אוטומטית:
- ✅ שמות עמודות שאינן תואמות (name במקום full_name וכו')
- ✅ יצירת פרופילים חסרים למשתמשים קיימים
- ✅ הוספת עמודת color לטבלת emotion_entry
- ✅ וידוא שכל ה-RLS policies פעילים
- ✅ וידוא שכל הקשרים בין הטבלאות תקינים

## שלב 5: אתחול מחדש של שרת הפיתוח

לאחר יצירת קובץ `.env.local`:

```bash
# עצרי את השרת (Ctrl+C)
# הריצי מחדש:
npm run dev
```

## בדיקה שהכל עובד

1. התחברי לאפליקציה
2. נסי להוסיף רשומת רגשות ביומן
3. אמורה להופיע הודעת הצלחה ללא שגיאות

## פתרון בעיות נפוצות

### שגיאה: "Error creating profile"
- ✅ ודאי ש-`SUPABASE_SERVICE_ROLE_KEY` מוגדר בקובץ `.env.local`
- ✅ ודאי שהרצת את סקריפט ה-SQL
- ✅ ודאי שאתחלת מחדש את שרת הפיתוח

### שגיאה: "relation does not exist"
- ✅ הריצי את כל קבצי ה-migrations בסדר:
  1. `20241013_initial_schema.sql`
  2. `20241013_fix_schema_consistency.sql`
  3. `20241013_add_color_to_emotion_entry.sql`
  4. `verify_and_fix_schema.sql`

### שגיאה: "new row violates row-level security policy"
- ✅ ודאי שה-RLS policies הוגדרו נכון (הסקריפט אמור לטפל בזה)
- ✅ ודאי שהמשתמש מחובר (auth.uid() מחזיר ערך)

## אבטחה ⚠️

**חשוב מאוד:**
- ✅ קובץ `.env.local` כבר נמצא ב-`.gitignore` ולא יועלה ל-Git
- ❌ **לעולם** אל תשתפי את ה-`service_role key` עם אף אחד
- ❌ **לעולם** אל תשתמשי ב-`service_role key` בצד הלקוח (client-side)
- ✅ השתמשי ב-`service_role key` רק ב-API routes (בתיקיית `/api`)


