'use client';

import { useEffect } from 'react';

export default function GivingFromFullnessPage() {
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
            <div className="stage-badge">🎁 שלב 5 במפה - תבונה ונתינה</div>
            <h1>נתינה מתוך מלאות</h1>
            <p className="subtitle">לא כדי לרצות. לא כי &quot;צריך&quot;. אלא כי הלב שלך כבר לא סגור – והוא רוצה לזרום החוצה</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          
          {/* Introduction */}
          <div className="content-card fade-in">
            <p>
              יש הבדל גדול בין הנתינה של פעם לנתינה של עכשיו.
            </p>
            <p>
              פעם נתת כדי שיהיו מרוצים, שלא יכעסו, שיאהבו.
            </p>
            <p>
              היום את רוצה לתת כדי להיות את – בלי להצטמצם.
            </p>
            <p className="highlight-text">
              נתינה מתוך מלאות היא לא הקרבה.
            </p>
            <p className="highlight-text">
              היא לא ביטול עצמי.
            </p>
            <p className="highlight-text">
              היא בחירה חופשית לחלוק – כי את כבר לא מרגישה שחסר.
            </p>
          </div>

          {/* How to Identify Healthy Giving */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">💚</span><span className="text-content">איך מזהים נתינה בריאה?</span></h2>
            <ul className="styled-list">
              <li>את נותנת בשמחה – לא מתוך תחושת חובה.</li>
              <li>את לא מרוקנת אחרי – אלא אפילו מתמלאת.</li>
              <li>את יודעת לעצור כשאת צריכה – בלי רגשות אשם.</li>
              <li>את לא מצפה לתמורה – אבל גם לא מתביישת לבקש אם צריך.</li>
            </ul>
          </div>

          {/* Giving from People-Pleasing */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">⚠️</span><span className="text-content">נתינה מתוך ריצוי – איך היא מרגישה?</span></h2>
            
            <table className="activity-table">
              <thead>
                <tr>
                  <th>סימן</th>
                  <th>מה את חווה בפנים</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>😓 את אומרת &quot;כן&quot; אוטומטית</td>
                  <td>ואז מתחרטת או מתעצבנת בשקט</td>
                </tr>
                <tr>
                  <td>🤐 את לא מבקשת עזרה</td>
                  <td>אבל כועסת שאף אחד לא מציע</td>
                </tr>
                <tr>
                  <td>🧯 את מכבה שריפות של אחרים</td>
                  <td>ושוכחת את עצמך בדרך</td>
                </tr>
                <tr>
                  <td>😠 את נותנת – ואז מצפה להכרה</td>
                  <td>ולא מבינה למה את מתאכזבת שוב</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* How to Create Full Giving */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🧭</span><span className="text-content">איך מייצרים נתינה מלאה מתוך שפע פנימי?</span></h2>
            
            <table className="activity-table">
              <thead>
                <tr>
                  <th>עיקרון</th>
                  <th>איך ליישם אותו</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>💬 הקשבה פנימית</td>
                  <td>לשאול את עצמך: &quot;יש לי לתת כרגע?&quot; לא רק &quot;צריך אותי?&quot;</td>
                </tr>
                <tr>
                  <td>✋ גבולות ברורים</td>
                  <td>לא כל בקשה מחייבת מענה. מותר לך לומר &quot;לא&quot;.</td>
                </tr>
                <tr>
                  <td>🧘 רגעים של תדלוק עצמי</td>
                  <td>תנועה, יצירה, שתיקה – לפני שאת מתפזרת לאחרים.</td>
                </tr>
                <tr>
                  <td>💞 תיעדוף של נתינה שמרגשת אותך</td>
                  <td>בחרי לתת במקומות שבהם את מרגישה נוכחת ושמחה.</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Practice Sentences */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">💡</span><span className="text-content">משפטים לתרגול פנימי:</span></h2>
            <ul className="styled-list">
              <li>&quot;אני נותנת באהבה – רק כשיש לי אהבה לתת.&quot;</li>
              <li>&quot;אני לא חייבת להציל – אני יכולה פשוט להיות שם.&quot;</li>
              <li>&quot;אני קודם כל אישה לעצמי – ורק אחר כך לאמא, לבת, לחברה, לאשת מקצוע.&quot;</li>
            </ul>
          </div>

          {/* Practice Exercise */}
          <div className="content-card exercise fade-in">
            <h2><span className="emoji-icon">🧘</span><span className="text-content">תרגול שבועי:</span></h2>
            <div className="exercise-box">
              <p>
                כתבי כל ערב:
              </p>
              <ul className="styled-list" style={{ marginTop: '16px' }}>
                <li>למי נתתי היום?</li>
                <li>איך הרגשתי לפני, תוך כדי, ואחרי?</li>
                <li>מה זה מלמד אותי על האיזון שלי?</li>
              </ul>
            </div>
          </div>

          {/* Aliza's Story */}
          <div className="content-card story-card fade-in">
            <h2><span className="emoji-icon">🎁</span><span className="text-content">עליזה שנקין על נתינה מתוך מלאות</span></h2>
            <blockquote className="quote-box">
              <p>
                &quot;פעם הייתי נותנת לכולם - לעבודה, לילדים, לבן הזוג, לשכנה, לכלב…
              </p>
              <p>
                אפילו לעציץ הייתי שמה תזכורת להשקות לפני שהייתי נזכרת בעצמי.
              </p>
              <p>
                יום אחד הבנתי שאני כמו כוס עם סדק - ממשיכה למזוג, אבל כבר מזמן ריקה מבפנים.
              </p>
              <p>
                אז עשיתי ניסוי:
              </p>
              <p>
                הפסקתי לתת יומיים.
              </p>
              <p>
                בהתחלה זה הרגיש כמו בגידה… ואז - כמו נשימה.
              </p>
              <p>
                פתאום שמתי לב כמה אנרגיה חוזרת כשאני בוחרת מתי ולמי לתת, ולא מתוך &apos;לא נעים&apos;.
              </p>
              <p>
                היום אני נותנת רק כשיש לי באמת,
                ואם אין, אני ממלאה קודם.
              </p>
              <p>
                כי נתינה אמיתית לא נמדדת בכמה את עושה,
                אלא בכמה את נוכחת כשאת עושה.
              </p>
              <p>
                ובינינו?
              </p>
              <p>
                אין מתנה גדולה יותר מזה -
                לתת מתוך לב מלא, לא מתוך חור בכיס הנשמתי שלך.&quot; 💞
              </p>
            </blockquote>
            <div className="image-container">
              <img src="https://i.imghippo.com/files/IXgZ1236Nqs.jpg" alt="קודם ממלאה את הכוס שלי — ואז מוזגת לאחרים" />
              <p className="image-caption" style={{ textAlign: 'center', marginTop: '16px', fontStyle: 'italic' }}>
                &quot;קודם ממלאה את הכוס שלי — ואז מוזגת לאחרים.&quot; 💞<br />
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

