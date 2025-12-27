'use client';

import { useEffect } from 'react';

export default function SettingBoundariesPage() {
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
            <div className="stage-badge">🌳 שלב 2 במפה - וודאות, שקט, ביטחון</div>
            <h1>🧍‍♀️ להציב גבולות – בלי רגשות אשם</h1>
            <p className="subtitle">&quot;אני לא יכולה עכשיו&quot; – למה כל כך קשה לנו לומר את זה?</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          
          {/* Introduction */}
          <div className="content-card fade-in">
            <p>
              כמה פעמים אמרת &quot;כן&quot; כשכל הגוף שלך רצה לצעוק &quot;לא&quot;?<br />
              כמה פעמים נשארת ערה עד מאוחר בשביל לסיים משהו שלא היה באמת דחוף?<br />
              כמה פעמים ביטלת את עצמך – כדי שמישהו אחר לא ייפגע?
            </p>
            <p>
              גיל המעבר לא מביא רק תסמינים פיזיים – הוא גם מביא איתו צורך עמוק להציב גבולות.<br />
              לא כי את אגואיסטית – אלא כי המערכת שלך כבר לא יכולה לספוג הכל.
            </p>
          </div>

          {/* Why It's Hard */}
          <div className="content-card fade-in">
            <h2>למה זה קשה לנו במיוחד עכשיו?</h2>
            <ul className="styled-list">
              <li>כי חונכנו להיות &quot;נחמדות&quot;, &quot;עוזרות&quot;, &quot;לא עושות בעיות&quot;.</li>
              <li>כי הגוף מאותת &quot;מספיק!&quot; – אבל ההרגלים עדיין פועלים אוטומטית.</li>
              <li>כי רגשות האשם מתעוררים בדיוק ברגע שהכי צריך לדאוג לעצמנו.</li>
              <li>כי לפעמים אנחנו לא יודעות מה הגבול עד שכבר עברו אותו.</li>
            </ul>
          </div>

          {/* What is a Healthy Boundary */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🛡️</span><span className="text-content">מה זה גבול בריא?</span></h2>
            <ul className="styled-list">
              <li>גבול הוא לא חומה – הוא שער עם מפתח שאת מחזיקה.</li>
              <li>גבול לא נועד להרחיק – אלא להגדיר מה נכון לך.</li>
              <li>גבול בריא נבנה בהדרגה, באהבה, ובנחישות שקטה.</li>
            </ul>
          </div>

          {/* Tools */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🧭</span><span className="text-content">כלים להצבת גבולות בלי רגשות אשם:</span></h2>
            
            <h3>🗣️ משפטים שתוכלי להשתמש בהם</h3>
            <table className="activity-table" style={{marginTop: '20px'}}>
              <thead>
                <tr>
                  <th>משפט</th>
                  <th>למה הוא עובד</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>&quot;אני צריכה לחשוב על זה. אחזור אלייך בהמשך.&quot;</td>
                  <td>נותן מרחב נשימה לפני תגובה אוטומטית.</td>
                </tr>
                <tr>
                  <td>&quot;זה לא מתאים לי כרגע, אבל תודה שחשבת עליי.&quot;</td>
                  <td>תקשורת אסרטיבית – עם כבוד לשני הצדדים.</td>
                </tr>
                <tr>
                  <td>&quot;זה מעבר למה שאני יכולה כרגע.&quot;</td>
                  <td>הכרה בכוחות שלך, בלי התנצלות.</td>
                </tr>
                <tr>
                  <td>&quot;אני מרגישה שאני צריכה רגע לעצמי. אעדכן כשאוכל.&quot;</td>
                  <td>תקשורת כנה שמכילה גם צורך בפרטיות.</td>
                </tr>
              </tbody>
            </table>

            <div className="highlight-box" style={{marginTop: '30px'}}>
              <p><strong>💡 תרגול יומי קטן:</strong></p>
              <p>כל יום, תבחרי תגובה אחת אוטומטית שאת רוצה להחליף בתגובה מודעת.</p>
              <p>לדוגמה: במקום לומר &quot;אין בעיה&quot;, נסי לשאול &quot;מה זה דורש ממני?&quot;.</p>
              <p className="highlight-text">הגבול מתחיל בשאלה. לא בתשובה.</p>
            </div>
          </div>

          {/* Emotional Tools */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🧘</span><span className="text-content">כלים רגשיים לתמיכה בגבולות:</span></h2>
            <ul className="styled-list">
              <li><strong>מנטרה אישית:</strong> &quot;מותר לי לדאוג לעצמי.&quot;</li>
              <li><strong>נשימת &apos;מרחב&apos;:</strong> שאיפה – איפה אני? נשיפה – מה אני מרגישה? (3 פעמים. ואז תגובה.)</li>
              <li><strong>כתיבת גבולות:</strong> רשימת מצבים שבהם את חשה מוצפת → וכתיבה של תגובה אפשרית.</li>
            </ul>
          </div>

          {/* What Happens Without Boundaries */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">💬</span><span className="text-content">מה קורה כשלא מציבים גבולות?</span></h2>
            <ul className="styled-list">
              <li>תחושת כעס סמוי, עייפות קבועה, אי שקט כללי</li>
              <li>פיצוצים קטנים בבית, עצבים מול הילדים, שתיקה מתמשכת מול בן הזוג</li>
              <li>ומעל הכל – תחושת אובדן של עצמך</li>
            </ul>
          </div>

          {/* Remember */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">💡</span><span className="text-content">זכרי:</span></h2>
            <ul className="styled-list">
              <li>גבול זה לא סוף קשר – זה התחלה של קשר בריא יותר, גם עם עצמך.</li>
              <li>אם לא תקשיבי לגוף שלך – הוא יתחיל לצעוק.</li>
              <li>מותר לך להחליט מה נכון לך – גם אם אחרים לא מבינים (עדיין).</li>
            </ul>
          </div>

          {/* Aliza's Story */}
          <div className="content-card story-card fade-in">
            <h2><span className="emoji-icon">🛡️</span><span className="text-content">עליזה שנקין על גבולות:</span></h2>
            <blockquote className="quote-box">
              <p>
                &quot;תשמעי… אצלי בגיל המעבר גיליתי תופעת לוואי שלא כתובה באף חוברת –<br />
                המילה &apos;לא&apos; התחילה לצאת לי מהפה.<br />
                בהתחלה בלחש, אחר כך בחצי חיוך, והיום? זה כבר עם פסקול.
              </p>
              <p>
                אז כן – בהתחלה כולם הופתעו:<br />
                &apos;מה זאת אומרת את לא יכולה לעזור עכשיו?&apos;<br />
                &apos;איך את אומרת לא לחמותך?&apos;<br />
                בכיף! אני אומרת לה – &apos;לא עכשיו. תבואי מחר עם עוגה.&apos; 😅
              </p>
              <p>
                האמת? כל &apos;לא&apos; קטן שלי – היה &apos;כן&apos; גדול לעצמי.<br />
                וזה לא תמיד קל, אבל זה עושה שקט בבפנים.<br />
                ובסוף – אנחנו ביחד בזה.<br />
                ללמוד להגיד &apos;לא&apos;,<br />
                בלי אשמה, בלי דרמה – ועם חיוך קטן של חופש חדש.&quot; ✨
              </p>
            </blockquote>
            <div className="image-container" style={{marginTop: '30px', marginBottom: '20px'}}>
              <img src="https://i.imghippo.com/files/gtg2852hgU.jpg" alt="לא עכשיו. אני על מצב טיסה." />
            </div>
            <p style={{marginTop: '20px', fontStyle: 'italic', textAlign: 'center'}}>
              &quot;לא עכשיו. אני על מצב טיסה.&quot; ✈️🎧
            </p>
          </div>

          {/* Downloads */}
          <div className="content-card downloads-card fade-in">
            <h2><span className="emoji-icon">📥</span><span className="text-content">להורדה:</span></h2>
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <a 
                href="https://drive.google.com/file/d/1ja3CyHo-fRqmAU3w0pmXooB1h0xb1V66/view?usp=sharing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="cta-button"
              >
                הגבולות שלי – מפת גבולות אישית לתרגול
              </a>
            </div>
          </div>

          {/* Back to Stage 2 and Roadmap Links */}
          <div className="next-steps-card fade-in">
            <h2>מה הלאה?</h2>
            <p>
              סיימת לקרוא על נושא חשוב זה בגיל המעבר.
            </p>
            <p className="highlight-text">
              את לא לבד במסע הזה!
            </p>
            
            <div className="button-group">
              <a href="/certainty-peace-security#boundaries" className="cta-button">
                🌳 חזרה לשלב 2 - וודאות, שקט, ביטחון
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

