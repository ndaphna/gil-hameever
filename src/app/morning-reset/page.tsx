import type { Metadata } from 'next';
import './morning-reset.css';

export const metadata: Metadata = {
  title: 'פרוטוקול הבוקר של הגיבורה | גיל המעבר',
  description: '5 דקות. 5 פעולות. יום שלם שונה.',
  robots: { index: false, follow: false },
};

export default function MorningResetPage() {
  return (
    <div className="mrvc-page" dir="rtl">
      <div className="mrvc-blob mrvc-blob-1" aria-hidden="true" />
      <div className="mrvc-blob mrvc-blob-2" aria-hidden="true" />
      <div className="mrvc-banner">
        <span className="mrvc-banner-text">מנופאוזית וטוב לה 👑</span>
      </div>
      <div className="mrvc-wrapper">
        <header className="mrvc-header">
          <h1 className="mrvc-title">
            <span className="mrvc-title-line1">פרוטוקול הבוקר של הגיבורה</span>
            <span className="mrvc-title-line2">5 דקות שמשנות את כל היום</span>
          </h1>
          <div className="mrvc-intro">
            <p>גיליתי משהו מוזר לפני כשנה. הימים הטובים שלי, אלה שבהם הייתי ממוקדת, פחות עצבנית, פחות עייפה, לא היו תלויים בכמה ישנתי.</p>
            <p><strong>הם היו תלויים במה עשיתי ב-5 הדקות הראשונות של הבוקר. כשקמתי וישר הסתכלתי בטלפון, היום התחיל בצורה מסוימת. כשקמתי ועשיתי את 5 הדברים הקטנים שכתבתי פה, היום התחיל אחרת לגמרי. לא בגלל "מחשבה חיובית". בגלל כימיה.</strong></p>
            <p>בגיל המעבר, ציר ההורמונים שלנו משתנה בצורה שמשפיעה ישירות על הקורטיזול, המלטונין ועל מקצב היממה. 5 דקות של גירוי עקבי בבוקר יוצרות שינוי הורמונלי מדיד.</p>
          </div>
        </header>
        <div className="mrvc-hacks-list">
          <article className="mrvc-card">
            <div className="mrvc-card-header">
              <span className="mrvc-card-icon">💧</span>
              <h2 className="mrvc-card-title">דקה 1: מים, 250ml מיד בקימה</h2>
            </div>
            <div className="mrvc-card-body">
              <p>לפני טלפון. לפני קפה. לפני הכל. אחרי 7-8 שעות שינה הגוף מיובש. יובש קל, אפילו 1-2%, גורם לעייפות, ערפל מוחי וקושי בריכוז. המוח הוא 73% מים.</p>
              <p><strong>הטיפ:</strong> השאירי כוס מים על שידת הלילה ערב קודם. בקימה, את שותה. עוד לפני שרגליך נוגעות ברצפה.</p>
            </div>
          </article>

          <article className="mrvc-card">
            <div className="mrvc-card-header">
              <span className="mrvc-card-icon">☀️</span>
              <h2 className="mrvc-card-title">דקה 2: 30 שניות אור ואוויר בחוץ</h2>
            </div>
            <div className="mrvc-card-body">
              <p>פתחי דלת, עמדי בחצר, במרפסת, ליד חלון פתוח. 30 שניות של אור טבעי על הפנים. האור מגיע לרשתית ושולח אות לאזור קטן בהיפותלמוס במוח, ה"שעון" שמכוון את כל מקצבי הגוף.</p>
              <p>בגיל המעבר, מקצב השינה מתבלבל. האור הוא הכפתור הכי פשוט לאיפוס.</p>
            </div>
          </article>

          <article className="mrvc-card">
            <div className="mrvc-card-header">
              <span className="mrvc-card-icon">🧘</span>
              <h2 className="mrvc-card-title">דקה 3: מתיחה אחת של 60 שניות</h2>
            </div>
            <div className="mrvc-card-body">
              <p>בחרי אחת ותשמרי עליה.</p>
              <p><strong>אפשרות א:</strong> מתיחת ירך ולגב תחתון, שכבי על הגב, משכי ברך אחת לחזה, 30 שניות, החלפי.</p>
              <p><strong>אפשרות ב:</strong> מתיחת חזה וכתפיים, עמדי ליד קיר, הניחי יד עליו, סובבי את הגוף ממנה, 30 שניות, החלפי.</p>
              <p>שינה מכווצת את השרירים. מתיחה אחת בת 60 שניות מעירה את הגוף ומקלה על כאבים בבוקר.</p>
            </div>
          </article>

          <article className="mrvc-card">
            <div className="mrvc-card-header">
              <span className="mrvc-card-icon">🌬️</span>
              <h2 className="mrvc-card-title">דקה 4: 3 נשימות 4-7-8</h2>
            </div>
            <div className="mrvc-card-body">
              <p>שאפי דרך האף 4 שניות, עצרי 7 שניות, נשפי דרך הפה 8 שניות. חזרי 3 פעמים.</p>
              <p>נשימת 4-7-8 מפעילה את עצב הוואגוס ומורידה את הקורטיזול תוך דקה. בגיל המעבר כשהגוף מתחיל את היום ב"מצב חירום", זה הכיבוי המהיר ביותר.</p>
              <p><strong>תוצאה:</strong> מוח רגוע יותר, פחות ריאקטיביות, יכולת החלטה גבוהה יותר.</p>
            </div>
          </article>

          <article className="mrvc-card">
            <div className="mrvc-card-header">
              <span className="mrvc-card-icon">✍️</span>
              <h2 className="mrvc-card-title">דקה 5: כתיבת "דבר אחד שאני רוצה לסיים היום"</h2>
            </div>
            <div className="mrvc-card-body">
              <p>ממש אחד. לא רשימה. לא יעדים. משפט אחד.</p>
              <p>"אני רוצה לשלוח את המייל לשרה." "אני רוצה לצאת להליכה ב-7." "אני רוצה לסיים את הדוח עד 12."</p>
              <p>המוח שלנו מתחיל כל בוקר ב"מצב פתוח", כשכל המחויבויות מתחרות על קשב. כתיבת דבר אחד יוצרת מיקוד עדיפות. מחקרים מראים שכתיבת "מה ואיך" מעלה פי 2-3 את הסיכוי לביצוע.</p>
            </div>
          </article>
        </div>
        <div className="mrvc-closing">
          <p className="mrvc-closing-text">5 הדקות האלה לא דורשות ציוד. לא דורשות רצון חזק. רק עקביות. כשאני עושה את הפרוטוקול, הבוקר מרגיש שלי. כשלא, הבוקר "תוקף" אותי. זה ההבדל בין לנהל את היום, לבין שהיום ינהל אותך.</p>
          <p className="mrvc-signoff">לא גברת. גיבורה. 👑 ענבל דפנה</p>
        </div>
      </div>
    </div>
  );
}
