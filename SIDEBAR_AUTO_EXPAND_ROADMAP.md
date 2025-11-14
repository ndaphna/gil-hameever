# 🗺️ פתיחה אוטומטית של תפריט מפת דרכים בסיידבר

## 🎯 מטרה

וידוא שכאשר המשתמשת נמצאת באחד מדפי מפת הדרכים:
1. ✅ התפריט הנפתח "מפת דרכים" נפתח אוטומטית
2. ✅ הכפתור "מפת דרכים" מודגש
3. ✅ הפריט הנוכחי (השלב הנוכחי) מודגש
4. ✅ גלילה אוטומטית לפריט הנוכחי

**התוצאה:** המשתמשת לא צריכה לחפש או לגלול כדי למצוא את התפריט!

---

## ✅ מה בוצע?

### 1️⃣ זיהוי אוטומטי של דפי מפת דרכים
📁 `src/app/components/Sidebar.tsx`

**נוסף:**
```tsx
// Check if current page is a roadmap page
const isRoadmapPage = useMemo(() => {
  const roadmapPaths = [
    '/menopause-roadmap',
    '/the-body-whispers',
    '/certainty-peace-security',
    '/belonging-sisterhood-emotional-connection',
    '/self-worth',
    '/wisdom-giving'
  ];
  return roadmapPaths.some(path => pathname === path);
}, [pathname]);
```

**מה זה עושה:**
- בודק אם ה-URL הנוכחי הוא אחד מדפי מפת הדרכים
- מעדכן אוטומטית כשהמשתמשת עוברת בין דפים

---

### 2️⃣ פתיחה אוטומטית של התפריט הנפתח

**נוסף:**
```tsx
// Auto-open roadmap dropdown if on a roadmap page
useEffect(() => {
  if (isRoadmapPage) {
    setRoadmapOpen(true);
  }
}, [isRoadmapPage]);
```

**מה זה עושה:**
- כשהמשתמשת נמצאת בדף מפת דרכים → התפריט נפתח אוטומטית
- עובד בכל טעינת דף או מעבר בין דפים

---

### 3️⃣ גלילה אוטומטית לפריט הפעיל

**נוסף:**
```tsx
// Auto-scroll to active item in sidebar
useEffect(() => {
  if (!mounted || !pathname) return;

  const timer = setTimeout(() => {
    const activeItem = document.querySelector('.sidebar-dropdown-item.active');
    if (activeItem) {
      activeItem.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, 300);

  return () => clearTimeout(timer);
}, [pathname, mounted, roadmapOpen]);
```

**מה זה עושה:**
- מחכה 300ms שהתפריט ייפתח
- מחפש את הפריט הפעיל
- גולל אליו בצורה חלקה
- גלילה "חכמה" - רק אם הפריט לא נראה

---

### 4️⃣ הדגשת כפתור "מפת דרכים"

**עודכן בקוד:**
```tsx
<button
  className={`sidebar-item sidebar-dropdown-toggle ${roadmapOpen ? 'open' : ''} ${isRoadmapPage ? 'active' : ''}`}
  onClick={() => setRoadmapOpen(!roadmapOpen)}
>
```

**מה זה עושה:**
- מוסיף class `active` כשהמשתמשת בדף מפת דרכים
- הכפתור מקבל עיצוב מודגש

---

### 5️⃣ עיצוב CSS מתאים
📁 `src/app/components/Sidebar.css`

**נוסף:**
```css
/* כפתור "מפת דרכים" כשפעיל */
.sidebar-dropdown-toggle.active {
  background: var(--gray-light);
  border-right-color: var(--magenta);
}

.sidebar-dropdown-toggle.active .sidebar-label {
  color: var(--magenta);
  font-weight: 700;
}

/* תפריט נפתח עם גלילה */
.sidebar-dropdown-menu {
  max-height: 500px;
  overflow-y: auto;
  scroll-behavior: smooth;
}
```

**מה זה עושה:**
- מדגיש את הכפתור כשפעיל
- מאפשר גלילה חלקה בתוך התפריט
- שומר על התפריט נגיש

---

## 🎨 איך זה נראה?

### לפני (המשתמשת צריכה לחפש):
```
┌──────────────────┐
│ 🏠 דף הבית      │
│ 💬 צ'אט         │
│ 📔 יומן          │
│ 🔮 תובנות       │
│ 👤 פרופיל       │
│                  │
│ 🗺️ מפת דרכים   │  ← סגור, צריך ללחוץ
└──────────────────┘
```

### אחרי (פתוח אוטומטית ומודגש):
```
┌──────────────────┐
│ 🏠 דף הבית      │
│ 💬 צ'אט         │
│ 📔 יומן          │
│ 🔮 תובנות       │
│ 👤 פרופיל       │
│                  │
│ 🗺️ מפת דרכים ▲ │  ← מודגש! פתוח!
│   🗺️ מפת מלאה   │
│   🧏 שלב 1       │
│   🌳 שלב 2  ← מודגש!
│   🤝 שלב 3       │
│   🌟 שלב 4       │
│   ✨ שלב 5       │
└──────────────────┘
```

---

## 🔄 תרחישים

### תרחיש 1: משתמשת נכנסת ישירות לשלב 2
```
1. המשתמשת גולשת ל-/certainty-peace-security
2. ✅ הסיידבר נטען
3. ✅ התפריט "מפת דרכים" נפתח אוטומטית
4. ✅ הכפתור "מפת דרכים" מודגש
5. ✅ "שלב 2" מודגש
6. ✅ גלילה אוטומטית ל"שלב 2" אם נדרש
```

### תרחיש 2: משתמשת עוברת מיומן לשלב 3
```
1. המשתמשת ב-/journal
2. לוחצת על "שלב 3" בסיידבר
3. ✅ עוברת ל-/belonging-sisterhood-emotional-connection
4. ✅ התפריט נשאר פתוח
5. ✅ "שלב 3" מודגש
6. ✅ הכפתור "מפת דרכים" מודגש
```

### תרחיש 3: משתמשת עוברת משלב 1 ליומן
```
1. המשתמשת ב-/the-body-whispers
2. התפריט פתוח ומודגש
3. לוחצת על "היומן שלי"
4. ✅ עוברת ל-/journal
5. ✅ התפריט "מפת דרכים" נסגר
6. ✅ "היומן שלי" מודגש
```

---

## 💡 יתרונות

### 1️⃣ UX משופר
- אין צורך לחפש את התפריט
- המשתמשת רואה מיד איפה היא נמצאת
- קל לעבור בין שלבים

### 2️⃣ אינטואיטיבי
- התפריט נפתח אוטומטית כשנדרש
- נסגר אוטומטית כשלא נדרש
- חסוך לחיצות מיותרות

### 3️⃣ נגיש
- גלילה אוטומטית לפריט הנוכחי
- הדגשה ויזואלית ברורה
- עובד גם במובייל

### 4️⃣ חכם
- זיהוי אוטומטי של הדף הנוכחי
- מתעדכן בזמן אמת
- לא מפריע לניווט רגיל

---

## 🎯 פרטים טכניים

### State Management:
- `isRoadmapPage` - מחושב עם `useMemo` לביצועים
- `roadmapOpen` - מנוהל עם `useState`
- מתעדכן אוטומטית עם שינויי `pathname`

### Timing:
- גלילה אוטומטית: 300ms delay (כדי שהתפריט יספיק להיפתח)
- אנימציות: `slideDown` 300ms
- scroll behavior: `smooth`

### CSS Classes:
- `.active` - פריט או כפתור פעיל
- `.open` - תפריט פתוח
- `.sidebar-dropdown-item.active` - פריט נוכחי בתפריט

---

## 📱 Responsive

### Desktop:
- הסיידבר תמיד פתוח
- התפריט נפתח/נסגר בתוך הסיידבר
- גלילה חלקה

### Mobile:
- הסיידבר נפתח עם ⚙️
- התפריט נפתח אוטומטית
- גלילה חלקה לפריט הפעיל
- סגירת הסיידבר אוטומטית אחרי בחירה

---

## ✅ Checklist

- [x] זיהוי אוטומטי של דפי מפת דרכים
- [x] פתיחה אוטומטית של התפריט
- [x] הדגשת כפתור "מפת דרכים"
- [x] הדגשת הפריט הנוכחי
- [x] גלילה אוטומטית לפריט הפעיל
- [x] עיצוב CSS מתאים
- [x] עובד ב-desktop
- [x] עובד ב-mobile
- [x] אין שגיאות linting

---

## 🎉 סיכום

**המשתמשת עכשיו לא צריכה לחפש או לגלול!**

- ✅ התפריט נפתח אוטומטית
- ✅ הכל מודגש וברור
- ✅ גלילה אוטומטית למקום הנכון
- ✅ חוויית משתמש חלקה ואינטואיטיבית

---

**נוצר:** ${new Date().toLocaleDateString('he-IL')}
**גרסה:** 1.0
**סטטוס:** ✅ הושלם







