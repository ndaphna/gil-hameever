'use client';

import { useEffect } from 'react';

export default function FemaleFriendshipHealingSpacePage() {
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
            <div className="stage-badge">👭 שלב 3 במפה - שייכות ואחוות נשים</div>
            <h1>חברות נשית כמרחב ריפוי</h1>
            <p className="subtitle">כי לפעמים חיבוק מחברה מרפא יותר מכל גלולה</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          
          {/* Introduction */}
          <div className="content-card fade-in">
            <p>
              בגיל הזה, נשים רבות מגלות שחברות עמוקה היא לא מותרות, אלא צורך רגשי. נפשי. קיומי.
            </p>
            <p>
              לא עוד חברות מבוססת &quot;נפגש בגינה עם הילדים&quot;, אלא קשר שמבוסס על הבנה הדדית, הכלה, ושותפות במסע הפנימי.
            </p>
            <p>
              זו יכולה להיות אישה אחת בלבד.<br />
              או קבוצה קטנה.<br />
              מה שמשנה זה המרחב שאת יכולה להיות בו את – בלי להסביר, בלי להצדיק, בלי להתכווץ.
            </p>
          </div>

          {/* Why Female Friendship Matters */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">💭</span><span className="text-content">למה חברות נשית בגיל הזה היא כל כך משמעותית?</span></h2>
            <ul className="styled-list">
              <li><strong>כי יש פחות סבלנות לשיחות ריקות</strong> ויותר צורך בעומק ואמת.</li>
              <li><strong>כי את כבר לא רוצה &quot;לרצות&quot;</strong> – ואת צריכה חברה שמקבלת אותך בדיוק כך.</li>
              <li><strong>כי הגוף משתנה, הרגשות משתוללים</strong> – ואת זקוקה למישהי שתגיד &quot;אני מבינה אותך&quot;.</li>
              <li><strong>כי יש עייפות מהתפקוד</strong> – וגעגוע לקרבה נטולת תפקיד.</li>
            </ul>
          </div>

          {/* Friendship as Healing Space */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">💬</span><span className="text-content">חברות כמרחב ריפוי – איך זה נראה?</span></h2>
            
            <table className="activity-table">
              <thead>
                <tr>
                  <th>מרחב</th>
                  <th>מה מרפא בו</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>☕ שיחת בוקר קבועה עם חברה אחת</td>
                  <td>תחושת רציפות, חיבור, קרקע רגשית.</td>
                </tr>
                <tr>
                  <td>💌 שיתוף הדדי בווטסאפ</td>
                  <td>אפשרות לפרוק ולהיתמך, גם בלי &quot;פגישה&quot;.</td>
                </tr>
                <tr>
                  <td>🧶 קבוצה יצירתית / סדנה נשית</td>
                  <td>חיבור דרך יצירה, תנועה, הקשבה. לא רק דיבור.</td>
                </tr>
                <tr>
                  <td>👭 מראה רגשית</td>
                  <td>חברה שמזכירה לך מי את – כשאת שוכחת.</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* What to Remember */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">📌</span><span className="text-content">מה כדאי לזכור?</span></h2>
            <ul className="styled-list">
              <li>לא כל חברה היא מרחב ריפוי. וזה בסדר. יש חברות לשמחות, יש לחיבוק, ויש לעומק.</li>
              <li>מותר לבחור מחדש. את לא חייבת להמשיך להשקיע בקשרים שלא מדויקים לך עכשיו.</li>
              <li>יש ערך גם לחברות חדשה – בכל גיל. לפעמים הקשר הכי עמוק נוצר דווקא בגיל 52...</li>
            </ul>
          </div>

          {/* Practice Exercise */}
          <div className="content-card fade-in exercise">
            <h2><span className="emoji-icon">💡</span><span className="text-content">תרגול לשבוע הקרוב:</span></h2>
            <div className="exercise-box">
              <p>בחרי אישה אחת שאת מרגישה איתה חיבור אמיתי.</p>
              <p>שלחי לה הודעה קצרה, כנה, מהלב:</p>
              <p className="highlight-text" style={{ fontStyle: 'italic', marginTop: '12px' }}>
                &quot;חשבתי עלייך. רוצה לקבוע לקפה בקרוב?&quot;
              </p>
              <p style={{ marginTop: '16px' }}>
                לא חייב לקרות מיד, אבל עצם הפנייה היא צעד ריפוי.
              </p>
            </div>
          </div>

          {/* Aliza's Story */}
          <div className="content-card story-card fade-in">
            <h2><span className="emoji-icon">👭</span><span className="text-content">עליזה שנקין על חברות נשית:</span></h2>
            <blockquote className="quote-box">
              <p>
                &quot;תשמעי, אני כבר עברתי את השלב של חברות שמדברות על דיאטות או מחירי הלחם.<br />
                היום אני רוצה את אלה שאני יכולה לבוא אליהן בטרנינג, עם עיגולים מתחת לעיניים,<br />
                והן יגידו לי – &apos;את מהממת, איך את שותה את קפה?&apos; ☕
              </p>
              <p>
                חברות בגיל הזה זה לא לייקים באינסטגרם – זה לייקים לנשמה.
              </p>
              <p>
                זה מישהי שמכירה את כל הבלגן שלך,<br />
                ועדיין אומרת לך &apos;יאללה, יש בך אור.&apos;
              </p>
              <p>
                ובסוף – אנחנו ביחד בזה.<br />
                עם הקמטים, עם הצחוקים, עם ההורמונים,<br />
                ועם הידיעהשאנחנו מחבקות – לא צריך מילים,<br />
                כי הריפוי כבר קורה בעצמו.&quot; 💞
              </p>
            </blockquote>
            <div className="image-container">
              <img src="https://i.imghippo.com/files/Hr6755pdQ.jpg" alt="חברות נשית כמרחב ריפוי" />
            </div>
            <p className="highlight-text" style={{ textAlign: 'center', marginTop: '24px', fontStyle: 'italic' }}>
              &quot;אין תרופה כמו חיבוק מחברה שמבינה.&quot; 🤗<br />
              - עליזה שנקין
            </p>
          </div>

          {/* Back to Stage 3 and Roadmap Links */}
          <div className="next-steps-card fade-in">
            <h2>מה הלאה?</h2>
            <p>
              סיימת לקרוא על נושא חשוב זה בגיל המעבר.
            </p>
            <p className="highlight-text">
              את לא לבד במסע הזה!
            </p>
            
            <div className="button-group">
              <a href="/belonging-sisterhood-emotional-connection" className="cta-button">
                🤝 חזרה לשלב 3 - שייכות ואחוות נשים
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












