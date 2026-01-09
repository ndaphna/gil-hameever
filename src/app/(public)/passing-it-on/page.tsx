'use client';

import { useEffect } from 'react';

export default function PassingItOnPage() {
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
            <div className="stage-badge">👩‍🏫 שלב 5 במפה - תבונה ונתינה</div>
            <h1>להעביר את זה הלאה</h1>
            <p className="subtitle">לא כדי ללמד. לא כדי להרשים. כדי לקצר למישהי אחרת את הדרך</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          
          {/* Introduction */}
          <div className="content-card fade-in">
            <p>
              יש בך ידע.
            </p>
            <p>
              לא רק ידע מקצועי – אלא תובנות מהדרך, מהכאב, מהשאלות ששאלת בלילה, מהאומץ לקום שוב בבוקר.
            </p>
            <p>
              וזה בדיוק הזמן לשאול:
            </p>
            <p className="highlight-text">
              איך אני יכולה להעביר את זה הלאה – פשוט, אמיתי, בגובה העיניים?
            </p>
            <p>
              לא כדי להפוך למנטורית, ולא כדי &quot;לעשות קריירה מזה&quot;.
            </p>
            <p>
              אלא כי יש מישהי שם בחוץ – שנמצאת איפה שאת היית.
            </p>
            <p className="highlight-text">
              ואת יכולה להיות עבורה סימן דרך.
            </p>
          </div>

          {/* Who Can You Pass It To */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">👥</span><span className="text-content">למי את יכולה להעביר את זה?</span></h2>
            <ul className="styled-list">
              <li>לבת שלך, או לאחיינית, או לשכנה הצעירה – שלא יודעת שמותר לה להיות מי שהיא.</li>
              <li>לחברה מהעבודה – שמתמודדת עכשיו עם אותם גלי חום שגרמו לך לבכות בלילה.</li>
              <li>לקבוצת נשים – בקהילה, בזום, באינסטגרם, במעגל נשים, בקפה השבועי.</li>
              <li>ולפעמים – לעצמך של פעם, דרך מכתב, טקסט, פוסט או שיחה פנימית.</li>
            </ul>
          </div>

          {/* How to Share Without Teaching */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🛠️</span><span className="text-content">איך משתפים בלי &quot;ללמד&quot;?</span></h2>
            
            <table className="activity-table">
              <thead>
                <tr>
                  <th>גישה</th>
                  <th>למה היא עובדת</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>📖 לשתף סיפור אישי</td>
                  <td>כי סיפור נוגע בלב, ולא נשמע כמו הרצאה.</td>
                </tr>
                <tr>
                  <td>💬 לשאול שאלות פתוחות</td>
                  <td>במקום לייעץ – לתת מקום לשיח.</td>
                </tr>
                <tr>
                  <td>👂 להקשיב בלי למהר להשיב</td>
                  <td>לפעמים עצם ההקשבה היא העברה של תבונה.</td>
                </tr>
                <tr>
                  <td>✍️ לכתוב פוסט, פסקה, משפט</td>
                  <td>לא כדי לקבל לייקים – אלא כדי לתת השראה שקטה.</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Simple Ideas */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">💡</span><span className="text-content">רעיונות פשוטים:</span></h2>
            <ul className="styled-list">
              <li>ליזום &quot;קפה עם מישהי צעירה&quot; ולספר מה היית רוצה שיגידו לך בגיל שלה</li>
              <li>לפתוח קבוצת ווטסאפ של נשים בגיל המעבר לשיתוף הדדי</li>
              <li>להעלות פוסט קצר עם משפט שלמדת על עצמך השבוע</li>
              <li>להציע להעביר סדנה קטנה במתנ&quot;ס, בית קפה או אונליין – אפילו רק לחברות</li>
            </ul>
          </div>

          {/* Practice Exercise */}
          <div className="content-card exercise fade-in">
            <h2><span className="emoji-icon">🧘</span><span className="text-content">תרגול שבועי:</span></h2>
            <div className="exercise-box">
              <p>
                כתבי לעצמך:
              </p>
              <ul className="styled-list" style={{ marginTop: '16px' }}>
                <li>מה אני יודעת היום – שלא ידעתי לפני 5 שנים?</li>
                <li>מה אני רוצה שאישה אחרת תדע – לפני שהיא תצטרך ללמוד את זה בדרך הקשה?</li>
                <li>איך אני יכולה לחלוק את זה – בצורה שמתאימה לי?</li>
              </ul>
            </div>
          </div>

          {/* Aliza's Story */}
          <div className="content-card story-card fade-in">
            <h2><span className="emoji-icon">👩‍🏫</span><span className="text-content">עליזה שנקין על &quot;להעביר את זה הלאה&quot;</span></h2>
            <blockquote className="quote-box">
              <p>
                &quot;פעם חשבתי שצריך להיות &apos;מומחית&apos; כדי ללמד.
              </p>
              <p>
                שצריך מצגת, תואר, קהל.
              </p>
              <p>
                היום אני יודעת — מספיק שחיית. שנפלת. שקמת.
              </p>
              <p>
                זה כבר תעודת הוראה לחיים.
              </p>
              <p>
                יש לי חברה שאומרת: &apos;מי אני בכלל שאלמד מישהי אחרת?&apos;
              </p>
              <p>
                אז אמרתי לה: &apos;אם את יכולה לחסוך לה חצי מהמדרון שירדנו ביחד — זה כבר שווה שיעור.&apos;
              </p>
              <p>
                להעביר את זה הלאה זה לא אומר לעמוד על במה.
              </p>
              <p>
                זה אומר לשבת עם מישהי על ספסל,
                לשתוק איתה,
                וללחוש — &apos;את תצאי מזה. גם אני יצאתי.&apos;
              </p>
              <p>
                וזה היופי בגיל הזה -
                שאנחנו לא מלמדות מהספר,
                אנחנו מלמדות מהלב.
              </p>
              <p>
                ומה שנלמד ככה - נשאר לתמיד.&quot; 💛
              </p>
            </blockquote>
            <div className="image-container">
              <img src="https://i.imghippo.com/files/xhA1343xkU.jpg" alt="לא מלמדת. פשוט מעבירה את זה הלאה" />
              <p className="image-caption" style={{ textAlign: 'center', marginTop: '16px', fontStyle: 'italic' }}>
                ✨ &quot;לא מלמדת. פשוט מעבירה את זה הלאה.&quot; ✨<br />
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














