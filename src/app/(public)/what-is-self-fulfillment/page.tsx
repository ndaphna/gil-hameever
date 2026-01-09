'use client';

import { useEffect } from 'react';

export default function WhatIsSelfFulfillmentPage() {
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
            <div className="stage-badge">🔍 שלב 4 במפה - ערך עצמי, משמעות</div>
            <h1>מה זה בכלל הגשמה עצמית בגיל המעבר?</h1>
            <p className="subtitle">רמז: זו לא רשימת משימות… זו תחושת חיות</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          
          {/* Introduction */}
          <div className="content-card fade-in">
            <p>
              כשאנחנו שומעות &quot;הגשמה עצמית&quot;, עולות מיד תמונות של שינוי קריירה, פתיחת עסק או הגירה ליוון.
            </p>
            <p>
              אבל האמת? הגשמה עצמית בגיל המעבר לא נמדדת בהישגים – אלא בתחושת התעוררות פנימית.
            </p>
            <p className="highlight-text">
              זה כשאת עושה משהו – קטן או גדול – ומרגישה:<br />
              &quot;זה אני. זה החיים שלי. ואני חיה אותם עכשיו.&quot;
            </p>
          </div>

          {/* Why It Looks Different */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🤔</span><span className="text-content">למה זה נראה אחרת בגיל הזה?</span></h2>
            <ul className="styled-list">
              <li><strong>כי עשית כבר הרבה.</strong> את לא צריכה להוכיח כלום – רק להתחבר מחדש.</li>
              <li><strong>כי הגבולות בין &quot;מי אני&quot; ל&quot;מה אחרים צריכים ממני&quot;</strong> מתחילים להתמוסס.</li>
              <li><strong>כי זה שלב שבו הקול הפנימי שלך</strong> – זה שהושתק שנים – מתחיל לעלות.</li>
              <li><strong>כי הגשמה בגיל הזה נמדדת לא רק בתוצאה,</strong> אלא בדיוק, במשמעות, ובשמחה שבדרך.</li>
            </ul>
          </div>

          {/* What is Self-Fulfillment */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">✨</span><span className="text-content">מהי &quot;הגשמה עצמית&quot; מנקודת מבט חדשה?</span></h2>
            
            <table className="activity-table">
              <thead>
                <tr>
                  <th>תפיסה ישנה</th>
                  <th>תפיסה חדשה בגיל המעבר</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>&quot;מה אני שווה?&quot;</td>
                  <td>&quot;מה אני מרגישה כשאני עושה את זה?&quot;</td>
                </tr>
                <tr>
                  <td>&quot;האם אצליח?&quot;</td>
                  <td>&quot;האם זה מדויק לי עכשיו?&quot;</td>
                </tr>
                <tr>
                  <td>&quot;מה יגידו?&quot;</td>
                  <td>&quot;האם זה נותן לי אור בעיניים?&quot;</td>
                </tr>
                <tr>
                  <td>&quot;כבר מאוחר מדי עבורי...&quot;</td>
                  <td>&quot;דווקא עכשיו אני מוכנה יותר מתמיד.&quot;</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Questions to Start */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🧭</span><span className="text-content">שאלות שמתחילות את הדרך:</span></h2>
            <ul className="styled-list">
              <li>מה אני אוהבת לעשות גם אם לא ישלמו לי על זה?</li>
              <li>מתי אני מרגישה מחוברת לעצמי?</li>
              <li>מה רציתי פעם – ושכחתי שרציתי?</li>
              <li>אילו תחומים אני סקרנית לחקור – אפילו בקטן?</li>
            </ul>
          </div>

          {/* What Fulfillment Can Look Like */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">💡</span><span className="text-content">הגשמה בגיל הזה יכולה להיראות כך:</span></h2>
            <ul className="styled-list">
              <li>לקחת קורס ציור אחרי 30 שנה בלי מכחול</li>
              <li>להדריך נשים אחרות במה שאת כבר חיה ונושמת</li>
              <li>להתחיל לכתוב, לשיר, לגדל עשבים, לבנות קהילה</li>
              <li>או פשוט… להרגיש שיש לך טעם לקום בבוקר</li>
            </ul>
          </div>

          {/* Practice Exercise */}
          <div className="content-card fade-in exercise">
            <h2><span className="emoji-icon">🧘</span><span className="text-content">תרגול לשבוע הקרוב:</span></h2>
            <div className="exercise-box">
              <p>כל ערב, לפני השינה – כתבי משפט אחד שמתחיל ב:</p>
              <p className="highlight-text" style={{ fontStyle: 'italic', marginTop: '12px' }}>
                &quot;היום הרגשתי חיה כש...&quot;
              </p>
              <p style={{ marginTop: '16px' }}>
                אל תחפשי דברים גדולים. תחפשי תחושת חיות. היא תצביע על כיוון.
              </p>
            </div>
          </div>

          {/* Aliza's Story */}
          <div className="content-card story-card fade-in">
            <h2><span className="emoji-icon">🔍</span><span className="text-content">עליזה שנקין על הגשמה עצמית בגיל המעבר:</span></h2>
            <blockquote className="quote-box">
              <p>
                &quot;פעם חשבתי שהגשמה זה לנהל, להצליח, לסמן וי.<br />
                היום אני רק רוצה לסמן חיוך.
              </p>
              <p>
                אני לא חייבת לנסוע לתאילנד (אם כי לא אתנגד 😉),<br />
                ולא חייבת לפתוח עסק של &apos;עליזה שנקין בע&quot;מ&apos;.
              </p>
              <p>
                מספיק שאני קמה בבוקר עם ניצוץ קטן בעיניים,<br />
                זה כבר פרויקט חיים מבחינתי.
              </p>
              <p>
                הגשמה בשבילי זה כשאני עושה משהו שלא חייבים,<br />
                אבל הלב שלי רוצה.
              </p>
              <p>
                זה יכול להיות לכתוב, לצייר,<br />
                או פשוט לשבת עם קפה ולהרגיש שאני לא בורחת מעצמי.
              </p>
              <p>
                ובסוף – אנחנו ביחד בזה.<br />
                כל אחת עם הים שלה, עם המכחול שלה, עם הדרך שלה,<br />
                אבל עם אותה תחושת בטן:<br />
                זה הזמן שלי לחיות, לא רק לתפקד.&quot; ☀️💗
              </p>
            </blockquote>
            <div className="image-container">
              <img src="https://i.imghippo.com/files/cQIv3697Kkk.jpg" alt="מה זה בכלל הגשמה עצמית בגיל המעבר" />
            </div>
            <p className="highlight-text" style={{ textAlign: 'center', marginTop: '24px', fontStyle: 'italic' }}>
              &quot;אני לא צריכה יעד – רק רגע שאני באמת חיה בו.&quot; 🌊💗<br />
              - עליזה שנקין
            </p>
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














