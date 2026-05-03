import type { Metadata } from 'next';
import './brain-fog-guide.css';

export const metadata: Metadata = {
  title: 'עזרה ראשונה לערפל מוחי | גיל המעבר',
  description: '5 כלים שעוזרים לך לחשוב בבהירות שוב',
  robots: { index: false, follow: false },
};

export default function BrainFogGuidePage() {
  return (
    <div className="bfgvc-page" dir="rtl">
      <div className="bfgvc-blob bfgvc-blob-1" aria-hidden="true" />
      <div className="bfgvc-blob bfgvc-blob-2" aria-hidden="true" />
      <div className="bfgvc-banner">
        <span className="bfgvc-banner-text">מנופאוזית וטוב לה 👑</span>
      </div>
      <div className="bfgvc-wrapper">
        <header className="bfgvc-header">
          <h1 className="bfgvc-title">
            <span className="bfgvc-title-line1">עזרה ראשונה לערפל מוחי</span>
            <span className="bfgvc-title-line2">פרוטוקול 5 כלים לגיבורה שממשיכה לחשוב בבהירות</span>
          </h1>
          <div className="bfgvc-intro">
            <p>הייתי באמצע פגישה. מישהו שאל אותי שאלה פשוטה, ואני ישבתי שם, פה פתוח, ומחכה שהמילה תגיע.</p>
            <p>לא הגיעה. חייכתי, שתיתי מים, אמרתי "סליחה, ברחה לי המילה לרגע", ובפנים חשבתי: מה קורה לי?</p>
            <p>זה ערפל מוחי. ואני מכירה את הפחד הזה שבא איתו. הפחד שאת נעשית "פחות חדה", "פחות את עצמך".</p>
            <p><strong>הנה מה שאף אחד לא אמר לי: ערפל מוחי בגיל המעבר הוא תוצאה ישירה של שינויים הורמונליים. האסטרוגן מגן על המוח, ותומך בזיכרון, בריכוז, ובשליפה של מילים. כשהוא משתנה, המוח מרגיש את זה. זה לא דמנציה. זה גיל המעבר.</strong></p>
          </div>
        </header>
        <div className="bfgvc-hacks-list">
          <article className="bfgvc-card">
            <div className="bfgvc-card-header">
              <span className="bfgvc-card-icon">⚡</span>
              <h2 className="bfgvc-card-title">כלי 1: גלוקוז חכם, לא ממתקים</h2>
            </div>
            <div className="bfgvc-card-body">
              <p><strong>מה עושים:</strong></p>
              <p>כשאת מרגישה "ריקנות" מוחית, אל תחטפי שוקולד. במקום זה: תפוח וכף שקד טחון, או פרוסת לחם מחיטה מלאה עם חומוס. ארוחה כל 3-4 שעות בלי לדלג.</p>
              <p><strong>למה זה עובד:</strong></p>
              <p>המוח רץ על גלוקוז. בגיל המעבר, רגישות לאינסולין משתנה, ורמות סוכר תנודתיות יוצרות ערפל. חלבון ופחמימה מורכבת שומרים על רמה יציבה.</p>
              <p><strong>הערה מעשית:</strong> יש לך פגישה חשובה? אכלי 30 דקות לפניה. אל תחכי לצהריים.</p>
            </div>
          </article>

          <article className="bfgvc-card">
            <div className="bfgvc-card-header">
              <span className="bfgvc-card-icon">⚡</span>
              <h2 className="bfgvc-card-title">כלי 2: נשימה 4-7-8 לפני פגישה חשובה</h2>
            </div>
            <div className="bfgvc-card-body">
              <p><strong>מה עושים:</strong></p>
              <p>3 דקות לפני כל פגישה: שאפי 4 שניות, עצרי 7 שניות, שחררי לאט 8 שניות. חזרי 4 פעמים.</p>
              <p><strong>למה זה עובד:</strong></p>
              <p>נשימה איטית מפעילה את מערכת העצבים הפאראסימפתטית, שמורידה קורטיזול ומגבירה זרימת דם לקורטקס הפרה-פרונטלי.</p>
              <p><strong>הערה מעשית:</strong> אני עושה את זה בשירותים לפני כל פגישה חשובה. ואני נכנסת אליה בראש אחר לגמרי.</p>
            </div>
          </article>

          <article className="bfgvc-card">
            <div className="bfgvc-card-header">
              <span className="bfgvc-card-icon">⚡</span>
              <h2 className="bfgvc-card-title">כלי 3: רשימת "3 הדברים שחשובים היום"</h2>
            </div>
            <div className="bfgvc-card-body">
              <p><strong>מה עושים:</strong></p>
              <p>כל בוקר, לפני שפותחים מייל, כותבים בנייר (לא בטלפון): הדבר החשוב ביותר להיום, הדבר השני, הדבר השלישי. וזהו. לכתוב רק 3.</p>
              <p><strong>למה זה עובד:</strong></p>
              <p>ערפל מוחי מחריף כשיש עומס מידע. ה-Working Memory בגיל המעבר נעשה רגיש יותר לעומס. 3 פריטים הוא המגבלה הטבעית.</p>
              <p><strong>הערה מעשית:</strong> תכתבי עם עט על נייר. לא Notes, לא Notion. הפעולה הפיזית של הכתיבה מחזקת את הקידוד בזיכרון.</p>
            </div>
          </article>

          <article className="bfgvc-card">
            <div className="bfgvc-card-header">
              <span className="bfgvc-card-icon">⚡</span>
              <h2 className="bfgvc-card-title">כלי 4: תנועה 5 דקות לפני</h2>
            </div>
            <div className="bfgvc-card-body">
              <p><strong>מה עושים:</strong></p>
              <p>לפני כל משימה שצריכה ריכוז, 5 דקות תנועה. לא חדר כושר. הליכה קצרה, קפיצות קלות, מתיחות, עליה וירידה בדרגות.</p>
              <p><strong>למה זה עובד:</strong></p>
              <p>תנועה מגבירה BDNF, חלבון שמגדל תאי עצב חדשים ומחזק חיבורים בין תאי מוח. 5 דקות תנועה מעלות את הריכוז ל-30-40 דקות.</p>
              <p><strong>הערה מעשית:</strong> לפני שיחה חשובה בטלפון, לכי תוך כדי. הגוף בתנועה עוזר לחשיבה.</p>
            </div>
          </article>

          <article className="bfgvc-card">
            <div className="bfgvc-card-header">
              <span className="bfgvc-card-icon">⚡</span>
              <h2 className="bfgvc-card-title">כלי 5: שינה היא המנהלת</h2>
            </div>
            <div className="bfgvc-card-body">
              <p><strong>מה עושים:</strong></p>
              <p>אם עשית 1-4 ועדיין יש ערפל, תסתכלי על השינה שלך אמש. כמה שעות? כמה פעמים התעוררת? ערפל מוחי מחר מתחיל בלילה הזה.</p>
              <p><strong>למה זה עובד:</strong></p>
              <p>בשינה, המוח עושה "ניקוי" של "פסולת" שנוצרת תוך כדי חשיבה. בלי שינה מספקת, הפסולת מצטברת. ואת מרגישה את זה בבוקר כ"ערפל".</p>
            </div>
          </article>
        </div>
        <div className="bfgvc-closing">
          <p className="bfgvc-closing-text">הערפל הזה שאת מרגישה, הוא לא את. את עדיין חדה. עדיין יודעת. עדיין יכולה. 5 הכלים האלה הם הבסיס. כשמשתמשים בהם ביחד, בתוך שבוע מרגישים הבדל.</p>
          <p className="bfgvc-signoff">לא גברת. גיבורה. 👑 ענבל דפנה</p>
        </div>
      </div>
    </div>
  );
}
