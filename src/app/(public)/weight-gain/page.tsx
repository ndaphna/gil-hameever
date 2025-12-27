'use client';
import { useEffect } from 'react';

export default function WeightGainPage() {
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
    <div className="weight-gain-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="decoration-circle"></div>
        <div className="decoration-circle"></div>
        <div className="container">
          <div className="hero-content">
            <div className="stage-badge">⚖️ עלייה במשקל ותזונה</div>
            <h1>עלייה במשקל ותזונה בגיל המעבר</h1>
            <p className="subtitle">שומן בטני, איך זה קורה גם כשאת לא אוכלת יותר מבעבר, ואיך להתמודד בלי דיאטות קיצון ובלי ייסורי מצפון</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          
          {/* Introduction */}
          <div className="content-card fade-in">
            <p className="intro-text">
              <strong>&quot;אבל אני לא אוכלת יותר!&quot; – ובכל זאת... הבטן מדברת בשם עצמה</strong>
            </p>
            <p>
              אם את מרגישה שאת משמינה מנשימות,<br />
              שהג&apos;ינס הישן פתאום הפך לנמוך־מותן נגד רצונך,<br />
              ושהמשקל עולה גם כשאת אוכלת &quot;כמו תמיד&quot;,
            </p>
            <p className="highlight-text">
              <strong>את לא מדמיינת.</strong>
            </p>
            <p>
              בגיל המעבר, שינוי הורמונלי + שינויים מטבוליים + סטרס = מתכון לתסכול.
            </p>
            <p>
              <strong>אבל יש גם חדשות טובות:</strong> אפשר לשנות כיוון – בלי להיכנס לדיאטה מייסרת.
            </p>
          </div>

          {/* Why Weight Changes Now */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">❓</span><span className="text-content">למה המשקל משתנה דווקא עכשיו?</span></h2>
            <div className="icon-list">
              <div className="icon-item">
                <span className="icon">🎯</span>
                <p><strong>ירידה ברמת האסטרוגן משפיעה על פיזור השומן בגוף</strong> – הוא נוטה להתיישב באזור הבטן.</p>
              </div>
              <div className="icon-item">
                <span className="icon">⏱️</span>
                <p><strong>האטה בחילוף החומרים</strong> – הגוף שורף פחות קלוריות במנוחה.</p>
              </div>
              <div className="icon-item">
                <span className="icon">💪</span>
                <p><strong>פחות מסת שריר</strong> – עם השנים אנחנו מאבדות שריר, וזה משפיע על קצב המטבוליזם.</p>
              </div>
              <div className="icon-item">
                <span className="icon">😴</span>
                <p><strong>שינויים בשינה ובמצב הרוח</strong> – פחות אנרגיה לתנועה, יותר אכילה רגשית.</p>
              </div>
            </div>
          </div>

          {/* What They Don't Tell You */}
          <div className="content-card fade-in">
            <h3><span className="emoji-icon">🤯</span><span className="text-content">ומה שלא מספרים לך:</span></h3>
            <ul className="styled-list">
              <li><strong>המשקל זו לא תמיד הבעיה</strong> – לפעמים זו התחושה בגוף שמשתנה.</li>
              <li><strong>גם נשים רזות בגיל המעבר</strong> מדווחות על נפיחות, תחושת כבדות, עייפות.</li>
              <li><strong>אכילה &quot;בריאה&quot; לא תמיד מספיקה</strong> – צריך להבין מה הגוף צריך עכשיו, לא מה עבד פעם.</li>
            </ul>
          </div>

          {/* What Really Helps */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🧭</span><span className="text-content">מה כן עוזר?</span></h2>
            
            <h3>🍎 שינויים תזונתיים חכמים:</h3>
            <div className="icon-list">
              <div className="icon-item">
                <span className="icon">🥩</span>
                <div>
                  <strong>תוספת חלבון איכותי</strong> – לבניית שריר ולתחושת שובע.
                </div>
              </div>
              <div className="icon-item">
                <span className="icon">🥦</span>
                <div>
                  <strong>מזון עשיר בסיבים תזונתיים</strong> – עוזר לעיכול ולהפחתת נפיחות.
                </div>
              </div>
              <div className="icon-item">
                <span className="icon">💧</span>
                <div>
                  <strong>שתייה מספקת</strong> – חשוב מתמיד (ולא רק בגלל גלי החום).
                </div>
              </div>
              <div className="icon-item">
                <span className="icon">🍬</span>
                <div>
                  <strong>הפחתת סוכרים פשוטים וקפאין</strong> – משפרים גם שינה וגם מצב רוח.
                </div>
              </div>
            </div>

            <h3>🏃 פעילות גופנית נכונה:</h3>
            <div className="icon-list">
              <div className="icon-item">
                <span className="icon">🏋️</span>
                <div>
                  <strong>אימוני כוח</strong> (גם עם משקל גוף או גומיות) – מגבירים מסת שריר ומטבוליזם.
                </div>
              </div>
              <div className="icon-item">
                <span className="icon">🚶</span>
                <div>
                  <strong>הליכות יומיות</strong> – גם 20 דקות עושות הבדל.
                </div>
              </div>
              <div className="icon-item">
                <span className="icon">🧘</span>
                <div>
                  <strong>יוגה/פילאטיס</strong> – לשיפור קשר גוף-נפש, שיווי משקל, יציבה וביטחון עצמי.
                </div>
              </div>
            </div>
          </div>

          {/* Tools That Work */}
          <div className="content-card important-card fade-in">
            <h3><span className="emoji-icon">🧘</span><span className="text-content">כלים שעובדים מהבטן (והנשמה):</span></h3>
            <div className="checklist">
              <div className="check-item">
                <span className="check-icon">🍽️</span>
                <div>
                  <strong>אכילה אינטואיטיבית</strong> - ללמוד לזהות רעב אמיתי מול רעב רגשי. לשאול: &quot;מה הגוף שלי צריך עכשיו?&quot;
                </div>
              </div>
              <div className="check-item">
                <span className="check-icon">🖊️</span>
                <div>
                  <strong>יומן אכילה מודעת</strong> - לא לספור קלוריות, אלא להקשיב: איך הרגשתי לפני? אחרי? מה עורר אותי לאכול?
                </div>
              </div>
              <div className="check-item">
                <span className="check-icon">🥗</span>
                <div>
                  <strong>הצלחת המודעת</strong> - הכנה של צלחת מאוזנת מראש, עם מודעות, בלי רגשות אשם.
                </div>
              </div>
              <div className="check-item">
                <span className="check-icon">💬</span>
                <div>
                  <strong>חיבוק פנימי</strong> - להפסיק לדבר אל עצמך בשפת &quot;איך זללת שוב&quot;, ולהתחיל בגישה של חמלה.
                </div>
              </div>
            </div>
          </div>

          {/* Nutrition Principles */}
          <div className="content-card fade-in">
            <h3><span className="emoji-icon">🥗</span><span className="text-content">עקרונות תזונה בגיל המעבר:</span></h3>
            <ul className="styled-list">
              <li>פחות סוכר → פחות דלקת בגוף.</li>
              <li>יותר חלבון → יותר שריר, יותר שובע.</li>
              <li>יותר ירקות → יותר אנרגיה, יותר סיבים.</li>
              <li>פחות אכילה מתוך סטרס → יותר בחירה מודעת.</li>
            </ul>
          </div>

          {/* Remember */}
          <div className="content-card fade-in">
            <h3><span className="emoji-icon">✨</span><span className="text-content">בואי נזכור:</span></h3>
            <ul className="styled-list">
              <li>עלייה קלה במשקל היא לעיתים חלק טבעי מהשלב הזה.</li>
              <li>הגוף לא בוגד. הוא משתנה ומבקש יחס אחר.</li>
              <li>לא כל שינוי הוא כישלון. לפעמים הוא קריאה ליחס חדש כלפי עצמך.</li>
            </ul>
          </div>

          {/* Small Tools - Big Difference */}
          <div className="content-card fade-in">
            <h3><span className="emoji-icon">🧰</span><span className="text-content">כלים קטנים – הבדל גדול:</span></h3>
            <div className="checklist">
              <div className="check-item">
                <span className="check-icon">🍽️</span>
                <div>
                  <strong>איזון בכל ארוחה:</strong> חלבון, שומן בריא, פחמימה מורכבת, ירק. פשוט.
                </div>
              </div>
              <div className="check-item">
                <span className="check-icon">🥄</span>
                <div>
                  <strong>ארוחת בוקר אמיתית:</strong> לא רק קפה. חלבון + שומן בריא = פתיחה טובה ליום.
                </div>
              </div>
              <div className="check-item">
                <span className="check-icon">🥤</span>
                <div>
                  <strong>מים! מים! מים!</strong> - נשים בגיל המעבר נוטות להתייבש יותר, ושותות פחות. מזכירה: גם עייפות היא לפעמים צמא.
                </div>
              </div>
            </div>
          </div>

          {/* Downloads */}
          <div className="content-card downloads-card fade-in" style={{ display: 'none' }}>
            <h2><span className="emoji-icon">📥</span><span className="text-content">רוצה להרגיש שליטה חדשה?</span></h2>
            <ul className="download-list">
              <li>📊 להורדת טבלת מעקב תזונה רגשית ונפח ארוחות</li>
              <li>🎥 לצפייה בסרטון: &quot;איך לבנות צלחת מאוזנת בלי להשתגע&quot; - בקרוב…</li>
              <li>📄 קובץ PDF להורדה ולהדבקה על המקרר: &quot;7 השאלות לפני שאת ניגשת למקרר&quot;</li>
              <li>🛍️ מוצרים ומאמרים</li>
            </ul>
          </div>

          {/* Aliza's Story */}
          <div className="content-card story-card fade-in">
            <h2><span className="emoji-icon">😅</span><span className="text-content">עליזה שנקין על המשקל בגיל המעבר</span></h2>
            <blockquote className="quote-box">
              <p>
                &quot;תשמעי, אני לא אשקר – המשקל שלי הפך להיות כמו חשבון בנק.<br />
                אני מפחדת להסתכל, ובכל פעם שאני כן מסתכלת – יש הפתעות.
              </p>
              <p>
                אבל למדתי משהו חשוב:<br />
                אין לי כוח יותר לדיאטות סיזיפיות.
              </p>
              <p>
                מה שיש לי כוח אליו זה להיות חברה טובה לגוף שלי.
              </p>
              <p>
                אז כן, יש לי ג&apos;ינס אחד שמחכה לי בארון כמו &apos;אקס&apos; מעצבן,<br />
                אבל בינתיים אני מתרגלת לאהוב את מי שאני רואה במראה.
              </p>
              <p>
                ובסוף – אנחנו ביחד בזה.<br />
                עם הג&apos;ינס, בלי הג&apos;ינס,<br />
                עם קפל קטן או שניים,<br />
                עם שוקולד באמצע הלילה או סלט ירוק בצהריים.
              </p>
              <p>
                כי מה שהכי משנה זו לא המידה על התווית,<br />
                אלא המידה שבה אנחנו בוחרות להיות טובות לעצמנו.
              </p>
              <p>
                אז כן, לפעמים הג&apos;ינס לא עולה.<br />
                אבל החיוך? הוא תמיד במידה הנכונה.&quot; ✨💜
              </p>
            </blockquote>
            <div className="image-container">
              <img src="https://i.imghippo.com/files/QWFd3072E.jpg" alt="עלייה במשקל ותזונה בגיל המעבר" />
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

