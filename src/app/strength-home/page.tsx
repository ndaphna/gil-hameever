import type { Metadata } from 'next';
import './strength-home.css';

export const metadata: Metadata = {
  title: 'האם גיל המעבר שלך קורא לך להרים משקולות? | גיל המעבר',
  description: '7 סימנים שכדאי להכיר, ופרוטוקול 20 דקות להתחיל בבית',
  robots: { index: false, follow: false },
};

const signs = [
  {
    num: '1',
    title: 'הגוף שלך השתנה בלי שינוי תזונה',
    text: 'הכנסת אותן קלוריות, אבל הגוף נראה שונה. יותר רך. אחר. זה שינוי הרכב הגוף, לא עצלות.',
  },
  {
    num: '2',
    title: 'את מרגישה חלשה יותר מלפני שנה',
    text: 'בקבוק מים כבד? שקית קניות שמרגישה כמו עשרה קילו? ירידת כוח פיזי היא סימן מובהק.',
  },
  {
    num: '3',
    title: 'כאבי גב, ברכיים, ירכיים שהתגברו',
    text: 'שריר מחזיק מפרקים. כשהוא נחלש, המפרקים סופגים יותר. מה שהיה עקצוץ קל הופך ל"לא יכולה ללכת נוח".',
  },
  {
    num: '4',
    title: 'עייפות שלא עוברת גם אחרי שינה',
    text: 'שריר מייצר אנרגיה, ממש. פחות שריר = פחות מנגנוני אנרגיה בתאים. זה לא בראש.',
  },
  {
    num: '5',
    title: 'המשקל עולה בלי שינוי תזונה',
    text: 'חילוף חומרים איטי = גם כשאת אוכלת אותו דבר, הגוף צובר יותר. פחות שריר = פחות שרפת קלוריות.',
  },
  {
    num: '6',
    title: 'אבדן שיווי משקל, אי יציבות, צעידה פחות בטוחה',
    text: 'שריר רגליים ובטן = שיווי משקל. ירידה בשריר = פחות יציבות. זה בדיוק מה שמוביל לנפילות אצל נשים מבוגרות יותר.',
  },
  {
    num: '7',
    title: 'את מרגישה שהגוף הרים ידיים, שאין טעם',
    text: 'זה לא את. זה הכימיה. ואפשר לשנות אותה.',
  },
];

const exercises = [
  {
    name: 'סקוואט עם כיסא',
    steps: [
      'עמדי מול כיסא, רגליים ברוחב הירכיים',
      'שבי לאט (4 שניות) עד שהישבן נוגע בכיסא',
      'קומי (2 שניות)',
    ],
    reps: '10 חזרות × 3 סטים',
    muscles: 'ירכיים, ישבן, שיווי משקל, עצמות ירך',
  },
  {
    name: 'שכיבות סמיכה בעזרת קיר',
    steps: [
      'עמדי מרחק זרוע מהקיר',
      'ידיים בגובה כתפיים על הקיר',
      'כופפי מרפקים לאט (4 שניות), חזרי (2 שניות)',
    ],
    reps: '10 חזרות × 3 סטים',
    muscles: 'חזה, כתפיים, טרייספס (השריר הגדול הממוקם בחלק האחורי של הזרוע העליונה)',
  },
  {
    name: 'מתיחת גב (Bird-Dog)',
    steps: [
      'ארבע על ארבע על מזרן',
      'הושיטי יד ימין ורגל שמאל בו-זמנית, החזיקי 3 שניות',
      'החליפי',
    ],
    reps: '10 חזרות לכל צד × 2 סטים',
    muscles: 'גב, בטן, שיווי משקל',
  },
];

export default function StrengthHomePage() {
  return (
    <div className="shvc-page" dir="rtl">
      {/* Blobs */}
      <div className="shvc-blob shvc-blob-1" aria-hidden="true" />
      <div className="shvc-blob shvc-blob-2" aria-hidden="true" />

      {/* Banner */}
      <div className="shvc-banner">
        <span className="shvc-banner-text">מנופאוזית וטוב לה 👑</span>
      </div>

      <div className="shvc-wrapper">

        {/* Header */}
        <header className="shvc-header">
          <h1 className="shvc-title">
            <span className="shvc-title-line1">האם גיל המעבר שלך קורא לך להרים משקולות?</span>
            <span className="shvc-title-line2">7 סימנים שכדאי לדעת, ומה עושים עם זה</span>
          </h1>
          <div className="shvc-intro">
            <p>לפני כשנתיים עמדתי על המשקל ושמתי לב למשהו מוזר.</p>
            <p>המשקל לא השתנה, אבל הגוף שלי נראה אחרת. פחות מוגדר. יותר &quot;רך&quot; בבטן. עייפות לא מוסברת.</p>
            <p>ביקרתי אצל הרופאה, ועשינו בדיקות. <strong>&quot;ירידת מסת שריר,&quot;</strong> היא אמרה. <strong>&quot;שלושה קילוגרם שריר בשנתיים.&quot;</strong></p>
            <p>תחשבי על זה, <strong>3 ק&quot;ג שריר</strong> שנעלמו בלי שהבחנתי. בלי שינוי תזונה גדול. בלי שהפסקתי להיות פעילה.</p>
            <p>פשוט, האסטרוגן ירד, ואיתו השריר.</p>
            <p>אף אחד לא סיפר לי שזה יקרה.</p>
          </div>
        </header>

        {/* Science section */}
        <article className="shvc-card">
          <h2 className="shvc-card-title">מה המדע אומר</h2>
          <div className="shvc-card-body">
            <p className="shvc-step-sub-text">
              האסטרוגן הוא לא רק הורמון של פוריות ומחזור. הוא גם אנאבולי, כלומר, הוא עוזר לבנות ולשמר שריר.
            </p>
            <p className="shvc-step-sub-text">כשהוא יורד בגיל המעבר, קורים כמה דברים:</p>
            <ul className="shvc-inner-list">
              <li><strong>Sarcopenia,</strong> ירידת מסת שריר, מהירה יותר ממה שחשבת</li>
              <li><strong>עלייה ב-body fat,</strong> גם אם המשקל לא השתנה, ההרכב משתנה</li>
              <li><strong>ירידה בחוזק העצמות,</strong> שריר חזק מגן על עצמות. שריר חלש, לא</li>
              <li><strong>חילוף חומרים איטי יותר,</strong> פחות שריר = פחות קלוריות שנשרפות במנוחה</li>
              <li><strong>כאבים ועייפות,</strong> שריר תומך במפרקים. בלעדיו, כאבים קטנים שרק גדלים</li>
            </ul>
            <p className="shvc-step-sub-text">
              <strong>הפתרון המחקרי:</strong> אימון כוח הוא ה-intervention הכי מוכח לנשים בגיל המעבר. לא קרדיו. לא דיאטה. <strong>משקולות.</strong>
            </p>
          </div>
        </article>

        {/* 7 signs section */}
        <article className="shvc-card">
          <h2 className="shvc-card-title">7 סימנים שגיל המעבר שלך קורא לך להרים משקולות</h2>
          <div className="shvc-card-body">
            <p className="shvc-step-sub-text">סמני ✓ ליד כל מה שמוכר לך:</p>
            <div className="shvc-signs-list">
              {signs.map((sign) => (
                <div key={sign.num} className="shvc-sign-item">
                  <p className="shvc-sign-title">
                    <span className="shvc-sign-check">☐</span>
                    <strong>{sign.num}. {sign.title}</strong>
                  </p>
                  <p className="shvc-step-sub-text">{sign.text}</p>
                </div>
              ))}
            </div>
            <p className="shvc-step-sub-label">3 ✓ ומעלה, הגיע הזמן להתחיל.</p>
          </div>
        </article>

        {/* Protocol section */}
        <article className="shvc-card">
          <h2 className="shvc-card-title">מה עושים: איך מתחילים בבית</h2>
          <div className="shvc-card-body">
            <p className="shvc-step-sub-text">לא צריך חדר כושר. לא צריך מאמן. לא צריך שעה.</p>
            <p className="shvc-step-sub-label">הפרוטוקול הבסיסי: 2 פעמים בשבוע. 20 דקות. בבית.</p>
            <p className="shvc-step-sub-text">3 תרגילים בסיסיים שמכסים את כל הגוף:</p>
            <div className="shvc-exercises-list">
              {exercises.map((ex) => (
                <div key={ex.name} className="shvc-exercise-item">
                  <p className="shvc-step-sub-label">{ex.name}</p>
                  <ul className="shvc-inner-list">
                    {ex.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                  <p className="shvc-step-sub-text">
                    <strong>{ex.reps}</strong>
                  </p>
                  <p className="shvc-step-sub-text">עובד על: {ex.muscles}</p>
                </div>
              ))}
            </div>
            <p className="shvc-step-sub-text">
              <strong>איך להתקדם:</strong> כל שבועיים, תוסיפי חזרה אחת. לאחר חודש, הוסיפי משקל קל (בקבוקי מים, 500 גרם כל אחד).
            </p>
          </div>
        </article>

        {/* Closing */}
        <div className="shvc-closing">
          <p className="shvc-closing-text">הגוף שלך לא הרים ידיים.</p>
          <p className="shvc-closing-text">הוא מחכה לך שתחזרי.</p>
          <p className="shvc-closing-text">
            <strong>20 דקות, פעמיים בשבוע, 3 תרגילים.</strong>
          </p>
          <p className="shvc-closing-text">
            זה לא אימון של ספורטאית. זו השקעה בכל הגוף שלך, עצמות, כוח, אנרגיה, מצב רוח, לשנים הבאות.
          </p>
          <p className="shvc-signoff">לא גברת. גיבורה. 👑 ענבל דפנה</p>
        </div>

      </div>
    </div>
  );
}
