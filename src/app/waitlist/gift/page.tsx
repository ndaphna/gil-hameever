'use client';

import './gift-premium.css';
import '../../globals.css';

export default function WaitlistGiftPage() {
  return (
    <div className="gift-premium-page">
      {/* Hero Section - פתיח יוקרתי */}
      <section className="gift-hero">
        <h1 className="gift-hero-title">
          7 דברים שאף אחד לא הכין אותי אליהם בגיל המעבר
        </h1>
        <p className="gift-hero-author">מאת ענבל דפנה</p>
      </section>

      {/* Main Content - מבנה מכתב שיווקי */}
      <section className="gift-premium-container">
        
        {/* פתיח - הקדמה קצרה */}
        <div className="gift-content-box">
          <h2 className="gift-premium-heading">הקדמה קצרה</h2>
          
          <p className="gift-premium-paragraph">
            לפני כמה שנים הגוף שלי התחיל לדבר איתי בשפה שלא הכרתי:
          </p>
          
          <p className="gift-premium-paragraph">
            גלי חום באמצע ישיבה בעבודה, עייפות שלא עברה גם אחרי לילה של "שמונה שעות",
          </p>
          
          <p className="gift-premium-paragraph">
            מצבי רוח שעולים ויורדים כמו רכבת הרים, והרגשה שלא משנה מה אני עושה, אני לא ממש "אני".
          </p>
          
          <p className="gift-premium-paragraph">
            הייתי בטוחה שאני היחידה.
          </p>
          
          <p className="gift-premium-paragraph">
            שאני "מתפרקת".
          </p>
          
          <p className="gift-premium-paragraph">
            שאיבדתי את עצמי.
          </p>
          
          <p className="gift-premium-paragraph" style={{ fontWeight: 600, textAlign: 'center', marginTop: '2rem' }}>
            עד שגיליתי את <span className="gift-highlight">האמת</span>:
          </p>
          
          {/* Quote Box - קופסת ציטוט יוקרתית */}
          <div className="gift-quote-box">
            <p className="gift-quote-text">
              זו <span className="gift-highlight">לא תקלה</span>. זו תקופה.
            </p>
            <p className="gift-quote-text" style={{ marginTop: '1rem' }}>
              וזו <span className="gift-highlight">לא תקופה של סוף</span>
            </p>
            <p className="gift-quote-text" style={{ marginTop: '1rem' }}>
              אלא תקופה של <span className="gift-highlight">מעבר</span>.
            </p>
          </div>
          
          <p className="gift-premium-paragraph">
            הדברים הבאים הם בדיוק מה שהייתי רוצה שמישהי תגיד לי אז.
          </p>
          
          <p className="gift-premium-paragraph" style={{ fontStyle: 'italic', textAlign: 'center' }}>
            אני מקווה שהם יזכירו לך שאת לא לבד לרגע אחד. 💗
          </p>
        </div>

        <hr className="gift-section-divider" />

        {/* 1. אף אחד לא הכין אותי לזה שהכול מגיע בהפתעה */}
        <div className="gift-content-box">
          <h3 className="gift-premium-heading">
            1. אף אחד לא הכין אותי לזה שהכול מגיע <span className="gift-highlight">בהפתעה</span>.
          </h3>
          
          <p className="gift-premium-paragraph">
            לא היה "תאריך יעד".
          </p>
          
          <p className="gift-premium-paragraph">
            לא מכתב מהמוח: "חמודה, בשבוע הבא מתחילים שינויים."
          </p>
          
          <p className="gift-premium-paragraph">
            זה פשוט… התחיל.
          </p>
          
          <p className="gift-premium-paragraph">
            יום אחד קמתי ושאלתי את עצמי:
          </p>
          
          <div className="gift-quote-box">
            <p className="gift-quote-text">"מה קורה לי??"</p>
          </div>
          
          <p className="gift-premium-paragraph" style={{ fontWeight: 600 }}>
            וזה נורמלי.
          </p>
          
          <p className="gift-premium-paragraph gift-mb-0">
            רוב הנשים נכנסות לגיל המעבר בהדרגה, בלי סימן ברור אחד.
          </p>
        </div>

        <hr className="gift-section-divider" />

        {/* 2. אף אחד לא הכין אותי לזה שהגוף והרגש עובדים יחד */}
        <div className="gift-content-box">
          <h3 className="gift-premium-heading">
            2. אף אחד לא הכין אותי לזה שהגוף והרגש <span className="gift-highlight">עובדים יחד</span>.
          </h3>
          
          <p className="gift-premium-paragraph">
            כששינויים הורמונליים מגיעים
          </p>
          
          <p className="gift-premium-paragraph">
            הם לא פוגעים רק בגוף.
          </p>
          
          <p className="gift-premium-paragraph">
            הם נוגעים גם ברגש, במחשבות, בשקט הפנימי.
          </p>
          
          <p className="gift-premium-paragraph">
            עצבנות?
          </p>
          
          <p className="gift-premium-paragraph">
            בכי פתאומי?
          </p>
          
          <p className="gift-premium-paragraph">
            תחושת ריק?
          </p>
          
          <div className="gift-quote-box">
            <p className="gift-quote-text">
              את לא "מגזימה" ולא "רגישה מדי".
            </p>
          </div>
          
          <p className="gift-premium-paragraph gift-mb-0">
            זה הגוף והנפש שעוברים שינוי - ביחד.
          </p>
        </div>

        <hr className="gift-section-divider" />

        {/* 3. אף אחד לא הכין אותי לעייפות החדשה הזו */}
        <div className="gift-content-box">
          <h3 className="gift-premium-heading">
            3. אף אחד לא הכין אותי ל<span className="gift-highlight">עייפות החדשה</span> הזו.
          </h3>
          
          <p className="gift-premium-paragraph">
            לא עייפות של "לא ישנתי טוב".
          </p>
          
          <p className="gift-premium-paragraph">
            עייפות של "הנפש שלי צריכה סוללה חדשה".
          </p>
          
          <p className="gift-premium-paragraph">
            וזה לא אומר שמשהו לא בסדר בך.
          </p>
          
          <p className="gift-premium-paragraph gift-mb-0" style={{ fontStyle: 'italic', fontWeight: 500 }}>
            זה סימן לגוף שאומר: "אני צריכה אותך רגע איתי."
          </p>
        </div>

        <hr className="gift-section-divider" />

        {/* 4. אף אחד לא הכין אותי לזה שהעור, השיער והעיניים ירגישו אחרת */}
        <div className="gift-content-box">
          <h3 className="gift-premium-heading">
            4. אף אחד לא הכין אותי לזה שהעור, השיער והעיניים ירגישו <span className="gift-highlight">אחרת</span>.
          </h3>
          
          <p className="gift-premium-paragraph" style={{ fontWeight: 600, fontSize: '1.125rem' }}>
            יבש. רגיז. רגיש.
          </p>
          
          <p className="gift-premium-paragraph">
            העור משתנה, השיער לפעמים לא משתף פעולה, והעיניים עייפות יותר מהרגיל.
          </p>
          
          <p className="gift-premium-paragraph">
            זה לא הזדקנות,
          </p>
          
          <p className="gift-premium-paragraph">
            זה שינוי הורמונלי טבעי.
          </p>
          
          <p className="gift-premium-paragraph">
            והבשורה המשמחת?
          </p>
          
          <p className="gift-premium-paragraph">
            אפשר לטפל בכל זה
          </p>
          
          <p className="gift-premium-paragraph gift-mb-0" style={{ fontStyle: 'italic' }}>
            בעדינות, בעקביות, בלי לחץ.
          </p>
        </div>

        <hr className="gift-section-divider" />

        {/* 5. אף אחד לא הכין אותי לזה שאני אשאל את עצמי מחדש: "מי אני?" */}
        <div className="gift-content-box">
          <h3 className="gift-premium-heading">
            5. אף אחד לא הכין אותי לזה שאני אשאל את עצמי מחדש: <span className="gift-highlight">"מי אני?"</span>
          </h3>
          
          <p className="gift-premium-paragraph">
            זו אחת ההפתעות הכי גדולות.
          </p>
          
          <p className="gift-premium-paragraph">
            לא רק הגוף משתנה,
          </p>
          
          <p className="gift-premium-paragraph">
            גם הזהות.
          </p>
          
          <p className="gift-premium-paragraph">
            נשים בגיל המעבר מספרות שהן חוות:
          </p>
          
          <ul className="gift-list">
            <li>צורך בבדק בית</li>
            <li>רצון לעצור רגע</li>
            <li>געגוע לעצמן</li>
            <li>צורך להחליט מחדש מה חשוב להן</li>
          </ul>
          
          <p className="gift-premium-paragraph" style={{ fontWeight: 500 }}>
            זה <span className="gift-highlight">לא משבר</span>
          </p>
          
          <p className="gift-premium-paragraph gift-mb-0" style={{ fontWeight: 700, fontSize: '1.125rem' }}>
            זו <span className="gift-highlight">הזמנה</span>.
          </p>
        </div>

        <hr className="gift-section-divider" />

        {/* 6. אף אחד לא הכין אותי לזה שגלי חום יכולים להגיע דווקא ברגע הלא מתאים */}
        <div className="gift-content-box">
          <h3 className="gift-premium-heading">
            6. אף אחד לא הכין אותי לזה שגלי חום יכולים להגיע דווקא ב<span className="gift-highlight">רגע הלא מתאים</span>.
          </h3>
          
          <p className="gift-premium-paragraph">
            בדיוק כשאת באמצע מצגת.
          </p>
          
          <p className="gift-premium-paragraph">
            ברגע שאת מנסה לישון.
          </p>
          
          <p className="gift-premium-paragraph">
            או באמצע חיבוק עם מישהו שאוהב אותך.
          </p>
          
          <p className="gift-premium-paragraph">
            וזה מביך.
          </p>
          
          <p className="gift-premium-paragraph">
            אבל זה גם נפוץ מאוד.
          </p>
          
          <div className="gift-quote-box">
            <p className="gift-quote-text">
              ולא, זה לא מגדיר אותך.
            </p>
          </div>
        </div>

        <hr className="gift-section-divider" />

        {/* 7. אף אחד לא הכין אותי לזה שיש גם צד שני. והוא מדהים */}
        <div className="gift-content-box">
          <h3 className="gift-premium-heading">
            7. אף אחד לא הכין אותי לזה שיש גם <span className="gift-highlight">צד שני</span>. והוא מדהים.
          </h3>
          
          <p className="gift-premium-paragraph">
            ברגע שאת מבינה מה עובר עלייך, משהו משתחרר.
          </p>
          
          <p className="gift-premium-paragraph">
            את נושמת אחרת.
          </p>
          
          <p className="gift-premium-paragraph">
            האשמה נעלמת.
          </p>
          
          <p className="gift-premium-paragraph">
            חוזרת שליטה.
          </p>
          
          <p className="gift-premium-paragraph">
            חוזר ביטחון.
          </p>
          
          <p className="gift-premium-paragraph">
            נשים בגיל המעבר מדווחות על:
          </p>
          
          <ul className="gift-list">
            <li>יצירתיות</li>
            <li>בהירות</li>
            <li>גבולות בריאים</li>
            <li>שלווה</li>
            <li>חיבור לעצמן שלא היה לפני</li>
          </ul>
          
          <p className="gift-premium-paragraph gift-mb-0" style={{ 
            fontWeight: 700, 
            fontSize: '1.125rem',
            textAlign: 'center',
            marginTop: '2rem'
          }}>
            זה גיל של <span className="gift-highlight">חכמה</span>, <span className="gift-highlight">עומק</span> ו<span className="gift-highlight">התחלה חדשה</span>.
          </p>
        </div>

        <hr className="gift-section-divider" />

        {/* סיום עדין */}
        <div className="gift-content-box gift-closing">
          <h2 className="gift-premium-heading" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            סיום עדין ממני אלייך
          </h2>
          
          <p className="gift-premium-paragraph" style={{ textAlign: 'center' }}>
            אם את קוראת את זה
          </p>
          
          <p className="gift-premium-paragraph" style={{ textAlign: 'center' }}>
            את כבר עושה משהו בשביל עצמך.
          </p>
          
          <p className="gift-premium-paragraph" style={{ textAlign: 'center' }}>
            וזה מרגש אותי בכל פעם מחדש.
          </p>
          
          <p className="gift-premium-paragraph" style={{ textAlign: 'center' }}>
            גיל המעבר הוא <span className="gift-highlight">לא סוף</span> של שום דבר
          </p>
          
          <p className="gift-premium-paragraph" style={{ textAlign: 'center' }}>
            הוא <span className="gift-highlight">התחלה</span> של פרק חדש,
          </p>
          
          <p className="gift-premium-paragraph" style={{ textAlign: 'center' }}>
            חכם, <span className="gift-highlight">אמיתי</span> ומלא חיים.
          </p>
          
          <p className="gift-premium-paragraph" style={{ textAlign: 'center' }}>
            אני כאן איתך במסע.
          </p>
          
          <p className="gift-premium-paragraph" style={{ 
            fontWeight: 600,
            marginTop: '2rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            תודה שבחרת להצטרף. 💗
          </p>
          
          <p className="gift-premium-paragraph gift-mb-0" style={{ 
            fontSize: '1.25rem',
            fontWeight: 500,
            fontStyle: 'italic',
            textAlign: 'center'
          }}>
            ענבל.
          </p>
        </div>

        <hr className="gift-section-divider" />

        {/* CTA Section - כפתור בסוף הדף */}
        <div className="gift-content-box" style={{ textAlign: 'center' }}>
          <p className="gift-premium-paragraph" style={{ 
            fontSize: '1.125rem',
            fontWeight: 600,
            marginBottom: '1rem'
          }}>
            רוצה לקבל עדכון כשהספר יוצא?
          </p>
          
          <p className="gift-premium-paragraph">
            את כבר ברשימת ההמתנה
          </p>
          
          <p className="gift-premium-paragraph" style={{ marginBottom: '2rem' }}>
            ותקבלי הצצה ראשונה ממש בקרוב.
          </p>
          
          <a 
            href="/waitlist" 
            className="gift-cta-button"
          >
            חזרה לדף ההרשמה
          </a>
          
          <div className="gift-footer-note">
            <p className="gift-premium-paragraph" style={{ 
              fontStyle: 'italic',
              fontSize: '0.9375rem',
              color: 'var(--premium-text-secondary)'
            }}>
              תודה שנתת לי להיכנס אלייך דרך המילים שלי.
            </p>
            
            <p className="gift-premium-paragraph" style={{ 
              fontStyle: 'italic',
              fontSize: '0.9375rem',
              color: 'var(--premium-text-secondary)'
            }}>
              מקווה שתרגישי בבית ביניהן.
            </p>
            
            <p className="gift-premium-paragraph" style={{ 
              fontStyle: 'italic',
              fontSize: '0.9375rem',
              color: 'var(--premium-text-secondary)'
            }}>
              אני מתרגשת כמו בלידה הראשונה…
            </p>
            
            <p className="gift-premium-paragraph" style={{ 
              fontStyle: 'italic',
              fontSize: '0.9375rem',
              color: 'var(--premium-text-secondary)'
            }}>
              זו גם 'לידה' של משהו גדול.
            </p>
            
            <p className="gift-premium-paragraph gift-mb-0" style={{ 
              fontStyle: 'italic',
              fontSize: '0.9375rem',
              color: 'var(--premium-text-secondary)'
            }}>
              מקווה שתתחברי. 🌸
            </p>
          </div>
        </div>

      </section>
    </div>
  );
}
