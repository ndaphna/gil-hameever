'use client';
import { useEffect } from 'react';

export default function MenopausalSleepPage() {
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
    <div className="menopausal-sleep-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="decoration-circle"></div>
        <div className="decoration-circle"></div>
        <div className="container">
          <div className="hero-content">
            <div className="stage-badge">💤 שינה בגיל המעבר</div>
            <h1>שינה בגיל המעבר</h1>
            <p className="subtitle">מה קורה להורמונים בלילה, וטיפים אפקטיביים לשינה טובה</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          
          {/* Introduction */}
          <div className="content-card fade-in">
            <p className="intro-text">
              <strong>כשאת לא נרדמת, מתעוררת בלי סיבה, והשעון הביולוגי שלך צוחק עלייך</strong>
            </p>
            <p>
              אחת המתנות הכי גדולות שאנחנו יכולות לתת לעצמנו בגיל הזה, היא שינה טובה.
            </p>
            <p>
              <strong>אבל האמת?</strong> בדיוק בתקופה הזו, היא הופכת למצרך נדיר.
            </p>
            <p>
              אם את מתהפכת שעות ולא מצליחה להירדם, למרות שאת גמורה מעייפות,<br />
              או מתעוררת 3 פעמים בלילה עם דופק מוגבר, דחף לרוץ לשירותים, וחלון פתוח למרות שקר בחוץ,<br />
              או מקיצה ממש מוקדם בבוקר (4–5 לפנות בוקר) בלי יכולת להירדם שוב,<br />
              או ישנה שינה שטחית, חולמת חלומות מטרידים, וקמה בבוקר בתחושת &quot;לא באמת ישנתי&quot;,
            </p>
            <p className="highlight-text">
              <strong>את לא לבד.</strong>
            </p>
            <p>
              בעיות שינה הן אחד התסמינים השכיחים והמתישים ביותר של גיל המעבר, וגם מהראשונים שמופיעים כבר בפרי־מנופאוזה.
            </p>
          </div>

          {/* What Happens at Night */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🌙</span><span className="text-content">מה קורה בלילה?</span></h2>
            <p>
              בגיל המעבר ההורמונים משחקים תפקיד מרכזי:
            </p>
            <div className="icon-list">
              <div className="icon-item">
                <span className="icon">📉</span>
                <p><strong>אסטרוגן ופרוגסטרון יורדים</strong> – שני הורמונים שמעודדים שינה רגועה.</p>
              </div>
              <div className="icon-item">
                <span className="icon">😴</span>
                <p><strong>מלטונין</strong> – הורמון השינה הטבעי – מופרש פחות, ולכן קשה יותר להירדם.</p>
              </div>
              <div className="icon-item">
                <span className="icon">😰</span>
                <p><strong>קורטיזול</strong> – הורמון הסטרס – נוטה להיות גבוה יותר בלילה, וזה גורם להתעוררויות.</p>
              </div>
            </div>
            <p className="highlight-box">
              💡 <strong>התוצאה:</strong> קושי להירדם, שינה קלה מדי, התעוררויות מרובות, ולפעמים גם נדודי שינה של ממש.
            </p>
          </div>

          {/* What Can You Do */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">💪</span><span className="text-content">מה אפשר לעשות כדי לישון טוב יותר?</span></h2>
            
            <h3>היגיינת שינה – הבסיס שכל אחת חייבת</h3>
            <div className="icon-list">
              <div className="icon-item">
                <span className="icon">🕐</span>
                <div>
                  <strong>שגרה קבועה</strong> – לישון ולקום פחות או יותר באותה שעה, גם בסופי שבוע.
                </div>
              </div>
              <div className="icon-item">
                <span className="icon">📱</span>
                <div>
                  <strong>מסכים מחוץ לחדר</strong> – הטלפון משבש הפרשת מלטונין. חצי שעה לפני השינה – להרחיק.
                </div>
              </div>
              <div className="icon-item">
                <span className="icon">🌡️</span>
                <div>
                  <strong>חדר קריר ואפל</strong> – טמפרטורה נוחה, מצעים קלים, חושך מלא או מסכת עיניים.
                </div>
              </div>
              <div className="icon-item">
                <span className="icon">☕</span>
                <div>
                  <strong>קפה ואלכוהול</strong> – להימנע בשעות הערב. גם אם האלכוהול מרדים, הוא מפריע לשינה עמוקה.
                </div>
              </div>
              <div className="icon-item">
                <span className="icon">🍽️</span>
                <div>
                  <strong>ארוחות כבדות</strong> – עדיף להקדים ארוחת ערב. קיבה מלאה = שינה פחות איכותית.
                </div>
              </div>
            </div>

            <h3>טכניקות שעוזרות להרגיע את הגוף</h3>
            <div className="icon-list">
              <div className="icon-item">
                <span className="icon">🌬️</span>
                <div>
                  <strong>נשימה 4–4–8</strong> – נשימה עמוקה שמאטה את הדופק ומשרה רוגע. שאיפה 4 שניות, החזקת אוויר 4 שניות, נשיפה איטית 8 שניות.
                </div>
              </div>
              <div className="icon-item">
                <span className="icon">📝</span>
                <div>
                  <strong>כתיבה לפני השינה</strong> – לרוקן את הראש מרשימות ומחשבות. אפילו 5 דקות מחברת ליד המיטה.
                </div>
              </div>
              <div className="icon-item">
                <span className="icon">🚿</span>
                <div>
                  <strong>מקלחת חמימה</strong> – עוזרת להוריד טמפרטורת גוף ולהכניס למצב מנוחה.
                </div>
              </div>
              <div className="icon-item">
                <span className="icon">🫖</span>
                <div>
                  <strong>ריטואל קבוע</strong> – תה צמחים, ספר רגוע, מוזיקה שקטה – אות למוח שעכשיו זה זמן שינה.
                </div>
              </div>
            </div>

            <h3>תוספים שיכולים לעזור</h3>
            <div className="icon-list">
              <div className="icon-item">
                <span className="icon">💊</span>
                <div>
                  <strong>מלטונין</strong> – במינון נמוך, בהמלצת רופא.
                </div>
              </div>
              <div className="icon-item">
                <span className="icon">🧪</span>
                <div>
                  <strong>מגנזיום</strong> – מרגיע שרירים ומערכת עצבים.
                </div>
              </div>
              <div className="icon-item">
                <span className="icon">🌿</span>
                <div>
                  <strong>קמומיל, ולריאן, פסיפלורה</strong> – חליטות צמחיות מוכרות לשינה טובה.
                </div>
              </div>
            </div>

            <h3>מה עוד שווה לדעת?</h3>
            <ul className="styled-list">
              <li>פעילות גופנית קבועה ביום משפרת את איכות השינה, אבל עדיף לא ממש לפני השינה.</li>
              <li>אם את מתעוררת בלילה – לא להילחם. לקום, לשתות מים, לקרוא משהו קצר, ואז לחזור למיטה.</li>
              <li>לפעמים גם שיחה עם רופאת גיל המעבר עוזרת – יש טיפולים שמכוונים ספציפית לשיפור איכות השינה.</li>
            </ul>
          </div>

          {/* What You Get Out of It */}
          <div className="content-card fade-in">
            <h3><span className="emoji-icon">🎁</span><span className="text-content">מה יוצא לך מזה?</span></h3>
            <ul className="styled-list">
              <li>שינה טובה מחזקת את מערכת החיסון, משפרת מצב רוח, עוזרת לשמור על משקל, ומחזירה את האנרגיה.</li>
              <li>יותר מזה – היא מחזירה את התחושה של &quot;אני בשליטה על הגוף שלי&quot;.</li>
            </ul>
            <p className="highlight-box">
              💡 אני יכולה להעיד על עצמי – ברגע שהפסקתי להביא את הטלפון למיטה, והתחלתי טקס שינה קצר עם מקלחת, נשימה ותה – השינה שלי השתפרה פלאים. לא תמיד מושלם, אבל לילות שלמים הפכו לשקטים יותר.
            </p>
          </div>

          {/* Do and Don't Table */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">📋</span><span className="text-content">עשי ואל תעשי לשינה טובה</span></h2>
            <table className="activity-table">
              <thead>
                <tr>
                  <th>✅ עשי</th>
                  <th>❌ אל תעשי</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>שמרי על שעת שינה ויקיצה קבועה</td>
                  <td>בלי טלוויזיה או טלפון ליד המיטה</td>
                </tr>
                <tr>
                  <td>אווררי את החדר ודאגי לטמפרטורה קרירה</td>
                  <td>אל תשתי קפה או אלכוהול בערב</td>
                </tr>
                <tr>
                  <td>צרי ריטואל שינה קבוע (תה צמחים, ספר, מקלחת)</td>
                  <td>אל תאכלי ארוחות כבדות מאוחר</td>
                </tr>
                <tr>
                  <td>כתבי 5 דקות במחברת לפני השינה כדי לרוקן את הראש</td>
                  <td>אל תיכנסי למיטה כשאת עדיין &quot;עובדת&quot; או עם מחשבות רצות</td>
                </tr>
                <tr>
                  <td>נסי טכניקות הרפיה ונשימה (4–4–8)</td>
                  <td>אל תתאמני באינטנסיביות ממש לפני השינה</td>
                </tr>
                <tr>
                  <td>שקלי תוספים עדינים (מגנזיום, תה קמומיל, מלטונין – בהתייעצות)</td>
                  <td>אל תישארי ערה במיטה שעות – אם את לא נרדמת, קומי לרגע וחזרי</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tips to Save */}
          <div className="content-card important-card fade-in">
            <h2><span className="emoji-icon">✂️</span><span className="text-content">לגזור ולשמור - טיפים ללילה טוב (באמת!)</span></h2>
            <div className="checklist">
              <div className="check-item">
                <span className="check-icon">🕐</span>
                <div>
                  <strong>סדר יום קבוע:</strong> כן, אני יודעת שזה נשמע משעמם, אבל ללכת לישון ולקום באותה שעה כל יום (כולל בסופ&quot;ש!) עוזר לגוף להתרגל.
                </div>
              </div>
              <div className="check-item">
                <span className="check-icon">❄️</span>
                <div>
                  <strong>הורידי את הטמפרטורה:</strong> הפכי את חדר השינה שלך למקרר קטן. טמפרטורה נמוכה יותר בחדר יכולה לעזור להפחית גלי חום ולשפר את איכות השינה.
                </div>
              </div>
              <div className="check-item">
                <span className="check-icon">🧘</span>
                <div>
                  <strong>תרגילי נשימה והרפיה:</strong> אם את מוצאת את עצמך בוהה בתקרה במקום לישון, נסי תרגילי נשימה עמוקה או מדיטציה. זה יכול להרגיע את המוח הסוער שלך.
                </div>
              </div>
              <div className="check-item">
                <span className="check-icon">🏃‍♀️</span>
                <div>
                  <strong>היי פעילה:</strong> פעילות גופנית סדירה (לא ממש לפני השינה) יכולה לשפר את איכות השינה. אפילו הליכה של 30 דקות ביום יכולה לעשות פלאים.
                </div>
              </div>
              <div className="check-item">
                <span className="check-icon">⛔</span>
                <div>
                  <strong>הימנעי מ&quot;אויבי השינה&quot;:</strong> קפאין, אלכוהול, וארוחות כבדות לפני השינה הם לא החברים שלנו. נסי להימנע מהם לפחות 4-6 שעות לפני השינה.
                </div>
              </div>
              <div className="check-item">
                <span className="check-icon">🛏️</span>
                <div>
                  <strong>צרי סביבת שינה נעימה:</strong> חדר חשוך, שקט, ונוח יכול לעשות הבדל עצום. השקיעי במזרן נוח, כריות טובות, וווילונות מחשיכים.
                </div>
              </div>
              <div className="check-item">
                <span className="check-icon">💊</span>
                <div>
                  <strong>שקלי טיפול הורמונלי:</strong> דברי עם הרופא שלך על האפשרות של טיפול הורמונלי. זה יכול לעזור בהפחתת גלי חום ושיפור איכות השינה.
                </div>
              </div>
              <div className="check-item">
                <span className="check-icon">📚</span>
                <div>
                  נסי לקרוא ספר לפני השינה. זה עובד טוב יותר מכל כדור שינה!
                </div>
              </div>
              <div className="check-item">
                <span className="check-icon">⏰</span>
                <div>
                  אם את לא מצליחה להירדם אחרי 20 דקות, קומי ועשי משהו רגוע עד שתרגישי עייפות.
                </div>
              </div>
              <div className="check-item">
                <span className="check-icon">📝</span>
                <div>
                  כתבי את הדאגות שלך על פתק לפני השינה. זה יכול לעזור &quot;לנקות את הראש&quot;.
                </div>
              </div>
            </div>
            <p className="highlight-text">
              <strong>לילה טוב ושינה נעימה!</strong><br />
              זכרי שזה תהליך ולא כל הפתרונות יעבדו לכולן. היי סבלנית עם עצמך ונסי דברים שונים עד שתמצאי את מה שעובד בשבילך.
            </p>
          </div>

          {/* Downloads */}
          <div className="content-card downloads-card fade-in">
            <h2><span className="emoji-icon">📥</span><span className="text-content">בונוסים:</span></h2>
            <ul className="download-list">
              <li>📊 &quot;יומן שינה שבועי&quot; להורדה</li>
              <li>🎧 מדיטציית שינה מוקלטת להאזנה לפני השינה (בקרוב...)</li>
              <li>📄 <a href="https://gilhameever.com/%d7%9c%d7%99%d7%9c%d7%94-%d7%98%d7%95%d7%91-%d7%91%d7%90%d7%9e%d7%aa-%d7%9e%d7%93%d7%a8%d7%99%d7%9a-%d7%94%d7%a9%d7%95%d7%a8%d7%93%d7%aa-%d7%9c%d7%a9%d7%99%d7%a0%d7%94-%d7%98%d7%95%d7%91%d7%94-%d7%91/" target="_blank" rel="noopener noreferrer">לילה טוב (באמת!): מדריך השורדת לשינה טובה בגיל המעבר</a></li>
              <li>🛍️ מוצרים ומאמרים - מניפה, מאוורר נייד, סדינים מקררים, קרחוניות צבעוניות למצב רוח, ספרים רלוונטיים</li>
            </ul>
          </div>

          {/* Aliza's Story */}
          <div className="content-card story-card fade-in">
            <h2><span className="emoji-icon">🌀</span><span className="text-content">עליזה שנקין מתפרצת</span></h2>
            <blockquote className="quote-box">
              <p>
                &quot;תשמעי, כל הטיפים האלה מעולים… אבל בואי נדבר תכל&apos;ס.
              </p>
              <p>
                אני יכולה לשתות תה קמומיל, לנשום 4–4–8, ללבוש פיג&apos;מת כותנה…<br />
                אבל אם הבעל שלי נוחר לידי – כל ההיגיינה בעולם לא תעזור!
              </p>
              <p>
                אז מה הפתרון שלי?<br />
                אוזניות, מדיטציה, ולפעמים לשלוח אותו לסלון עם שמיכה.
              </p>
              <p>
                מה לעשות, גם הוא בגיל המעבר.<br />
                מעבר לספה…&quot; 😏
              </p>
            </blockquote>
            <div className="image-container">
              <img src="https://i.imghippo.com/files/ktZ2815Ujw.jpg" alt="שינה בגיל המעבר" />
            </div>
          </div>

          {/* Back Links */}
          <div className="next-steps-card fade-in">
            <div className="button-group">
              <a href="/the-body-whispers#key-topics" className="cta-button">
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

