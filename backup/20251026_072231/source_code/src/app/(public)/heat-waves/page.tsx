'use client';
import { useEffect } from 'react';

export default function HeatWavesPage() {
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
    <div className="heat-waves-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="decoration-circle"></div>
        <div className="decoration-circle"></div>
        <div className="container">
          <div className="hero-content">
            <div className="stage-badge">🔥 גלי חום והזעות לילה</div>
            <h1>גלי חום והזעות לילה</h1>
            <p className="subtitle">הסימפטום הכי מוכר והכי מציק בגיל המעבר</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          
          {/* Introduction */}
          <div className="content-card fade-in">
            <p className="intro-text">
              <strong>ברוכה הבאה למחלקת הסאונה – רק בלי השליטה על הכפתור</strong>
            </p>
            <p>
              אם את כאן, כנראה שגם לך זה קורה.
            </p>
            <p>
              אמצע היום, פתאום הגוף מרגיש כאילו מישהו הדליק תנור בתוכו, ואת מחפשת בטירוף איזה דף לנפנף איתו.
            </p>
            <p>
              לילה, את סוף־סוף נרדמת, פתאום את קמה רטובה, מעיפה מעליך את השמיכה, ומדליקה מזגן, מאוורר, מגששת לכוס המים שעל שידת הלילה.
            </p>
            <p className="highlight-text">
              <strong>גלי חום והזעות לילה הם מהסימפטומים הכי נפוצים, הכי מוכרים, וגם הכי מציקים, בגיל המעבר.</strong>
            </p>
            <p>
              אבל מה זה בעצם? ולמה זה קורה?
            </p>
          </div>

          {/* What is a Hot Flash */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🔥</span><span className="text-content">מה זה גל חום?</span></h2>
            <div className="icon-list">
              <div className="icon-item">
                <span className="icon">🌡️</span>
                <p>תחושת חום פתאומית שמתחילה לעיתים בפנים, מתפשטת לצוואר ולחזה, ולעיתים גם לשאר הגוף.</p>
              </div>
              <div className="icon-item">
                <span className="icon">💦</span>
                <p>מלווה לעיתים בהזעה, הסמקה, דופק מואץ ותחושת &quot;אני עומדת להתפוצץ&quot;.</p>
              </div>
              <div className="icon-item">
                <span className="icon">⏱️</span>
                <p>נמשך בין 30 שניות ל-10 דקות (אבל מי סופרת?).</p>
              </div>
              <div className="icon-item">
                <span className="icon">🌙</span>
                <p>יכול להופיע כמה פעמים ביום – או בלילה, ולעורר מהשינה (הידוע לשמצה: הזעת לילה).</p>
              </div>
            </div>
          </div>

          {/* Why Does This Happen */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">❓</span><span className="text-content">למה זה קורה?</span></h2>
            <p>
              בגיל המעבר רמות האסטרוגן יורדות, וזה משפיע על &quot;תרמוסטט&quot; קטן במוח שלנו ששולט בטמפרטורת הגוף.
            </p>
            <p>
              <strong>בפשטות?</strong> המוח חושב שהגוף שלך מתחמם מדי – גם כשהוא לא.
            </p>
            <p>
              הגוף נכנס ל&quot;מצב חירום&quot;, והתגובה שלו: &quot;יאללה, לקרר!&quot; – הזעה, הרחבת כלי דם, תחושת חום קיצונית.
            </p>
            <p className="highlight-text">
              וזה... חוזר שוב. ושוב.
            </p>
          </div>

          {/* Remember */}
          <div className="content-card fade-in">
            <h3><span className="emoji-icon">✨</span><span className="text-content">בואי נזכור:</span></h3>
            <ul className="styled-list">
              <li>את לא &quot;מתחממת סתם&quot; – זו תגובה פיזיולוגית אמיתית.</li>
              <li>את לא לבד – מחקרים מראים שיותר מ־70% מהנשים חוות את זה.</li>
              <li>אפשר להקל, ואפילו לעבור את זה עם הומור (ושמיכה מנדפת זיעה).</li>
            </ul>
          </div>

          {/* What Can You Do */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">💪</span><span className="text-content">מה אפשר לעשות?</span></h2>
            <p>
              אני לא רופאה, אבל חקרתי, ניסיתי ושוחחתי עם נשים רבות. הנה מה שבאמת עוזר:
            </p>
            
            <h3>פתרונות טבעיים ויומיומיים</h3>
            <div className="icon-list">
              <div className="icon-item">
                <span className="icon">👕</span>
                <div>
                  <strong>אוורור ולבוש שכבות</strong> – עדיף כותנה, פשתן, בדים נושמים. בלילה – שמיכה קלה, לפעמים אפילו שתיים דקות במקום אחת כבדה.
                </div>
              </div>
              <div className="icon-item">
                <span className="icon">☕</span>
                <div>
                  <strong>הפחתת קפאין, אלכוהול ותבלינים חריפים</strong> – הם ידועים כ&quot;טריגרים&quot; לגלי חום. כן, אני יודעת, קשה לוותר על הקפה. אני אישית שותה קפה אחרון בצהריים. לא מאוחר יותר.
                </div>
              </div>
              <div className="icon-item">
                <span className="icon">🏃‍♀️</span>
                <div>
                  <strong>פעילות גופנית קבועה</strong> – לא חייב להיות אינטנסיבי, אפילו הליכה יומית. זה מאזן הורמונים ומרגיע את מערכת העצבים.
                </div>
              </div>
              <div className="icon-item">
                <span className="icon">🧘</span>
                <div>
                  <strong>תרגילי נשימה והרפיה</strong> – טכניקת 4–4–8 לפני השינה יכולה לעזור להירגע ולהאריך את השינה הרציפה. שאיפה 4 שניות, החזקת אוויר 4 שניות, נשיפה איטית 8 שניות.
                </div>
              </div>
              <div className="icon-item">
                <span className="icon">🌿</span>
                <div>
                  <strong>תוספים</strong> – חלק מהנשים נעזרות בפיטואסטרוגנים (איזופלבונים מסויה, זרעי פשתן, תלתן אדום). חשוב להתייעץ לפני, כי לא לכל אחת זה מתאים.
                </div>
              </div>
              <div className="icon-item">
                <span className="icon">🌬️</span>
                <div>
                  <strong>מניפה אישית / קרחונים קטנים</strong> – לפעמים זה כל מה שצריך כדי להרגיש שיש שליטה.
                </div>
              </div>
            </div>

            <h3>טיפולים רפואיים</h3>
            <div className="icon-list">
              <div className="icon-item">
                <span className="icon">💊</span>
                <div>
                  <strong>טיפול הורמונלי חלופי (HRT)</strong> – נחשב היעיל ביותר להקלת גלי חום. לא מתאים לכל אחת, ויש לשקול עם רופאת גיל המעבר.
                </div>
              </div>
              <div className="icon-item">
                <span className="icon">💊</span>
                <div>
                  <strong>טיפולים לא הורמונליים</strong> – קיימות תרופות שמקלות גם בלי אסטרוגן. לרוב ניתנות לנשים שלא יכולות לקחת הורמונים.
                </div>
              </div>
            </div>
          </div>

          {/* What You Get Out of It */}
          <div className="content-card fade-in">
            <h3><span className="emoji-icon">🎁</span><span className="text-content">מה יוצא לך מזה?</span></h3>
            <ul className="styled-list">
              <li>שינה טובה יותר, פחות התעוררויות, יותר אנרגיה ביום.</li>
              <li>פחות &quot;שריפה&quot; באמצע היום, יותר תחושת שליטה בגוף.</li>
              <li>ולא פחות חשוב – הידיעה שאת לא לבד.</li>
            </ul>
            <p className="highlight-box">
              💡 אני יכולה לספר לך שכששיניתי את שגרת הערב שלי – הפחתתי קפה אחרי הצהריים, תרגלתי נשימות 5 דקות לפני השינה והנחתי מים קרים ליד המיטה, לילות שלמים התחילו להרגיש אחרת. לא מושלם, אבל הרבה יותר נסבל.
            </p>
          </div>

          {/* Tips to Save */}
          <div className="content-card important-card fade-in">
            <h2><span className="emoji-icon">✂️</span><span className="text-content">לגזור ולשמור - טיפים שיעזרו לך להישאר קרירה (ומגניבה):</span></h2>
            <div className="checklist">
              <div className="check-item">
                <span className="check-icon">👗</span>
                <div>
                  <strong>לבוש בשכבות קלות</strong> שאפשר להסיר בקלות. ככה, כשמגיע גל חום, אפשר &quot;לקלף&quot; שכבה ולהרגיש מיד יותר קריר.
                </div>
              </div>
              <div className="check-item">
                <span className="check-icon">💧</span>
                <div>
                  <strong>מים קרים תמיד בהישג יד וכמה שיותר!</strong> זה לא רק מרענן, אלא גם עוזר לגוף לווסת את הטמפרטורה. אפשר גם להחזיק בקבוק ספריי קטן עם מים קרים ולרסס על הפנים והצוואר כשמגיע גל חום. זה כמו מיני-מקלחת, רק בלי הצורך להתפשט באמצע הרחוב.
                </div>
              </div>
              <div className="check-item">
                <span className="check-icon">🌬️</span>
                <div>
                  <strong>נשימות עמוקות:</strong> כשמתחיל גל חום, נסי לנשום עמוק ולאט. זה יכול להרגיע את הגוף ולהפחית את עוצמת גל החום. בונוס: זה גם יפחית סטרס ולחץ.
                </div>
              </div>
              <div className="check-item">
                <span className="check-icon">🥗</span>
                <div>
                  <strong>תזונה חכמה:</strong> הימנעי מאוכל חריף, קפאין, ואלכוהול, במיוחד בערב. כן, אני יודעת, זה נשמע כמו להוציא את כל הכיף מהחיים, אבל תחשבי על זה ככה – פחות גלי חום = יותר שעות שינה = יותר אנרגיה לעשות דברים כיפיים אחרים! בנוסף, הוסיפי תזונה מקררת הכוללת עלים ירוקים, ירקות ירוקים, נענע, מנטה ודגים.
                </div>
              </div>
              <div className="check-item">
                <span className="check-icon">💪</span>
                <div>
                  <strong>פעילות גופנית:</strong> כן, זה נשמע מוזר, אבל פעילות גופנית סדירה יכולה לעזור להפחית את תדירות גלי החום. אז קדימה, צאי להליכה, לשחיה, או לרקוד סלסה. הבונוס? שיפור הכושר כשהגוף יחליט סוף סוף להפסיק להיות תנור אנושי.
                </div>
              </div>
              <div className="check-item">
                <span className="check-icon">🧘</span>
                <div>
                  <strong>טכניקות הרפיה:</strong> מדיטציה, יוגה, או פשוט לשבת בשקט כמה דקות ביום יכולים לעזור להפחית את התדירות והעוצמה של גלי החום.
                </div>
              </div>
              <div className="check-item">
                <span className="check-icon">💊</span>
                <div>
                  <strong>טיפול הורמונלי:</strong> אם גלי החום ממש מפריעים לאיכות החיים, שווה להתייעץ. זה לא מתאים לכולן, אבל יכול להיות פתרון מצוין למי שכן.
                </div>
              </div>
            </div>
          </div>

          {/* Downloads */}
          <div className="content-card downloads-card fade-in">
            <h2><span className="emoji-icon">📥</span><span className="text-content">רוצה עוד מידע?</span></h2>
            <p className="intro-text">
              <strong>גלי חום: איך להישאר קרירה כשהגוף מחליט להיות תנור?</strong>
            </p>
            <ul className="download-list">
              <li>📄 להורדת PDF - &quot;7 הדרכים להקלת גלי חום והזעות לילה - מדריך נשי בגובה העיניים&quot;</li>
              <li>🎥 צפי בסרטון קצר: &quot;גל חום? הנה מה שאת באמת צריכה לעשות&quot;</li>
              <li>🛍️ מוצרים ומאמרים - מניפה, מאוורר נייד, סדינים מקררים, קרחוניות צבעוניות למצב רוח, ספרים רלוונטיים</li>
            </ul>
          </div>

          {/* Aliza's Story */}
          <div className="content-card story-card fade-in">
            <h2><span className="emoji-icon">🔥</span><span className="text-content">עליזה שנקין מגלגלת עיניים</span></h2>
            <blockquote className="quote-box">
              <p>
                &quot;תקשיבי… זה לא גלי חום. זה צונאמי אישי.
              </p>
              <p>
                באמצע הלילה אני מתעוררת, מרגישה כמו כיריים על מצב 9,<br />
                ובינתיים הבעל שלי ישן מתחת לפוך כאילו אנחנו באנטארקטיקה.
              </p>
              <p>
                אז מה אני עושה?<br />
                פותחת חלון, סוגרת חלון, זורקת שמיכה, מחפשת שמיכה,<br />
                בקיצור – שיעור אירובי מלא בלי לצאת מהמיטה.
              </p>
              <p>
                וזה הכי מצחיק – אומרים &apos;זה יעבור&apos;.<br />
                יופי. אבל מתי??
              </p>
              <p>
                אני כבר לא נלחמת בזה.<br />
                יש לי ליד המיטה ערכת חירום: מניפה, בקבוק ספריי מים, וחולצת כותנה ספייר.
              </p>
              <p>
                ככה במקום להתהפך מצד לצד, אני עושה &apos;פיט סטופ&apos; של שתי דקות – מתקררת, מחליפה, חוזרת לישון.&quot; 👕🔥
              </p>
            </blockquote>
            <div className="image-container">
              <img src="https://i.imghippo.com/files/XFkC2038mCk.jpg" alt="גלי חום והזעות לילה בגיל המעבר" />
            </div>
          </div>

          {/* Back Links */}
          <div className="next-steps-card fade-in">
            <div className="button-group">
              <a href="/the-body-whispers#heat-waves" className="cta-button">
                🧏🏻‍♀️ חזרה לשלב 1 במפת דרכים
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

