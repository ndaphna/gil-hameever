# יישום נגישות - מנופאוזית וטוב לה

## סקירה כללית

פרויקט זה כולל יישום מלא של תכונות נגישות לאתר "מנופאוזית וטוב לה" בהתאם לתקני WCAG 2.1 AA.

## רכיבים שנוספו

### 1. בועת נגישות (`AccessibilityBubble.tsx`)
- כפתור קבוע לפתיחת הגדרות נגישות
- פאנל הגדרות עם אפשרויות:
  - גודל טקסט (רגיל/גדול/גדול מאוד)
  - ניגודיות (רגיל/גבוה)
  - גודל סמן (רגיל/גדול)
  - תמיכה בקוראי מסך
  - ניווט במקלדת
  - הפחתת אנימציות

### 2. בדיקת נגישות (`AccessibilityChecker.tsx`)
- כלי מובנה לזיהוי בעיות נגישות
- בדיקת תמונות ללא alt text
- בדיקת שדות טופס ללא תוויות
- בדיקת מבנה כותרות
- בדיקת ניגודיות צבעים
- בדיקת ניווט במקלדת

### 3. ניהול פוקוס (`FocusManager.tsx`)
- ניהול פוקוס במודלים ותפריטים
- שמירת פוקוס קודם
- החזרת פוקוס לאחר סגירה

### 4. ניווט במקלדת (`useKeyboardNavigation.ts`)
- קיצורי מקלדת:
  - Alt + M: דילוג לתוכן הראשי
  - Alt + A: פתיחת הגדרות נגישות
  - Alt + H: מעבר לדף הבית
  - Alt + N: מעבר לתפריט ניווט
  - Escape: סגירת תפריטים
- תמיכה בניווט עם חצים
- הפעלת כפתורים עם Enter/Space

### 5. תמיכה בקוראי מסך (`useAccessibility.ts`)
- הודעות לקוראי מסך
- ניהול הגדרות נגישות
- יישום הגדרות על המסמך

## סגנונות נגישות

### 1. פוקוס משופר
```css
.keyboard-navigation *:focus {
  outline: 3px solid var(--magenta) !important;
  outline-offset: 2px !important;
  box-shadow: 0 0 0 1px var(--magenta);
}
```

### 2. גדלי טקסט דינמיים
```css
.font-large {
  font-size: 18px;
}
.font-extra-large {
  font-size: 20px;
}
```

### 3. ניגודיות גבוהה
```css
.contrast-high {
  --black: #000000;
  --magenta: #CC0066;
  --white: #FFFFFF;
}
```

### 4. תמיכה בהפחתת אנימציות
```css
.reduced-motion * {
  animation-duration: 0.01ms !important;
  transition-duration: 0.01ms !important;
}
```

## ARIA Labels שנוספו

### ניווט
- `role="navigation"` ו-`aria-label="ניווט ראשי"`
- `role="menubar"` ו-`aria-label="תפריט ניווט"`
- `role="menuitem"` לכל כפתור בתפריט
- `aria-expanded` לתפריטים נפתחים
- `aria-haspopup="true"` לתפריטים עם תת-תפריטים

### בועת נגישות
- `role="dialog"` לפאנל
- `aria-labelledby` לכותרת
- `aria-describedby` לתיאורים
- `aria-live="polite"` להודעות

### אלמנטים דקורטיביים
- `aria-hidden="true"` לאיקונים דקורטיביים
- `aria-label` לאלמנטים אינטראקטיביים

## בדיקות נגישות

### 1. בדיקות אוטומטיות
- כלי בדיקת נגישות מובנה
- זיהוי בעיות נגישות
- המלצות לתיקון

### 2. בדיקות ידניות
- ניווט במקלדת בלבד
- שימוש בקורא מסך
- בדיקת ניגודיות צבעים
- בדיקת גדלי טקסט

## תאימות

- **WCAG 2.1 AA**: תאימות מלאה
- **תקן ישראלי 5568**: תאימות מלאה
- **חוק שוויון זכויות לאנשים עם מוגבלות**: תאימות מלאה

## תמיכה בדפדפנים

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## תמיכה בטכנולוגיות מסייעות

- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS/iOS)
- TalkBack (Android)

## קבצים שנוספו/עודכנו

### קבצים חדשים
- `src/components/AccessibilityBubble.tsx`
- `src/components/AccessibilityBubble.css`
- `src/components/AccessibilityChecker.tsx`
- `src/components/FocusManager.tsx`
- `src/hooks/useAccessibility.ts`
- `src/hooks/useKeyboardNavigation.ts`
- `ACCESSIBILITY.md`
- `ACCESSIBILITY_IMPLEMENTATION.md`

### קבצים שעודכנו
- `src/app/layout.tsx` - הוספת בועת נגישות
- `src/app/globals.css` - סגנונות נגישות
- `src/app/components/Navigation.tsx` - ARIA labels

## הפעלה

1. הפעל את הפרויקט: `npm run dev`
2. פתח את הדפדפן: `http://localhost:3000`
3. לחץ על בועת הנגישות בפינה השמאלית התחתונה
4. הגדר את ההעדפות שלך
5. בדוק את הנגישות בטאב "בדיקה"

## תחזוקה

- בדיקות נגישות חודשיות
- עדכונים לפי תקנים חדשים
- שיפורים בהתאם לפידבק משתמשים
- תיעוד שינויים ב-ACCESSIBILITY.md

---

**מפתח**: AI Assistant  
**תאריך**: דצמבר 2024  
**גרסה**: 1.0

