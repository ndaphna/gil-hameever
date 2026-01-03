'use client';

import { useEffect } from 'react';

export default function HowToDiscoverWhatIWantPage() {
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
            <div className="stage-badge">💡 שלב 4 במפה - ערך עצמי, משמעות</div>
            <h1>איך מגלים מה בא לי עכשיו?</h1>
            <p className="subtitle">כשאין לך מושג מה בא לך – זה לא כי אין תשובה. זה כי היא קבורה מתחת ל&quot;הייתי חייבת&quot;</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          
          {/* Introduction */}
          <div className="content-card fade-in">
            <p>
              אחת השאלות הכי נפוצות בגיל הזה היא:
            </p>
            <p className="highlight-text">
              &quot;אבל איך אני יודעת מה אני רוצה?&quot;
            </p>
            <p>
              וזה לא שאת לא חכמה, לא מתבוננת, לא מחפשת.
            </p>
            <p>
              להפך – חיפשת כל החיים, רק לא לעצמך.
            </p>
            <p>
              חיפשת לבשל מה שהם אוהבים, לקנות מה שחסר, לעשות את מה שצריך…
            </p>
            <p>
              ועכשיו, כשסוף סוף יש מקום לשאלה – היא מרגישה ריקה.
            </p>
            <p className="highlight-text">
              אז איך ממלאים אותה מחדש – אבל מבפנים?
            </p>
          </div>

          {/* Why It's Hard */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🤔</span><span className="text-content">למה כל כך קשה לדעת מה &quot;בא לי&quot;?</span></h2>
            <ul className="styled-list">
              <li>כי לא שאלנו את עצמנו את זה באמת במשך שנים.</li>
              <li>כי כל &quot;בא לי&quot; קיבל מיד תגובת נגד: &quot;אבל זה לא פרקטי / רווחי / מתאים למשפחה&quot;.</li>
              <li>כי התרגלנו לשים את הרצון של אחרים לפני שלנו.</li>
              <li>כי לפעמים שכחנו שמותר לרצות – גם סתם בשביל ההנאה.</li>
            </ul>
          </div>

          {/* How to Connect */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🧭</span><span className="text-content">איך מתחילים להתחבר לרצון שלך?</span></h2>
            
            <table className="activity-table">
              <thead>
                <tr>
                  <th>שיטה</th>
                  <th>איך זה עובד</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>✍️ כתיבה אינטואיטיבית</td>
                  <td>5 דקות כל בוקר – &quot;מה הייתי עושה היום אם הכל היה פתוח?&quot; בלי תיקון, בלי שיפוט.</td>
                </tr>
                <tr>
                  <td>🧘 מיקוד בגוף</td>
                  <td>לחשוב על רעיון – ולהרגיש: האם הגוף נפתח או מתכווץ?</td>
                </tr>
                <tr>
                  <td>🎧 טיול השראה</td>
                  <td>ללכת ולתת למחשבות לזרום. לשים לב למה תופס את תשומת הלב.</td>
                </tr>
                <tr>
                  <td>💬 שיחת שיקוף</td>
                  <td>עם חברה טובה: שתשאל אותך שאלות ותאפשר לך לשמוע את עצמך מדברת.</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Questions That Open Doors */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🧩</span><span className="text-content">שאלות שיכולות לפתוח דלת:</span></h2>
            <ul className="styled-list">
              <li>מתי אני מרגישה שאני בזרימה?</li>
              <li>אילו נושאים אני יכולה לדבר עליהם שעות בלי להשתעמם?</li>
              <li>מה הייתי עושה אם לא הייתי צריכה לדאוג לפרנסה?</li>
              <li>מה אני אוהבת לעשות – גם אם אני &quot;לא הכי טובה בזה&quot;?</li>
            </ul>
          </div>

          {/* Remember */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">💡</span><span className="text-content">זכרי:</span></h2>
            <ul className="styled-list">
              <li>התשובה לא תמיד באה ברעם וברק – לפעמים היא לחישה.</li>
              <li>מותר להתחיל ממה שמסקרן – לא חייבות לקרוא לזה &quot;ייעוד&quot;.</li>
              <li>רצון קטן = סימן חיים גדול.</li>
            </ul>
          </div>

          {/* Practice Exercise */}
          <div className="content-card exercise fade-in">
            <h2><span className="emoji-icon">🧘</span><span className="text-content">תרגול לשבוע הקרוב:</span></h2>
            <div className="exercise-box">
              <p>
                בכל יום, עני לעצמך על השאלה:
              </p>
              <p className="highlight-text">
                &quot;מה מסקרן אותי היום?&quot;
              </p>
              <p>
                זה לא חייב להיות דבר גדול.
              </p>
              <p>
                אפילו &quot;בא לי לראות סרט דוקו על גנים יפניים&quot; – זו התחלה.
              </p>
              <p className="highlight-text">
                כל סקרנות היא סימן שמשהו בפנים מתעורר.
              </p>
            </div>
          </div>

          {/* Aliza's Story */}
          <div className="content-card story-card fade-in">
            <h2><span className="emoji-icon">💡</span><span className="text-content">עליזה שנקין על לגלות מה בא לי עכשיו:</span></h2>
            <blockquote className="quote-box">
              <p>
                &quot;פעם ידעתי בדיוק מה אני רוצה:
              </p>
              <p>
                שקט, שלוש דקות לבד, ושיחזירו את הגוף של גיל 35.
              </p>
              <p>
                היום אני קצת יותר צנועה… אני רק רוצה להרגיש חיה.
              </p>
              <p>
                וזה קטע, כי שנים ידעתי מה כולם צריכים ממני,
                אבל כששאלתי את עצמי &apos;מה אני רוצה?&apos;,
                היתה דממה. כמו מענה קולי בלי הודעה מוקלטת.
              </p>
              <p>
                אז התחלתי בקטן.
              </p>
              <p>
                שאלתי את עצמי כל יום: מה מסקרן אותי? מה עושה לי חיוך?
              </p>
              <p>
                לפעמים זו הייתה מניפה חדשה,
                לפעמים להקשיב לשיר ישן,
                ולפעמים פשוט הלכתי על בא לי… גם אם לא היה בזה שום היגיון.
              </p>
              <p>
                גיליתי שהסוד הוא -
                לא למצוא תשובה אחת גדולה,
                אלא לאפשר לרצונות הקטנים להחזיר לי את הקול שלי.
              </p>
              <p>
                ובסוף – אנחנו ביחד בזה.
                מחפשות, מנסות, צוחקות,
                ולומדות להקשיב ללחישות הקטנות של הלב –
                כי הן הרבה יותר חכמות מכל התכניות הגדולות.&quot; 💗✨
              </p>
            </blockquote>
            <div className="image-container">
              <img src="https://i.imghippo.com/files/WijL2944vA.jpg" alt="מחפשת את מה שבא לי — ומוצאת את עצמי בדרך" />
              <p className="image-caption" style={{ textAlign: 'center', marginTop: '16px', fontStyle: 'italic' }}>
                &quot;מחפשת את מה שבא לי — ומוצאת את עצמי בדרך.&quot; 💗🔍🎶<br />
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







