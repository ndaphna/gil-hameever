# הגדרת תמונות פרופיל

## שלב 1: יצירת Storage Bucket ב-Supabase

1. לך ל-Supabase Dashboard: https://supabase.com/dashboard
2. בחר את הפרויקט שלך
3. לחץ על **Storage** בתפריט הצד
4. לחץ על **New bucket**
5. מלא את הפרטים:
   - **Name**: `profile-images`
   - **Public bucket**: ✅ כן (צריך להיות public כדי שהתמונות יהיו נגישות)
   - **File size limit**: 5 MB (או יותר לפי הצורך)
   - **Allowed MIME types**: `image/jpeg,image/jpg,image/png,image/gif,image/webp`
6. לחץ על **Create bucket**

## שלב 2: הגדרת RLS Policies

לאחר יצירת ה-bucket, הגדר את ה-policies הבאות:

### Policy 1: משתמשים יכולים להעלות תמונות משלהם

```sql
CREATE POLICY "Users can upload their own profile images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### Policy 2: משתמשים יכולים לעדכן תמונות משלהם

```sql
CREATE POLICY "Users can update their own profile images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### Policy 3: משתמשים יכולים למחוק תמונות משלהם

```sql
CREATE POLICY "Users can delete their own profile images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### Policy 4: כל המשתמשים יכולים לקרוא תמונות (כי ה-bucket הוא public)

```sql
CREATE POLICY "Anyone can view profile images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-images');
```

## שלב 3: הרצת Migration

הרץ את ה-migration הבא ב-Supabase SQL Editor:

```sql
-- File: supabase/migrations/20250130_add_phone_and_profile_image.sql
```

או העתק את התוכן מהקובץ והרץ אותו.

## בדיקה

לאחר ההגדרה:
1. התחברי למערכת
2. לך לעמוד הפרופיל
3. נסי להעלות תמונת פרופיל
4. ודאי שהתמונה מופיעה

## פתרון בעיות

### שגיאה: "Bucket not found"
- ודאי שה-bucket `profile-images` נוצר ב-Storage
- ודאי שהשם מדויק (case-sensitive)

### שגיאה: "Access denied"
- ודאי שה-RLS policies הוגדרו נכון
- ודאי שה-bucket הוא public

### שגיאה: "File too large"
- ודאי שהקובץ קטן מ-5MB
- או הגדל את ה-file size limit ב-bucket settings






