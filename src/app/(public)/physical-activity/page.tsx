'use client';
import { useEffect } from 'react';

export default function PhysicalActivityPage() {
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
    <div className="physical-activity-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="decoration-circle"></div>
        <div className="decoration-circle"></div>
        <div className="container">
          <div className="hero-content">
            <div className="stage-badge">🏃‍♀️ פעילות גופנית</div>
            <h1>פעילות גופנית בגיל המעבר</h1>
            <p className="subtitle">תנועה שמחברת אותך לגוף, לנפש ולכוח שלך</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          
          {/* Introduction */}
          <div className="content-card fade-in">
            <p className="intro-text">
              <strong>לא בשביל לרזות. בשביל לחזור להרגיש בגוף שלך</strong>
            </p>
            <p>
              אולי את זוכרת שפעם הגוף שלך הרגיש &quot;שלך&quot;: גמיש, חזק, מחובר, מגיב.<br />
              ואולי היום התחושה היא יותר כמו: &quot;אוף. למה כואב לי כאן?&quot; או &quot;מתי הפכתי למישהי שמתנשפת בעלייה?&quot;
            </p>
            <p>
              אבל זה לא הסוף. זו יכולה להיות הזדמנות להתחלה.
            </p>
            <p className="highlight-text">
              פעילות גופנית מותאמת בגיל המעבר לא נועדה לבנות לך קוביות בבטן, אלא בשביל שתזכרי איך זה להרגיש חיה בגוף שלך.
            </p>
          </div>

          {/* What Changes */}
          <div className="content-card fade-in">
            <h3><span className="emoji-icon">🌀</span><span className="text-content">מה משתנה בגוף – ולמה זה דורש התאמה?</span></h3>
            <ul className="styled-list">
              <li><strong>חילוף החומרים מואט</strong> – המשקל &quot;נתקע&quot;.</li>
              <li><strong>מסת השריר יורדת</strong> – פחות טונוס, יותר כאבים.</li>
              <li><strong>צפיפות העצם פוחתת</strong> – עולה הסיכון לשברים.</li>
              <li><strong>העייפות, גלי החום והמצב הרגשי</strong> – מקשים להתחיל לזוז.</li>
            </ul>
          </div>

          {/* What To Do */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">💪</span><span className="text-content">אז מה כן לעשות?</span></h2>
            <h4>✔️ פעילות גופנית מומלצת:</h4>
            <table className="activity-table">
              <thead>
                <tr>
                  <th>סוג פעילות</th>
                  <th>למה זה חשוב בגיל הזה</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>🏋️ אימוני כוח</td>
                  <td>שומרים על מסת שריר, מזרזים מטבוליזם, מגנים על עצמות</td>
                </tr>
                <tr>
                  <td>🚶 הליכה יומית (גם 20 דק&apos;)</td>
                  <td>תורמת לבריאות הלב, מעודדת חשיבה חיובית</td>
                </tr>
                <tr>
                  <td>🧘 יוגה / פילאטיס</td>
                  <td>מחזקת ליבה, משפרת גמישות, מחברת בין גוף לנפש</td>
                </tr>
                <tr>
                  <td>💃 ריקוד / תנועה חופשית</td>
                  <td>מעלה מצב רוח, מחברת להנאה מהגוף – בלי לשפוט</td>
                </tr>
              </tbody>
            </table>
            <p className="highlight-box">
              💡 <strong>העיקר: להתמיד ולא להכאיב.</strong> הגוף שלך רוצה תנועה, אבל הוא גם רוצה שתהיי בעדו, לא נגדו.
            </p>
          </div>

          {/* Remember */}
          <div className="content-card fade-in">
            <h3><span className="emoji-icon">💡</span><span className="text-content">זכרי:</span></h3>
            <ul className="reminder-list">
              <li>את לא צריכה להוכיח כלום. מספיק שתבחרי לנוע בדרך שלך.</li>
              <li>את לא חייבת להיראות כמו פעם. מספיק שתרגישי טוב עכשיו.</li>
              <li>ולפעמים, רק להכניס ריקוד למטבח בבוקר, זה כל הספורט שהנשמה צריכה.</li>
            </ul>
          </div>

          {/* Important Rule */}
          <div className="content-card important-card fade-in">
            <h3>כלל חשוב:</h3>
            <div className="important-box">
              <p>📅 <strong>שגרה והתמדה !</strong></p>
              <p>עדיף הליכה 3 פעמים בשבוע מאשר ריצת מרתון פעמיים בשנה.</p>
            </div>
          </div>

          {/* Downloads */}
          <div className="content-card downloads-card fade-in" style={{ display: 'none' }}>
            <h2><span className="emoji-icon">📥</span><span className="text-content">בונוסים שמחכים לך:</span></h2>
            <ul className="download-list">
              <li>📄 PDF: &quot;הצלחת המודעת&quot; – מדריך לבניית ארוחה פשוטה ומזינה</li>
              <li>📊 טבלת הרגלי תנועה שבועית – מעקב עדין בלי שיפוט</li>
              <li>🎥 וידאו קצר: דפנה והגומייה – התעמלות מצחיקה לשימוש ביתי</li>
              <li>🛍️ מוצרים ומאמרים</li>
            </ul>
          </div>

          {/* Aliza's Story */}
          <div className="content-card story-card fade-in">
            <h2><span className="emoji-icon">🏃‍♀️</span><span className="text-content">עליזה שנקין על פעילות גופנית</span></h2>
            <blockquote className="quote-box">
              <p>
                &quot;תשמעי, כל פעם שאומרים לי &apos;ספורט&apos; אני ישר נזכרת בשיעורי ספורט בבית ספר – עם מכנסי טרנינג אפורים ומורה עם שריקה. טראומה!
              </p>
              <p>
                אבל גיליתי משהו: בגיל המעבר אף אחד לא מחלק לי ציון.<br />
                אז אם אני עושה סקוואט כדי להרים את סל הקניות מהסופר – זה נספר.<br />
                ואם אני עושה ריקוד חופשי במטבח עם כף עץ ביד – זה בונוס קלוריות.
              </p>
              <p>
                האמת? הכי חשוב זה לזוז.<br />
                בדרך שלך, בקצב שלך, עם המוזיקה שלך.
              </p>
              <p>
                ובסוף – אנחנו ביחד בזה.<br />
                חלק עם נעלי ריצה חדשות, חלק עם כפכפים למכולת,<br />
                וחלק פשוט עם סשן ריקודים מול הסירים.<br />
                העיקר שהגוף ירגיש – שאני בצד שלו.&quot; ✨💃
              </p>
            </blockquote>
            <div className="image-container">
              <img src="https://i.imghippo.com/files/rkJ5351fC.jpg" alt="פעילות גופנית בגיל המעבר" />
            </div>
          </div>

          {/* Back Links */}
          <div className="next-steps-card fade-in">
            <div className="button-group">
              <a href="/the-body-whispers#physical-activity" className="cta-button">
                🧏🏻‍♀️ חזרה לשלב 1 במפת דרכים
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

