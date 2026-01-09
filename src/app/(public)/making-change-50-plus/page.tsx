'use client';

import { useEffect } from 'react';

export default function MakingChange50PlusPage() {
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
            <div className="stage-badge">🧭 שלב 4 במפה - ערך עצמי, משמעות</div>
            <h1>לעשות שינוי – גם בגיל 50+</h1>
            <p className="subtitle">כי את לא מאוחרת מדי. את בדיוק בזמן בשבילך.</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          
          {/* Introduction */}
          <div className="content-card fade-in">
            <p>
              השינוי לא תמיד דרמטי.
            </p>
            <p>
              לפעמים הוא רק מבט אחר על הבוקר שלך.
            </p>
            <p>
              ולפעמים – הוא כמו רעידת אדמה שקטה: משהו זז בפנים, ואת לא יכולה להתעלם מזה יותר.
            </p>
            <p>
              אבל אז קופץ הקול הזה:
            </p>
            <p className="highlight-text">
              &quot;מה עכשיו? בגילי? מי ייקח אותי? מי יאמין בי? זה מאוחר מדי…&quot;
            </p>
            <p>
              והאמת?
            </p>
            <p className="highlight-text">
              אין גיל נכון לשינוי. יש רגע נכון – וזה כשאת כבר לא מסוגלת להישאר איפה שאת.
            </p>
          </div>

          {/* Why Now */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">⏰</span><span className="text-content">למה דווקא עכשיו זה זמן טוב לשינוי?</span></h2>
            <ul className="styled-list">
              <li>כי כבר אין לך סבלנות &quot;לשחק את המשחק&quot;.</li>
              <li>כי את יודעת מי את – וגם מי את לא מוכנה להיות יותר.</li>
              <li>כי הילדים גדלו, והעולם כבר לא סובב רק סביב אחרים.</li>
              <li>כי הגוף והנפש מאותתים: &quot;עכשיו תורך.&quot;</li>
            </ul>
          </div>

          {/* But It's Scary */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">💪</span><span className="text-content">אבל... זה מפחיד. ברור.</span></h2>
            
            <table className="activity-table">
              <thead>
                <tr>
                  <th>פחד</th>
                  <th>מה עוזר להתמודד</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>😱 פחד מכישלון</td>
                  <td>לזכור: גם להיתקע במקום זה סיכון – רק בלי סיכוי לרווח.</td>
                </tr>
                <tr>
                  <td>💸 פחד כלכלי</td>
                  <td>להתחיל בקטן, לבחון אפשרויות, להתייעץ. לא חייבות לקפוץ למים בבת אחת.</td>
                </tr>
                <tr>
                  <td>😔 פחד מ&quot;מה יגידו&quot;</td>
                  <td>לזכור: את לא חיה את החיים של אחרים – רק את שלך.</td>
                </tr>
                <tr>
                  <td>🧭 פחד מאי-ודאות</td>
                  <td>ליצור עוגנים קטנים של ודאות – במקביל לתנועה קדימה.</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Inspiring Stories */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">✨</span><span className="text-content">סיפורים מחזקים:</span></h2>
            <ul className="styled-list">
              <li><strong>טלי</strong> התחילה לכתוב בלוג בגיל 54 – היום היא מרצה לנשים ברחבי הארץ.</li>
              <li><strong>רונית</strong> למדה נטורופתיה בגיל 56 – ומטפלת בעיקר בנשים בגיל המעבר.</li>
              <li><strong>מירי</strong> פתחה קבוצת הליכה בשכונה – והפכה למובילה קהילתית בלי שהתכוונה.</li>
            </ul>
            <p className="highlight-text" style={{ marginTop: '20px' }}>
              ואף אחת מהן לא &quot;ידעה איך&quot;, רק החליטה לא לחכות יותר.
            </p>
          </div>

          {/* How to Start */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🧭</span><span className="text-content">איך מתחילים?</span></h2>
            <p style={{ marginBottom: '20px' }}>
              שלושה שלבים פשוטים:
            </p>
            
            <div className="highlight-box" style={{ marginBottom: '20px' }}>
              <p><strong>חולמת:</strong> מה הייתי רוצה שיהיה?</p>
            </div>
            
            <div className="highlight-box" style={{ marginBottom: '20px' }}>
              <p><strong>מתכננת:</strong> מה הצעד הראשון שאני יכולה לעשות?</p>
            </div>
            
            <div className="highlight-box">
              <p><strong>נעה:</strong> מתי אני עושה אותו?</p>
            </div>
            
            <p className="highlight-text" style={{ marginTop: '20px' }}>
              זה לא חייב להיות מושלם. זה רק צריך להיות שלך.
            </p>
          </div>

          {/* Practice Exercise */}
          <div className="content-card exercise fade-in">
            <h2><span className="emoji-icon">🧘</span><span className="text-content">תרגול לשבוע הקרוב:</span></h2>
            <div className="exercise-box">
              <p>
                כתבי:
              </p>
              <p className="highlight-text">
                &quot;מה אני לא מוכנה יותר?&quot;
              </p>
              <p>
                ו&quot;הצעד הקטן הראשון שאני יכולה לעשות בכיוון חדש הוא…&quot;
              </p>
              <p>
                ואז – עשי אותו. קטן ככל שיהיה.
              </p>
            </div>
          </div>

          {/* Aliza's Story */}
          <div className="content-card story-card fade-in">
            <h2><span className="emoji-icon">🔍</span><span className="text-content">עליזה שנקין על שינוי בגיל 50+</span></h2>
            <blockquote className="quote-box">
              <p>
                &quot;נכון, שינוי בגיל 50 זה לא כמו בגיל 25 — זה הרבה יותר אמיץ.
              </p>
              <p>
                אז מה אם פעם פחדתי לקפוץ למים? היום אני פשוט בודקת אם הם חמימים ונכנסת לאט… אבל נכנסת!
              </p>
              <p>
                בגיל הזה, השינוי לא בא כדי להוכיח משהו לעולם — הוא בא להזכיר לך שאת עדיין בחיים.
              </p>
              <p>
                אז יאללה, תני לפחד לשבת מאחור, תני לחלום להחזיק את ההגה,
                ותזכרי — גם GPS משנה מסלול באמצע הדרך.
              </p>
              <p>
                זה לא כישלון. זו גמישות של מנוסות.&quot; 🚗💨💪
              </p>
            </blockquote>
            <div className="image-container">
              <img src="https://i.imghippo.com/files/jw9133xFQ.jpg" alt="יש לי רישיון לשינוי" />
              <p className="image-caption" style={{ textAlign: 'center', marginTop: '16px', fontStyle: 'italic' }}>
                &quot;יש לי רישיון לשינוי.&quot; 🚙<br />
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














