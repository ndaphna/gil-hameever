# 🗄️ הגדרת מסד נתונים אמיתי

## 📋 שלבים להפעלת האפליקציה עם נתונים אמיתיים:

### **שלב 1: יצירת משתמש ב-Supabase Auth**
1. לך ל-Supabase Dashboard
2. לך ל-Authentication > Users
3. לחץ על "Add user"
4. מלא:
   - **Email**: `nitzandaphna@gmail.com`
   - **Password**: `test123456`
   - **Auto Confirm User**: ✅ Yes
5. לחץ "Create user"
6. **העתק את ה-User ID** (UUID ארוך)

### **שלב 2: עדכון קובץ ה-SQL**
1. פתח את `sample_data.sql`
2. מצא את השורה:
   ```sql
   '00000000-0000-0000-0000-000000000001', -- Replace with actual user ID from Supabase Auth
   ```
3. החלף את ה-UUID עם ה-User ID האמיתי שהעתקת
4. שמור את הקובץ

### **שלב 3: הרצת הנתונים**
1. לך ל-Supabase Dashboard > SQL Editor
2. העתק את כל התוכן מ-`sample_data.sql` (עם ה-User ID החדש)
3. לחץ "Run" להרצת הסקריפט
4. ודא שהנתונים נטענו בהצלחה

### **שלב 4: הפעלת האפליקציה**
1. ודא ש-`useMockLogin` מוגדר כ-`false` ב-`src/app/login/page.tsx`
2. הפעל את האפליקציה: `npm run dev`
3. לך ל-`http://localhost:3000/login`
4. התחבר עם:
   - **Email**: `nitzandaphna@gmail.com`
   - **Password**: `test123456`

## 📊 הנתונים שיוצגו:
- **35 דיווחי מעקב יומי** (17 ימים אחורה)
- **10 דיווחי מחזור**
- **12 הודעות מעליזה**
- מגוון תסמינים ומצבי רוח
- נתונים בעברית עם תובנות אישיות

## 🔍 איך לוודא שזה עובד:
1. פתח את Developer Tools (F12)
2. לך ל-Console tab
3. חפש הודעות כמו:
   - ✅ "User authenticated successfully"
   - ❌ לא תראה "Using mock login" או "Using mock data"
