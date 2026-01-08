'use client';

import { useEffect } from 'react';

export default function WhatIsBelongingPage() {
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
            <div className="stage-badge">🤝 שלב 3 במפה - שייכות ואחוות נשים</div>
            <h1>מה זאת בכלל שייכות בגיל הזה?</h1>
            <p className="subtitle">כשאת לא צריכה שיאשרו אותך, רק שיראו אותך</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          
          {/* Introduction */}
          <div className="content-card fade-in">
            <p>
              שייכות זו לא רק להיות חלק ממשהו, זו תחושה עמוקה של &quot;אני יכולה להיות מי שאני – ועדיין להתקבל באהבה.&quot;
            </p>
            <p>
              בגיל 20 שייכות הייתה סביב מקובלות.<br />
              בגיל 30 סביב ילדים, גן, חוגים, עבודה.<br />
              ובגיל 40+? היא הופכת אישית יותר, מדויקת יותר, רגישה יותר.
            </p>
            <p>
              נשים רבות בגיל המעבר מדווחות שהן מוקפות אנשים – ועדיין מרגישות לבד.
            </p>
            <p className="highlight-text">
              וזה לא כי אין להן חברות, אלא כי הן כבר לא רוצות להתחפש כדי להיות שייכות.
            </p>
          </div>

          {/* Why Belonging Shifts */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🤔</span><span className="text-content">למה השייכות מתערערת בגיל הזה?</span></h2>
            <ul className="styled-list">
              <li><strong>כי הזהות משתנה</strong> – פחות מוגדרת דרך הילדים, העבודה, או זוגיות.</li>
              <li><strong>כי התשוקה להיות אמיתית גוברת</strong> – גם אם זה מרחיק אנשים שלא רגילים לזה.</li>
              <li><strong>כי את שואלת:</strong> מי באמת רואה אותי עכשיו, כמו שאני – בלי פילטרים?</li>
              <li><strong>כי קבוצות שהיית חלק מהן כבר לא מרגישות &quot;שלך&quot;</strong> – אבל אין לך עדיין קבוצה חדשה.</li>
            </ul>
          </div>

          {/* What Helps */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🧭</span><span className="text-content">מה עוזר לבנות תחושת שייכות עמוקה?</span></h2>
            
            <table className="activity-table">
              <thead>
                <tr>
                  <th>פעולה</th>
                  <th>למה זה עוזר</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>💬 שיתוף כן בקבוצה קטנה</td>
                  <td>כשאת משתפת באמת, את פותחת דלת לחיבור אמיתי.</td>
                </tr>
                <tr>
                  <td>📖 כתיבת סיפור אישי (גם לעצמך)</td>
                  <td>מעגן את התחושה ש&quot;אני קיימת&quot;, גם כשאין מי שיאמר לך את זה.</td>
                </tr>
                <tr>
                  <td>🤝 יצירת ריטואלים קבועים עם נשים קרובות</td>
                  <td>קפה שבועי, קבוצת ווטסאפ פתוחה – עוגנים לחיבור.</td>
                </tr>
                <tr>
                  <td>🧲 חיפוש מרחבים חדשים</td>
                  <td>חוגים, סדנאות, קורסים, קבוצות שיח – לפגוש נשים במצב דומה.</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* The Real Belonging */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">💬</span><span className="text-content">השייכות שאת מחפשת – היא לא חיצונית בלבד</span></h2>
            <p>
              לפני הכל, שייכות מתחילה בינך לבין עצמך.
            </p>
            <p>
              כשאת מקבלת את מה שעובר עלייך, את הופכת ל&quot;מקום בטוח&quot; עבור עצמך.
            </p>
            <p className="highlight-text">
              ומשם – קל יותר לזהות מי מרגישה גם היא כך, וליצור חיבור ללא מאמץ.
            </p>
          </div>

          {/* Practice Exercise */}
          <div className="content-card fade-in exercise">
            <h2><span className="emoji-icon">🧘</span><span className="text-content">תרגול לשבוע הקרוב:</span></h2>
            <div className="exercise-box">
              <p>כתבי לעצמך כל ערב:</p>
              <ul className="styled-list">
                <li>איפה הרגשתי שייכת היום?</li>
                <li>איפה הרגשתי זרה?</li>
                <li>מה אני לומדת מכל זה על מי אני עכשיו?</li>
              </ul>
            </div>
          </div>

          {/* Aliza's Story */}
          <div className="content-card story-card fade-in">
            <h2><span className="emoji-icon">🤝</span><span className="text-content">עליזה שנקין על שייכות בגיל הזה:</span></h2>
            <blockquote className="quote-box">
              <p>
                &quot;פעם הרגשתי שייכת כשקיבלתי הזמנה לקבוצת וואטסאפ של ההורים.<br />
                היום אני בעיקר מודה כשלא מוסיפים אותי 😅
              </p>
              <p>
                שייכות בגיל הזה זה כבר לא &apos;להיות חלק&apos;.<br />
                זה להרגיש בבית — גם אם את לבד על הספה עם שוקולד וסדרה טורקית.
              </p>
              <p>
                פעם רציתי שיאשרו אותי.<br />
                היום אני רק רוצה שמישהי תראה אותי, תצחק איתי,<br />
                ותגיד &apos;גם אני שם, בדיוק עכשיו&apos;.
              </p>
              <p>
                ובסוף – אנחנו ביחד בזה.<br />
                עם הפחדים, עם החברות הישנות והחדשות,<br />
                ועם הידיעה שבשבט הזה – את לא צריכה להוכיח כלום כדי להיות שייכת.&quot; 💞
              </p>
            </blockquote>
            <div className="image-container">
              <img src="https://i.imghippo.com/files/ItvB8487NLs.jpg" alt="שייכות בגיל הזה" />
            </div>
            <p className="highlight-text" style={{ textAlign: 'center', marginTop: '24px', fontStyle: 'italic' }}>
              &quot;שייכות זה לא להסכים על הכול — זה לדעת שאת לא לבד.&quot;<br />
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












