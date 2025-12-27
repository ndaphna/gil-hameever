'use client';

import { useEffect } from 'react';

export default function WhatDidILeaveHerePage() {
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
            <div className="stage-badge">👣 שלב 5 במפה - תבונה ונתינה</div>
            <h1>מה השארתי כאן?</h1>
            <p className="subtitle">לא מדליה. לא פסל. נוכחות. זיכרון. מגע. השפעה שקטה.</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          
          {/* Introduction */}
          <div className="content-card fade-in">
            <p>
              יום אחד, מישהי תספר עלייך.
            </p>
            <p>
              אולי הבת שלך. אולי חברה. אולי קולגה צעירה.
            </p>
            <p>
              והיא תגיד:
            </p>
            <p className="highlight-text" style={{ fontStyle: 'italic', marginTop: '16px', marginBottom: '16px' }}>
              &quot;הייתה אישה אחת…<br />
              שלא חיפשה תשומת לב, אבל תמיד ידעה לומר את הדבר הנכון.<br />
              שלא הייתה הכי רועשת, אבל כשהיא נכנסה – החדר הרגיש אחרת.<br />
              שלא ניסתה להרשים, אבל כל מי שעמדה לידה – הרגישה שהיא יכולה יותר.&quot;
            </p>
            <p className="highlight-text">
              זאת לא אגדה. זו את.
            </p>
          </div>

          {/* What is Feminine Legacy */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">💎</span><span className="text-content">מה זו מורשת נשית?</span></h2>
            <p>
              לא תואר.
            </p>
            <p>
              לא תפקיד.
            </p>
            <p>
              לא הישגים בלינקדאין.
            </p>
            <p className="highlight-text">
              אלא האופן שבו נגעת – בחיים של מישהי אחרת.
            </p>
          </div>

          {/* Where Legacy is Built */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">💫</span><span className="text-content">איפה נבנית מורשת?</span></h2>
            
            <table className="activity-table">
              <thead>
                <tr>
                  <th>תחום</th>
                  <th>דוגמה להשפעה</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>🏡 בית</td>
                  <td>ערכים שהנחלת – גם אם לא בדיבור אלא בדוגמה אישית</td>
                </tr>
                <tr>
                  <td>💬 שיחה</td>
                  <td>משפט שאמרת והוא הדהד – הרבה אחרי שהלכת</td>
                </tr>
                <tr>
                  <td>🤝 חברות</td>
                  <td>מרחב שהיית בו מישהי שהאירה, הקשיבה, תמכה</td>
                </tr>
                <tr>
                  <td>📚 יצירה</td>
                  <td>מכתב, פוסט, סיפור, מיזם – שהעברת דרכו משהו ממך הלאה</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* How to Identify Your Impact */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🧭</span><span className="text-content">איך לזהות את ההשפעה שלך?</span></h2>
            <p style={{ marginBottom: '16px' }}>
              שאלי את עצמך:
            </p>
            <ul className="styled-list">
              <li>על מה אנשים חוזרים אליי שוב ושוב?</li>
              <li>מתי מישהי אמרה לי &quot;שינית לי משהו&quot;?</li>
              <li>מה נשאר מאחור כשאני עוזבת מקום?</li>
            </ul>
          </div>

          {/* Practice Exercise */}
          <div className="content-card exercise fade-in">
            <h2><span className="emoji-icon">🧘</span><span className="text-content">תרגול לשבוע הקרוב:</span></h2>
            <div className="exercise-box">
              <p>
                כתבי מכתב לעצמך של לפני 10 שנים.
              </p>
              <p>
                ספרי לה מה עברת, מה למדת, מה את יודעת היום.
              </p>
              <p>
                ואז כתבי:
              </p>
              <p className="highlight-text">
                &quot;אני משאירה אחריי…&quot;
              </p>
              <p>
                ותני למילים לצאת.
              </p>
            </div>
          </div>

          {/* Aliza's Story */}
          <div className="content-card story-card fade-in">
            <h2><span className="emoji-icon">👣</span><span className="text-content">עליזה שנקין על מורשת, נוכחות והשפעה</span></h2>
            <blockquote className="quote-box">
              <p>
                &quot;פעם חשבתי שמורשת זה משהו שמשאירים אחרי שמתים.
              </p>
              <p>
                היום אני מבינה – זה מה שאת משאירה אחרי כל פגישה קטנה בחיים.
              </p>
              <p>
                לא צריך פסל על שם עליזה שנקין (למרות שפסל עם מניפה היה יכול להיות לא רע 😅).
              </p>
              <p>
                צריך רק שמישהי, מתישהו, תגיד:
              </p>
              <p>
                &apos;היא גרמה לי להרגיש שאני יכולה.&apos;
              </p>
              <p>
                אני חושבת על כל הנשים שנגעו בי בלי לדעת –
                המורה ההיא שאמרה לי שאני מצחיקה,
                האחות במחלקה שחיבקה אותי כשבכיתי,
                החברה שאמרה &apos;יאללה, תכתבי כבר את הספר שלך&apos;.
              </p>
              <p>
                כולן השאירו בי משהו.
              </p>
              <p>
                וזה מה שאני רוצה להשאיר הלאה –
                לא רעש, לא שלמות,
                אלא שובל קטן של אור,
                כזה שנדבק לנשמה של מישהי אחרת וממשיך ללכת איתה גם כשהיא לא רואה.&quot; ✨
              </p>
            </blockquote>
            <div className="image-container">
              <img src="https://i.imghippo.com/files/xcu5279co.jpg" alt="לא השארתי פסל. רק אור קטן שממשיך ללכת" />
              <p className="image-caption" style={{ textAlign: 'center', marginTop: '16px', fontStyle: 'italic' }}>
                ✨ &quot;לא השארתי פסל. רק אור קטן שממשיך ללכת.&quot; ✨<br />
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

