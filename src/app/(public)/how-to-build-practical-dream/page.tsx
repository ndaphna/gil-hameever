'use client';

import { useEffect } from 'react';

export default function HowToBuildPracticalDreamPage() {
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
            <div className="stage-badge">🌈 שלב 4 במפה - ערך עצמי, משמעות</div>
            <h1>איך בונים חלום מעשי</h1>
            <p className="subtitle">כי רעיון טוב הוא רק התחלה – מה שמגדל אותו זה צעדים קטנים, עקשניים ואוהבים</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          
          {/* Introduction */}
          <div className="content-card fade-in">
            <p>
              אז עלה בך רעיון. משהו שמרגש אותך. מסקרן. קורץ.
            </p>
            <p>
              ופתאום הקול הפנימי הזה קופץ:
            </p>
            <p className="highlight-text">
              &quot;אין לי זמן. אין לי כסף. אני לא באמת יודעת איך. מי אני בכלל?&quot;
            </p>
            <p>
              וזה מובן.
            </p>
            <p>
              אבל חשוב להבין: כל חלום, גם הגדול ביותר, מתחיל מגרעין קטן.
            </p>
            <p className="highlight-text">
              והשלב הראשון הוא לא &quot;לעזוב הכול&quot; – אלא להעביר את החלום ממרחב הדמיון לקרקע המציאות.
            </p>
          </div>

          {/* Why It's Hard */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🤔</span><span className="text-content">למה קשה לנו להוציא רעיונות לפועל?</span></h2>
            <ul className="styled-list">
              <li>כי אנחנו מחכות &quot;להיות מוכנות לגמרי&quot; – רגע שלא יגיע אף פעם.</li>
              <li>כי התרגלנו לדחות את הרצונות שלנו לסוף הרשימה.</li>
              <li>כי נדמה לנו שצריך להתחיל מושלם – במקום להתחיל פשוט.</li>
              <li>כי אנחנו מפחדות מהצלחה לא פחות מכישלון.</li>
            </ul>
          </div>

          {/* Steps to Build */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🛠️</span><span className="text-content">שלבים פשוטים להפוך רעיון למשהו קיים:</span></h2>
            
            <table className="activity-table">
              <thead>
                <tr>
                  <th>שלב</th>
                  <th>פעולה</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>🌱 חלום</td>
                  <td>נסחי אותו במשפט ברור. בלי התנצלות.</td>
                </tr>
                <tr>
                  <td>🧭 כיוון</td>
                  <td>שאלי: את מי זה יכול לשרת? איפה זה יכול להתקיים?</td>
                </tr>
                <tr>
                  <td>📅 צעד ראשון</td>
                  <td>קבעי פעולה קטנה בלו&quot;ז – שיחה, חיפוש, רישום, כתיבה.</td>
                </tr>
                <tr>
                  <td>🤝 תמיכה</td>
                  <td>שתפי מישהי שאת סומכת עליה – היא יכולה להיות עוגן בדרך.</td>
                </tr>
                <tr>
                  <td>🔄 גמישות</td>
                  <td>הרעיונות משתנים תוך כדי תנועה – זה לא סימן לבלבול, אלא לדיוק.</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Example */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">✍️</span><span className="text-content">דוגמה: &quot;אני רוצה לכתוב ספר ילדים&quot;</span></h2>
            <ul className="styled-list">
              <li><strong>רעיון:</strong> כתיבה יצירתית לילדים.</li>
              <li><strong>חיפוש:</strong> איזה ספרים אני אוהבת? מה הקול שלי?</li>
              <li><strong>צעד ראשון:</strong> לכתוב סיפור קצר אחד ולהראות לחברה.</li>
              <li><strong>תמיכה:</strong> להצטרף לקבוצת כתיבה מקומית או דיגיטלית.</li>
              <li><strong>התמדה:</strong> שעה אחת בשבוע מוקדשת לפרויקט הזה.</li>
            </ul>
            <p className="highlight-text" style={{ marginTop: '20px' }}>
              והופ – חלום הפך לתהליך. תהליך הופך להתקדמות. התקדמות – למציאות.
            </p>
          </div>

          {/* Practice Exercise */}
          <div className="content-card exercise fade-in">
            <h2><span className="emoji-icon">💡</span><span className="text-content">תרגול שבועי:</span></h2>
            <div className="exercise-box">
              <p>
                כתבי את החלום שלך במשפט אחד ברור.
              </p>
              <p>
                אחר כך, כתבי 3 פעולות שאפשר לעשות השבוע כדי לקרב אותו.
              </p>
              <p className="highlight-text">
                לא ענקיות. לא דרמטיות. רק תנועה קדימה.
              </p>
            </div>
          </div>

          {/* Aliza's Story */}
          <div className="content-card story-card fade-in">
            <h2><span className="emoji-icon">🔍</span><span className="text-content">עליזה שנקין על חלומות</span></h2>
            <blockquote className="quote-box">
              <p>
                &quot;אני לא יודעת איך זה אצלך, אבל אצלי יש מחברת שלמה של חלומות – חלקם כבר התגשמו, חלקם מחכים לי בסבלנות, וחלקם בכלל לא זוכרים למה כתבתי אותם.
              </p>
              <p>
                הבנתי שחלום זה לא &apos;יעד&apos; – זו מערכת יחסים.
              </p>
              <p>
                אם את מתייחסת אליו יפה, נותנת לו קצת זמן, קצת תשומת לב, הוא מתחיל לפרוח.
              </p>
              <p>
                אז אל תחכי לרגע המושלם.
              </p>
              <p>
                התחילי ברגע האמיתי.
              </p>
              <p>
                בכתיבה של שורה, בשיחת טלפון, בצעד אחד קטן.
              </p>
              <p>
                כי כל חלום, צריך שתהיי לו לאמא – לא רק קהל מעודדות.
              </p>
              <p>
                ובינינו? גם אם זה ייקח זמן, גם אם תשני כיוון בדרך – לפחות תדעי שחיית חיים של &apos;ניסיתי&apos;,
                ולא של &apos;אולי פעם&apos;.&quot; 💫
              </p>
            </blockquote>
            <div className="image-container">
              <img src="https://i.imghippo.com/files/jhS3056p.jpg" alt="חולמת, מעיזה, מגשימה" />
              <p className="image-caption" style={{ textAlign: 'center', marginTop: '16px', fontStyle: 'italic' }}>
                &quot;חולמת, מעיזה, מגשימה!&quot; 🌱 🌈<br />
                - עליזה שנקין
              </p>
            </div>
          </div>

          {/* Back to Stage 4 and Roadmap Links */}
          <div className="next-steps-card fade-in">
            <h2>מה הלאה?</h2>
            <p>
              סיימת לקרוא על נושא חשוב זה בגיל המעבר.
            </p>
            <p className="highlight-text">
              את לא לבד במסע הזה!
            </p>
            
            <div className="button-group">
              <a href="/self-worth" className="cta-button">
                🌟 חזרה לשלב 4 - ערך עצמי, משמעות
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


