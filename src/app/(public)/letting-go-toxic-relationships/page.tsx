'use client';

import { useEffect } from 'react';

export default function LettingGoToxicRelationshipsPage() {
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
            <div className="stage-badge">🙅‍♀️ שלב 3 במפה - שייכות ואחוות נשים</div>
            <h1>להרפות מקשרים רעילים</h1>
            <p className="subtitle">לפעמים האומץ הגדול הוא לא להישאר – אלא לדעת מתי להתרחק</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          
          {/* Introduction */}
          <div className="content-card fade-in">
            <p>
              יש קשרים ש&quot;נגמרים בשקט&quot;.<br />
              לא כי קרה משהו דרמטי, אלא כי את משתנה, והם נשארים באותו מקום.
            </p>
            <p>
              ויש קשרים שפשוט מכבידים עלייך: את יוצאת מהם מרוקנת, מתוסכלת, עצבנית או מבולבלת.
            </p>
            <p>
              בגיל הזה, כשהרגישות עולה, והסבלנות יורדת,<br />
              הריחוק מקשר שלא מזין אותך כבר מרגיש פיזי. בגוף. בנפש.
            </p>
            <p className="highlight-text">
              וזה בדיוק הזמן להתבונן, להקשיב, ולהרפות באהבה.
            </p>
          </div>

          {/* What is Toxic Relationship */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🤔</span><span className="text-content">מהו קשר רעיל?</span></h2>
            <ul className="styled-list">
              <li>קשר שבו את מרגישה צורך מתמיד להתנצל, להסביר, או להתכווץ.</li>
              <li>קשר שמנמיך אותך – בציניות, בביקורת, ב&quot;סתם בדיחה&quot; שחודרת עמוק.</li>
              <li>קשר חד-צדדי – את תמיד נותנת, מבינה, מקשיבה… והוא? רק לוקח.</li>
              <li>קשר שמחזק רגשות של אשמה, בושה, חוסר ערך.</li>
            </ul>
          </div>

          {/* Signs You're Staying Out of Habit */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">📌</span><span className="text-content">סימנים שאת &quot;נשארת בגלל ההרגל&quot;, ולא כי זה טוב לך:</span></h2>
            <ul className="styled-list">
              <li>את חוזרת לשיחות מתוך &quot;לא נעים&quot; – לא מתוך רצון.</li>
              <li>את אומרת לעצמך &quot;זה זמני&quot; כבר שלוש שנים.</li>
              <li>את מדחיקה דברים רק כדי &quot;לא להיכנס לזה שוב&quot;.</li>
              <li>את שותקת – יותר ויותר – כי את מרגישה שלא באמת שומעים אותך.</li>
            </ul>
          </div>

          {/* How to Let Go */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🧭</span><span className="text-content">איך נפרדים באהבה – גם בלי לעשות דרמה?</span></h2>
            
            <table className="activity-table">
              <thead>
                <tr>
                  <th>צעד</th>
                  <th>למה זה חשוב</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>✍️ כתיבה לעצמך</td>
                  <td>מה אני מרגישה בקשר הזה? מה אני מאחלת לעצמי?</td>
                </tr>
                <tr>
                  <td>🧭 שיחה ישירה (אם יש מקום)</td>
                  <td>לא לצורך &quot;האשמה&quot;, אלא כדי לשחרר את האמת שלך.</td>
                </tr>
                <tr>
                  <td>💬 התרחקות הדרגתית</td>
                  <td>לפעמים המרחק נוצר באופן טבעי – וצריך פשוט לא להחזיק חזק מדי.</td>
                </tr>
                <tr>
                  <td>💞 בקשת תמיכה</td>
                  <td>לשתף חברה אחרת / מטפלת – כי גם פרידה רגשית זקוקה לתמיכה.</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Remember Section */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">💡</span><span className="text-content">זכרי:</span></h2>
            <ul className="styled-list">
              <li><strong>זה לא אגואיזם – זו היגיינה נפשית.</strong></li>
              <li><strong>מותר לך לבחור במערכות יחסים שמזינות אותך</strong> – ולא מרוקנות אותך.</li>
              <li><strong>הרפיה היא לא ניתוק</strong> – היא שחרור של משהו שכבר לא מדויק עבורך.</li>
              <li><strong>ולפעמים, כשמשהו יוצא – נפתח מקום למשהו חדש,</strong> טוב ומדויק הרבה יותר.</li>
            </ul>
          </div>

          {/* Practice Exercise */}
          <div className="content-card fade-in exercise">
            <h2><span className="emoji-icon">🧘</span><span className="text-content">תרגול שבועי:</span></h2>
            <div className="exercise-box">
              <p>כתבי לעצמך:</p>
              <ul className="styled-list">
                <li>מי האנשים שאני מרגישה איתם נינוחה?</li>
                <li>ליד מי אני מתכווצת, נזהרת, או יוצאת מותשת?</li>
                <li>ואז שאלי: מה אני בוחרת לעשות עם זה?</li>
              </ul>
            </div>
          </div>

          {/* Aliza's Story */}
          <div className="content-card story-card fade-in">
            <h2><span className="emoji-icon">🙅‍♀️</span><span className="text-content">עליזה שנקין על להרפות מקשרים רעילים:</span></h2>
            <blockquote className="quote-box">
              <p>
                &quot;תראי… אני לא בן אדם של דרמות, אבל גם אני עברתי כמה &apos;חברות רעילות&apos; – כאלה שמורידות לך את הביטחון יותר נמוך מהמינוס שלי.
              </p>
              <p>
                פעם הייתי שומרת על קשרים רק כי &apos;לא נעים&apos;.<br />
                היום? אם כל שיחה איתך גורמת לי להזיע יותר מגל חום – זה סימן שהחברות שלנו צריכה הפסקת חשמל 😅
              </p>
              <p>
                זה לא שאני לא אוהבת – פשוט למדתי לא לאהוב על חשבון עצמי.
              </p>
              <p>
                להרפות זה לא ניתוק, זו מתנה.<br />
                כי כשמנקים רעלים מהלב – פתאום נכנסים אנשים שמרגישים כמו אוויר טוב.
              </p>
              <p>
                ובסוף – אנחנו ביחד בזה.<br />
                לשחרר, לסלוח, לפתוח מקום חדש –<br />
                ולהשאיר בחיים שלנו רק את מי שמדליק אותנו, לא את מי ששורף אותנו.&quot; 🔥💞
              </p>
            </blockquote>
            <div className="image-container">
              <img src="https://i.imghippo.com/files/zMvc9494o.jpg" alt="להרפות מקשרים רעילים" />
            </div>
            <p className="highlight-text" style={{ textAlign: 'center', marginTop: '24px', fontStyle: 'italic' }}>
              &quot;לא כל מה שעזב הוא אובדן. לפעמים זה שחרור.&quot; 🎈<br />
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














