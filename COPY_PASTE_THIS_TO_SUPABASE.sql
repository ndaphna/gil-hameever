-- ================================
-- תיקון טבלת cycle_entries
-- ================================
-- 
-- מה הסקריפט הזה עושה:
-- 1. מוחק את הטבלה הישנה עם המבנה השגוי
-- 2. יוצר טבלה חדשה עם העמודה 'date' שחסרה
-- 3. מגדיר הרשאות (RLS Policies)
-- 4. יוצר אינדקסים לביצועים
-- 5. מוסיף trigger לעדכון אוטומטי
--
-- ⚠️ אזהרה: זה ימחק נתונים קיימים בטבלה!
-- ================================

-- שלב 1: מחיקת הטבלה הישנה
DROP TABLE IF EXISTS public.cycle_entries CASCADE;

-- שלב 2: יצירת הטבלה החדשה עם כל העמודות הנדרשות
CREATE TABLE public.cycle_entries (
  -- מזהה ייחודי לכל רשומה
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- מזהה המשתמשת
  user_id UUID NOT NULL REFERENCES public.user_profile(id) ON DELETE CASCADE,
  
  -- 👈 זו העמודה שחסרה! date - תאריך הרשומה
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- האם זה יום של מחזור
  is_period BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- עוצמת הדימום
  bleeding_intensity TEXT CHECK (bleeding_intensity IN ('light', 'medium', 'heavy')),
  
  -- רשימת סימפטומים
  symptoms TEXT[],
  
  -- הערות חופשיות
  notes TEXT,
  
  -- רמת מצב רוח
  mood_level TEXT CHECK (mood_level IN ('very_low', 'low', 'neutral', 'good', 'excellent')),
  
  -- רמת כאב (0-10)
  pain_level INTEGER CHECK (pain_level >= 0 AND pain_level <= 10),
  
  -- זמן יצירה ועדכון
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- הגבלה: רשומה אחת למשתמשת ליום
  UNIQUE(user_id, date)
);

-- שלב 3: הפעלת אבטחת שורות (RLS)
ALTER TABLE public.cycle_entries ENABLE ROW LEVEL SECURITY;

-- שלב 4: יצירת מדיניות הרשאות
-- משתמשות יכולות לראות רק את הרשומות שלהן
CREATE POLICY "Users can view own cycle entries" ON public.cycle_entries
  FOR SELECT USING (auth.uid() = user_id);

-- משתמשות יכולות ליצור רשומות חדשות
CREATE POLICY "Users can create own cycle entries" ON public.cycle_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- משתמשות יכולות לעדכן את הרשומות שלהן
CREATE POLICY "Users can update own cycle entries" ON public.cycle_entries
  FOR UPDATE USING (auth.uid() = user_id);

-- משתמשות יכולות למחוק את הרשומות שלהן
CREATE POLICY "Users can delete own cycle entries" ON public.cycle_entries
  FOR DELETE USING (auth.uid() = user_id);

-- שלב 5: יצירת אינדקסים לביצועים טובים יותר
CREATE INDEX idx_cycle_entries_user_id ON public.cycle_entries(user_id);
CREATE INDEX idx_cycle_entries_date ON public.cycle_entries(date);
CREATE INDEX idx_cycle_entries_is_period ON public.cycle_entries(is_period);

-- שלב 6: הוספת trigger לעדכון אוטומטי של updated_at
CREATE TRIGGER update_cycle_entries_updated_at BEFORE UPDATE ON public.cycle_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- סיימנו! אם הכל עבד טוב, אמור להיות כתוב למטה:
-- "Success. No rows returned"
-- ================================
