'use client';

import './page.css';

export default function DataDeletionClient() {
  return (
    <div className="data-deletion-page">
      <div className="data-deletion-container">
        <div className="data-deletion-header">
          <h1 className="data-deletion-title">מחיקת נתונים אישיים</h1>
          <p className="data-deletion-subtitle">מנופאוזית וטוב לה — gilhameever.com</p>
        </div>

        <div className="data-deletion-content">

          <div className="deletion-section">
            <h2>אילו נתונים אנחנו אוספות?</h2>
            <p>
              כחלק מהפעילות השיווקית שלנו אנחנו משתמשות ב-<strong>Meta Pixel</strong> (פיקסל פייסבוק).
              הפיקסל עשוי לאסוף מידע טכני על הביקור שלך באתר, כגון:
            </p>
            <ul>
              <li>כתובת IP ומידע על הדפדפן/המכשיר</li>
              <li>דפים שביקרת באתר ופעולות שביצעת (למשל, הרשמה לניוזלטר)</li>
              <li>מזהה קוקי של Meta, אם את משתמשת בפייסבוק/אינסטגרם</li>
            </ul>
            <p>
              אם נרשמת לאחד מהמדריכים או הניוזלטר שלנו, ייתכן שנשמר אצלנו גם שמך וכתובת המייל שלך.
            </p>
          </div>

          <div className="deletion-section">
            <h2>כיצד לבקש מחיקת הנתונים?</h2>
            <p>יש לשלוח בקשה בכתב לכתובת המייל שלנו:</p>
            <div className="contact-box">
              <p><strong>אימייל:</strong> <a href="mailto:inbal@gilhameever.com">inbal@gilhameever.com</a></p>
              <p><strong>נושא המייל:</strong> בקשת מחיקת נתונים</p>
              <p><strong>יש לכלול במייל:</strong> שמך המלא וכתובת האימייל שבה נרשמת</p>
            </div>

            <div className="info-box" style={{ marginTop: '1.5rem' }}>
              <p>
                ניתן גם לבקש את מחיקת הנתונים ישירות דרך הגדרות הפייסבוק שלך:
                הגדרות ← אפליקציות ואתרים ← חפשי את &ldquo;גיל המעבר&rdquo; או gilhameever ← הסר גישה.
              </p>
            </div>
          </div>

          <div className="deletion-section">
            <h2>מה יקרה אחרי הבקשה?</h2>
            <ol className="steps-list">
              <li>נאשר את קבלת הבקשה תוך <strong>3 ימי עסקים</strong>.</li>
              <li>נמחק את נתוניך האישיים מהמערכות שלנו תוך <strong>30 יום</strong> מאישור הבקשה.</li>
              <li>נשלח לך אישור בכתב לאחר השלמת המחיקה.</li>
            </ol>
            <p>
              שים לב: נתונים המשמשים לצורכי חובה חוקית (כגון רישומי תשלומים, לפי חוק) יישמרו
              לתקופה הנדרשת בחוק ולאחר מכן יימחקו גם הם.
            </p>
          </div>

          <div className="deletion-section">
            <h2>שאלות נוספות</h2>
            <p>
              לכל שאלה בנושא הפרטיות שלך ניתן לפנות אלינו ב-
              <a href="mailto:inbal@gilhameever.com"> inbal@gilhameever.com</a>.
            </p>
            <p>
              למידע נוסף על מדיניות הפרטיות שלנו ראי את{' '}
              <a href="/privacy-policy">דף מדיניות הפרטיות</a>.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
