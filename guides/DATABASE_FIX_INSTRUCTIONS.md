# 🔧 תיקון בעיית מסד הנתונים - cycle_entries

## הבעיה

השגיאה שמתקבלת:
```
Error: column cycle_entries.date does not exist
```

זה אומר שהטבלה `cycle_entries` במסד הנתונים של Supabase לא מכילה את העמודה `date`.

## הפתרון

יש **2 אפשרויות** לתקן את הבעיה:

---

## אפשרות 1: הרצת סקריפט תיקון ב-Supabase Dashboard (מומלץ)

### שלבים:

1. **היכנסי ל-Supabase Dashboard**
   - לכי ל: https://supabase.com/dashboard
   - בחרי בפרויקט שלך

2. **פתחי את ה-SQL Editor**
   - בתפריט הצד, לחצי על **SQL Editor**
   - לחצי על **New query**

3. **הריצי את סקריפט התיקון**
   
   **העתיקי והדביקי את הקוד הבא:**

```sql
-- Fix cycle_entries schema
-- This script ensures the cycle_entries table has the correct structure

-- First, drop the existing table if it exists (⚠️ זה ימחק נתונים קיימים!)
DROP TABLE IF EXISTS public.cycle_entries CASCADE;

-- Recreate the table with the correct schema
CREATE TABLE public.cycle_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profile(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_period BOOLEAN NOT NULL DEFAULT FALSE,
  bleeding_intensity TEXT CHECK (bleeding_intensity IN ('light', 'medium', 'heavy')),
  symptoms TEXT[],
  notes TEXT,
  mood_level TEXT CHECK (mood_level IN ('very_low', 'low', 'neutral', 'good', 'excellent')),
  pain_level INTEGER CHECK (pain_level >= 0 AND pain_level <= 10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE public.cycle_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view own cycle entries" ON public.cycle_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own cycle entries" ON public.cycle_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cycle entries" ON public.cycle_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cycle entries" ON public.cycle_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Create Indexes
CREATE INDEX idx_cycle_entries_user_id ON public.cycle_entries(user_id);
CREATE INDEX idx_cycle_entries_date ON public.cycle_entries(date);
CREATE INDEX idx_cycle_entries_is_period ON public.cycle_entries(is_period);

-- Create Update Trigger
CREATE TRIGGER update_cycle_entries_updated_at BEFORE UPDATE ON public.cycle_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

4. **לחצי על RUN** (או Ctrl+Enter)

5. **בדקי שהכל עבד**
   - אם קיבלת "Success" - מצוין!
   - רעננ/י את האתר ובדק/י שהשגיאה נעלמה

---

## אפשרות 2: בדיקה ותיקון ידני

אם את רוצה לבדוק קודם מה המצב בפועל:

### 1. בדיקת המבנה הקיים

```sql
-- בדיקה איזה עמודות יש בטבלה
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'cycle_entries' 
  AND table_schema = 'public';
```

### 2. אם העמודה `date` לא קיימת - הוספה שלה

```sql
-- הוספת עמודת date
ALTER TABLE public.cycle_entries 
ADD COLUMN date DATE NOT NULL DEFAULT CURRENT_DATE;

-- הוספת index
CREATE INDEX IF NOT EXISTS idx_cycle_entries_date 
ON public.cycle_entries(date);
```

---

## תיקון נוסף: daily_entries

אם יש בעיה דומה עם `daily_entries`, הריצי גם:

```sql
-- בדיקה אם יש בעיה
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'daily_entries' 
  AND table_schema = 'public';
```

אם חסרה העמודה `date`, הריצי את הסקריפט מ:
`supabase/migrations/fix_daily_entries_schema.sql`

---

## אחרי התיקון

1. **רענני את הדפדפן** - Ctrl+F5 (או Cmd+Shift+R ב-Mac)
2. **נקי את ה-Cache**
3. **בדקי שהיומן עובד**

---

## ⚠️ אזהרה חשובה

הסקריפט `DROP TABLE` ימחק את כל הנתונים הקיימים בטבלה!

אם יש לך נתונים חשובים:
1. תחילה, עשי גיבוי של הנתונים
2. אחר כך הריצי את הסקריפט
3. אם צריך, ייבאי את הנתונים בחזרה

---

## בדיקה שהכל תקין

אחרי שהרצת את הסקריפט, בדקי:

```sql
-- בדיקה שהטבלה קיימת עם כל העמודות
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name IN ('cycle_entries', 'daily_entries')
  AND table_schema = 'public'
ORDER BY table_name, ordinal_position;
```

אמורים להופיע:
- `cycle_entries.date` - DATE
- `daily_entries.date` - DATE
- ועוד כל שאר העמודות

---

## אם עדיין יש בעיה

1. בדקי ש-RLS policies פעילים:
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('cycle_entries', 'daily_entries');
```

2. בדקי שהמשתמש מחובר נכון ויש לו `user_id` תקין

3. בדקי את הקונסולה ב-DevTools לשגיאות נוספות

---

## צריכה עזרה?

אם הבעיה לא נפתרה, שלחי:
1. צילום מסך של השגיאה
2. התוצאות של השאילתות למעלה
3. את ה-Network tab מ-DevTools כשהשגיאה קורית
