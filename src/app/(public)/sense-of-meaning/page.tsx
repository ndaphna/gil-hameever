'use client';

import { useEffect } from 'react';

export default function SenseOfMeaningPage() {
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
            <div className="stage-badge">🎯 שלב 5 במפה - תבונה ונתינה</div>
            <h1>תחושת משמעות</h1>
            <p className="subtitle">לא חייבים להציל את העולם. מספיק שתדעי למה את קמה בבוקר.</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          
          {/* Introduction */}
          <div className="content-card fade-in">
            <p>
              המשמעות היא לא תמיד גדולה, נוצצת או מתוקשרת.
            </p>
            <p>
              לפעמים היא שקטה, פנימית, אישית מאוד:
            </p>
            <p className="highlight-text">
              לדעת שאת חשובה – גם אם אף אחד לא מוחא כפיים.
            </p>
            <p>
              תחושת משמעות בגיל המעבר לא נמדדת בכמות – אלא בעומק.
            </p>
            <p>
              היא נבנית מתוך חיבורים, ערכים, הקשבה לעצמך, ורגעים של נוכחות.
            </p>
            <p className="highlight-text">
              זו ההבנה שאת לא רק חיה – את משפיעה. גם בלי כוונה.
            </p>
          </div>

          {/* When Do We Feel Meaning */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">💫</span><span className="text-content">מתי מרגישים משמעות?</span></h2>
            <ul className="styled-list">
              <li>כשמה שאת עושה מרגיש לך מדויק – גם אם קטן.</li>
              <li>כשאת מחוברת לערכים שלך – גם בלי לדבר עליהם כל הזמן.</li>
              <li>כשאת נמצאת במקום מסוים – ומרגישה שזו לא טעות.</li>
              <li>כשאת מרגישה שהעשייה שלך מהדהדת – בך, ובאחרים.</li>
            </ul>
          </div>

          {/* How to Develop Sense of Meaning */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🛠️</span><span className="text-content">איך מפתחים תחושת משמעות יומיומית?</span></h2>
            
            <table className="activity-table">
              <thead>
                <tr>
                  <th>פעולה</th>
                  <th>למה זה עובד</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>✍️ רישום &quot;רגע משמעותי מהיום&quot;</td>
                  <td>עוזר להבחין בעומק בתוך השגרה</td>
                </tr>
                <tr>
                  <td>🧘 טקסי חיבור יומיומיים</td>
                  <td>למשל: כוס תה עם כוונה, נשימה מודעת, מבט בעיניים</td>
                </tr>
                <tr>
                  <td>🤝 עשייה שמבוססת על ערכים</td>
                  <td>זיהוי מה חשוב לי – ופועלת לפי זה, גם אם אף אחד לא רואה</td>
                </tr>
                <tr>
                  <td>💬 שיח עם נשים אחרות</td>
                  <td>לחלוק תובנות, הקשבה הדדית – תורם גם לתחושת ערך עצמי</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Questions That Point to Meaning */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">💡</span><span className="text-content">שאלות שמצביעות על משמעות:</span></h2>
            <ul className="styled-list">
              <li>איפה אני מרגישה שאני תורמת – גם בלי תגמול?</li>
              <li>מתי בפעם האחרונה הרגשתי &quot;במקום הנכון&quot;?</li>
              <li>מה אני עושה שמרגיש לי &quot;לא מובן מאליו&quot;?</li>
              <li>למי אני משמעותית – גם אם הוא לא תמיד אומר את זה?</li>
            </ul>
          </div>

          {/* Practice Exercise */}
          <div className="content-card exercise fade-in">
            <h2><span className="emoji-icon">🧘</span><span className="text-content">תרגול לשבוע הקרוב:</span></h2>
            <div className="exercise-box">
              <p>
                בכל ערב, שאלי את עצמך:
              </p>
              <p className="highlight-text">
                &quot;איזה רגע היום גרם לי להרגיש שמה שאני עושה – חשוב?&quot;
              </p>
              <p>
                כתבי אותו. גם אם הוא נראה שולי.
              </p>
              <p className="highlight-text">
                כי שם נמצאת המשמעות.
              </p>
            </div>
          </div>

          {/* Aliza's Story */}
          <div className="content-card story-card fade-in">
            <h2><span className="emoji-icon">🎯</span><span className="text-content">עליזה שנקין על תחושת משמעות</span></h2>
            <blockquote className="quote-box">
              <p>
                &quot;פעם הייתי בטוחה ש&apos;משמעות&apos; זה משהו שעושים עליו כתבה בעיתון.
              </p>
              <p>
                שהיא מגיעה עם שלט, תעודה או לפחות סרטון השראה עם מוזיקה דרמטית.
              </p>
              <p>
                היום אני יודעת – המשמעות הכי גדולה שלי מתרחשת כשאף אחד לא רואה.
              </p>
              <p>
                כשאני מחבקת את עצמי בבוקר ואומרת &apos;יהיה בסדר&apos;,
                כשאני מצליחה לא לצעוק על מישהו למרות שכל הסיבות קיימות,
                כשאני צוחקת עם חברה בדיוק כשהיא הכי צריכה את זה.
              </p>
              <p>
                אלה רגעים קטנים של אור.
              </p>
              <p>
                ואם יש משהו שלמדתי בגיל הזה – זה שלא צריך להאיר את העולם,
                מספיק שתהיי נר קטן שמדליק את מי שלידך.
              </p>
              <p>
                אז כן, אני כבר לא רודפת אחרי משמעות –
                אני פשוט מזכירה לעצמי כל יום שאני משמעותית כבר עכשיו.&quot; 🌷
              </p>
            </blockquote>
            <div className="image-container">
              <img src="https://i.imghippo.com/files/wOlP5730Iw.jpg" alt="לא צריך להציל את העולם – רק לזכור למה קמתי הבוקר" />
              <p className="image-caption" style={{ textAlign: 'center', marginTop: '16px', fontStyle: 'italic' }}>
                ✨ &quot;לא צריך להציל את העולם – רק לזכור למה קמתי הבוקר.&quot; ✨<br />
                - עליזה שנקין
              </p>
            </div>
          </div>

          {/* Back to Stage 5 and Roadmap Links */}
          <div className="next-steps-card fade-in">
            <h2>מה הלאה?</h2>
            <p>
              סיימת לקרוא על נושא חשוב זה בגיל המעבר.
            </p>
            <p className="highlight-text">
              את לא לבד במסע הזה!
            </p>
            
            <div className="button-group">
              <a href="/wisdom-giving" className="cta-button">
                ✨ חזרה לשלב 5 - תבונה ונתינה
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


