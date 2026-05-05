import type { Metadata } from 'next';
import './identity-guide.css';

export const metadata: Metadata = {
  title: 'המסע שלי מ"גברת" לגיבורה! | גיל המעבר',
  description: 'ברגע שהחלטתי שאני לא גברת. אני גיבורה.',
  robots: { index: false, follow: false },
};

export default function IdentityGuidePage() {
  return (
    <div className="igvc-page" dir="rtl">
      <div className="igvc-blob igvc-blob-1" aria-hidden="true" />
      <div className="igvc-blob igvc-blob-2" aria-hidden="true" />
      <div className="igvc-banner">
        <span className="igvc-banner-text">מנופאוזית וטוב לה 👑</span>
      </div>
      <div className="igvc-wrapper">
        <header className="igvc-header">
          <h1 className="igvc-title">
            <span className="igvc-title-line1">המסע שלי</span>
            <span className="igvc-title-line2">מ"גברת" לגיבורה!</span>
          </h1>
          <div className="igvc-intro">
            <p>
              היה בוקר רגיל לגמרי. קמתי בשש, שתיתי קפה, ובדרך חזרה מהמטבח, בלי לתכנן, עצרתי מול הראי.
            </p>
            <p>
              האישה שהסתכלה עלי הייתה מוכרת לגמרי. אותם עיניים. אבל משהו לא נראה כמו תמיד. לא הייתי מסוגלת להסביר מה בדיוק. היא נראתה כמוני, אבל בגרסה חדשה, כאילו מישהו שינה את כל הכללים שהיא הכירה בלי לספר לה.
            </p>
          </div>
        </header>

        <div className="igvc-hacks-list">

          <article className="igvc-card">
            <div className="igvc-card-header">
              <span className="igvc-card-icon">🌑</span>
              <h2 className="igvc-card-title">שלב ראשון: הכחשה</h2>
            </div>
            <div className="igvc-card-body">
              <p>
                זה רק עייפות. זה מה שאמרתי לעצמי. בביטחון מלא. עייפות מהעבודה, עייפות מהמשפחה, עייפות מהחיים...
                אז לקחתי לעצמי סופ"ש לנוח באמת. ועמדתי שוב מול הראי ביום ראשון בבוקר. האישה עדיין הייתה שם. עדיין עם אותו מבט. עדיין עם אותה תחושה שהחוקים השתנו ואף אחד לא טרח להודיע לה.
              </p>
              <p>
                זה מה שעושות הרבה נשים בגיל מסוים: מחכות שיעבור. מחכות שהעייפות תיגמר, שהמצב הרוח יתאזן, שהגוף יחזור לעצמו.
              </p>
            </div>
          </article>

          <article className="igvc-card">
            <div className="igvc-card-header">
              <span className="igvc-card-icon">🌓</span>
              <h2 className="igvc-card-title">שלב שני: הבלבול</h2>
            </div>
            <div className="igvc-card-body">
              <p>
                שאלה שחזרה ועלתה שוב ושוב: מה קורה לי?
              </p>
              <p>
                הדברים שהיו לי חשובים, עדיין היו חשובים, אבל בדרך אחרת. הסבלנות שהיתה לי, נעלמה. הדברים שעד עכשיו סבלתי בשתיקה, כבר לא יכולתי לסבול. ניסיתי לתקן. להחזיר את עצמי. להיות מי שהייתי.
              </p>
            </div>
          </article>

          <article className="igvc-card">
            <div className="igvc-card-header">
              <span className="igvc-card-icon">🌕</span>
              <h2 className="igvc-card-title">שלב שלישי: הבחירה</h2>
            </div>
            <div className="igvc-card-body">
              <p>
                הרגע ששינה הכל הגיע בערב רגיל. ישבתי בסלון, ניסיתי לקרוא ספר, לא הצלחתי להתרכז, והנחתי אותו. ושאלתי את עצמי שאלה אחרת לגמרי.
              </p>
              <p>
                לא מה קרה לי? אלא: מה אם לא קרה לי כלום? מה אם זו בדיוק אני, אני הבאה?
              </p>
              <p>
                זה היה הרגע. לא דרמה. סתם ישיבה בסלון, ספר סגור על הכרית, ושאלה שנכנסה לחיי ולא יצאה.
              </p>
            </div>
          </article>

          <article className="igvc-card">
            <div className="igvc-card-header">
              <span className="igvc-card-icon">👑</span>
              <h2 className="igvc-card-title">הגיבורה לא מחכה שהגוף יחזור</h2>
            </div>
            <div className="igvc-card-body">
              <p>
                זו התובנה שפתחה לי הכל. הגיבורה לא מחכה שהגוף יחזור לנורמלי. הגיבורה בונה את הנורמלי החדש, בגוף שיש לה, עם הכלים שיש לה, מהנקודה שהיא עומדת בה עכשיו.
              </p>
              <p>
                זה לא ויתור. זה לא לקבל בהכנעה. זה בנייה אקטיבית. לצאת בבוקר ולהחליט מה הכללים, לא לחכות שמישהו יספר לה.
              </p>
              <p>
                <strong>הגברת מחכה שתחזור לעצמה. הגיבורה מחליטה מי היא.</strong>
              </p>
            </div>
          </article>

        </div>

        <div className="igvc-closing">
          <p className="igvc-closing-text">
            אם הרגע שתיארתי, הראי, הבלבול, השאלה מה קרה לי?, מדבר אליך, את במקום הנכון. מישהי צריכה לומר לך: את לא לבד. ולא הולכת לאיבוד. את בדיוק בדרך.
          </p>
          <p className="igvc-signoff">לא גברת. גיבורה. 👑 ענבל דפנה</p>
        </div>
      </div>
    </div>
  );
}
