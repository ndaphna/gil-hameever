# 🔧 תיקון שגיאות הכנסת נתוני דמה

## שגיאות נפוצות:

### שגיאה 1:
```
ERROR: 42P01: relation "public.journal_preferences" does not exist
```

### שגיאה 2:
```
ERROR: 42703: column "is_read" of relation "aliza_messages" does not exist
```

### שגיאה 3:
```
ERROR: 42703: column "mood_level" of relation "cycle_entries" does not exist
```

---

## 🎯 הבעיה:

העמודות והטבלאות האלה הוספו במיגרציה `20250126_journal_enhancements.sql` שלא רצה במסד הנתונים שלך.

הסקריפטים **כבר תוקנו** להשתמש רק בעמודות בסיסיות שקיימות במיגרציה המקורית!

---

## ✅ הפתרון:

### הסקריפטים כבר תוקנו! 🎉

הסקריפטים `QUICK_INSERT_MOCK_DATA.sql` ו-`insert_mock_data_for_inbal.sql` **מתוקנים ומעודכנים**:

#### מה שונה:
1. ✅ **daily_entries** - משתמש בכל העמודות הבסיסיות
2. ✅ **cycle_entries** - רק עמודות בסיסיות (ללא mood_level, pain_level)
3. ✅ **aliza_messages** - רק עמודות בסיסיות (ללא is_read, priority)
4. ✅ **journal_preferences** - דולג אם הטבלה לא קיימת

#### עמודות שנשארו:
- `cycle_entries`: user_id, date, is_period, bleeding_intensity, symptoms, notes
- `aliza_messages`: user_id, type, message, emoji, action_url

**פשוט הריצי את הסקריפט שוב - הוא יעבוד!** 🚀

---

### אפשרות 2: צור את הטבלה החסרה (מומלץ)

אם את רוצה את כל התכונות, הריצי את המיגרציה החסרה:

1. **פתחי SQL Editor ב-Supabase**
2. **העתיקי והריצי**:

```sql
-- יצירת טבלת journal_preferences
CREATE TABLE IF NOT EXISTS public.journal_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profile(id) ON DELETE CASCADE,
  morning_reminder_time TIME DEFAULT '08:00:00',
  evening_reminder_time TIME DEFAULT '20:00:00',
  enable_morning_reminder BOOLEAN DEFAULT TRUE,
  enable_evening_reminder BOOLEAN DEFAULT TRUE,
  enable_cycle_predictions BOOLEAN DEFAULT TRUE,
  enable_symptom_insights BOOLEAN DEFAULT TRUE,
  preferred_language TEXT DEFAULT 'he',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- RLS
ALTER TABLE public.journal_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own journal preferences" ON public.journal_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own journal preferences" ON public.journal_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal preferences" ON public.journal_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Trigger
CREATE TRIGGER update_journal_preferences_updated_at BEFORE UPDATE ON public.journal_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

3. **אחרי שהטבלה נוצרה - הריצי את סקריפט המוק מחדש**

---

## 🚀 מה לעשות עכשיו:

### 1. הריצי את הסקריפט המתוקן:

```sql
-- העתק את כל התוכן מ-QUICK_INSERT_MOCK_DATA.sql והריץ
```

הסקריפט **לא יכשל** יותר - הוא פשוט ידלג על journal_preferences אם הטבלה לא קיימת.

### 2. אם רצית - צור את הטבלה:

הריצי את הקוד למעלה ליצירת `journal_preferences`.

---

## 📊 מה יקרה:

### אם הטבלה לא קיימת:
✅ דיווחים יומיים: יוכנסו (29 רשומות)  
✅ מחזורים: יוכנסו (16 רשומות)  
✅ הודעות עליזה: יוכנסו (6 הודעות)  
⚠️ העדפות יומן: ידלגו (טבלה לא קיימת)  

### אם הטבלה קיימת:
✅ כל הנתונים יוכנסו - כולל העדפות!

---

## 💡 למה זה קרה?

הטבלה `journal_preferences` נוצרה במיגרציה `20250126_journal_enhancements.sql`.

אם לא הרצת את המיגרציה הזו - הטבלה לא קיימת.

**זה לא בעיה!** הסקריפט המתוקן עובד גם בלי הטבלה הזו.

---

## ✨ סטטוס:

- ✅ הסקריפטים תוקנו
- ✅ לא ייכשלו יותר
- ✅ מוכנים לשימוש

**פשוט הריצי שוב! 🚀**
