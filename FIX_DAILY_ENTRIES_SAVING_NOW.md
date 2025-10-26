# תיקון בעיית שמירת דיווחים יומיים - עכשיו! 🔥

## הבעיה
הדיווחים היומיים לא נשמרים כי:
1. ❌ אין user_profile למשתמש שלך
2. ❌ הטבלה daily_entries מחפשת user_profile שלא קיים
3. ❌ לכן השמירה נכשלת

## הפתרון - 3 דקות

### שלב 1: פתח את Supabase Dashboard
1. לך ל: https://supabase.com/dashboard
2. בחר את הפרויקט שלך
3. לחץ על **SQL Editor** בתפריט השמאלי

### שלב 2: העתק והרץ את הקוד הזה
העתק את **כל** הקוד מהקובץ:
[`FIX_USER_PROFILE_AND_DAILY_ENTRIES.sql`](FIX_USER_PROFILE_AND_DAILY_ENTRIES.sql)

**או** העתק ישירות מכאן:

```sql
-- תיקון בעיית שמירת דיווחים יומיים
-- תעתיקי והריצי ב-Supabase SQL Editor

-- 1. בדיקה אם הטבלה daily_entries קיימת
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'daily_entries'
) as daily_entries_exists;

-- 2. בדיקה אם יש user_profile למשתמש שלך
-- החליפי את ה-email שלך כאן:
SELECT * FROM public.user_profile 
WHERE id IN (
    SELECT id FROM auth.users 
    WHERE email = 'inbald@sapir.ac.il'
);

-- 3. אם אין user_profile, צרי אחד:
INSERT INTO public.user_profile (id, full_name, gender, birth_year, created_at, last_period_date)
SELECT 
    id,
    'ענבל דוד' as full_name,
    'female' as gender,
    1975 as birth_year,
    NOW() as created_at,
    CURRENT_DATE - INTERVAL '45 days' as last_period_date
FROM auth.users 
WHERE email = 'inbald@sapir.ac.il'
AND NOT EXISTS (
    SELECT 1 FROM public.user_profile 
    WHERE user_profile.id = auth.users.id
);

-- 4. בדיקה אם הפוליסות קיימות
SELECT * FROM pg_policies 
WHERE tablename = 'daily_entries';

-- 5. אם הטבלה לא קיימת, צרי אותה:
CREATE TABLE IF NOT EXISTS public.daily_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profile(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  time_of_day TEXT NOT NULL CHECK (time_of_day IN ('morning', 'evening')),
  sleep_quality TEXT CHECK (sleep_quality IN ('poor', 'fair', 'good')),
  woke_up_night BOOLEAN DEFAULT FALSE,
  night_sweats BOOLEAN DEFAULT FALSE,
  energy_level TEXT CHECK (energy_level IN ('low', 'medium', 'high')),
  mood TEXT CHECK (mood IN ('calm', 'irritated', 'sad', 'happy', 'frustrated')),
  hot_flashes BOOLEAN DEFAULT FALSE,
  dryness BOOLEAN DEFAULT FALSE,
  pain BOOLEAN DEFAULT FALSE,
  bloating BOOLEAN DEFAULT FALSE,
  concentration_difficulty BOOLEAN DEFAULT FALSE,
  sleep_issues BOOLEAN DEFAULT FALSE,
  sexual_desire BOOLEAN DEFAULT FALSE,
  daily_insight TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date, time_of_day)
);

-- 6. הפעלת RLS
ALTER TABLE public.daily_entries ENABLE ROW LEVEL SECURITY;

-- 7. יצירת פוליסות אם לא קיימות
DO $$
BEGIN
    -- Delete existing policies
    DROP POLICY IF EXISTS "Users can view own daily entries" ON public.daily_entries;
    DROP POLICY IF EXISTS "Users can create own daily entries" ON public.daily_entries;
    DROP POLICY IF EXISTS "Users can update own daily entries" ON public.daily_entries;
    DROP POLICY IF EXISTS "Users can delete own daily entries" ON public.daily_entries;
    
    -- Create new policies
    CREATE POLICY "Users can view own daily entries" ON public.daily_entries
      FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "Users can create own daily entries" ON public.daily_entries
      FOR INSERT WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update own daily entries" ON public.daily_entries
      FOR UPDATE USING (auth.uid() = user_id);

    CREATE POLICY "Users can delete own daily entries" ON public.daily_entries
      FOR DELETE USING (auth.uid() = user_id);
END $$;

-- 8. יצירת אינדקסים
CREATE INDEX IF NOT EXISTS idx_daily_entries_user_id ON public.daily_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_entries_date ON public.daily_entries(date);
CREATE INDEX IF NOT EXISTS idx_daily_entries_time_of_day ON public.daily_entries(time_of_day);

-- 9. בדיקה סופית - נסיון להכניס דיווח בדיקה
-- החליפי את ה-user_id בהתאם
INSERT INTO public.daily_entries (
    user_id,
    date,
    time_of_day,
    sleep_quality,
    energy_level,
    mood,
    daily_insight
)
SELECT 
    id as user_id,
    CURRENT_DATE,
    'morning' as time_of_day,
    'good' as sleep_quality,
    'high' as energy_level,
    'happy' as mood,
    'דיווח בדיקה' as daily_insight
FROM public.user_profile 
WHERE id IN (
    SELECT id FROM auth.users 
    WHERE email = 'inbald@sapir.ac.il'
)
ON CONFLICT (user_id, date, time_of_day) DO NOTHING;

-- 10. בדיקה אם הדיווח נשמר
SELECT * FROM public.daily_entries 
WHERE user_id IN (
    SELECT id FROM auth.users 
    WHERE email = 'inbald@sapir.ac.il'
)
ORDER BY created_at DESC;
```

### שלב 3: לחץ על RUN
לחץ על כפתור **RUN** או **Execute**

### שלב 4: בדוק את התוצאות
בתחתית המסך תראה:
- ✅ user_profile נוצר
- ✅ daily_entries table קיימת
- ✅ RLS policies נוצרו
- ✅ דיווח בדיקה נשמר

## בדיקה באפליקציה

### 1. רענן את הדף
```
F5 או Ctrl+R
```

### 2. פתח Console
```
F12 → Console
```

### 3. נסה לשמור דיווח חדש
1. לחץ על "בוקר" או "ערב"
2. מלא את הטופס
3. לחץ "שמור דיווח"

### 4. בדוק בConsole את הלוגים:
```
🔍 DailyTracking: loadEntries called
👤 Loading entries for userId: 7b42606e-16ae-448b-8505-79c5fa889d7e
📡 Loading from Supabase for real user...
📦 Supabase response: {data: Array(1), error: null}
✅ Loaded entries count: 1
📋 Loaded entries: [{...}]
```

## עדיין לא עובד?

### בדיקה 1: האם user_profile נוצר?
רוץ ב-SQL Editor:
```sql
SELECT * FROM public.user_profile 
WHERE id IN (
    SELECT id FROM auth.users 
    WHERE email = 'inbald@sapir.ac.il'
);
```

אם אין תוצאות - הבעיה היא ב-user_profile.

### בדיקה 2: האם יש שגיאות RLS?
רוץ ב-SQL Editor:
```sql
-- בדיקה בתור המשתמש שלך
SELECT * FROM public.daily_entries;
```

אם יש שגיאה - הבעיה היא ב-RLS.

### בדיקה 3: מה השגיאה בConsole?
תעתיק את השגיאה מה-Console ותודיע לי!

## סיכום

הבעיה הייתה ש:
1. **daily_entries** דורשת **user_profile**
2. **user_profile** לא היה קיים
3. לכן השמירה נכשלה

הפתרון:
1. יצרנו **user_profile**
2. וידאנו ש-**daily_entries** קיימת
3. הגדרנו **RLS policies** נכונות
4. בדקנו עם דיווח בדיקה

**עכשיו זה צריך לעבוד! 🎉**
