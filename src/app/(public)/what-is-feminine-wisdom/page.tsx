'use client';

import { useEffect } from 'react';

export default function WhatIsFeminineWisdomPage() {
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
            <div className="stage-badge">🌿 שלב 5 במפה - תבונה ונתינה</div>
            <h1>מהי תבונה נשית בגיל המעבר?</h1>
            <p className="subtitle">ידע חי שנרכש דרך הלב, הגוף והדרך שלך</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          
          {/* Introduction */}
          <div className="content-card fade-in">
            <p>
              התבונה הנשית בגיל המעבר היא לא תעודת הצטיינות.
            </p>
            <p>
              היא לא מבוססת על תארים, פרסים או הצלחות.
            </p>
            <p>
              היא נוצרת כשעברת מספיק – ושרדת.
            </p>
            <p>
              כשתפקדת מתוך כאב, קמת שוב ושוב, הקשבת לעצמך – גם כשלא היה שקט.
            </p>
            <p className="highlight-text">
              תבונה נשית היא הדרך בה את נוכחת בעולם – עם פחות צורך להוכיח, ויותר יכולת לראות.
            </p>
          </div>

          {/* Why It Feels Tangible */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🤔</span><span className="text-content">למה תבונה בגיל הזה מרגישה פתאום מוחשית?</span></h2>
            <ul className="styled-list">
              <li>כי את כבר לא מחפשת להיות כמו כולן – אלא כמו עצמך.</li>
              <li>כי עברת מספיק כדי להבין: אין פתרונות קסם, אבל יש נוכחות. חמלה. דיוק.</li>
              <li>כי אחרים מתחילים לפנות אליך לייעוץ – ואת מבינה שיש בך תשובות.</li>
              <li>כי את פחות שופטת – ויותר מקשיבה.</li>
            </ul>
          </div>

          {/* Characteristics */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">💎</span><span className="text-content">מאפיינים של תבונה נשית בגיל המעבר:</span></h2>
            
            <table className="activity-table">
              <thead>
                <tr>
                  <th>תכונה</th>
                  <th>מה זה אומר בפועל</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>👂 הקשבה עמוקה</td>
                  <td>את כבר לא ממהרת לייעץ – אלא יוצרת מרחב.</td>
                </tr>
                <tr>
                  <td>🔍 הבחנה מדויקת</td>
                  <td>את מזהה מתי זה שלך ומתי זה של אחרים – ומפסיקה לסחוב.</td>
                </tr>
                <tr>
                  <td>🌱 חמלה אותנטית</td>
                  <td>את לא מרחמת – את מכירה כאב, ולכן מבינה.</td>
                </tr>
                <tr>
                  <td>🌀 גמישות מחשבתית</td>
                  <td>את פתוחה לשינויים – לא כי את מתפשרת, אלא כי את מתבגרת באומץ.</td>
                </tr>
                <tr>
                  <td>🎯 תחושת כיוון פנימי</td>
                  <td>גם בלי לדעת הכל – את יודעת מתי משהו נכון לך, בגוף.</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Quotes */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">💡</span><span className="text-content">משפטים של נשים בתבונה:</span></h2>
            <ul className="styled-list">
              <li>&quot;אני כבר לא ממהרת להסביר את עצמי.&quot;</li>
              <li>&quot;אני לא צריכה להוכיח. אני פשוט נוכחת.&quot;</li>
              <li>&quot;אני מבינה שמותר לי גם לשתוק – ודווקא אז שומעים אותי הכי חזק.&quot;</li>
              <li>&quot;אני לא יודעת הכל. אבל את מה שאני יודעת – אני יודעת מהבטן.&quot;</li>
            </ul>
          </div>

          {/* Practice Exercise */}
          <div className="content-card exercise fade-in">
            <h2><span className="emoji-icon">🧭</span><span className="text-content">תרגול לשבוע הקרוב:</span></h2>
            <div className="exercise-box">
              <p>
                בכל ערב, כתבי:
              </p>
              <ul className="styled-list" style={{ marginTop: '16px' }}>
                <li>איפה היום פעלתי מתוך התבונה שבי?</li>
                <li>באיזה רגע הרגשתי שאני נוכחת, יציבה, חומלת?</li>
                <li>מה עזר לי לזהות את זה?</li>
              </ul>
            </div>
          </div>

          {/* Aliza's Story */}
          <div className="content-card story-card fade-in">
            <h2><span className="emoji-icon">🌿</span><span className="text-content">עליזה שנקין על תבונה נשית בגיל המעבר</span></h2>
            <blockquote className="quote-box">
              <p>
                &quot;פעם חשבתי שתבונה זה לדעת הכול.
              </p>
              <p>
                שזה אומר שיש לך תשובה לכל שאלה,
                ושאת הולכת תמיד בביטחון כמו מנטורית בפרסומת לתה ירוק.
              </p>
              <p>
                היום אני יודעת שתבונה אמיתית זה לדעת מתי לא לענות.
              </p>
              <p>
                מתי להקשיב, מתי לשתוק, ומתי פשוט להניח לדברים להסתדר בלי שאני אתערב.
              </p>
              <p>
                תבונה זה כשאני רואה מישהי צעירה מתעצבנת על שטות,
                ומחייכת לעצמי בלב כי הייתי שם – וגם זה עובר.
              </p>
              <p>
                זה כשאני סולחת לעצמי על עוד יום פחות מושלם,
                כי אני כבר מבינה ששלמות זה מיתוס של גיל שלושים.
              </p>
              <p>
                ובקיצור?
              </p>
              <p>
                תבונה נשית זה כשאת מחליפה את הצורך להיות צודקת
                ברצון להיות שלֵווה.
              </p>
              <p>
                וזה, יקירתי – תואר של כבוד שאף אוניברסיטה לא מחלקת.&quot; 🌿
              </p>
            </blockquote>
            <div className="image-container">
              <img src="https://i.imghippo.com/files/tPne9540jmQ.jpg" alt="אני כבר לא צריכה להוכיח. אני פשוט נוכחת" />
              <p className="image-caption" style={{ textAlign: 'center', marginTop: '16px', fontStyle: 'italic' }}>
                ✨ &quot;אני כבר לא צריכה להוכיח. אני פשוט נוכחת.&quot; ✨<br />
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












