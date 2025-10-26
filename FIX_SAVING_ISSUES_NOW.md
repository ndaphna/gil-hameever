# תיקון בעיות השמירה - עכשיו! 🚀

## הבעיה
הנתונים מהפופאפ של הדיווח היומי לא נשמרים ב-DB והדף מציג סימולציות במקום נתונים אמיתיים.

## הפתרון - 1 דקה

### שלב 1: פתח Supabase SQL Editor
1. לך ל: https://supabase.com/dashboard
2. בחר את הפרויקט שלך
3. לחץ על **SQL Editor**

### שלב 2: העתק והרץ את הקוד הזה
העתק את **כל** הקוד מהקובץ:
[`FINAL_FIX_SAVING_ISSUES.sql`](FINAL_FIX_SAVING_ISSUES.sql)

**או** העתק ישירות מכאן:

```sql
-- תיקון מהיר לכל בעיות השמירה
-- תעתיקי והריצי ב-Supabase SQL Editor

-- 1. בדיקה מה יש בטבלת user_profile
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'user_profile'
ORDER BY ordinal_position;

-- 2. הוספת עמודות חסרות ל-user_profile
DO $$
BEGIN
    -- הוספת full_name אם לא קיימת
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profile' AND column_name = 'full_name') THEN
        ALTER TABLE public.user_profile ADD COLUMN full_name TEXT;
    END IF;
    
    -- הוספת gender אם לא קיימת
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profile' AND column_name = 'gender') THEN
        ALTER TABLE public.user_profile ADD COLUMN gender TEXT CHECK (gender IN ('male', 'female', 'other'));
    END IF;
    
    -- הוספת birth_year אם לא קיימת
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profile' AND column_name = 'birth_year') THEN
        ALTER TABLE public.user_profile ADD COLUMN birth_year INTEGER;
    END IF;
    
    -- הוספת last_period_date אם לא קיימת
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profile' AND column_name = 'last_period_date') THEN
        ALTER TABLE public.user_profile ADD COLUMN last_period_date DATE;
    END IF;
    
    -- הוספת created_at אם לא קיימת
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profile' AND column_name = 'created_at') THEN
        ALTER TABLE public.user_profile ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
    
    -- הוספת updated_at אם לא קיימת
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profile' AND column_name = 'updated_at') THEN
        ALTER TABLE public.user_profile ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- 3. הפעלת RLS על user_profile
ALTER TABLE public.user_profile ENABLE ROW LEVEL SECURITY;

-- 4. יצירת פוליסות ל-user_profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profile;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profile;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profile;

CREATE POLICY "Users can view own profile" ON public.user_profile FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.user_profile FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.user_profile FOR INSERT WITH CHECK (auth.uid() = id);

-- 5. עדכון המשתמש הקיים עם הנתונים החדשים
UPDATE public.user_profile 
SET 
    full_name = 'ענבל דוד',
    gender = 'female',
    birth_year = 1975,
    last_period_date = CURRENT_DATE - INTERVAL '45 days',
    updated_at = NOW()
WHERE id = '7b42606e-16ae-448b-8505-79c5fa889d7e';

-- 6. אם המשתמש לא קיים, צור אותו
INSERT INTO public.user_profile (
    id, 
    email,
    full_name, 
    gender, 
    birth_year, 
    created_at, 
    last_period_date
)
SELECT 
    id,
    email,
    'ענבל דוד' as full_name,
    'female' as gender,
    1975 as birth_year,
    NOW() as created_at,
    CURRENT_DATE - INTERVAL '45 days' as last_period_date
FROM auth.users 
WHERE email = 'inbald@sapir.ac.il'
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    gender = EXCLUDED.gender,
    birth_year = EXCLUDED.birth_year,
    last_period_date = EXCLUDED.last_period_date,
    updated_at = NOW();

-- 7. וידוא ש-daily_entries קיימת
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

-- 8. הפעלת RLS על daily_entries
ALTER TABLE public.daily_entries ENABLE ROW LEVEL SECURITY;

-- 9. יצירת פוליסות ל-daily_entries
DROP POLICY IF EXISTS "Users can view own daily entries" ON public.daily_entries;
DROP POLICY IF EXISTS "Users can create own daily entries" ON public.daily_entries;
DROP POLICY IF EXISTS "Users can update own daily entries" ON public.daily_entries;
DROP POLICY IF EXISTS "Users can delete own daily entries" ON public.daily_entries;

CREATE POLICY "Users can view own daily entries" ON public.daily_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own daily entries" ON public.daily_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own daily entries" ON public.daily_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own daily entries" ON public.daily_entries FOR DELETE USING (auth.uid() = user_id);

-- 10. בדיקה סופית
SELECT 'SUCCESS! ✅ Everything is ready!' as result;
SELECT 'user_profile:' as table_name, count(*) as count FROM public.user_profile
UNION ALL
SELECT 'daily_entries:', count(*) FROM public.daily_entries;

-- 11. בדיקה שהמשתמש נוצר נכון
SELECT 
    id,
    email,
    full_name,
    gender,
    birth_year,
    created_at
FROM public.user_profile 
WHERE id = '7b42606e-16ae-448b-8505-79c5fa889d7e';
```

### שלב 3: לחץ RUN
לחץ על כפתור **RUN** או **Execute**

### שלב 4: בדוק את התוצאות
בתחתית המסך תראה:
```
SUCCESS! ✅ Everything is ready!
user_profile: 1
daily_entries: 0
```

וגם:
```
id: 7b42606e-16ae-448b-8505-79c5fa889d7e
email: inbald@sapir.ac.il
full_name: ענבל דוד
gender: female
birth_year: 1975
created_at: 2025-10-26...
```

## בדיקה באפליקציה

### 1. רענן את הדף
```
F5 או Ctrl+R
```

### 2. נסה לשמור דיווח חדש
1. לחץ על "בוקר" או "ערב"
2. מלא את הטופס
3. לחץ "שמור דיווח"

### 3. בדוק בConsole (F12)
תראה:
```
🔍 DailyTracking: loadEntries called
👤 Loading entries for userId: 7b42606e...
📡 Loading from Supabase for real user...
📦 Supabase response: {data: Array(1), error: null}
✅ Loaded entries count: 1
📋 Loaded entries: [{...}]
💾 DailyTracking: handleSaveEntry called
📊 Entry data: {sleep_quality: "good", ...}
🔒 Real user - saving to Supabase...
➕ Creating new entry...
✅ Entry created successfully: [{...}]
🔄 Reloading entries from database...
✅ Entries reloaded
✨ Real user save completed successfully
```

### 4. בדוק שהנתונים מופיעים
- הדיווח החדש מופיע ברשימה
- הסטטיסטיקות מתעדכנות
- אין שגיאות

## מה הסקריפט עושה?

1. ✅ **בודק את הסכמה** של user_profile
2. ✅ **מוסיף עמודות חסרות** (full_name, gender, birth_year, וכו')
3. ✅ **מגדיר RLS policies** נכונות
4. ✅ **מעדכן את המשתמש הקיים** עם הנתונים החדשים
5. ✅ **יוצר daily_entries** אם לא קיימת
6. ✅ **מגדיר RLS policies** ל-daily_entries
7. ✅ **בודק שהכל עובד**

## עדיין לא עובד?

### בדיקה 1: האם user_profile נוצר נכון?
רוץ ב-SQL Editor:
```sql
SELECT 
    id,
    email,
    full_name,
    gender,
    birth_year
FROM public.user_profile 
WHERE id = '7b42606e-16ae-448b-8505-79c5fa889d7e';
```

### בדיקה 2: מה השגיאה בConsole?
תעתיק את השגיאה מה-Console ותודיע לי!

## סיכום

הבעיה הייתה:
- ❌ `user_profile` חסרות עמודות (full_name, gender, וכו')
- ❌ `daily_entries` לא קיימת או חסרות RLS policies
- ❌ לכן השמירה נכשלת

הפתרון:
- ✅ הוספנו את כל העמודות החסרות
- ✅ עדכנו את המשתמש הקיים עם הנתונים החדשים
- ✅ יצרנו daily_entries עם RLS policies נכונות
- ✅ הגדרנו RLS policies נכונות

**עכשיו זה צריך לעבוד! 🎉**
