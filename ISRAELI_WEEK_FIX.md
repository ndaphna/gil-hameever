# שבוע ישראלי (ראשון-שבת) בכל המערכת - הושלם! ✅

## מה תוקן

בישראל, השבוע מתחיל ביום ראשון ונגמר בשבת.
עדכנתי את כל חישובי השבוע במערכת להתאים לשבוע הישראלי.

## קבצים שעודכנו

### 1. `src/components/journal/DailyTracking.tsx`
**לפני:**
```tsx
const oneWeekAgo = new Date();
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
const weeklyEntries = entries.filter(e => new Date(e.date) >= oneWeekAgo);
```

**אחרי:**
```tsx
// Find last Sunday (start of Israeli week)
const nowDate = new Date();
const currentDayOfWeek = nowDate.getDay(); // 0 = Sunday
const lastSunday = new Date(nowDate);
lastSunday.setDate(nowDate.getDate() - currentDayOfWeek);
lastSunday.setHours(0, 0, 0, 0);

const weeklyEntries = entries.filter(e => new Date(e.date) >= lastSunday);
```

### 2. `src/components/journal/MoodCards.tsx`
**לפני:**
```tsx
const periodDays = selectedPeriod === 'week' ? 7 : ...;
const startDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);
```

**אחרי:**
```tsx
if (selectedPeriod === 'week') {
  // Find last Sunday (start of Israeli week)
  const currentDayOfWeek = now.getDay();
  startDate = new Date(now);
  startDate.setDate(now.getDate() - currentDayOfWeek);
  startDate.setHours(0, 0, 0, 0);
}
```

### 3. `src/app/dashboard/page.tsx`
**לפני:**
```tsx
const oneWeekAgo = new Date();
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
const weeklyEntries = daily.filter(e => new Date(e.date) >= oneWeekAgo);
```

**אחרי:**
```tsx
// Find last Sunday (start of Israeli week)
const nowForWeek = new Date();
const currentDayOfWeekForStats = nowForWeek.getDay();
const lastSundayForStats = new Date(nowForWeek);
lastSundayForStats.setDate(nowForWeek.getDate() - currentDayOfWeekForStats);
lastSundayForStats.setHours(0, 0, 0, 0);

const weeklyEntries = daily.filter(e => new Date(e.date) >= lastSundayForStats);
```

## איך זה עובד

### דוגמה 1: היום ראשון (26.10.2025)
```
השבוע הנוכחי: א׳ 26.10 - ש׳ 1.11
מציג: דיווחים מיום ראשון ואילך
```

### דוגמה 2: היום רביעי (29.10.2025)
```
השבוע הנוכחי: א׳ 26.10 - ש׳ 1.11
מציג: דיווחים מיום ראשון 26.10 ואילך
```

### דוגמה 3: היום שבת (1.11.2025)
```
השבוע הנוכחי: א׳ 26.10 - ש׳ 1.11
מציג: דיווחים מיום ראשון 26.10 עד שבת 1.11
```

## היתרונות

✅ **שבוע ישראלי** - מתחיל ביום ראשון תמיד
✅ **עקבי** - כל המערכת משתמשת באותה לוגיקה
✅ **מדויק** - לא 7 ימים אחורה, אלא מתחילת השבוע
✅ **ברור** - המשתמשת רואה את השבוע הנוכחי שלה

## איפה זה משפיע

✅ **מעקב יומי** - "דיווחים השבוע", "גלי חום", "לילות טובים"
✅ **MoodCards** - כשבוחרים "שבוע"
✅ **דאשבורד** - כל הסטטיסטיקות השבועיות
✅ **גרף מיני** - תמיד מציג א׳-ש׳

**עכשיו כל המערכת עובדת עם שבוע ישראלי! 🇮🇱**
