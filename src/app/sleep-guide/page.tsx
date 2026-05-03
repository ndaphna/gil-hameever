import type { Metadata } from 'next';
import './sleep-guide.css';

export const metadata: Metadata = {
  title: 'עזרה ראשונה למי שלא ישנה לילה שלם כבר חודשים | גיל המעבר',
  description: 'לא ספירת כבשים. לא "הירגעי". פרוטוקול מדעי פשוט שמלמד את הגוף שלך לישון שוב, גם בזמן גיל המעבר.',
  robots: { index: false, follow: false },
};

export default function SleepGuidePage() {
  return (
    <div className="sgvc-page" dir="rtl">
      {/* Blobs */}
      <div className="sgvc-blob sgvc-blob-1" aria-hidden="true" />
      <div className="sgvc-blob sgvc-blob-2" aria-hidden="true" />

      {/* Banner */}
      <div className="sgvc-banner">
        <span className="sgvc-banner-text">מנופאוזית וטוב לה 👑</span>
      </div>

      <div className="sgvc-wrapper">
        {/* Header */}
        <header className="sgvc-header">
          <h1 className="sgvc-title">
            <span className="sgvc-title-line1">עזרה ראשונה למי שלא ישנה לילה שלם כבר חודשים</span>
            <span className="sgvc-title-line2">5 צעדים לגיבורה שמחזירה לעצמה את הלילה</span>
          </h1>
          <div className="sgvc-intro">
            <p>שלוש בבוקר. עיניים פקוחות לרווחה. ומחר יש לי פגישת הנהלה שבה אני אמורה להוביל, להחליט, להיות נוכחת.</p>
            <p>שכבתי שם ושמעתי את הדפיקות של הלב שלי, חשבתי על כל מה שלא עשיתי, על כל מה שצריך לקרות מחר... ופחדתי. לא מהלילה. פחדתי שאני נשברת.</p>
            <p>זה היה לפני שנתיים. כשגיליתי שמה שקורה לי בלילה זה לא חולשה. זה ביולוגיה. <strong>האסטרוגן שלי צנח, ואיתו נפל גם הפרוגסטרון שאחראי להרגשת השלווה לפני שינה.</strong> זה לא &quot;לחץ&quot;. זה לא &quot;צריכה להירגע&quot;. זה גוף שמשנה את חוקי המשחק בלי לשאול אותי.</p>
            <p>ברגע שהפסקתי להאשים את עצמי, התחלתי למצוא פתרונות.</p>
            <p>המדריך הזה הוא מה שלמדתי. 5 צעדים שמשנים את הלילה. לא הבטחות גדולות, כלים אמיתיים שעבדו לי ואני משתפת איתך.</p>
          </div>
        </header>

        {/* Prep Section */}
        <section className="sgvc-prep-section">
          <h2 className="sgvc-section-title">לפני שמתחילות: 3 דברים להבין</h2>
          <div className="sgvc-prep-list">
            <div className="sgvc-prep-item">
              <span className="sgvc-prep-label">1. האסטרוגן הוא שומר הסדר של השינה שלך</span>
              <p className="sgvc-prep-text">אסטרוגן עוזר לגוף לייצר סרוטונין, שהוא אחד ממבשרי המלטונין (הורמון השינה). כשאסטרוגן יורד, ייצור המלטונין נפגע. התוצאה: קשה להירדם, קשה להישאר ישנה.</p>
            </div>
            <div className="sgvc-prep-item">
              <span className="sgvc-prep-label">2. קורטיזול בלילה הוא האויב הגדול</span>
              <p className="sgvc-prep-text">בגיל המעבר, מחזור הקורטיזול (הורמון הלחץ) מתבלבל. במקום להיות גבוה בבוקר ונמוך בלילה, הוא עולה גם בשלוש בבוקר ומעיר אותך. זה לא &quot;מחשבות שוטפות&quot;. זה כימיה.</p>
            </div>
            <div className="sgvc-prep-item">
              <span className="sgvc-prep-label">3. הגוף צריך אות ברור: &quot;עכשיו לילה&quot;</span>
              <p className="sgvc-prep-text">מקצב היממה (Circadian Rhythm) שלך רגיש לאות: אור, טמפרטורה, שגרה. בגיל המעבר הוא נעשה עוד יותר רגיש. ה-5 צעדים פה מלמדים את הגוף שלך לזהות &quot;הגיע הלילה&quot;.</p>
            </div>
          </div>
        </section>

        {/* Steps */}
        <h2 className="sgvc-steps-title">הפרוטוקול: 5 צעדים</h2>
        <div className="sgvc-steps-list">

          <article className="sgvc-card">
            <div className="sgvc-card-header">
              <span className="sgvc-card-icon">⚡</span>
              <h3 className="sgvc-card-title">צעד 1: קררי את חדר השינה</h3>
            </div>
            <div className="sgvc-card-body">
              <p className="sgvc-step-sub-label">מה עושים:</p>
              <p className="sgvc-step-sub-text">הורידי את הטמפרטורה בחדר השינה ל-18-19 מעלות. אם אין לך מיזוג, פתחי חלון, השתמשי במאוורר, הורידי שמיכה אחת. אני ויתרתי על השמיכה הכבדה ועברתי לסדין.</p>
              <p className="sgvc-step-sub-label">למה זה עובד:</p>
              <p className="sgvc-step-sub-text">כדי שתירדמי, הטמפרטורה הפנימית של הגוף צריכה לרדת בחצי מעלה עד מעלה. בגיל המעבר יש לנו גלי חום שמעלים את הטמפרטורה, וחדר קריר מפצה על זה ועוזר לגוף &quot;ללחוץ על כפתור השינה&quot;.</p>
              <p className="sgvc-step-sub-label">הערה מעשית:</p>
              <p className="sgvc-step-sub-text">אם יש לך בן/בת זוג שחם לו, קנו שמיכות נפרדות. אחת ל&quot;צד הקר&quot; (שלך) ואחת לצד שלו.</p>
            </div>
          </article>

          <article className="sgvc-card">
            <div className="sgvc-card-header">
              <span className="sgvc-card-icon">⚡</span>
              <h3 className="sgvc-card-title">צעד 2: חלון החשיכה, 90 דקות לפני שינה</h3>
            </div>
            <div className="sgvc-card-body">
              <p className="sgvc-step-sub-label">מה עושים:</p>
              <p className="sgvc-step-sub-text">90 דקות לפני השעה שבה את רוצה להירדם, כבי את המסכים. לא &quot;הורידי תאורה&quot;. כבי. גם טלפון, גם טלוויזיה, גם טאבלט. עברי לתאורה חמה ונמוכה.</p>
              <p className="sgvc-step-sub-label">למה זה עובד:</p>
              <p className="sgvc-step-sub-text">האור הכחול ממסכים מעכב ייצור מלטונין בשעתיים עד שלוש שעות. בגוף שכבר מתקשה לייצר מלטונין, זה בעייתי ביותר.</p>
              <p className="sgvc-step-sub-label">הערה מעשית:</p>
              <p className="sgvc-step-sub-text">&quot;אבל אני לא יכולה להפסיק לעבוד ב-21:00&quot;, אני מבינה. תחליטי על שעת השינה שלך. אם היא 23:30, אז ב-22:00 המסכים כבים. סגרי מיילים, שמרי מסמכים, וסיימי את היום שלך. העבודה תהיה שם מחר.</p>
            </div>
          </article>

          <article className="sgvc-card">
            <div className="sgvc-card-header">
              <span className="sgvc-card-icon">⚡</span>
              <h3 className="sgvc-card-title">צעד 3: פרוטוקול שלוש בבוקר</h3>
            </div>
            <div className="sgvc-card-body">
              <p className="sgvc-step-sub-label">מה עושים:</p>
              <p className="sgvc-step-sub-text">התעוררת ב-3. אל תנסי &quot;להכריח&quot; את עצמך לישון. במקום זה:</p>
              <ul className="sgvc-inner-list">
                <li>תני לגוף 5 דקות לנשום בשיטת 4-7-8: שאפי 4 שניות, עצרי 7, שחררי 8.</li>
                <li>אם לא חזרת לישון אחרי 20 דקות, קומי לחדר אחר, שבי בחשיכה עם תה צמחים (ורוד, קמומיל) ובלי מסכים.</li>
                <li>חזרי למיטה רק כשאת מרגישה כובד בעפעפיים.</li>
              </ul>
              <p className="sgvc-step-sub-label">למה זה עובד:</p>
              <p className="sgvc-step-sub-text">המיטה צריכה להיות מקושרת במוח שלך ל&quot;שינה&quot;. אם את שוכבת ערה במיטה במשך שעה, את יוצרת קיבוע שלילי, המוח לומד: מיטה = חרדה. הקימה ל-20 דקות שוברת את הדפוס הזה.</p>
              <p className="sgvc-step-sub-label">הערה מעשית:</p>
              <p className="sgvc-step-sub-text">ה-4-7-8 נשמע פשוט מדי. עשי אותו 3 פעמים רצופות ותביני למה לא. זה ממש עובד.</p>
            </div>
          </article>

          <article className="sgvc-card">
            <div className="sgvc-card-header">
              <span className="sgvc-card-icon">⚡</span>
              <h3 className="sgvc-card-title">צעד 4: תזונת הערב</h3>
            </div>
            <div className="sgvc-card-body">
              <p className="sgvc-step-sub-label">מה אוכלים:</p>
              <div className="sgvc-contrast">
                <div className="sgvc-contrast-item sgvc-contrast-yes">
                  <span className="sgvc-contrast-label">כן: </span>
                  תפוח עם שקדים, גבינה לבנה עם עגבניות, ביצה קשה, כוס חלב חם (אם את שותה חלב).
                </div>
                <div className="sgvc-contrast-item sgvc-contrast-no">
                  <span className="sgvc-contrast-label">לא: </span>
                  שוקולד מריר אחרי 16:00 (יש בו קפאין), אלכוהול (נדמה שעוזר... הורס את איכות השינה), ארוחה כבדה 3 שעות לפני שינה.
                </div>
              </div>
              <p className="sgvc-step-sub-label">למה זה עובד:</p>
              <p className="sgvc-step-sub-text">טריפטופן (חומצת אמינו בחלבון) הוא מבשר של סרוטונין ומלטונין. שילוב של חלבון קל עם פחמימה מורכבת בערב מזין את מסלול הייצור הזה.</p>
              <p className="sgvc-step-sub-label">הערה מעשית:</p>
              <p className="sgvc-step-sub-text">אלכוהול הוא השקר הגדול של השינה. הוא מאיץ את ההירדמות אבל מפר את שלב ה-REM בחצות. מסביר למה &quot;ישנתי אבל ישנתי גרוע&quot;.</p>
            </div>
          </article>

          <article className="sgvc-card">
            <div className="sgvc-card-header">
              <span className="sgvc-card-icon">⚡</span>
              <h3 className="sgvc-card-title">צעד 5: יומן שינה, תראי את הדפוס</h3>
            </div>
            <div className="sgvc-card-body">
              <p className="sgvc-step-sub-label">מה עושים:</p>
              <p className="sgvc-step-sub-text">שבוע אחד בלבד. כל בוקר רשמי 3 שורות:</p>
              <ul className="sgvc-inner-list">
                <li>באיזו שעה הלכת לישון / ישנת בפועל</li>
                <li>כמה פעמים התעוררת</li>
                <li>מה היה שונה אתמול (אכלת שוקולד? עבדת עד אוחר? היה לחץ?)</li>
              </ul>
              <p className="sgvc-step-sub-label">למה זה עובד:</p>
              <p className="sgvc-step-sub-text">70% מהנשים שמנהלות יומן שינה שבוע אחד מגלות דפוס ברור שלא ידעו עליו. אחת גילתה שכל פעם שישבה לכתוב בלילה, לא ישנה. אחת גילתה שיין ביום שישי הורס לה את שבת.</p>
              <p className="sgvc-step-sub-label">הערה מעשית:</p>
              <p className="sgvc-step-sub-text">תקפידי שיהיה לך נייר ועט ליד המיטה. את תראי כמה זה חשוב.</p>
            </div>
          </article>

        </div>

        {/* Closing */}
        <div className="sgvc-closing">
          <p className="sgvc-closing-text">
            שינה גרועה בגיל המעבר היא אחד הסימפטומים הכי נפוצים, ואחד הכי פחות מדוברים. נשים מסתירות את זה, מסתדרות עם קפאין, מאמינות שזה &quot;סתם לחץ&quot;.
          </p>
          <p className="sgvc-closing-text">
            <strong>זה לא לחץ. זה גוף שמשתנה ורוצה שתקשיבי לו.</strong>
          </p>
          <p className="sgvc-closing-text">
            5 הצעדים האלה לא פותרים הכל ביום אחד. אבל כשתתחילי אותם, בתוך שבוע, משהו משתנה. ראיתי את זה שוב ושוב.
          </p>
          <p className="sgvc-closing-text">
            את גיבורה שמחליטה לדאוג לשינה שלה. זה לא אנוכי. זה הבסיס לכל השאר.
          </p>
          <p className="sgvc-signoff">לא גברת. גיבורה. 👑 ענבל דפנה</p>
        </div>
      </div>
    </div>
  );
}
