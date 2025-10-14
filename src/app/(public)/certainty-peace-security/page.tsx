'use client';

import { useEffect } from 'react';

export default function CertaintyPeaceSecurityPage() {
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
    <div className="certainty-peace-security-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="decoration-circle"></div>
        <div className="decoration-circle"></div>
        <div className="container">
          <div className="hero-content">
            <div className="stage-badge">🌳 שלב 2 במפה</div>
            <h1>וודאות, שקט, ביטחון</h1>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          
          {/* Introduction */}
          <div className="content-card fade-in">
            <h2>הנפש מתחילה ללחוש</h2>
            <p>אחרי שהבנת ש&quot;משהו קורה&quot; בגוף, מגיע השלב הבא:</p>
            <p>הבלבול נרגע קצת, אבל מתחיל רעש חדש – בתוכך.</p>
            <p>פתאום את פחות סבלנית. יותר עצבנית ודאגנית.</p>
            <p>יש ימים שאת מרגישה שאת בקצה של קצה היכולת הרגשית שלך,<br />
            ואם מישהו עוד ישאל &quot;הכול בסדר?&quot; את עלולה לפרוץ בבכי, או בצעקה. או גם וגם.</p>
            
            <p className="emphasis-box">
              <strong>ברוכה הבאה לשלב שבו צרכי הביטחון עולים אל פני השטח:</strong><br />
              רצון ליציבות. וודאות. גבולות. אוויר.<br />
              את צריכה שישמרו גם עלייך, לא רק את על כולם.
            </p>
            
            <p>השלב השני במפת הדרכים, מדבר על הנפש ועל הצורך בביטחון ובשקט נפשי. כאן עולה השאלה - עם כל השינויים והסערות, איך אני חוזרת להרגיש אני?</p>
          </div>

          {/* What's Happening */}
          <div className="content-card fade-in">
            <h2>מה קורה בשלב הזה?</h2>
            <div className="icon-list">
              <div className="icon-item">
                <span className="icon">🌀</span>
                <p>תחושת חוסר שקט גוברת – גם כשאין סיבה ברורה.</p>
              </div>
              <div className="icon-item">
                <span className="icon">🌀</span>
                <p>עייפות רגשית, רגישות יתר, צורך בזמן לבד.</p>
              </div>
              <div className="icon-item">
                <span className="icon">🌀</span>
                <p>דאגנות – פתאום את ערה בלילה עם מחשבות על הילדים, ההורים, העתיד.</p>
              </div>
              <div className="icon-item">
                <span className="icon">🌀</span>
                <p>קושי להציב גבולות – את נותנת מעצמך, מתרוקנת… ואז מתעצבנת.</p>
              </div>
              <div className="icon-item">
                <span className="icon">🌀</span>
                <p>פחד לא מוסבר – ממחלה, מנטישה, מכישלון. כאילו הקרקע קצת זזה.</p>
              </div>
            </div>

            <div className="quote-box">
              <p className="quote-title">🎭 עליזה שנקין משתפת:</p>
              <blockquote>
                &quot;הייתה לי תקופה שהייתי מתעוררת באמצע הלילה כי חלמתי ששכחתי משהו... לא ידעתי מה. אולי את עצמי?&quot;
              </blockquote>
            </div>
          </div>

          {/* What To Do */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🛠️</span><span className="text-content">אז מה את עושה עם זה?</span></h2>
            <div className="checklist">
              <div className="check-item">
                <span className="check-icon">📌</span>
                <div>קודם כל מזהה – את לא &quot;דרמה קווין&quot;, את מחפשת איזון מחדש.</div>
              </div>
              <div className="check-item">
                <span className="check-icon">📌</span>
                <div>שמה לב מתי הגוף מגיב (דופק, בכי, צעקה) לפני שהראש מבין.</div>
              </div>
              <div className="check-item">
                <span className="check-icon">📌</span>
                <div>מתחילה לבנות מרחב בטוח: שגרה, הגדרות, שקט – ולא מתנצלת על זה.</div>
              </div>
              <div className="check-item">
                <span className="check-icon">📌</span>
                <div>בודקת – מה גורם לי להרגיש בטוחה? ומה מדליק לי את מערכת האזעקה?</div>
              </div>
            </div>
          </div>

          {/* Knowledge Section */}
          <div className="content-card fade-in knowledge-card">
            <h2><span className="emoji-icon">🔬</span><span className="text-content">ידע בגובה העיניים – על ויסות, גבולות, וחרדה שקטה</span></h2>
            
            <div className="topics-table">
              <div className="topic-row">
                <div className="topic-title">
                  <span className="topic-icon">⚠️</span>
                  <span className="topic-text">מה זה בכלל &quot;וויסות רגשי&quot;?</span>
                </div>
                <div className="topic-desc">הסבר פשוט על המערכת הסימפתטית, והקשר בין הורמונים לרגש.</div>
              </div>
              <div className="topic-row">
                <div className="topic-title">
                  <span className="topic-icon">🧯</span>
                  <span className="topic-text">התקפי חרדה קלים או פתאומיים</span>
                </div>
                <div className="topic-desc">למה הם מופיעים דווקא עכשיו, ואיך להוריד מהם את העוקץ.</div>
              </div>
              <div className="topic-row">
                <div className="topic-title">
                  <span className="topic-icon">🧍‍♀️</span>
                  <span className="topic-text">להציב גבולות – בלי רגשות אשם</span>
                </div>
                <div className="topic-desc">איך לזהות מתי את אומרת &quot;כן&quot; כשבא לך להגיד &quot;לא&quot;, ואיך לתקן את זה.</div>
              </div>
              <div className="topic-row">
                <div className="topic-title">
                  <span className="topic-icon">📆</span>
                  <span className="topic-text">בניית שגרה בטוחה</span>
                </div>
                <div className="topic-desc">למה ריטואלים קטנים הם עוגן רגשי, ואיך ליצור כאלה שמתאימים לך.</div>
              </div>
              <div className="topic-row">
                <div className="topic-title">
                  <span className="topic-icon">🔄</span>
                  <span className="topic-text">המעבר מאימפולסיביות לרוגע</span>
                </div>
                <div className="topic-desc">כלים קטנים לשים שנייה בין הגירוי לתגובה. זה כל ההבדל.</div>
              </div>
            </div>
          </div>

          {/* Self Questions */}
          <div className="content-card fade-in questions-card">
            <h2><span className="emoji-icon">🧠</span><span className="text-content">שאלות לעצמך (בלי פילטרים):</span></h2>
            <p className="intro-text">📝 כתבי ביומן, בנייד, או סתם בלב. העיקר שתהיי כנה.</p>
            
            <ul className="questions-list">
              <li>מתי בפעם האחרונה הרגשתי אני?</li>
              <li>אילו תכונות בי אני הכי מתגעגעת אליהן?</li>
              <li>באיזו סיטואציה לאחרונה נעלמתי לעצמי? ואיפה דווקא הצלחתי לצוץ מחדש?</li>
              <li>אם הייתי פוגשת את עצמי בגיל 30, מה הייתי רוצה להגיד לה?</li>
            </ul>

            <div className="exercise-box">
              <p><strong>📝 כל ערב, לפני השינה</strong> – רשמי שלושה רגעים שבהם הרגשת חוסר שקט. וליד כל אחד, נסי לנסח מה היית רוצה שיקרה במקום.</p>
              <p className="highlight">כשתסיימי – קראי את הרשימה שלך. היא המפה לצרכים שלך.</p>
            </div>
          </div>

          {/* Self Awareness Exercises */}
          <div className="content-card fade-in exercises-card">
            <h2><span className="emoji-icon">💡</span><span className="text-content">תרגילי מודעות עצמית:</span></h2>

            <div className="exercise">
              <h3><span className="emoji-icon">✨</span><span className="text-content">לשהות עם התחושה</span></h3>
              <p>לא לברוח.<br />
              לא לחפש הסחות.<br />
              לשבת רגע. לנשום לתוך מה שיש.<br />
              ולשאול:<br />
              <strong>&quot;מה באת ללמד אותי?&quot;</strong></p>
              <p><em>נשימה אחת, מבט אחד פנימה, ואת כבר צעד קדימה.</em></p>
            </div>

            <div className="exercise">
              <h3><span className="emoji-icon">✨</span><span className="text-content">להעז להיות פגיעה זה האומץ האמיתי</span></h3>
              <p>כתבי לעצמך בכל יום משפט אחד אמיתי, חשוף, קטן:</p>
              <ul className="examples-list">
                <li>&quot;אני עייפה מלהיות חזקה.&quot;</li>
                <li>&quot;היום הרגשתי לא שייכת.&quot;</li>
                <li>&quot;אני לא בטוחה בעצמי.&quot;</li>
              </ul>
              <p><strong>וכשזה יוצא, פתאום זה קטן יותר. פחות שולט בך.</strong></p>
            </div>

            <div className="exercise">
              <h3><span className="emoji-icon">✨</span><span className="text-content">מילים הן לחש קסמים</span></h3>
              <p>כל מילה שאת אומרת לעצמך היא כמו לחש. בחרי אותן בזהירות.</p>
              <p>שימי לב לדיבור הפנימי שלך.</p>
              <div className="comparison-box">
                <p><strong>במקום:</strong> &quot;אני על הפנים&quot;,<br />
                <strong>תגידי:</strong> &quot;אני בתהליך של חזרה לעצמי.&quot;</p>
                <p><strong>ובמקום:</strong> &quot;עבר זמני&quot;,<br />
                <strong>תגידי:</strong> &quot;העונה משתנה אבל אני עדיין בפרק המרכזי של חיי.&quot;</p>
              </div>
            </div>

            <div className="exercise">
              <h3><span className="emoji-icon">✨</span><span className="text-content">הומור זה טיפול</span></h3>
              <p className="quote-inline">&quot;אם את כבר נשברת, לפחות תעשי מזה סטנדאפ.&quot; - עליזה שנקין</p>
              <p><strong>מה את יכולה לעשות?</strong></p>
              <p>כתבי לעצמך פסקה קטנה בסגנון קטע סטנדאפ:</p>
              <p>על הבכי מהפרסומת בטלוויזיה, על הריב איתו בגלל ההורמונים, על זה שהמראה עושה לך פרצופים.</p>
              <p><strong>כשתתחילי לצחוק על עצמך, תחזרי להרגיש אותך.</strong></p>
            </div>

            <div className="exercise">
              <h3><span className="emoji-icon">✨</span><span className="text-content">&quot;מכתב לעצמי כשאני נעלמת&quot;</span></h3>
              <p>כתבי משפט פתיחה כמו:</p>
              <div className="example-box">
                <blockquote>
                  &quot;אהובה שלי, אני יודעת שאת מרגישה עכשיו מרחפת, שקופה, זרה לעצמך…&quot;
                </blockquote>
              </div>
              <p>והמשיכי משם כמו לחברה הכי טובה.</p>
              <p>חמלה, הבנה, אולי אפילו קצת צחוק עצמי – זה החומר שמרפא.</p>
            </div>

            <div className="exercise">
              <h3><span className="emoji-icon">✨</span><span className="text-content">״לְרַכֵּךְ את המבט, לְרַפֵּא את הסיפור״</span></h3>
              <p className="subtitle-text">מה אני רואה – או מה אני בוחרת לראות?</p>
              
              <div className="wisdom-box">
                <p><strong>השראה מרנה בראון:</strong></p>
                <p>&quot;הבושה חיה בשקט. היא אוהבת סודיות. אבל כשאנחנו נותנות לה שם ומביאות אותה לאור, היא מאבדת מכוחה.&quot;</p>
              </div>

              <p><strong>שאלי את עצמך:</strong></p>
              <ul className="questions-list">
                <li>כשאני עומדת מול המראה – מה המילים הראשונות שעולות לי בראש?</li>
                <li>של מי הקול שאני שומעת? שלי, או של מישהי שפעם אמרה לי משהו שהאמנתי לו יותר מדי?</li>
              </ul>

              <div className="practice-box">
                <p><strong>תרגול:</strong></p>
                <p>עמדי מול מראה, הביטי בעצמך בעיניים, ובלי לגעת בפגמים – תני לעצמך שלוש מחמאות שלא קשורות למראה החיצוני.</p>
                <p><strong>לדוגמה:</strong></p>
                <ul className="examples-list">
                  <li>&quot;את מתמודדת כל כך יפה עם החיים&quot;,</li>
                  <li>&quot;אני רואה אותך. את אמיצה&quot;,</li>
                  <li>&quot;אני גאה בדרך שעשית&quot;.</li>
                </ul>
                <p className="practice-note">עשי את זה מדי יום – כמו לצחצח שיניים. אבל לנשמה.</p>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="content-card fade-in insights-card">
            <h2><span className="emoji-icon">🌱</span><span className="text-content">תובנות:</span></h2>
            <p className="lead-text">את לא לבד.</p>
            <p>התחושות שאת חווה – הן לא סוף הסיפור. הן רק דף אמצע.</p>
            <p><strong>את נולדת מחדש, גם אם זה מרגיש בינתיים כמו בלאגן.</strong></p>
          </div>

          {/* Downloads Section */}
          <div className="content-card fade-in downloads-card">
            <h2><span className="emoji-icon">📦</span><span className="text-content">קישורים לדברים טובים:</span></h2>
            
            <ul className="download-list">
              <li>📘 מדריך PDF: &quot;10 סימנים שהנפש שלך מבקשת ביטחון – ומה עושים איתם&quot;</li>
              <li>🧘 הקלטת מדיטציה קצרה: &quot;מרחב בטוח בתוך הראש שלי&quot;</li>
              <li>📥 דף עבודה: &quot;הגבולות שלי – מפת גבולות אישית לתרגול&quot;</li>
            </ul>
          </div>

          {/* Aliza's Story */}
          <div className="content-card fade-in story-card">
            <h2><span className="emoji-icon">😅</span><span className="text-content">ומה יש לעליזה שנקין לומר על שלב הביטחון:</span></h2>
            <div className="story-content">
              <p>&quot;תראי, כשאני הגעתי לשלב הזה, הרגשתי כמו מערכת אזעקה בלי שלט.</p>
              <p>כל דבר קטן היה מפעיל אותי – הילדה לא ענתה, הבעל שכח לקנות חלב, המנהל כתב &apos;אפשר שיחה קצרה?&apos; – ואני כבר מחפשת איפה הממ&quot;ד.</p>
              <p>ואז הבנתי – <strong>אני לא צריכה להיות המאבטחת של כולם 24/7.</strong></p>
              <p>מותר לי גם לבקש שמישהו ישמור עליי.</p>
              <p>אז בניתי לי כללים פשוטים:</p>
              <ul className="simple-rules">
                <li>טלפון על שקט אחרי עשר,</li>
                <li>&apos;לא&apos; חד־משמעי כשאין לי כוח,</li>
                <li>וחיבוק לעצמי במקום אשמה.</li>
              </ul>
              <p>ובסוף – אנחנו ביחד בזה.</p>
              <p>עם הדאגות, עם הצחוקים, עם השיחות ב־3 בלילה מול המקרר.</p>
              <p className="final-thought">כי גם אם הקרקע קצת רועדת – אנחנו יכולות להיות זו הגב של זו.&quot; ✨</p>
            </div>

            <div className="image-container">
              <img src="https://i.imghippo.com/files/ezYp5665IJc.jpg" alt="וודאות שקט ביטחון" />
            </div>
          </div>

          {/* Next Steps */}
          <div className="content-card fade-in next-steps-card">
            <h2><span className="emoji-icon">👣</span><span className="text-content">מה השלב הבא במפת הדרכים?</span></h2>
            <p>סיימת את שלב 2 במסע שלך!</p>
            <p>למדת להקשיב לא רק לגוף, אלא גם לתחושת השקט הפנימית,<br />
            הצבת גבולות, זיהית את הטריגרים שלך, ובנית לעצמך עוגנים קטנים של יציבות.</p>
            <p>כשאת מתחילה להרגיש קצת יותר שקט מבפנים,<br />
            הקול הפנימי שלך מתחיל לבקש שייכות, אחווה, וחיבור רגשי.</p>
            <p className="next-step-text">זה הזמן שלך לעלות לשלב הבא במפת הדרכים.</p>
            <p><strong>רוצה להמשיך לשלב הבא?</strong></p>
            <p>👉 שייכות, אחוות נשים, חיבור רגשי – הגיע הזמן לזוז מהישרדות... לחיבורים.</p>
            
            <div className="button-group">
              <a href="/belonging-sisterhood-emotional-connection" className="cta-button">
                שלב 3 במפת דרכים
              </a>
              <a href="/menopause-roadmap" className="cta-button secondary">
                חזרה למפת הדרכים
              </a>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
