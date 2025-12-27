'use client';

import { useEffect } from 'react';

export default function BuildingSafeRoutinePage() {
  useEffect(() => {
    // Intersection Observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="what-going-on-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="decoration-circle"></div>
        <div className="decoration-circle"></div>
        <div className="container">
          <div className="hero-content">
            <div className="stage-badge">🌳 שלב 2 במפה - וודאות, שקט, ביטחון</div>
            <h1>📆 בניית שגרה בטוחה</h1>
            <p className="subtitle">כשכל העולם רועש – השגרה שלך יכולה להיות העוגן</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          
          {/* Introduction */}
          <div className="content-card fade-in">
            <p>
              זה אולי לא נשמע סקסי כמו &quot;לצאת מאזור הנוחות&quot;,<br />
              אבל בגיל המעבר, נשים רבות מגלות שדווקא שגרה יציבה ונעימה<br />
              היא לא שעמום – היא ריפוי.
            </p>
            <p>
              שגרה טובה לא כולאת אותך – היא עוזרת לך לארגן מחדש את התחושה הפנימית שלך,<br />
              להפחית סטרס, לווסת רגשות, ולחזור להרגיש שיש לך על מה לסמוך – גם כשדברים משתנים.
            </p>
          </div>

          {/* Why Routine is Important */}
          <div className="content-card fade-in">
            <h2>למה השגרה כל כך חשובה דווקא עכשיו?</h2>
            <ul className="styled-list">
              <li>כי הגוף עובר שינויים – והוא צמא לקביעות שתאזן את הבלבול.</li>
              <li>כי ההורמונים משפיעים על שינה, מצב רוח, חשק, זיכרון – ושגרה מייצרת עקביות מול חוסר הוודאות.</li>
              <li>כי גם אם את מתפקדת כלפי חוץ – בפנים את מרגישה לפעמים כאילו אין בסיס.</li>
              <li>כי כשאין סדר – את נהיית &quot;כיבוי שרפות&quot;, וזה מתיש רגשית.</li>
            </ul>
          </div>

          {/* How to Create Safe Routine */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🧭</span><span className="text-content">איך יוצרים שגרה בטוחה – אבל גמישה?</span></h2>
            
            <h3>🕰️ 5 עוגנים פשוטים לשילוב בשגרת היום:</h3>
            <table className="activity-table" style={{marginTop: '20px'}}>
              <thead>
                <tr>
                  <th>עוגן</th>
                  <th>דוגמה</th>
                  <th>למה זה חשוב</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>⏰ שעת קימה קבועה</td>
                  <td>גם בסופי שבוע, עם טקס בוקר קצר</td>
                  <td>מייצר תחושת יציבות ביולוגית ונפשית</td>
                </tr>
                <tr>
                  <td>🧃 ריטואל שתייה/אכילה</td>
                  <td>כוס מים עם לימון, קפה עם נשימה מודעת</td>
                  <td>יוצר נוכחות ומכניס קרקע לתחילת היום</td>
                </tr>
                <tr>
                  <td>✍️ זמן כתיבה / פריקה</td>
                  <td>5 דקות עם מחברת, בלי שיפוט</td>
                  <td>עוזר לרוקן רעש לפני שהוא מציף</td>
                </tr>
                <tr>
                  <td>🚶 רגע של תנועה</td>
                  <td>הליכה קצרה, מתיחה, מוזיקה בגוף</td>
                  <td>מחבר אותך לעצמך ולגוף המשתנה</td>
                </tr>
                <tr>
                  <td>🌙 טקס ערב קבוע</td>
                  <td>אור עמום, קוביית שוקולד, מקלחת חמה</td>
                  <td>מסמן למוח ולנפש ש&quot;עכשיו אפשר להרפות&quot;</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* How to Build Personal Routine */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🧱</span><span className="text-content">איך בונים שגרה אישית שמתאימה רק לך?</span></h2>
            <ul className="styled-list">
              <li>בחרי שעה ביום שאת רוצה להקדיש לעצמך – אפילו 10 דקות.</li>
              <li>חשבי מה מחזק אותך: תנועה? כתיבה? שתיקה? מוזיקה?</li>
              <li>הפכי את זה לטקס קטן שחוזר על עצמו באותו זמן כל יום.</li>
              <li>שימי תזכורת עד שזה ייכנס לזרימה טבעית.</li>
              <li>והכי חשוב – אל תוותרי לעצמך כשאת &quot;לא במצב רוח&quot;. דווקא אז – זה הכי נחוץ.</li>
            </ul>
          </div>

          {/* Remember */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">💡</span><span className="text-content">זכרי:</span></h2>
            <ul className="styled-list">
              <li>שגרה לא חייבת להיות משעממת. היא יכולה להיות רכה, מתחשבת, מחבקת.</li>
              <li>לפעמים, הבדל בין יום סוער ליום סביר – זה טקס קטן של דקה וחצי.</li>
              <li>לא נבנית מחדש ביום אחד – אבל כל יום הוא לבנה.</li>
            </ul>
          </div>

          {/* Aliza's Story */}
          <div className="content-card story-card fade-in">
            <h2><span className="emoji-icon">📆</span><span className="text-content">עליזה שנקין על שגרה:</span></h2>
            <blockquote className="quote-box">
              <p>
                &quot;תשמעי… פעם חשבתי ששגרה זה מילה של פנסיונרים – קפה שחור בשבע, תוכנית בוקר ברדיו, ונמנום בצהריים.<br />
                היום? זה התרופה שלי.
              </p>
              <p>
                כי אם אני לא שמה לעצמי שגרה – אני מוצאת את עצמי בשלוש בלילה מול המקרר, בדילמה אם שוקולד נחשב לארוחת לילה בריאה.
              </p>
              <p>
                אז כן, שגרה זה אולי לא פוטוגני, לא &apos;זורמת&apos;, לא &apos;הרפתקה&apos;.<br />
                אבל זה מה שמחזיר אותי לעצמי.<br />
                הקפה של הבוקר, ההליכה הקטנה, הטקס לפני השינה –<br />
                זה הדלק של הנשמה שלי.
              </p>
              <p>
                ובסוף – אנחנו ביחד בזה.<br />
                עם רשימות, עם תזכורות, עם שוקולד של ערב.<br />
                כי שגרה? זה לא כלוב – זה חיבוק.&quot; 💜
              </p>
            </blockquote>
            <div className="image-container" style={{marginTop: '30px', marginBottom: '20px'}}>
              <img src="https://i.imghippo.com/files/KRl6695kw.jpg" alt="שגרה – זה לא סקסי, אבל זה מחזיק לי את הפיוזים מחוברים" />
            </div>
            <p style={{marginTop: '20px', fontStyle: 'italic', textAlign: 'center'}}>
              &quot;שגרה – זה לא סקסי, אבל זה מחזיק לי את הפיוזים מחוברים&quot;
            </p>
          </div>

          {/* Downloads */}
          <div className="content-card downloads-card fade-in">
            <h2><span className="emoji-icon">📥</span><span className="text-content">להורדה:</span></h2>
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <a 
                href="https://drive.google.com/file/d/173HcDymNIWeb8X7vZv2ehcxOqrjXHr1Q/view?usp=sharing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="cta-button"
              >
                10 סימנים שהנפש שלך מבקשת ביטחון ומה את יכולה לעשות
              </a>
            </div>
          </div>

          {/* Back to Stage 2 and Roadmap Links */}
          <div className="next-steps-card fade-in">
            <h2>מה הלאה?</h2>
            <p>
              סיימת לקרוא על נושא חשוב זה בגיל המעבר.
            </p>
            <p className="highlight-text">
              את לא לבד במסע הזה!
            </p>
            
            <div className="button-group">
              <a href="/certainty-peace-security#safe-routine" className="cta-button">
                🌳 חזרה לשלב 2 - וודאות, שקט, ביטחון
              </a>
              <a href="/menopause-roadmap" className="cta-button secondary">
                🗺️ מפת הדרכים למנופאוזית המתחילה
              </a>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}


