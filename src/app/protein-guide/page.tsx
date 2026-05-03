import type { Metadata } from 'next';
import './protein-guide.css';

export const metadata: Metadata = {
  title: 'רשימת הגיבורה לחלבון | גיל המעבר',
  description: 'כל מה שצריך לדעת כדי לאכול מספיק חלבון בגיל המעבר',
  robots: { index: false, follow: false },
};

const proteinSources = [
  {
    name: 'ביצים',
    protein: '6 גרם לביצה',
    prep: 'ביצה קשה (מכינים 4 ביחד), ביצה עלומה, חביתה עם ירקות',
    meal: '3 ביצים קשות + עגבנייה + כף טחינה = 21 גרם',
  },
  {
    name: 'עוף (חזה)',
    protein: '31 גרם ל-100 גרם',
    prep: 'פרוסות עוף מוכנות מראש, מחבת עם שמן זית ולימון 8 דקות',
    meal: '150 גרם עוף + ירקות צלויים = 46 גרם',
  },
  {
    name: 'טונה בקופסה (במים)',
    protein: '25 גרם לקופסה סטנדרטית',
    prep: 'פתיחת קופסה. זהו.',
    meal: 'טונה + לחם מלא + עגבנייה + לימון = 30 גרם',
  },
  {
    name: 'קוטג\' 5%',
    protein: '12 גרם לקופסה קטנה (200 גרם)',
    prep: 'ישירות מהמקרר',
    meal: 'קוטג\' + פרי + אגוזים = 15 גרם',
  },
  {
    name: 'גבינה בולגרית 5%',
    protein: '14 גרם ל-100 גרם',
    prep: 'פרוסה + לחם',
    meal: 'גבינה + ביצה קשה + ירקות = 20 גרם',
  },
  {
    name: 'יוגורט יווני (0% או 2%)',
    protein: '10 גרם ל-100 גרם',
    prep: 'מה שצריך זה כפית',
    meal: '200 גרם יוגורט יווני + גרגירי חומוס + לימון = 23 גרם',
  },
  {
    name: 'עדשים מבושלות',
    protein: '9 גרם ל-100 גרם מבושל',
    prep: 'אפשר לקנות מוכן בשקית (ללא בישול)',
    meal: 'מרק עדשים מוכן + לחם = 18 גרם',
  },
  {
    name: 'אדממה (פולי סויה)',
    protein: '11 גרם ל-100 גרם',
    prep: 'מהמקפיא, 3 דקות מיקרו',
    meal: 'קערת אדממה + מלח גס = 11 גרם (נשנוש כחטיף)',
  },
  {
    name: 'סלמון (טרי או קפוא)',
    protein: '25 גרם ל-100 גרם',
    prep: 'מחבת עם שמן זית, 4 דקות כל צד',
    meal: '150 גרם סלמון + ירק ירוק = 37 גרם + אומגה 3 בונוס',
  },
  {
    name: 'אבקת חלבון (Whey או צמחי)',
    protein: '20-25 גרם למנה',
    prep: 'שייק עם חלב שקדים + בננה = 30 שניות',
    meal: 'שייק בוקר = 20-25 גרם, אפשרות טובה כשקשה לאכול בבוקר',
  },
];

const meals = [
  {
    time: 'בוקר (33 גרם)',
    options: [
      'אפשרות א: 3 ביצים (21 גרם) + קוטג\' (12 גרם) = 33 גרם',
      'אפשרות ב: שייק חלבון (25 גרם) + 2 ביצים קשות (12 גרם) = 37 גרם',
      'אפשרות ג: יוגורט יווני 200 גרם (20 גרם) + אדממה (11 גרם) = 31 גרם',
    ],
  },
  {
    time: 'צהריים (33 גרם)',
    options: [
      'אפשרות א: 150 גרם עוף = 45 גרם',
      'אפשרות ב: טונה (25 גרם) + ביצה קשה (6 גרם) + גבינה (12 גרם) = 43 גרם',
      'אפשרות ג: 150 גרם סלמון + עדשים = 45 גרם',
    ],
  },
  {
    time: 'ערב (30-34 גרם)',
    options: [
      'אפשרות א: 2 ביצים (12 גרם) + 100 גרם גבינה (14 גרם) + יוגורט (10 גרם) = 36 גרם',
      'אפשרות ב: 100 גרם עוף (31 גרם) + ירקות = 31 גרם',
      'אפשרות ג: קוטג\' גדול (20 גרם) + ביצים (12 גרם) = 32 גרם',
    ],
  },
];

const mistakes = [
  {
    title: 'טעות 1: לספור יוגורט רגיל כ"חלבון"',
    text: 'יוגורט רגיל יש בו 3-4 גרם חלבון ל-100 גרם. יוגורט יווני יש בו 10 גרם. ההבדל הוא פי 3. שנים חשבתי שאני אוכלת חלבון עם הארוחות הבריאות שלי.',
  },
  {
    title: 'טעות 2: לשכוח שלסלט אין כמעט חלבון',
    text: '"אכלתי סלט גדול עם טונה", טונה 25 גרם. ה"גדול" לא מוסיף חלבון. ירקות הם מעולים אבל הם לא מקור חלבון.',
  },
  {
    title: 'טעות 3: לחשוב שלחם מחיטה מלאה = חלבון מספיק',
    text: 'פרוסת לחם מלא יש בה 3-4 גרם חלבון. לאכול 4 פרוסות ביום ו"לכסות" חלבון זה לא ריאלי מבחינת קלוריות.',
  },
];

export default function ProteinGuidePage() {
  return (
    <div className="pgvc-page" dir="rtl">
      <div className="pgvc-blob pgvc-blob-1" aria-hidden="true" />
      <div className="pgvc-blob pgvc-blob-2" aria-hidden="true" />

      <div className="pgvc-banner">
        <span className="pgvc-banner-text">מנופאוזית וטוב לה 👑</span>
      </div>

      <div className="pgvc-wrapper">

        {/* Header */}
        <header className="pgvc-header">
          <h1 className="pgvc-title">
            <span className="pgvc-title-line1">רשימת הגיבורה לחלבון</span>
            <span className="pgvc-title-line2">כל מה שצריך לדעת כדי לאכול מספיק חלבון בגיל המעבר</span>
          </h1>
          <div className="pgvc-intro">
            <p>יום אחד ישבתי עם דיאטנית ועשינו חישוב פשוט.</p>
            <p>
              כמה חלבון אני אוכלת ביום? ביחד עברנו על מה שאכלתי בשלושת הימים האחרונים.
              יוגורט בבוקר, סלט בצהריים, פסטה עם ירקות בערב. &quot;נשמע טוב,&quot; חשבתי.
            </p>
            <p><strong>התוצאה: בסביבות 30 גרם חלבון ביום.</strong></p>
            <p>הכמות שגוף שלי צריך בגיל המעבר: <strong>100-110 גרם.</strong></p>
            <p>
              פשוט עמדתי שם ולא האמנתי. שלושים. לא שבעים, לא שמונים. שלושים.
              עשיתי &quot;בריאות&quot; עשר שנים ולא ידעתי שאני מרעיבה את השרירים שלי.
            </p>
            <p>המדריך הזה הוא מה שהייתי רוצה שמישהו יתן לי באותו יום.</p>
          </div>
        </header>

        {/* Science section */}
        <article className="pgvc-card">
          <h2 className="pgvc-card-title">למה חלבון קריטי בגיל המעבר</h2>
          <div className="pgvc-card-body">
            <p className="pgvc-step-sub-text">
              האסטרוגן הוא לא רק &quot;הורמון מיני&quot;. הוא שומר על מסת השריר שלך.
            </p>
            <p className="pgvc-step-sub-text">
              כשאסטרוגן יורד בגיל המעבר, <strong>Sarcopenia מתחיל:</strong> ירידה מואצת במסת שריר.
              בלי מספיק חלבון, הגוף מפרק שריר כדי לקבל חומצות אמינו. וכשיש פחות שריר:
            </p>
            <ul className="pgvc-inner-list">
              <li><strong>Metabolism יורד,</strong> קל יותר לעלות במשקל, קשה יותר לרדת</li>
              <li><strong>עצמות נחלשות,</strong> שריר חזק = עצמות חזקות. זה לא נפרד.</li>
              <li><strong>עייפות,</strong> שריר הוא מקור אנרגיה. פחות שריר = פחות אנרגיה זמינה.</li>
              <li><strong>שינויי גוף</strong> שמרגישים &quot;פתאומיים&quot;, אבל מתרחשים לאט לאט מבפנים</li>
            </ul>
            <p className="pgvc-step-sub-text">
              <strong>הפתרון לא מתחיל בחדר כושר. הוא מתחיל בצלחת.</strong>
            </p>
          </div>
        </article>

        {/* Protein sources */}
        <article className="pgvc-card">
          <h2 className="pgvc-card-title">הרשימה: 10 מקורות חלבון שאפשר לעשות איתם משהו</h2>
          <div className="pgvc-card-body">
            <div className="pgvc-sources-list">
              {proteinSources.map((source, i) => (
                <div key={source.name} className="pgvc-source-item">
                  <p className="pgvc-step-sub-label">{i + 1}. {source.name}</p>
                  <p className="pgvc-step-sub-text"><strong>כמה חלבון:</strong> {source.protein}</p>
                  <p className="pgvc-step-sub-text"><strong>הכנה בפחות מ-10 דקות:</strong> {source.prep}</p>
                  <p className="pgvc-step-sub-text"><strong>דוגמת ארוחה:</strong> {source.meal}</p>
                </div>
              ))}
            </div>
          </div>
        </article>

        {/* Daily protocol */}
        <article className="pgvc-card">
          <h2 className="pgvc-card-title">פרוטוקול היום: 3 נקודות חלבון ביום</h2>
          <div className="pgvc-card-body">
            <p className="pgvc-step-sub-text">
              המטרה: <strong>100 גרם חלבון ביום.</strong> נשבר ל-3 ארוחות של כ-33 גרם כל אחת.
            </p>
            <div className="pgvc-meals-list">
              {meals.map((meal) => (
                <div key={meal.time} className="pgvc-meal-item">
                  <p className="pgvc-step-sub-label">{meal.time}</p>
                  <ul className="pgvc-inner-list">
                    {meal.options.map((opt, i) => (
                      <li key={i}>{opt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </article>

        {/* Mistakes */}
        <article className="pgvc-card">
          <h2 className="pgvc-card-title">מה לא לעשות: 3 טעויות שאני עצמי עשיתי</h2>
          <div className="pgvc-card-body">
            {mistakes.map((m) => (
              <div key={m.title} className="pgvc-mistake-item">
                <p className="pgvc-step-sub-label">{m.title}</p>
                <p className="pgvc-step-sub-text">{m.text}</p>
              </div>
            ))}
            <p className="pgvc-step-sub-text">
              <strong>הפתרון לכל שלוש הטעויות:</strong> אחרי שבוע של מעקב פשוט ביומן, גיליתי את הפערים שלי.
              לא צריך לספור לנצח. רק שבוע אחד כדי להבין מה באמת נכנס.
            </p>
          </div>
        </article>

        {/* Closing */}
        <div className="pgvc-closing">
          <p className="pgvc-closing-text">
            100 גרם חלבון ביום לא דורש &quot;דיאטה&quot;. לא דורש שייקים מיוחדים ואבקות יקרות.
            דורש תשומת לב, ותכנון קצר.
          </p>
          <p className="pgvc-closing-text">
            <strong>יש לך גוף שמשתנה, ולא גוף שהתקלקל.</strong> ואת מחליטה לדאוג לו.
          </p>
          <p className="pgvc-signoff">לא גברת. גיבורה. 👑 ענבל דפנה</p>
        </div>

      </div>
    </div>
  );
}
