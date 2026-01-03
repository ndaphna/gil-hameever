'use client';

import { useEffect } from 'react';

export default function CommunityNewConnectionsPage() {
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
            <div className="stage-badge">🧡 שלב 3 במפה - שייכות ואחוות נשים</div>
            <h1>קבוצה, קהילה, חיבורים חדשים</h1>
            <p className="subtitle">לא תמיד נולדים עם שבט – לפעמים יוצרים אותו מחדש, בדיוק בזמן</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          
          {/* Introduction */}
          <div className="content-card fade-in">
            <p>
              יש נשים שמוקפות בחברות מהגן.<br />
              ויש כאלה שבגיל 50 מגלות:<br />
              אני רוצה להתחבר מחדש, אבל אין לי מושג איפה מתחילים.
            </p>
            <p>
              וזה לא כי אין נשים טובות סביבך,<br />
              זה כי את כבר לא מחפשת חברות שטחית – אלא מרחב נשי אמיתי.
            </p>
            <p>
              הדור שלנו מתאפיין בתרבות &quot;הסופר־וומן&quot; – כולנו בקשרים, אבל מעט מאוד באמת בקִרבה.<br />
              נשים רבות משתפות שהן חשות בדידות: &quot;לא חסרות לי קבוצות וואטסאפ, חסרה לי קבוצה של נשמה.&quot;
            </p>
            <p className="highlight-text">
              והחדשות הטובות?<br />
              את לא לבד בזה. מאות נשים סביבך מחפשות את אותו דבר – הן רק מחכות שמישהי תעשה את הצעד הראשון.
            </p>
          </div>

          {/* Why It's Missing and Hard */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🤔</span><span className="text-content">למה זה כל כך חסר – וקשה?</span></h2>
            <ul className="styled-list">
              <li>כי הקבוצות שהיית שייכת להן (הורי כיתה, מקום עבודה, שכונה) – כבר לא מרגישות מדויקות.</li>
              <li>כי קשה להצטרף לקבוצות חדשות כשאת כבר &quot;מבוגרת&quot;.</li>
              <li>כי נדמה שכולן כבר &quot;מסודרות&quot;, ואת תרגישי כמו ה&quot;חדשה&quot;.</li>
              <li>כי את רוצה חיבור אמיתי – אבל מפחדת להרגיש שוב לבד.</li>
            </ul>
          </div>

          {/* How to Create New Belonging Space */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🛠️</span><span className="text-content">איך יוצרים לעצמך מרחב שייכות חדש?</span></h2>
            
            <table className="activity-table">
              <thead>
                <tr>
                  <th>פעולה</th>
                  <th>למה זה עוזר</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>💬 שליחת הודעה כנה לאישה אחת שאת מרגישה אליה חיבור</td>
                  <td>לפעמים זה כל מה שצריך כדי לפתוח ערוץ.</td>
                </tr>
                <tr>
                  <td>🧶 הצטרפות לקבוצה קיימת (אפילו דיגיטלית)</td>
                  <td>מתחילות כצופות – ואז נפתחות.</td>
                </tr>
                <tr>
                  <td>👭 יצירת קבוצה בעצמך</td>
                  <td>כן, גם בלי ניסיון. אפילו שתי נשים זה כבר &quot;שבט&quot;.</td>
                </tr>
                <tr>
                  <td>🧘 השתתפות בסדנה / מעגל נשים / שיעור תנועה</td>
                  <td>תנועה משותפת יוצרת שפה אחרת של חיבור.</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Things to Remember */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">📌</span><span className="text-content">דברים שכדאי לזכור:</span></h2>
            <ul className="styled-list">
              <li>לא צריך 10 נשים – צריך אחת שמבינה אותך.</li>
              <li>החיבור העמוק לא תמיד קורה מיד – אבל כשהוא קורה, הוא משנה חיים.</li>
              <li>מותר &quot;לנסות קבוצה&quot; ולגלות שהיא לא מתאימה – זה לא כישלון.</li>
              <li>לפעמים דווקא במרחב חדש את מרשה לעצמך להיות חדשה – ולהתחיל מהתחלה.</li>
            </ul>
          </div>

          {/* Practice Exercise */}
          <div className="content-card fade-in exercise">
            <h2><span className="emoji-icon">🧘</span><span className="text-content">תרגול לשבוע הקרוב:</span></h2>
            <div className="exercise-box">
              <p>בחרי מקום אחד שמעורר בך סקרנות – זה יכול להיות שיעור תנועה, חוג כתיבה, או קבוצת פייסבוק.</p>
              <p>הצטרפי אליו. בלי ציפייה.</p>
              <p>רק תני לעצמך להיות נוכחת.</p>
              <p className="highlight-text" style={{ marginTop: '16px' }}>
                כי לעיתים השייכות נולדת קודם כל מתוך התבוננות שקטה.
              </p>
            </div>
          </div>

          {/* Aliza's Story */}
          <div className="content-card story-card fade-in">
            <h2><span className="emoji-icon">🧡</span><span className="text-content">עליזה שנקין על קהילה והאומץ לצאת מהקונכייה:</span></h2>
            <blockquote className="quote-box">
              <p>
                &quot;תקשיבי… כשניסיתי להצטרף לקבוצת נשים בפעם הראשונה, הרגשתי כמו בכיתה א&apos;, רק עם יותר קמטים ופחות סבלנות 😅
              </p>
              <p>
                עמדתי שם עם כוס תה צמחים ביד, מחייכת חיוך של &apos;אני פתוחה לחיבורים&apos;,<br />
                אבל מבפנים רק רציתי לברוח הביתה לפיג&apos;מה.
              </p>
              <p>
                ואז מישהי חייכה אליי,<br />
                חיוך אחד קטן, אמיתי,<br />
                ופתאום הרגשתי שנפתח סדק קטן בחומה.
              </p>
              <p>
                מאז הבנתי:<br />
                לא צריך שבט שלם, מספיק אישה אחת שמסתכלת עלייך בעיניים ואומרת בלי מילים, &apos;אני רואה אותך&apos;.
              </p>
              <p>
                ובסוף – אנחנו ביחד בזה.<br />
                עם המבוכה, עם הקפה הראשון, עם הקבוצות החדשות והלב הפתוח.<br />
                כי גם אם אנחנו מתחילות כזָרות,<br />
                אחרי כמה צחוקים, אנחנו כבר אחיות לשבט החדש שלנו.&quot; ☕💞
              </p>
            </blockquote>
            <div className="image-container">
              <img src="https://i.imghippo.com/files/zbUS5527lIg.jpg" alt="קבוצה, קהילה, חיבורים חדשים" />
            </div>
            <p className="highlight-text" style={{ textAlign: 'center', marginTop: '24px', fontStyle: 'italic' }}>
              &quot;לא נולדות עם שבט — לפעמים פשוט יוצאות מהקונכייה ומוצאות אותו.&quot; 🐚💞<br />
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







