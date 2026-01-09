'use client';

import { useEffect } from 'react';

export default function HonestCommunicationPage() {
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
            <div className="stage-badge">💬 שלב 3 במפה - שייכות ואחוות נשים</div>
            <h1>תקשורת כנה ולא מתנצלת</h1>
            <p className="subtitle">לדבר מהלב בלי לחשוש שיגידו &quot;מה את עושה מזה סיפור?&quot;</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          
          {/* Introduction */}
          <div className="content-card fade-in">
            <p>
              אחד הקשיים בגיל הזה הוא לומר את מה שאת באמת מרגישה<br />
              בלי להתחיל ב&quot;סליחה שאני חופרת&quot;,<br />
              בלי לסיים ב&quot;עזבי, זה לא משנה&quot;,<br />
              ובלי להרגיש שאת &quot;רגישה מדי&quot;.
            </p>
            <p>
              אבל דווקא עכשיו, כשאת מכירה את עצמך יותר טוב מאי פעם –<br />
              זה בדיוק הזמן ללמוד לדבר את האמת שלך.
            </p>
            <p className="highlight-text">
              ברכות. בתקיפות. בלי להתנצל על מי שאת.
            </p>
          </div>

          {/* Why Communication Breaks Down */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🤔</span><span className="text-content">למה התקשורת משתבשת בגיל המעבר?</span></h2>
            <ul className="styled-list">
              <li><strong>כי את רגישה יותר</strong> – והפתיל הפנימי קצר יותר.</li>
              <li><strong>כי עייפת מלהסביר</strong> – ורוצה פשוט שיבינו אותך.</li>
              <li><strong>כי לפעמים את בעצמך עוד לא יודעת להסביר</strong> מה קורה בפנים.</li>
              <li><strong>כי התרגלת להצניע, &quot;לבלוע&quot;, ולהתמודד לבד</strong> – וזה כבר לא עובד.</li>
            </ul>
          </div>

          {/* How to Speak Truth */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🛠️</span><span className="text-content">איך לדבר אמת בלי לפחד?</span></h2>
            
            <table className="activity-table">
              <thead>
                <tr>
                  <th>כלי</th>
                  <th>למה זה עובד</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>🗣️ &quot;שפת אני&quot;</td>
                  <td>במקום &quot;אתה תמיד...&quot; – לומר &quot;אני מרגישה ש...&quot;. זה מרכך, אך לא מוחק את האמת.</td>
                </tr>
                <tr>
                  <td>🕰️ תזמון נכון</td>
                  <td>לא כשהדופק על 120 – אלא רגע אחרי שהסערה נרגעה.</td>
                </tr>
                <tr>
                  <td>✍️ כתיבה לפני דיבור</td>
                  <td>כשקשה לומר – כתבי קודם. אפילו לעצמך. זה מחדד.</td>
                </tr>
                <tr>
                  <td>🧘 נשימה לפני תגובה</td>
                  <td>לנשום לפני שאת עונה – כדי לבחור תגובה, לא לפלוט תגובה.</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Phrases to Adopt */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">💡</span><span className="text-content">משפטים שאפשר לאמץ:</span></h2>
            <ul className="styled-list">
              <li>&quot;חשוב לי לשתף אותך, גם אם קשה לי למצוא את המילים.&quot;</li>
              <li>&quot;אני מרגישה שזה לא נשמע טוב, וזה מכווץ אותי.&quot;</li>
              <li>&quot;אני יודעת שזה לא נעים לשמוע, אבל אני צריכה לומר את זה בשביל עצמי.&quot;</li>
              <li>&quot;אני לא מחפשת ויכוח – אני מחפשת חיבור.&quot;</li>
            </ul>
          </div>

          {/* What You Don't Have to Do Anymore */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">👂</span><span className="text-content">מה את לא חייבת יותר:</span></h2>
            <ul className="styled-list">
              <li>להסביר את עצמך שוב ושוב.</li>
              <li>להתנצל על רגשות, דמעות, רגישות.</li>
              <li>&quot;להחליק&quot; דברים כדי לא לעשות רעש.</li>
              <li>לשתוק כדי לשמור על שלום בית, עבודה, חברה – אם את לא שלמה עם זה.</li>
            </ul>
          </div>

          {/* Practice Exercise */}
          <div className="content-card fade-in exercise">
            <h2><span className="emoji-icon">🧘</span><span className="text-content">תרגול שבועי:</span></h2>
            <div className="exercise-box">
              <p>בכל פעם שאת מרגישה &quot;לא אמרתי את מה שבאמת רציתי&quot;,</p>
              <ul className="styled-list">
                <li>עצרי. כתבי את זה לעצמך במחברת.</li>
                <li>נסי לחשוב איך היית אומרת את זה – אם היית מרגישה בטוחה.</li>
                <li>ואז נסי שוב – בפעם הבאה.</li>
              </ul>
            </div>
          </div>

          {/* Aliza's Story */}
          <div className="content-card story-card fade-in">
            <h2><span className="emoji-icon">💬</span><span className="text-content">עליזה שנקין על תקשורת כנה:</span></h2>
            <blockquote className="quote-box">
              <p>
                &quot;פעם הייתי מומחית בלהתחיל כל משפט ב&apos;סליחה על הדרמה&apos; ולסיים ב&apos;לא משנה, אני רגישה מדי&apos;.<br />
                היום? אני פשוט אומרת מה אני מרגישה –<br />
                ואם למישהו זה יותר מדי, שינמיך את הווליום הפנימי שלו 😅
              </p>
              <p>
                גיליתי שכשאני מדברת מהלב – חלק נבהלים, חלק מתרחקים,<br />
                אבל אלה שנשארים? הם אלה שמקשיבים באמת.
              </p>
              <p>
                אז אני כבר לא עוטפת את האמת שלי בצלופן מנומס.<br />
                אני אומרת בעדינות, אבל ברור.<br />
                כי אין לי יותר כוח לדבר ברמזים –<br />
                הורמונים זה לא נושא לרמזים!
              </p>
              <p>
                ובסוף – אנחנו ביחד בזה.<br />
                ללמוד לדבר בקול רך אבל יציב,<br />
                להפסיק להתנצל על מה שאנחנו מרגישות,<br />
                ולהביןשאנחנו אומרות אמת – זה לא עימות. זה ריפוי.&quot; 💗
              </p>
            </blockquote>
            <div className="image-container">
              <img src="https://i.imghippo.com/files/efy3770I.jpg" alt="תקשורת כנה ולא מתנצלת" />
            </div>
            <p className="highlight-text" style={{ textAlign: 'center', marginTop: '24px', fontStyle: 'italic' }}>
              &quot;זו לא דרמה, זו דעה.&quot; 🎤😅<br />
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














