import type { Metadata } from 'next';
import './mood-guide.css';

export const metadata: Metadata = {
  title: 'עזרה ראשונה לנפילת מצב רוח | גיל המעבר',
  description: '5 כלים לגיבורה שלא מבינה למה היא בוכה',
  robots: { index: false, follow: false },
};

export default function MoodGuidePage() {
  return (
    <div className="mgvc-page" dir="rtl">
      <div className="mgvc-blob mgvc-blob-1" aria-hidden="true" />
      <div className="mgvc-blob mgvc-blob-2" aria-hidden="true" />
      <div className="mgvc-banner">
        <span className="mgvc-banner-text">מנופאוזית וטוב לה 👑</span>
      </div>
      <div className="mgvc-wrapper">
        <header className="mgvc-header">
          <h1 className="mgvc-title">
            <span className="mgvc-title-line1">עזרה ראשונה</span>
            <span className="mgvc-title-line2">לנפילת מצב רוח</span>
          </h1>
          <div className="mgvc-intro">
            <p>
              פעם אחת עמדתי בסופר ואי-אפשר היה למצוא חלב 3%. רק 1% ו-5%. לא 3%. בכיתי.
            </p>
            <p>
              לא בכי רך, לא דמעה שקטה, בכי של מישהי שהעולם הולך לקרוס עליה. ואז, בדרך חזרה לרכב, נזכרתי שאני בת 47, ושחלב זה פשוט חלב.
            </p>
            <p>
              <strong>
                אם גם את מכירה את הרגע הזה, את במקום הנכון. האסטרוגן לא שולט רק על המחזור שלנו. הוא שולט על הסרוטונין והדופמין. כשאסטרוגן יורד ועולה ויורד שוב בצורה לא צפויה, כל ירידה לוקחת איתה חלק מה&apos;הכל בסדר&apos;. זה לא חולשה. זה הורמון.
              </strong>
            </p>
          </div>
        </header>

        <div className="mgvc-hacks-list">

          <article className="mgvc-card">
            <div className="mgvc-card-header">
              <span className="mgvc-card-icon">🛑</span>
              <h2 className="mgvc-card-title">כלי 1: פרוטוקול 5 הדקות</h2>
            </div>
            <div className="mgvc-card-body">
              <p><strong>מה עושים:</strong></p>
              <p>
                כשהגל מגיע, אל תחליטי כלום. אל תשלחי הודעה. צאי מהחדר (החוצה, אם אפשר, אם לא לשירותים). תנשמי: שאיפה 4 שניות, עצירה 4 שניות, נשיפה 6 שניות. חזרי 5 פעמים. חכי 5 דקות לפני שאת מחליטה משהו.
              </p>
              <p>
                <strong>למה זה עובד:</strong> נשימה מכוונת מפעילה את העצב הוואגוסי ומאטה את תגובת הקורטיזול. הגל נמשך בין 7 ל-12 דקות. ואז עובר.
              </p>
            </div>
          </article>

          <article className="mgvc-card">
            <div className="mgvc-card-header">
              <span className="mgvc-card-icon">📊</span>
              <h2 className="mgvc-card-title">כלי 2: לוח מצב הרוח לזיהוי דפוסים</h2>
            </div>
            <div className="mgvc-card-body">
              <p><strong>איך בונים:</strong></p>
              <p>
                מדי יום בשעה קבועה, רשמי בין 1 ל-10: מצב רוח כללי, רמת אנרגיה, שינה אמש, האם היה גל רגשי ומה קדם לו?
              </p>
              <p>
                אחרי חודש תתחילי לראות דפוסים. יום אחרי שינה גרועה הגל יותר חזק. כשאכלת הרבה סוכר אחר הצהריים קשה. הידיעה היא כוח. כשיודעים מתי הגל מגיע מכינים את עצמנו.
              </p>
            </div>
          </article>

          <article className="mgvc-card">
            <div className="mgvc-card-header">
              <span className="mgvc-card-icon">🥗</span>
              <h2 className="mgvc-card-title">כלי 3: מזון לסרוטונין</h2>
            </div>
            <div className="mgvc-card-body">
              <p><strong>לאכול כשמגיע גל:</strong></p>
              <p>
                ביצה קשה (חלבון + כולין), אגוזי מלך (אומגה 3 + מגנזיום), שוקולד מריר 70%+ (2-3 קוביות), בננה (טריפטופן + ויטמין B6), גבינה קשה.
              </p>
              <p><strong>מה לא לאכול:</strong></p>
              <p>
                סוכר פשוט (גלידה, עוגה, עוגיות) עולה מהר, יורד חזק, מחמיר את הגל. קפה בשיא הגל מגביר קורטיזול ומאריך את חוסר האיזון.
              </p>
              <p>
                <strong>עיקרון:</strong> לא אוכלת בגלל רגשות. מזינה את הנוירוטרנסמיטורים.
              </p>
            </div>
          </article>

          <article className="mgvc-card">
            <div className="mgvc-card-header">
              <span className="mgvc-card-icon">🚶</span>
              <h2 className="mgvc-card-title">כלי 4: תנועה מיידית, 5 דקות שמפסיקות גל</h2>
            </div>
            <div className="mgvc-card-body">
              <p><strong>כשמגיע גל:</strong></p>
              <p>
                קומי, צאי להליכה של 5 דקות, תסתכלי על משהו ירוק בדרך (עץ, שיח, כל ירוק), תחזרי. הליכה מפרישה BDNF שמפחית תגובה של אמיגדלה. 5 דקות הליכה מפחיתות קורטיזול במדידה. הצבע הירוק מפחית פעילות מערכת עצבים סימפטתית תוך 40-90 שניות.
              </p>
              <p>
                <strong>הטריק:</strong> אל תחכי שתהיי במצב רוח ללכת. לכי בדיוק כשאת לא בו.
              </p>
            </div>
          </article>

          <article className="mgvc-card">
            <div className="mgvc-card-header">
              <span className="mgvc-card-icon">💬</span>
              <h2 className="mgvc-card-title">כלי 5: הגרסה הגיבורה, לדבר בלי להתנצל</h2>
            </div>
            <div className="mgvc-card-body">
              <p><strong>לבן / בת הזוג:</strong></p>
              <p>
                יש לי תקופה שמערכת הרגשות שלי מאוד רגישה. זה קשור להורמונים, לא למשהו שעשית. כשאני נראית כבויה, זה לא אתה, זה גל. אני צריכה [X דקות / חיבוק / שקט].
              </p>
              <p><strong>לילדים:</strong></p>
              <p>
                אמא לפעמים מרגישה המון דברים בבת אחת. זה בסדר, זה עובר, ואני אוהבת אותך תמיד.
              </p>
              <p>
                <strong>הכלל:</strong> לא מסבירות יותר מדי. לא מבקשות סליחה. אומרות מה קורה, אומרות מה צריכות, ממשיכות.
              </p>
            </div>
          </article>

        </div>

        <div className="mgvc-closing">
          <p className="mgvc-closing-text">
            הגל הזה שאת מרגישה הוא לא את. 5 הכלים האלה עוזרים לנהל אותו, לא רק לשרוד אותו.
          </p>
          <p className="mgvc-signoff">לא גברת. גיבורה. 👑 ענבל דפנה</p>
        </div>
      </div>
    </div>
  );
}
