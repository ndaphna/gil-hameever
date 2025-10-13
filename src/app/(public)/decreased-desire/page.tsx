'use client';

import { useEffect } from 'react';

export default function DecreasedDesirePage() {
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
    <div className="decreased-desire-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="decoration-circle"></div>
        <div className="decoration-circle"></div>
        <div className="container">
          <div className="hero-content">
            <div className="stage-badge">💕 שלב 1 במפה - ירידה בחשק ובמיניות</div>
            <h1>ירידה בחשק ובמיניות</h1>
            <p className="subtitle">כשהגוף משתנה - והחשק מרגיש רחוק</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          
          {/* Introduction */}
          <div className="content-card fade-in">
            <p className="intro-text">
              <strong>&quot;זה לא שאני לא אוהבת אותך... זה פשוט שאני לא מרגישה אותי.&quot;</strong>
            </p>
            <p>
              זה אחד הנושאים הכי מושתקים… וגם הכי טעונים.
            </p>
            <p>
              נשים רבות בגיל המעבר חוות ירידה בחשק, ריחוק, או פשוט חוסר עניין במגע.<br />
              לא תמיד יש עם מי לדבר על זה. לא עם חברות, לא עם הרופא/ה, לפעמים אפילו לא עם בן הזוג.
            </p>
            <p className="highlight-text">
              אבל את לא לבד, ואת לא &quot;שבורה&quot;.<br />
              המיניות שלך לא נעלמה – היא רק מבקשת שפה חדשה.
            </p>
          </div>

          {/* Why It Happens */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🔍</span><span className="text-content">למה זה קורה? כמה סיבות:</span></h2>
            <div className="icon-list">
              <div className="icon-item">
                <span className="icon">🧬</span>
                <div>
                  <strong>הורמונלית:</strong> ירידה באסטרוגן ובטסטוסטרון משפיעה על החשק, הרטיבות וההנאה.
                </div>
              </div>
              <div className="icon-item">
                <span className="icon">💫</span>
                <div>
                  <strong>פיזית:</strong> יובש נרתיקי, כאב במגע, תחושת ניתוק מהגוף.
                </div>
              </div>
              <div className="icon-item">
                <span className="icon">💭</span>
                <div>
                  <strong>רגשית:</strong> שינוי בדימוי הגוף, עייפות, סטרס, שינויים בזוגיות.
                </div>
              </div>
              <div className="icon-item">
                <span className="icon">🌍</span>
                <div>
                  <strong>חברתית:</strong> מיתוסים כמו &quot;אישה בגיל הזה לא צריכה את זה יותר&quot; – שקרים מזיקים.
                </div>
              </div>
            </div>
          </div>

          {/* How to Reconnect */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🧭</span><span className="text-content">איך תתחילי להחזיר קשר לגוף ולחשק?</span></h2>
            
            <h3><span className="emoji-icon">👁</span><span className="text-content">קודם כל – עם עצמך:</span></h3>
            <ul className="styled-list">
              <li>לזהות את התחושות בגוף, בלי שיפוט.</li>
              <li>לשים לב – מה עוצר אותי? עייפות? כאב? מבוכה?</li>
            </ul>

            <h3><span className="emoji-icon">🗣</span><span className="text-content">אחר כך – בתקשורת:</span></h3>
            <ul className="styled-list">
              <li>לדבר עם בן/בת הזוג בכנות – לא רק על מה לא, אלא על מה כן.</li>
              <li>להסביר: זו לא דחייה. זו תקופה חדשה. ואם תדברו עליה, היא לא תהיה קיר.</li>
            </ul>
          </div>

          {/* Tools */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">💡</span><span className="text-content">כלים מחברים ומעוררי חיבור:</span></h2>
            <div className="icon-list">
              <div className="icon-item">
                <span className="icon">💧</span>
                <div>
                  <strong>לחות נרתיקית וטיפול הורמונלי מקומי</strong> - מקל משמעותית על כאב, יובש, ומחזיר תחושת נוחות.
                </div>
              </div>
              <div className="icon-item">
                <span className="icon">🧴</span>
                <div>
                  <strong>שמני עיסוי טבעיים</strong> - משנים את החוויה ממטלה - לרגע מענג, גם לבד.
                </div>
              </div>
              <div className="icon-item">
                <span className="icon">🧘</span>
                <div>
                  <strong>מיינדפולנס למיניות</strong> - תרגול נוכחות, לא ביצוע. להיות, לא &quot;להספיק&quot;.
                </div>
              </div>
            </div>
          </div>

          {/* Remember */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">❤️</span><span className="text-content">בואי נזכור:</span></h2>
            <ul className="styled-list">
              <li>החשק לא &quot;נעלם לנצח&quot;, הוא פשוט מתעורר אחרת.</li>
              <li>לא צריך לחכות שהוא יחזור, אפשר ליצור את התנאים שיזמינו אותו.</li>
              <li>ולפעמים, דווקא כשאת מתחילה לדבר על זה, את מגלה שאת לא לבד, ושהדרך חזרה לעצמך מתחילה עכשיו.</li>
            </ul>
          </div>

          {/* Aliza's Story */}
          <div className="content-card story-card fade-in">
            <h2><span className="emoji-icon">🔥</span><span className="text-content">עליזה שנקין מתפרצת</span></h2>
            <blockquote className="quote-box">
              <p>
                &quot;תקשיבי… פעם הייתי חושבת ש&apos;חשק&apos; זה כמו חשמל – או שיש או שאין.
              </p>
              <p>
                בגיל המעבר גיליתי שזה יותר כמו Wi-Fi בבית:<br />
                לפעמים יש קליטה מצוינת, לפעמים צריך לעמוד ליד הראוטר,<br />
                ולפעמים – גם אם עשית ריסטארט – זה פשוט לא מתחבר 😅.
              </p>
              <p>
                אז מה אני עושה?<br />
                קצת פחות לחץ על &apos;חייבים&apos;, קצת יותר משחק מקדים עם עצמי,<br />
                ומזכירה לעצמי שמיניות זה לא רק חדירה,<br />
                זה גם לגעת, לצחוק, להרגיש, להיות קרובה.
              </p>
              <p>
                ובסוף – אנחנו ביחד בזה.<br />
                עם החשק, בלי החשק, עם הקרמים, עם הפנטזיות,<br />
                ועם הידיעה שהלב שלנו – הוא תמיד האיבר הכי מיני בגוף.&quot; ❤️✨
              </p>
            </blockquote>
            <div className="image-container">
              <img src="https://i.imghippo.com/files/vZGF8331DaE.jpg" alt="ירידה בחשק ובמיניות" />
            </div>
          </div>

          {/* Back to Stage 1 and Roadmap Links */}
          <div className="next-steps-card fade-in">
            <h2>מה הלאה?</h2>
            <p>
              סיימת לקרוא על נושא חשוב זה בגיל המעבר.
            </p>
            <p className="highlight-text">
              את לא לבד במסע הזה!
            </p>
            
            <div className="button-group">
              <a href="/the-body-whispers#key-topics" className="cta-button">
                🧏🏻‍♀️ חזרה לשלב 1 - נושאים מרכזיים
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

