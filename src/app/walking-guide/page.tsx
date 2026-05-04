import type { Metadata } from 'next';
import './walking-guide.css';

export const metadata: Metadata = {
  title: 'פרוטוקול ההליכה | גיל המעבר',
  description: 'פרוטוקול 5 צעדים לנשים שיודעות שהליכה חשובה, אבל לא מצליחות להתחיל',
  robots: { index: false, follow: false },
};

export default function WalkingGuidePage() {
  return (
    <div className="wgvc-page" dir="rtl">
      <div className="wgvc-blob wgvc-blob-1" aria-hidden="true" />
      <div className="wgvc-blob wgvc-blob-2" aria-hidden="true" />
      <div className="wgvc-banner">
        <span className="wgvc-banner-text">מנופאוזית וטוב לה 👑</span>
      </div>
      <div className="wgvc-wrapper">
        <header className="wgvc-header">
          <h1 className="wgvc-title">
            <span className="wgvc-title-line1">פרוטוקול ההליכה</span>
            <span className="wgvc-title-line2">5 צעדים להתחיל, וגם להתמיד</span>
          </h1>
          <div className="wgvc-intro">
            <p>אני הולכת עם הכלבים שלי כל בוקר. לא כי אני ספורטאית. לא כי יש לי כוח. אלא כי הם לא מבינים "לא היום". הם עומדים ליד הדלת, מביטים בי בעיניים גדולות, ואני קמה.</p>
            <p>מה שגיליתי תוך חודש של הליכות בוקר שינה לי כמה דברים: לישון טוב יותר, לחשוב בבהירות, להרגיש שיש לי זמן לעצמי לפני שהיום מתחיל.</p>
            <p><strong>הליכה פשוטה, 10-15 דקות ביום, עושה הרבה מאוד בגוף שעובר את מה שגופנו עובר עכשיו. ירידת האסטרוגן בגיל המעבר משפיעה על עצמות, מצב רוח, הורמונים ומשקל. הליכה היא אחת הפעילויות הטובות ביותר לטפל בכל אלה ביחד.</strong></p>
          </div>
        </header>
        <div className="wgvc-hacks-list">
          <article className="wgvc-card">
            <div className="wgvc-card-header">
              <span className="wgvc-card-icon">👣</span>
              <h2 className="wgvc-card-title">צעד 1: 10 דקות ביום מספיקות</h2>
            </div>
            <div className="wgvc-card-body">
              <p>זהו. רק זה. לא צריך נעלי ספורט מקצועיות. לא צריך מסלול. לא צריך ללכת שעה כדי "לספור צעדים". המוח שלנו אוהב להגיד "אם אני לא עושה את זה כמו שצריך, אני לא עושה בכלל". תני לו את 10 הדקות האלה. המחקרים מראים שגם 10 דקות הליכה ביום, אם הן עקביות, מספיקות לשיפור ניכר בבריאות.</p>
            </div>
          </article>

          <article className="wgvc-card">
            <div className="wgvc-card-header">
              <span className="wgvc-card-icon">🌅</span>
              <h2 className="wgvc-card-title">צעד 2: בבוקר, לפני שהמוח מחליט לא</h2>
            </div>
            <div className="wgvc-card-body">
              <p>בבוקר, לפני שהראש מתחיל לארגן את הרשימה הארוכה של כל מה שצריך לעשות, הגוף עדיין שלך. הכוח הרצוני שלנו בשיאו בבוקר. קורטיזול הבוקר עוזר לעשייה. אחרי ההליכה, כל היום מרגיש יותר בשליטה. אם בוקר ממש לא אפשרי, אחר הצהריים לפני ארוחת ערב. הנקודה: תבחרי שעה קבועה ושמרי עליה.</p>
            </div>
          </article>

          <article className="wgvc-card">
            <div className="wgvc-card-header">
              <span className="wgvc-card-icon">🎧</span>
              <h2 className="wgvc-card-title">צעד 3: קישוט, פודקאסט, מוזיקה, אודיובוק</h2>
            </div>
            <div className="wgvc-card-body">
              <p>ההליכה לא חייבת להיות "זמן ריק". הרשי לעצמך הנאה: פודקאסט שמחכה רק להליכה, מוזיקה שמרוממת אותך, אודיובוק שרצית לגמור כבר חודשים. כשההליכה מקושרת לדבר שאת אוהבת, את מחכה לה במקום לדחות אותה.</p>
            </div>
          </article>

          <article className="wgvc-card">
            <div className="wgvc-card-header">
              <span className="wgvc-card-icon">🐕</span>
              <h2 className="wgvc-card-title">צעד 4: חבר כלב או חבר אנושי</h2>
            </div>
            <div className="wgvc-card-body">
              <p>אחריות חיצונית מגדילה בהרבה את הסיכוי להצליח. אם יש לך כלב, מצוין. הוא לא מבין "מחר". אם אין, חברה שהולכת איתך, גם בטלפון בזמן ההליכה. בגיל המעבר כשהמוטיבציה נמוכה ביותר, העזרה הכי גדולה היא לא להסתמך על מוטיבציה, אלא על מחויבות.</p>
            </div>
          </article>

          <article className="wgvc-card">
            <div className="wgvc-card-header">
              <span className="wgvc-card-icon">📅</span>
              <h2 className="wgvc-card-title">צעד 5: תיעוד ורצף של 7 ימים</h2>
            </div>
            <div className="wgvc-card-body">
              <p>7 ימים בלבד. לא יותר. צלמי צילום מסך. כתבי ביומן. סמני V בלוח. מחקרים מראים שיצירת רצף של 7 ימים היא נקודת המפנה, כשהגוף מתחיל לצפות להליכה ולא להתנגד לה. הבטחה: אחרי 7 ימים, הגוף שלך יבקש את ההליכה. לא את.</p>
            </div>
          </article>
        </div>
        <div className="wgvc-closing">
          <p className="wgvc-closing-text">לכי 10 דקות מחר בבוקר. לא חצי שעה. לא עם ציוד. לא בשעה מושלמת. רק 10 דקות, את והרגליים שלך. זה מספיק.</p>
          <p className="wgvc-signoff">לא גברת. גיבורה. 👑 ענבל דפנה</p>
        </div>
      </div>
    </div>
  );
}
