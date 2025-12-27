'use client';

import { useEffect } from 'react';

export default function FearsGuiltSelfDoubtPage() {
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
            <div className="stage-badge">😱 שלב 4 במפה - ערך עצמי, משמעות</div>
            <h1>פחדים, אשמה וספק עצמי</h1>
            <p className="subtitle">איך לא לתת להם לנהוג – אפילו כשאי אפשר להיפטר מהם לגמרי</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          
          {/* Introduction */}
          <div className="content-card fade-in">
            <p>
              כמעט כל אישה שמתחילה לשאול &quot;מה בא לי עכשיו?&quot;
              פוגשת מיד שלושה אורחים לא קרואים:
            </p>
            <ul className="styled-list">
              <li><strong>פחד</strong> – &quot;ומה אם אני אכשל?&quot;</li>
              <li><strong>אשמה</strong> – &quot;אבל איך אני אעשה משהו בשביל עצמי כשכולם צריכים אותי?&quot;</li>
              <li><strong>ספק עצמי</strong> – &quot;אני בכלל לא יודעת אם אני מסוגלת… אולי אני מדמיינת.&quot;</li>
            </ul>
            <p className="highlight-text" style={{ marginTop: '20px' }}>
              הם לא סימן שאת לא מוכנה.
            </p>
            <p className="highlight-text">
              הם סימן שאת בדיוק במקום שבו משהו חדש נולד.
            </p>
          </div>

          {/* Why They're So Strong */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🤔</span><span className="text-content">למה הם כל כך חזקים דווקא עכשיו?</span></h2>
            <ul className="styled-list">
              <li>כי את נוגעת לראשונה ברצון אישי – והוא עוד עדין.</li>
              <li>כי אחרי שנים של תפקוד – כל מה שקשור ב&quot;עצמי&quot; מרגיש כמעט אנוכי.</li>
              <li>כי את לא בת 20. את יודעת כמה דברים יכולים להשתבש.</li>
              <li>כי גם הגוף משתנה – וזה משפיע על הביטחון.</li>
            </ul>
          </div>

          {/* How Not to Let Them Stop You */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🛠️</span><span className="text-content">איך לא נותנים להם לעצור אותך?</span></h2>
            
            <table className="activity-table">
              <thead>
                <tr>
                  <th>פחד/ רגש</th>
                  <th>תגובה מאזנת</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>😱 פחד מכישלון</td>
                  <td>&quot;אני עושה את זה בשבילי, לא כדי להרשים.&quot;</td>
                </tr>
                <tr>
                  <td>😔 אשמה</td>
                  <td>&quot;כשטוב לי – אני טובה לאחרים.&quot;</td>
                </tr>
                <tr>
                  <td>🙄 ספק עצמי</td>
                  <td>&quot;אני לא חייבת להיות בטוחה. רק להתחיל.&quot;</td>
                </tr>
                <tr>
                  <td>😶 חוסר ודאות</td>
                  <td>&quot;אני לא צריכה לדעת הכל. רק את הצעד הבא.&quot;</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Principles for the Journey */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🧭</span><span className="text-content">עקרונות לדרך עם פחד:</span></h2>
            <ul className="styled-list">
              <li>לא לנסות לבטל אותו – רק להזיז אותו למושב האחורי.</li>
              <li>לדבר אליו – &quot;אני רואה אותך. תודה שאתה שומר עליי. אבל עכשיו אני נוהגת.&quot;</li>
              <li>להמשיך למרות הפחד – עשייה קטנה מפחיתה את הנפח שלו.</li>
              <li>להתמלא השראה – לקרוא סיפורים של נשים אחרות, להזכיר לעצמך שאת לא לבד.</li>
            </ul>
          </div>

          {/* Aliza's Quick Share */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🎭</span><span className="text-content">עליזה שנקין משתפת:</span></h2>
            <blockquote className="quote-box">
              <p>
                &quot;כשבא לי לעשות משהו חדש, ישר עולה הקול: &apos;מה יגידו?&apos;
              </p>
              <p>
                אז עניתי לו: &apos;תודה ששאלת. אני אגיד וואו – ואחר כך אגשים את זה.&apos;&quot;
              </p>
            </blockquote>
          </div>

          {/* Practice Exercise */}
          <div className="content-card exercise fade-in">
            <h2><span className="emoji-icon">🧘</span><span className="text-content">תרגול לשבוע הקרוב:</span></h2>
            <div className="exercise-box">
              <p>
                כתבי שלוש אמונות מגבילות שעלו לך השבוע (למשל: &quot;אין לי מספיק זמן&quot;, &quot;אני לא טובה בזה&quot;, &quot;מאוחר מדי בשבילי&quot;).
              </p>
              <p>
                וליד כל אחת – נסחי תשובה חדשה, אוהבת, מציאותית.
              </p>
              <p style={{ marginTop: '16px' }}>
                <strong>דוגמה:</strong>
              </p>
              <p style={{ marginTop: '8px' }}>
                ❌ &quot;אני תמיד דוחה דברים&quot;
              </p>
              <p className="highlight-text">
                ✅ &quot;הפעם אני עושה צעד קטן אחד – וזו כבר התחלה חדשה.&quot;
              </p>
            </div>
          </div>

          {/* Aliza's Full Story */}
          <div className="content-card story-card fade-in">
            <h2><span className="emoji-icon">🔍</span><span className="text-content">עליזה שנקין על פחד, אשמה וספק</span></h2>
            <blockquote className="quote-box">
              <p>
                &quot;תראי, פחד, אשמה וספק עצמי הם כמו הטריו הקבוע שמגיע איתי לכל מקום.
              </p>
              <p>
                לא משנה אם אני פותחת דף חדש במחברת או ארון בחדר – הם שם, מציצים:
              </p>
              <p>
                &apos;את בטוחה שזה רעיון טוב?&apos;
              </p>
              <p>
                &apos;מה יחשבו עלייך?&apos;
              </p>
              <p>
                &apos;שוב את ממציאה את עצמך?&apos;
              </p>
              <p>
                אז פעם ניסיתי להיפטר מהם. לא עבד.
              </p>
              <p>
                היום אני פשוט מזיזה להם קצת מקום מאחורה ברכב החיים שלי.
              </p>
              <p>
                הם עדיין מדברים, אבל אני על ההגה.
              </p>
              <p>
                ואם יש משהו שלמדתי, זה - שפחד לא נעלם. הוא פשוט מאבד כוח כשאת מתחילה לזוז.
              </p>
              <p>
                אז כן, לפעמים אני נוסעת לאט, לפעמים עוצרת בצד עם גלידה כדי לנשום,
                אבל אני ממשיכה לנסוע.
              </p>
              <p>
                כי האשמה תצעק, הספק ילחש,
                אבל אם תסתכלי טוב – מאחוריהם תמיד יש קול אחד קטן שאומר:
              </p>
              <p>
                &apos;קדימה, זה הרגע שלך.&apos;&quot; 🚗✨
              </p>
            </blockquote>
            <div className="image-container">
              <img src="https://i.imghippo.com/files/eTHX5949phQ.jpg" alt="זה הזמן שלי וכלום לא יסיט אותי מדרכי" />
              <p className="image-caption" style={{ textAlign: 'center', marginTop: '16px', fontStyle: 'italic' }}>
                &quot;זה הזמן שלי וכלום לא יסיט אותי מדרכי&quot; 🚙🌳<br />
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

