'use client';

import { useEffect } from 'react';

export default function AnxietyAttacksPage() {
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
            <h1>🧯 התקפי חרדה קלים או פתאומיים</h1>
            <p className="subtitle">כשפתאום אין אוויר, גם אם הכל בסדר – לכאורה…</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          
          {/* Introduction */}
          <div className="content-card fade-in">
            <p>
              התקף חרדה זה לא תמיד צרחה ודרמה.<br />
              לפעמים זה דופק שמתגבר בלי סיבה, תחושת חנק, רעידות קלות בידיים, או סתם תחושת &quot;משהו לא בסדר&quot;.<br />
              לפעמים זה קורה באמצע הקניות, באמצע פגישה, או דווקא בלילה, כשכולם ישנים ואת לא מצליחה לנשום.
            </p>
            <p>
              בגיל המעבר, נשים רבות חוות חרדה לראשונה, או בעוצמה שונה.<br />
              גם אם זה לא &quot;התקף&quot; מלא, זו קריאת מצוקה שקטה של הגוף והנפש.
            </p>
          </div>

          {/* Why Now */}
          <div className="content-card fade-in">
            <h2>למה זה קורה דווקא עכשיו?</h2>
            <ul className="styled-list">
              <li>הירידה באסטרוגן משפיעה על רמות הסרוטונין והדופמין – חומרים שאחראים לאיזון רגשי.</li>
              <li>ויסות מערכת העצבים הופך פחות מדויק – הגוף מגיב בעוצמה גם לגירוי קטן.</li>
              <li>עייפות, עומס, דאגות לא מדוברות – כל אלה מתנקזים למעין הצפה פנימית.</li>
              <li>תחושת אובדן שליטה על הגוף / הזמן / העתיד – מתבטאת בחרדה.</li>
            </ul>
          </div>

          {/* Signs */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">📌</span><span className="text-content">סימנים להתקף חרדה סמוי:</span></h2>
            <ul className="styled-list">
              <li>תחושת &quot;זרם חשמלי&quot; בגוף, דקירה פתאומית בחזה או ביד, לחץ באוזניים.</li>
              <li>דופק מהיר, הזעה, רעידות, תחושת עילפון.</li>
              <li>מחשבות חוזרות (&quot;אולי אני חולה&quot;, &quot;אולי יקרה משהו רע&quot;).</li>
              <li>צורך לעזוב מקום מסוים, לברוח, או פשוט לשכב ולהתכדרר.</li>
            </ul>
            <p className="highlight-text">
              💡 חשוב: תמיד כדאי לשלול גורמים רפואיים – אבל גם לזכור: חרדה היא תופעה נורמלית – ולא &quot;בעיה&quot;.
            </p>
          </div>

          {/* What To Do */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🧭</span><span className="text-content">מה עושים כשזה מגיע?</span></h2>
            
            <h3>כלים מיידיים:</h3>
            <ul className="styled-list">
              <li><strong>תנועה עדינה:</strong> להזיז את כפות הידיים, ללכת לאט, לקפל וליישר אצבעות.</li>
              <li><strong>מיקוד חושי:</strong> להתבונן סביב ולומר לעצמך:
                <ul style={{marginTop: '10px', paddingRight: '20px'}}>
                  <li>5 דברים שאני רואה</li>
                  <li>4 שאני שומעת</li>
                  <li>3 שאני נוגעת</li>
                  <li>2 שאני מריחה</li>
                  <li>1 טעם בפה</li>
                </ul>
              </li>
              <li><strong>נשימת 4-6:</strong> שאיפה 4 שניות, נשיפה איטית 6 שניות (מאריכה את הנשיפה – מפעילה את המערכת המרגיעה).</li>
            </ul>

            <h3>כלים מונעים לטווח ארוך:</h3>
            <ul className="styled-list">
              <li>מדיטציות קצרות (3–5 דקות) בזמנים קבועים ביום.</li>
              <li>הימנעות מקפאין ואלכוהול – מחמירים חרדה.</li>
              <li>כתיבה רגשית יומית – פריקה לפני שהכל מצטבר.</li>
              <li>שיחות פתוחות – עם חברה, קבוצת תמיכה, מטפלת.</li>
            </ul>
          </div>

          {/* Remember */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">💡</span><span className="text-content">זכרי:</span></h2>
            <ul className="styled-list">
              <li>את לא &quot;מאבדת את זה&quot; – את מתמודדת עם מערכת שמאותתת שהיא מוצפת.</li>
              <li>ככל שתקשיבי מוקדם יותר – תוכלי להרגיע לפני שיגיע השיא.</li>
              <li>לא חייבים להתמודד לבד – לפעמים עצם ההבנה שזה חרדה ולא התקף לב כבר מקלה מאוד.</li>
            </ul>
          </div>

          {/* Aliza's Story */}
          <div className="content-card story-card fade-in">
            <h2><span className="emoji-icon">🧯</span><span className="text-content">עליזה שנקין על התקפי חרדה:</span></h2>
            <blockquote className="quote-box">
              <p>
                &quot;תקשיבי… פעם היה לי התקף חרדה באמצע הסופר.<br />
                עמדתי בין המדפים של הפסטה והעגבניות מרוסקות, ופתאום – דופק 180, נשימה שטוחה, ואני בטוחה שעוד רגע ימצאו אותי מתעלפת ליד המבצע על ספגטי.
              </p>
              <p>
                אבל מה קרה בפועל?<br />
                נשענתי על העגלה, ספרתי לעצמי &apos;5 דברים שאני רואה&apos;… וגיליתי שאני רואה בעיקר גברים מבולבלים במדף החלב.<br />
                צחקתי באמצע החרדה – וזה כבר חצי מהתרופה.
              </p>
              <p>
                אז כן, זה מפחיד, זה מבלבל, זה מרגיש כמו סוף העולם –<br />
                אבל זה גם עובר.<br />
                ובסוף – אנחנו ביחד בזה.<br />
                עם הדופק, עם הזיעה, ועם הידיעה שאם כבר להתעלף – לפחות שזה יהיה ליד שוקולד במבצע.&quot; 🍫😅
              </p>
            </blockquote>
            <div className="image-container" style={{marginTop: '30px', marginBottom: '20px'}}>
              <img src="https://i.imghippo.com/files/EYBp5923o.jpg" alt="אם כבר להתעלף – לפחות ליד השוקולד" />
            </div>
            <p style={{marginTop: '20px', fontStyle: 'italic', textAlign: 'center'}}>
              &quot;אם כבר להתעלף – לפחות ליד השוקולד.&quot; 🍫 - עליזה שנקין
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
              <a href="/certainty-peace-security#anxiety-attacks" className="cta-button">
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

