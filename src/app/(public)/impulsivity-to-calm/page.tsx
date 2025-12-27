'use client';

import { useEffect } from 'react';

export default function ImpulsivityToCalmPage() {
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
            <h1>🔄 המעבר מאימפולסיביות לרוגע</h1>
            <p className="subtitle">כלים קטנים לשים שנייה בין הגירוי לתגובה. זה כל ההבדל.</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          
          {/* Introduction */}
          <div className="content-card fade-in">
            <p>
              אם את מוצאת את עצמך מתפרצת על הילדים, על הבעל, על הפקידה בקופה,<br />
              או שולחת הודעה קשה מדי, ואז מתחרטת…<br />
              את לא לבד. בגיל המעבר, ההורמונים עושים את שלהם,<br />
              והפיוזים שלנו קצרים מתמיד.
            </p>
            <p>
              אבל כאן נמצא סוד קטן:<br />
              לא תמיד צריך &quot;לשלוט בעצבים&quot;.<br />
              לפעמים מספיק לשים שנייה אחת של מרווח נשימה –<br />
              וזה כבר משנה את כל התגובה.
            </p>
          </div>

          {/* Why This Happens */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🧬</span><span className="text-content">למה זה קורה?</span></h2>
            <ul className="styled-list">
              <li><strong>הורמונלית</strong> – ירידה באסטרוגן משפיעה על מערכת העצבים → פחות וויסות רגשי.</li>
              <li><strong>פיזיולוגית</strong> – הגוף בעומס (חום, עייפות, יובש) → פחות סבלנות.</li>
              <li><strong>רגשית</strong> – שנים של נתינה ולחץ מצטבר → יש פחות &quot;מאגר&quot; פנימי לספיגה.</li>
              <li><strong>חברתית</strong> – ציפיות &quot;להיות תמיד בסדר&quot; → מתנגשות עם הצורך שלנו בשקט ובגבולות.</li>
            </ul>
          </div>

          {/* Tools */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🧭</span><span className="text-content">כלים קטנים לעצור רגע לפני הפיצוץ:</span></h2>
            <ul className="styled-list">
              <li><strong>🕊️ נשימת 4-6</strong> – שאיפה 4 שניות, נשיפה איטית 6 שניות. מאריך את המרחק בין &quot;בא לי לצעוק&quot; ל&quot;בחרתי לענות אחרת&quot;.</li>
              <li><strong>✍️ כתבי הודעה – אל תשלחי.</strong> כשאת מרגישה שאת עומדת להגיב מהר מדי, כתבי את זה בנוטס או בטיוטות. קראי שוב אחרי 10 דקות. לרוב תרצי לשנות.</li>
              <li><strong>🚶 שינוי מקום פיזי</strong> – אם את עומדת להתפוצץ, צאי רגע לחדר אחר, למרפסת או אפילו לשירותים. תנועה = הפסקה טבעית.</li>
              <li><strong>💧 תרגול &quot;רגע מים&quot;</strong> – לפני תגובה, קחי שלוק מים. עצם ההשהיה הקטנה הזו שוברת את השרשרת האוטומטית.</li>
              <li><strong>🎧 מילת עצירה אישית</strong> – בחרי מילה או משפט קצר לעצמך, כמו &quot;שקט&quot; או &quot;חכי רגע&quot;. אמרי אותה בלב בכל פעם שאת מרגישה גל אימפולסיביות.</li>
            </ul>
          </div>

          {/* Daily Practice */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">💡</span><span className="text-content">תרגול יומי קטן:</span></h2>
            <p>
              בכל יום, מצאי סיטואציה אחת קטנה שבה הצלחת לשים שנייה של מרחק לפני התגובה.<br />
              זה יכול להיות גם &quot;חייכתי במקום לענות&quot; או &quot;נשמתי במקום להתפרץ&quot;.<br />
              בסוף השבוע – כתבי את שלושת הרגעים שבהם הצלחת.<br />
              <strong>אלה הראיות שלך שאת יכולה לבחור אחרת.</strong>
            </p>
          </div>

          {/* Remember */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">✨</span><span className="text-content">זכרי:</span></h2>
            <ul className="styled-list">
              <li>את לא &quot;חמת מזג&quot; – את בתקופה שבה המערכת שלך רגישה יותר.</li>
              <li>כל שנייה של מודעות – היא ניצחון קטן.</li>
              <li>את לא חייבת להיות מושלמת, רק להיות רגע עם עצמך לפני שאת עונה. שם נמצא הכוח האמיתי שלך.</li>
            </ul>
          </div>

          {/* Aliza's Story */}
          <div className="content-card story-card fade-in">
            <h2><span className="emoji-icon">🎭</span><span className="text-content">עליזה שנקין מסכמת:</span></h2>
            <blockquote className="quote-box">
              <p>
                &quot;תקשיבי… אני קוראת לזה &apos;מיקרו־פוזה&apos;.<br />
                לפני שאני מתפוצצת – אני לוקחת שלוק מים,<br />
                כאילו זה קוקטייל שגורם לי לחשוב פעמיים.<br />
                זה לא תמיד עובד… לפעמים המים נשפכים מרוב עצבים 😅<br />
                אבל כשזה כן עובד – וואלה, אני מרגישה כמו גורו של זן.
              </p>
              <p>
                אז כן, הפיוז שלי קצר,<br />
                אבל לפחות למדתי לשים שנייה בין הניצוץ לפיצוץ.<br />
                ובסוף – אנחנו ביחד בזה.<br />
                עם הצעקות, עם הצחוקים,<br />
                ועם היכולת לגלות שגם במנופאוזה – אפשר להיות קצת בודהה.&quot; 🧘‍♀️✨
              </p>
            </blockquote>
            <div className="image-container" style={{marginTop: '30px', marginBottom: '20px'}}>
              <img src="https://i.imghippo.com/files/pQV9822OeA.jpg" alt="פיוז קצר – אבל בודהה בפוטנציה" />
            </div>
            <p style={{marginTop: '20px', fontStyle: 'italic', textAlign: 'center'}}>
              &quot;פיוז קצר – אבל בודהה בפוטנציה&quot;<br />
              &quot;נשימה אחת – ואני גורו.&quot; 🧘‍♀️<br />
              - עליזה שנקין
            </p>
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
              <a href="/certainty-peace-security#impulsivity-to-calm" className="cta-button">
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


