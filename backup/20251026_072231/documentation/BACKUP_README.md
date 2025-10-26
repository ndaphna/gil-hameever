# גיבוי מלא למערכת Gil Hameever
# Full System Backup for Gil Hameever
# Generated: 2025-01-26 07:22:31

## תוכן הגיבוי / Backup Contents

### 📁 מבנה התיקיות / Directory Structure
```
backup/20251026_072231/
├── database/                    # גיבוי מסד הנתונים
│   ├── complete_schema_backup.sql
│   ├── 20241013_initial_schema.sql
│   ├── 20241013_add_color_to_emotion_entry.sql
│   ├── 20241013_fix_schema_consistency.sql
│   ├── 20241017_add_chat_tables.sql
│   ├── 20241024_menopause_journal_tables.sql
│   ├── 20250118_notification_system.sql
│   ├── check_database_status.sql
│   ├── verify_and_fix_schema.sql
│   └── README.md
├── source_code/                 # קוד המקור
│   ├── app/                     # Next.js App Router
│   ├── components/             # רכיבי React
│   ├── contexts/               # Context Providers
│   ├── hooks/                  # Custom Hooks
│   ├── lib/                    # Utilities & API clients
│   ├── styles/                 # CSS Styles
│   ├── types/                  # TypeScript Types
│   └── utils/                  # Helper Functions
├── config/                      # קבצי תצורה
│   ├── package.json
│   ├── package-lock.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── eslint.config.mjs
│   ├── postcss.config.mjs
│   ├── middleware.ts
│   └── env_template.txt
└── documentation/              # תיעוד המערכת
    └── BACKUP_README.md
```

## 🗄️ מסד הנתונים / Database

### טבלאות עיקריות / Main Tables
- **user_profile** - פרופילי משתמשים
- **thread** - שיחות צ'אט
- **message** - הודעות צ'אט
- **emotion_entry** - רשומות יומן רגשי
- **subscription** - מנויים
- **token_ledger** - מעקב שימוש בטוקנים

### מערכת התראות / Notification System
- **notification_preferences** - העדפות התראות
- **notification_templates** - תבניות התראות
- **scheduled_notifications** - התראות מתוזמנות
- **notification_history** - היסטוריית התראות
- **insight_analysis** - ניתוח תובנות

### פונקציות ומנגנונים / Functions & Mechanisms
- **update_updated_at_column()** - עדכון זמן עדכון אוטומטי
- **handle_new_user()** - יצירת פרופיל משתמש חדש
- **get_pending_notifications()** - קבלת התראות ממתינות
- **mark_notification_sent()** - סימון התראה כנשלחה
- **get_user_notification_preferences()** - קבלת העדפות משתמש

## 🔧 תצורת המערכת / System Configuration

### תלויות עיקריות / Main Dependencies
```json
{
  "next": "15.5.4",
  "react": "19.1.0",
  "@supabase/supabase-js": "^2.75.0",
  "openai": "^6.4.0"
}
```

### משתני סביבה נדרשים / Required Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` - כתובת Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - מפתח אנונימי Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - מפתח שירות Supabase
- `OPENAI_API_KEY` - מפתח API של OpenAI

## 🚀 הוראות שחזור / Restoration Instructions

### 1. הכנת הסביבה / Environment Setup
```bash
# יצירת פרויקט חדש
mkdir gil-hameever-restored
cd gil-hameever-restored

# העתקת קבצי התצורה
cp backup/20251026_072231/config/* .

# התקנת תלויות
npm install
```

### 2. הגדרת מסד הנתונים / Database Setup
1. צור פרויקט Supabase חדש
2. פתח את SQL Editor
3. הרץ את הקובץ `complete_schema_backup.sql`
4. ודא שכל הטבלאות נוצרו בהצלחה

### 3. הגדרת משתני סביבה / Environment Variables
```bash
# העתק את התבנית
cp backup/20251026_072231/config/env_template.txt .env.local

# ערוך את הערכים
# החלף את הערכים המסומנים בערכים האמיתיים שלך
```

### 4. העתקת קוד המקור / Source Code Restoration
```bash
# העתק את כל קוד המקור
cp -r backup/20251026_072231/source_code/* src/
```

### 5. הפעלת המערכת / System Startup
```bash
# הפעלת שרת הפיתוח
npm run dev

# בניית הפרויקט
npm run build
```

## 🔒 אבטחה / Security

### מידע רגיש / Sensitive Information
- מפתחות API לא נכללים בגיבוי
- משתני סביבה מוצפנים
- מדיניות RLS מופעלת על כל הטבלאות

### המלצות אבטחה / Security Recommendations
1. שמור את הגיבוי במקום מאובטח
2. אל תשתף מפתחות API
3. השתמש בהצפנה לגיבויים
4. עדכן מפתחות באופן קבוע

## 📊 סטטיסטיקות המערכת / System Statistics

### גודל הגיבוי / Backup Size
- קוד מקור: ~2MB
- מסד נתונים: ~50KB
- תצורה: ~10KB
- סה"כ: ~2.1MB

### רכיבי המערכת / System Components
- 15 טבלאות במסד הנתונים
- 8 פונקציות SQL
- 12 טריגרים
- 25+ מדיניות RLS
- 50+ רכיבי React
- 20+ API endpoints

## 🆘 פתרון בעיות / Troubleshooting

### בעיות נפוצות / Common Issues

#### שגיאת חיבור למסד נתונים / Database Connection Error
```bash
# בדוק את משתני הסביבה
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY

# ודא שהמפתחות נכונים
```

#### שגיאת הרשאות / Permission Error
```sql
-- בדוק הרשאות בטבלה
SELECT * FROM information_schema.table_privileges 
WHERE table_name = 'user_profile';
```

#### שגיאת בנייה / Build Error
```bash
# נקה cache
rm -rf .next
npm run build
```

## 📞 תמיכה / Support

### מידע ליצירת קשר / Contact Information
- פרויקט: Gil Hameever - פלטפורמת תמיכה בגיל המעבר
- טכנולוגיות: Next.js, React, Supabase, OpenAI
- תאריך גיבוי: 26 בינואר 2025

### קישורים שימושיים / Useful Links
- [תיעוד Next.js](https://nextjs.org/docs)
- [תיעוד Supabase](https://supabase.com/docs)
- [תיעוד OpenAI](https://platform.openai.com/docs)

---

**⚠️ חשוב: גיבוי זה מכיל מידע רגיש. שמור אותו במקום מאובטח ואל תשתף אותו עם גורמים לא מורשים.**

**⚠️ Important: This backup contains sensitive information. Store it securely and do not share it with unauthorized parties.**
