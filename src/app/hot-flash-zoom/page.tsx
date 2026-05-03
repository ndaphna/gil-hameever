import type { Metadata } from 'next';
import './hot-flash-zoom.css';

export const metadata: Metadata = {
  title: 'עזרה ראשונה לגל חום באמצע זום | גיל המעבר',
  description: 'פרוטוקול 5 צעדים לגיבורה שלא עוזבת את הפגישה',
  robots: { index: false, follow: false },
};

const prepItems = [
  { icon: '💧', bold: 'כוס מים קרים', rest: '(לא קרח, לא חמים. קרים.)' },
  { icon: '🌬️', bold: 'מאוורר שולחני קטן', rest: 'או כל דבר שאפשר לנפף איתו בשקט' },
  { icon: '👕', bold: 'חולצה מכותנה', rest: 'בשכבות, קלה להסרה' },
];

const steps = [
  {
    icon: '⚡',
    title: 'צעד 1: קררי את שורש כף היד (30 שניות)',
    what: 'שימי את פרק כף היד על הכוס הקרה. 30 שניות. לא יותר.',
    why: 'עצב הוואגוס עובר דרך שורש כף היד. קירור של אזור זה שולח אות ישיר למוח: "הכל בסדר, אפשר לירד הילוך." המחקר מראה שגלי חום קשורים לירידה חדה בפעילות הפאראסימפתטית, והקירור המקומי עוזר לאזן אותה.',
    practiceLabel: 'בפגישה:',
    practice: 'מחזיקה את הכוס בשקט, ידיים על השולחן. אף אחת לא רואה כלום.',
  },
  {
    icon: '⚡',
    title: 'צעד 2: נשמי 4.7.8 (30 שניות)',
    what: 'שאפי 4 שניות דרך האף. עצרי 7 שניות. נשפי 8 שניות דרך הפה בשקט. חזרי פעמיים.',
    why: 'נשיפה ארוכה מהשאיפה מפעילה את העצב הוואגלי. זה הפוך ממה שהגוף עושה בגל חום. את בעצם אומרת למערכת העצבים שלך: "לא חירום. ממשיכות."',
    practiceLabel: 'בפגישה:',
    practice: 'עושים בזמן שמישהי אחרת מדברת. ניתן לחלוטין בסתר.',
  },
  {
    icon: '⚡',
    title: 'צעד 3: קחי 60 שניות (אם הגל חזק)',
    what: '"חברות, יש לי בעיה טכנית קטנה, שנייה." כבי מצלמה. שימי משהו קר על הצוואר או הפנים. נשימה אחת של 4.7.8. חזרי.',
    why: 'גל חום נמשך ממוצע 30 עד 90 שניות בלבד. 60 שניות הן כל מה שצריך. "בעיה טכנית" היא לגיטימית לחלוטין ולא מעוררת שאלות.',
    practiceLabel: 'ואם שאלו:',
    practice: '"האינטרנט שלי מתחרפן קצת." זה מספיק.',
  },
  {
    icon: '⚡',
    title: 'צעד 4: בחרי איך את מגדירה את הרגע הזה',
    what: 'זה הצעד שאף אחד לא מלמד. אם נתפסת, אם ראו, אם שאלו.',
    why: 'מחקר מ-2025 מראה שנשים שמדברות על תסמיני גיל המעבר בעבודה בגלוי וללא התנצלות, חוות פחות חרדה, פחות גלים, ופחות פגיעה בביצועים המקצועיים שלהן.',
    practiceLabel: '',
    practice: '',
  },
  {
    icon: '⚡',
    title: 'צעד 5: 5 דקות אחרי הפגישה (לא לדלג על זה)',
    what: 'שתי 250 מ"ל מים קרים. ואז רשמי בטלפון: מה שתית לפני? (קפה? אלכוהול? משקה חם?) כמה ישנת? כמה סטרס היה בשעה לפני? מה אכלת?',
    why: 'גלי חום לא מגיעים "סתם". יש להם טריגרים. וכשאנחנו מתחילות לזהות אותם, מתחילות לשלוט. את לא קורבן של הגוף שלך. את החוקרת שלו.',
    practiceLabel: 'יומן:',
    practice: 'יומן גלי חום: 5 דקות אחרי כל ישיבה שהיה בה גל. חודש. ותראי תבנית.',
  },
];

export default function HotFlashZoomPage() {
  return (
    <div className="hfzvc-page" dir="rtl">
      {/* Blobs */}
      <div className="hfzvc-blob hfzvc-blob-1" aria-hidden="true" />
      <div className="hfzvc-blob hfzvc-blob-2" aria-hidden="true" />

      {/* Banner */}
      <div className="hfzvc-banner">
        <span className="hfzvc-banner-text">מנופאוזית וטוב לה 👑</span>
      </div>

      <div className="hfzvc-wrapper">

        {/* Header */}
        <header className="hfzvc-header">
          <h1 className="hfzvc-title">
            <span className="hfzvc-title-line1">עזרה ראשונה לגל חום באמצע זום</span>
            <span className="hfzvc-title-line2">פרוטוקול 5 צעדים לגיבורה שלא עוזבת את הפגישה</span>
          </h1>
          <div className="hfzvc-intro">
            <p>זה קרה לי.</p>
            <p>
              באמצע ישיבה בזום. מצלמה דולקת. לפטופ פתוח. אני בשיא ההסבר.
            </p>
            <p>ואז... הגל.</p>
            <p>
              פתאום כל הגוף בוער מבפנים, הפנים אדומות, ואני יושבת שם וחושבת:
              &quot;הם רואים אותי עכשיו, וחושבים שאני מתפרקת.&quot;
            </p>
            <p>ניפנפתי עם משטח העכבר שלי כאילו זו פעולה מתוכננת לחלוטין.</p>
            <p>
              לא. הם לא רואים כלום. זו רק אני מדמיינת.
              הישיבה הסתיימה. ואז ישבתי ופיתחתי לעצמי פרוטוקול לפעם הבאה.
              גם הוא נכנס ישר לפרוטוקול המלא שלי, פרוטוקול הגיבורה.
            </p>
          </div>
        </header>

        {/* Prep section */}
        <section className="hfzvc-prep-section">
          <h2 className="hfzvc-section-title">לפני שמתחילות: מה להכין ליד הלפטופ תמיד</h2>
          <p className="hfzvc-prep-subtitle">שלושה דברים. זהו.</p>
          <ul className="hfzvc-prep-list">
            {prepItems.map((item) => (
              <li key={item.bold} className="hfzvc-prep-item">
                <span className="hfzvc-prep-icon" aria-hidden="true">{item.icon}</span>
                <span>
                  <strong>{item.bold}</strong> {item.rest}
                </span>
              </li>
            ))}
          </ul>
          <p className="hfzvc-prep-note">
            זה לא &quot;להיות מוכנה לרע&quot;. זה לנהל את האימפריה שלך באופן חכם.
          </p>
        </section>

        {/* Steps */}
        <p className="hfzvc-steps-title">הפרוטוקול: 5 צעדים ⚡</p>
        <div className="hfzvc-steps-list">
          {steps.map((step) => (
            <article key={step.title} className="hfzvc-card">
              <div className="hfzvc-card-header">
                <span className="hfzvc-card-icon" aria-hidden="true">{step.icon}</span>
                <h2 className="hfzvc-card-title">{step.title}</h2>
              </div>

              <div className="hfzvc-card-body">
                <p className="hfzvc-step-sub-label">מה עושים:</p>
                <p className="hfzvc-step-sub-text">{step.what}</p>

                <p className="hfzvc-step-sub-label">למה זה עובד:</p>
                <p className="hfzvc-step-sub-text">{step.why}</p>

                {step.title.includes('צעד 4') && (
                  <div className="hfzvc-contrast">
                    <div className="hfzvc-contrast-item hfzvc-contrast-a">
                      <span className="hfzvc-contrast-label">גרסת הגברת:</span>
                      <span> &quot;סליחה, קצת חם לי...&quot; ומורידה לעצמה.</span>
                    </div>
                    <div className="hfzvc-contrast-item hfzvc-contrast-b">
                      <span className="hfzvc-contrast-label">גרסת הגיבורה:</span>
                      <span> &quot;גיל המעבר עשה עלייה לאוויר. נותנת לו שנייה.&quot; חיוך קטן. ממשיכה.</span>
                    </div>
                    <p className="hfzvc-step-sub-text hfzvc-tagline">
                      הגל לא מגדיר אותך. <strong>את מגדירה אותו.</strong> זה ההבדל בין גברת שמתנצלת לגיבורה שמנהלת.
                    </p>
                  </div>
                )}

                {step.practiceLabel && step.practice && (
                  <>
                    <p className="hfzvc-step-sub-label">{step.practiceLabel}</p>
                    <p className="hfzvc-step-sub-text">{step.practice}</p>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Closing */}
        <div className="hfzvc-closing">
          <p className="hfzvc-closing-text">
            הגל יעבור. תמיד עובר.
          </p>
          <p className="hfzvc-closing-text">
            השאלה היחידה היא מי את בזמן שהוא עובר.
          </p>
          <p className="hfzvc-closing-text">
            גברת שמתנצלת שהיא אנושית? או גיבורה שממשיכה לנהל את האימפריה שלה בגוף שהחליף חוקים?
          </p>
          <p className="hfzvc-closing-text">
            את יודעת מה הבחירה שלי.
          </p>
          <p className="hfzvc-signoff">
            לא גברת. גיבורה. 👑 ענבל דפנה
          </p>
        </div>

      </div>
    </div>
  );
}
