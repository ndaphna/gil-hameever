'use client';

import { useEffect } from 'react';

export default function EmotionalRegulationPage() {
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
            <h1>⚠️ מה זה בכלל &quot;וויסות רגשי&quot;?</h1>
            <p className="subtitle">&quot;אני בסך הכל רציתי להכניס מכונת כביסה, למה אני בוכה באמצע המטבח?&quot;</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          
          {/* Introduction */}
          <div className="content-card fade-in">
            <p>
              אם את מרגישה שהרגשות שלך הפכו לרכבת הרים, בלי תחנת עצירה,<br />
              אם צעקת על מישהו ואז מיד שאלת את עצמך &quot;רגע, מה קרה לי?&quot;,<br />
              אם את מתפרצת, שותקת, בוכה, מתרחקת, לפעמים בלי להבין למה...<br />
              <strong>זה לא את.<br />
              זה לא הווסת.<br />
              זה הוויסות.</strong>
            </p>
          </div>

          {/* What is Emotional Regulation */}
          <div className="content-card fade-in">
            <h2>מה זה בכלל &quot;וויסות רגשי&quot;?</h2>
            <p>
              וויסות רגשי זה היכולת לנהל את התגובה שלנו לרגש,<br />
              במקום שהתגובה תנהל אותנו.
            </p>
            <p>זה אומר להצליח:</p>
            <ul className="styled-list">
              <li>לזהות רגש כשעולה (למשל כעס, פחד, בושה)</li>
              <li>להבין מה הפעיל אותו</li>
              <li>לבחור תגובה מודעת ולא אוטומטית</li>
            </ul>
            <p className="highlight-text">
              נשמע פשוט? בגיל המעבר, זה כמעט מדע בדיוני.
            </p>
            <p>
              ההורמונים משתנים, מערכת העצבים מגיבה ביתר רגישות,<br />
              ומה שפעם הצלחנו &quot;לספוג&quot; – פתאום גורם לנו להתפרק.
            </p>
          </div>

          {/* Hormones Connection */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🧬</span><span className="text-content">הקשר בין הורמונים לוויסות רגשי</span></h2>
            <ul className="styled-list">
              <li>הירידה באסטרוגן משפיעה על רמות סרוטונין ודופמין – חומרים שאחראים למצב הרוח ולתחושת יציבות.</li>
              <li>מערכת העצבים הסימפתטית (fight/flight) נדלקת מהר יותר – הגוף מגיב כמו לאיום, גם כשאין איום ממשי.</li>
              <li>תחושת השליטה יורדת, וזה מגביר סטרס → סטרס מגביר תגובתיות רגשית → מעגל קסמים.</li>
            </ul>
          </div>

          {/* Signs */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">📌</span><span className="text-content">סימנים שהוויסות הרגשי שלך מאותגר:</span></h2>
            <ul className="styled-list">
              <li>תגובה רגשית חזקה למשהו קטן (נפגעת ממילה אחת קטנה?)</li>
              <li>צורך &quot;להתנתק&quot; כדי לא להתפרק</li>
              <li>קושי לשים מילים על מה שאת מרגישה</li>
              <li>תחושת חרטה אחרי ריב או ויכוח</li>
              <li>מחשבות שחוזרות שוב ושוב בלילה</li>
            </ul>
          </div>

          {/* What To Do */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🧭</span><span className="text-content">מה לעשות כדי לווסת?</span></h2>
            
            <h3>כלים מיידיים:</h3>
            <ul className="styled-list">
              <li><strong>נשימה מודעת</strong> – 5 נשימות עמוקות, עיניים עצומות, בלי לתקן כלום.</li>
              <li><strong>שם לרגש</strong> – עצרי רגע ושאלי את עצמך: מה אני מרגישה עכשיו?</li>
              <li><strong>מעבר פיזי</strong> – קומי, לכי לחדר אחר, החליפי סביבה. תנועה = ניקוז.</li>
            </ul>

            <h3>כלים לטווח ארוך:</h3>
            <ul className="styled-list">
              <li><strong>יומן רגשות</strong> – כתבי מדי ערב על רגע אחד רגשי ביום. מה עורר אותו? איך הגבת?</li>
              <li><strong>שיחה עם חברה תומכת</strong> – לא כדי &quot;לפתור&quot;, אלא כדי להשמיע.</li>
              <li><strong>טקס מרגיע קבוע</strong> – כוס תה, מוזיקה שקטה, דקה של שקט – כל יום, באותה שעה.</li>
            </ul>
          </div>

          {/* Remember */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">💡</span><span className="text-content">זכרי:</span></h2>
            <ul className="styled-list">
              <li>את לא חלשה – את אנושית. הגוף שלך רגיש יותר, והלב שלך פתוח יותר.</li>
              <li>הרגשות שלך מבקשים הקשבה, לא הדחקה.</li>
              <li>לא צריך &quot;להיות בשליטה&quot; כל הזמן – רק להיות עם עצמך ברגע.</li>
            </ul>
          </div>

          {/* Aliza's Story */}
          <div className="content-card story-card fade-in">
            <h2><span className="emoji-icon">🎭</span><span className="text-content">ומה עליזה אומרת?</span></h2>
            <h3>עליזה שנקין על וויסות רגשי:</h3>
            <blockquote className="quote-box">
              <p>
                &quot;נו באמת… קוראים לזה &apos;וויסות רגשי&apos;?<br />
                אני קוראת לזה &apos;מי חטף לי את הפיוזים ועשה מהם חוטי חשמל חשופים&apos;.<br />
                פעם הייתי יכולה לסבול שטיפת כלים בלי להתרגש.<br />
                היום – אם מישהו מניח לי עוד כפית בכיור – אני על סף מונולוג דרמטי של שייקספיר.
              </p>
              <p>
                אבל למדתי משהו:<br />
                לפעמים לא צריך להיות &apos;בשליטה&apos;,<br />
                מספיק לדעת מתי לשים אוזניות, לצאת לסיבוב עם עצמי,<br />
                ולזכור שעדיף לצחוק על זה מאשר להתנצל על זה.
              </p>
              <p>
                ובסוף – אנחנו ביחד בזה.<br />
                עם הבכי על הפרסומת, עם הצעקות על הכביסה,<br />
                ועם הידיעה שאם כבר נפל לי הפיוז – לפחות שיהיה זיקוקי דינור.&quot; ✨
              </p>
            </blockquote>
            <div className="image-container" style={{marginTop: '30px', marginBottom: '20px'}}>
              <img src="https://i.imghippo.com/files/Lpx5321I.jpg" alt="אם כבר נפל לי הפיוז – לפחות שיהיה זיקוקי דינור" />
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
              <a href="/certainty-peace-security#emotional-regulation" className="cta-button">
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

