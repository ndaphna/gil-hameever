'use client';
import { useEffect } from 'react';

export default function HormonesPage() {
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
    <div className="hormones-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="decoration-circle"></div>
        <div className="decoration-circle"></div>
        <div className="container">
          <div className="hero-content">
            <div className="stage-badge">💊 הורמונים - כן או לא</div>
            <h1>הורמונים - כן או לא</h1>
            <p className="subtitle">המדריך המעשי לקבלת החלטה מושכלת</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          
          {/* Introduction */}
          <div className="content-card fade-in">
            <p className="intro-text">
              <strong>אם גם את מרגישה שהמילה &quot;אסטרוגן&quot; מפחידה אותך יותר מ&quot;גל חום&quot;, הגיע הזמן לשיחה פתוחה</strong>
            </p>
            <h3>בואי נשים את זה על השולחן:</h3>
            <p>
              נראה שכל מי שחוותה תסמיני גיל מעבר קיבלה את השאלה הזו לפחות פעם אחת (ולפעמים עם הרמת גבה):
            </p>
            <p className="highlight-text">
              &quot;נו... ניסית הורמונים?&quot;
            </p>
            <p>
              הנושא הזה עטוף בבלבול, מיתוסים, פחדים – והרבה מאוד גוגל.
            </p>
            <p>
              <strong>אז רגע לפני שמחליטות – בואי נעשה סדר בגובה העיניים.</strong>
            </p>
          </div>

          {/* What is HRT */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">💊</span><span className="text-content">קודם כל – מה זה בכלל טיפול הורמונלי?</span></h2>
            <p>
              <strong>טיפול הורמונלי (HRT = Hormone Replacement Therapy)</strong> הוא מתן של הורמונים, בעיקר אסטרוגן ולעיתים גם פרוגסטרון וטסטוסטרון, כדי לאזן את הגוף בתקופת המעבר.
            </p>
            <p><strong>יש מגוון סוגים:</strong></p>
            <ul className="styled-list">
              <li>כדורים</li>
              <li>מדבקות</li>
              <li>ג&apos;לים</li>
              <li>נרות / קרמים נרתיקיים</li>
              <li>זריקות או טבעות</li>
            </ul>
          </div>

          {/* Who Is It For */}
          <div className="content-card fade-in">
            <h3><span className="emoji-icon">🤔</span><span className="text-content">למי זה מתאים?</span></h3>
            <div className="icon-list">
              <div className="icon-item">
                <span className="icon">🔥</span>
                <div>
                  <strong>נשים שחוות תסמינים פיזיים קשים:</strong> גלי חום קשים, הפרעות שינה קשות, יובש קשה, עייפות כרונית.
                </div>
              </div>
              <div className="icon-item">
                <span className="icon">🩺</span>
                <div>
                  <strong>נשים בריאות ללא היסטוריה של סרטן שד/קרישי דם/מחלות כבד</strong> (יש יוצאות דופן, תמיד לבדוק עם רופא/ה).
                </div>
              </div>
              <div className="icon-item">
                <span className="icon">📅</span>
                <div>
                  <strong>נשים בתחילת גיל המעבר</strong> (לרוב עד גיל 60 או עד 10 שנים מהמחזור האחרון).
                </div>
              </div>
            </div>
          </div>

          {/* Pros and Cons Table */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">⚖️</span><span className="text-content">יתרונות מול חסרונות בקצרה:</span></h2>
            <table className="activity-table">
              <thead>
                <tr>
                  <th>✔️ יתרונות</th>
                  <th>⚠️ סיכונים / שיקולים</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>מפחית גלי חום, הזעות לילה, נדודי שינה</td>
                  <td>עלול להעלות סיכון לסרטן שד (בעיקר בטיפול משולב אסטרוגן+פרוגסטרון לאורך זמן)</td>
                </tr>
                <tr>
                  <td>משפר מצב רוח וחשק מיני</td>
                  <td>אינו מומלץ לנשים עם קרישיות יתר, היסטוריה משפחתית בעייתית</td>
                </tr>
                <tr>
                  <td>מגן על העצמות ומפחית אוסטיאופורוזיס</td>
                  <td>דורש מעקב רפואי צמוד ובחירה נכונה של מינון וסוג</td>
                </tr>
                <tr>
                  <td>משפר איכות חיים כללית והרגשה כללית</td>
                  <td>לא תמיד מתאים, ולעיתים יש תופעות לוואי בתחילת הדרך</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Natural Alternatives */}
          <div className="content-card fade-in">
            <h3><span className="emoji-icon">🌿</span><span className="text-content">ומה לגבי חלופות טבעיות?</span></h3>
            <div className="icon-list">
              <div className="icon-item">
                <span className="icon">🌱</span>
                <div>
                  <strong>פיטואסטרוגנים</strong> - תמציות צמחים כמו קוהוש שחור, מרווה רפואית, סויה – חלק מהנשים מדווחות על שיפור.
                </div>
              </div>
              <div className="icon-item">
                <span className="icon">💊</span>
                <div>
                  <strong>תוספי תזונה</strong> - מגנזיום, ויטמין D, אומגה 3 – לפי צורך אישי.
                </div>
              </div>
              <div className="icon-item">
                <span className="icon">🏃‍♀️</span>
                <div>
                  <strong>שינויים באורח חיים</strong> – לעיתים משפיעים לא פחות מטיפול תרופתי.
                </div>
              </div>
            </div>
            <p className="highlight-box">
              ⚠️ <strong>גם לטיפולים טבעיים יש השפעה ביולוגית.</strong> חשוב להתייעץ עם רופא/ה או נטורופת מוסמך/ת.
            </p>
          </div>

          {/* Questions to Ask */}
          <div className="content-card important-card fade-in">
            <h3><span className="emoji-icon">💬</span><span className="text-content">שאלות שכדאי לשאול את הרופא/ה:</span></h3>
            <div className="checklist">
              <div className="check-item">
                <span className="check-icon">❓</span>
                <div>
                  האם אני מתאימה לטיפול הורמונלי?
                </div>
              </div>
              <div className="check-item">
                <span className="check-icon">❓</span>
                <div>
                  אילו סוגי טיפול קיימים? ומה ההבדל ביניהם?
                </div>
              </div>
              <div className="check-item">
                <span className="check-icon">❓</span>
                <div>
                  מה הסיכונים עבורי לפי ההיסטוריה הרפואית שלי?
                </div>
              </div>
              <div className="check-item">
                <span className="check-icon">❓</span>
                <div>
                  תוך כמה זמן אראה שיפור? מה תופעות הלוואי האפשריות?
                </div>
              </div>
            </div>
          </div>

          {/* Remember */}
          <div className="content-card fade-in">
            <h3><span className="emoji-icon">💡</span><span className="text-content">חשוב לזכור:</span></h3>
            <ul className="styled-list">
              <li>זה לא או &quot;כן הורמונים&quot; או &quot;לא&quot;. יש קשת רחבה של אפשרויות, ועליך לבדוק, לשנות, להתלבט.</li>
              <li>מה שמתאים לחברה שלך – לא בהכרח יתאים לך.</li>
              <li>הכי חשוב – לא לוותר על איכות החיים שלך בגלל פחדים מיושנים.</li>
            </ul>
          </div>

          {/* Downloads */}
          <div className="content-card downloads-card fade-in" style={{ display: 'none' }}>
            <h2><span className="emoji-icon">📥</span><span className="text-content">רוצה להבין לעומק?</span></h2>
            <ul className="download-list">
              <li>📄 PDF: &quot;10 מיתוסים על טיפול הורמונלי – והאמת מאחוריהם&quot;</li>
              <li>📊 טבלת השוואה בין סוגי הטיפול – היתרונות והחסרונות</li>
              <li>🎥 סרטון קצר: &quot;הורמונים – איך לבחור נכון? דפנה שואלת, רופאה עונה&quot;</li>
              <li>🛍️ מוצרים ומאמרים</li>
            </ul>
          </div>

          {/* Aliza's Story */}
          <div className="content-card story-card fade-in">
            <h2><span className="emoji-icon">💬</span><span className="text-content">עליזה שנקין על הורמונים</span></h2>
            <p className="intro-text">
              וכמובן שעליזה לא תפספס הזדמנות להגיב לנושא כזה רגיש ומעורר פחדים 😉
            </p>
            <blockquote className="quote-box">
              <p>
                &quot;תשמעי, כל פעם שמישהו שואל אותי &apos;נו, את לוקחת הורמונים?&apos; – אני מרגישה כאילו הציעו לי להצטרף לכת סודית.
              </p>
              <p>
                הם לוחשים את זה כאילו מדובר במשהו לא חוקי…
              </p>
              <p>
                האמת? בהתחלה פחדתי מהמילה &apos;אסטרוגן&apos; יותר ממה שפחדתי מהגלי חום עצמם.
              </p>
              <p>
                אבל אחרי לילה של חמישה סיבובים עם השמיכה (פעם עליי, פעם ברצפה), החלטתי שעדיף לברר מאשר לסבול.
              </p>
              <p>
                אז כן – יש מי שזה מתאים לה, יש מי שלא.
              </p>
              <p>
                מה שבטוח – זה לא משחק של כן/לא, זה יותר כמו לבחור תוכנית נטפליקס: צריך לנסות להבין מה עובד בשבילך.
              </p>
              <p>
                ובסוף – אנחנו ביחד בזה.<br />
                עם ההורמונים, בלי ההורמונים, עם תה מרווה או עם מדבקה על הירך.
              </p>
              <p>
                מה שחשוב זה לא אם את &apos;לוקחת&apos; או &apos;לא לוקחת&apos; –<br />
                אלא אם את חיה טוב יותר, ישנה טוב יותר, ומרגישה את עצמך בחזרה.&quot; ✨
              </p>
            </blockquote>
            <div className="image-container">
              <img src="https://i.imghippo.com/files/JTq7019jgE.jpg" alt="הורמונים - כן או לא" />
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

