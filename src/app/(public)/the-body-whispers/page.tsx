'use client';

import { useEffect } from 'react';

export default function TheBodyWhispersPage() {
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
    <div className="body-whispers-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="decoration-circle"></div>
        <div className="decoration-circle"></div>
        <div className="container">
          <div className="hero-content">
            <div className="stage-badge">🧏🏻‍♀️ שלב 1 במפה</div>
            <h1>הגוף לוחש – אז בואי נקשיב</h1>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          
          {/* Introduction */}
          <div className="content-card fade-in">
            <p className="lead-text">
              <strong>כי כשמשהו משתנה – הגוף תמיד הראשון לדבר.</strong>
            </p>
            <p>
              השלב הזה מתחיל בלי תופים ובלי צלצולים.
            </p>
            <p>
              לפעמים זה לילה בלי שינה, פתאום חם לך בטירוף, הדופק דופק בלי סיבה, מצב הרוח מתנדנד בלי אזהרה מוקדמת, או את פשוט מרגישה שמישהו הדליק תנור בתוך הגוף שלך...
            </p>
            <p className="emphasis-box">
              ואז מגיע הרגע הזה שאת שואלת את עצמך:<br />
              <em>&quot;רגע… זו אני? זה גיל המעבר? או שאני פשוט מתחרפנת?&quot;</em>
            </p>
            <p>
              <strong>אם הגעת לפה, כנראה שהגוף שלך כבר התחיל ללחוש.</strong><br />
              השאלה היא: האם את מוכנה לעצור לרגע, ולהקשיב לו?
            </p>
          </div>

          {/* What's Happening */}
          <div className="content-card fade-in">
            <h2>מה קורה בשלב הזה?</h2>
            <div className="icon-list">
              <div className="icon-item">
                <span className="icon">🌀</span>
                <p>מתחילים להופיע שינויים פיזיים, לפעמים עוד לפני שהמחזור משתנה.</p>
              </div>
              <div className="icon-item">
                <span className="icon">🌀</span>
                <p>גלי חום, הזעות לילה, יובש כללי, מיחושים למיניהם, עייפות כרונית, רגישות יתר, עצבנות בלי סיבה, חוסר חשק מיני - כל אחת והקוקטייל שלה.</p>
              </div>
              <div className="icon-item">
                <span className="icon">🌀</span>
                <p>הרבה נשים מדווחות על תחושת בלבול, ומנסות להבין - האם זה סטרס? הורמונים? גיל?</p>
              </div>
              <div className="icon-item">
                <span className="icon">🌀</span>
                <p>וזה הרגע שבו נשים רבות שומעות לראשונה את המושג: <strong>&quot;פרי-מנופאוזה&quot;</strong> (כן, יש שלב לפני השלבים…)</p>
              </div>
            </div>
          </div>

          {/* What To Do */}
          <div className="content-card fade-in">
            <h2>אז מה את עושה עם זה?</h2>
            <div className="checklist">
              <div className="check-item">
                <span className="check-icon">📌</span>
                <div>
                  <strong>מקשיבה.</strong> לא מדחיקה. הגוף הוא לא אויב, הוא מערכת התראה חכמה.
                </div>
              </div>
              <div className="check-item">
                <span className="check-icon">📌</span>
                <div>
                  <strong>פונה לרופא/ת נשים</strong> - מבקשות בדיקות דם להורמונים (FSH, אסטרדיול ועוד).
                </div>
              </div>
              <div className="check-item">
                <span className="check-icon">📌</span>
                <div>
                  <strong>מנהלת יומן סימפטומים</strong> - תיעוד יומי פשוט יכול לעזור לגלות תבניות.
                </div>
              </div>
              <div className="check-item">
                <span className="check-icon">📌</span>
                <div>
                  <strong>מחפשת תמיכה</strong> - רפואית, רגשית, נשית. אין סיבה לעבור את זה לבד.
                </div>
              </div>
              <div className="check-item">
                <span className="check-icon">📌</span>
                <div>
                  <strong>בוחרת להבין, לא לפחד.</strong> ידע זה כוח. בטח בגיל הזה.
                </div>
              </div>
            </div>
          </div>

          {/* Knowledge Section - Part 1 */}
          <div className="content-card fade-in knowledge-card">
            <h2>ידע בגובה העיניים - מה קורה לי בגוף?</h2>
            <p className="intro-text">
              <strong>את לא לבד, ואת לא משתגעת.</strong><br />
              זה החלק שיעשה לך סדר: מה באמת קורה בגוף שלך? מה נורמלי, מתי לפנות לרופא, ואיך נשים אחרות מתמודדות עם זה.
            </p>
            
            <div className="image-container">
              <img src="https://i.imghippo.com/files/wKjX4873aY.jpg" alt="ידע בגובה העיניים" />
              <p className="image-caption">
                &quot;גיל המעבר אינו סוף הנעורים, זוהי<br />
                תחילתה של חוכמה מתוך גופך&quot;
              </p>
            </div>

            <p className="section-intro">
              במקום לשקוע באינסוף מאמרים מבלבלים, ריכזתי עבורך את המידע הכי חשוב, הכי ברור, והכי בגובה העיניים.
            </p>

            <h3 id="key-topics">✨ הנושאים המרכזיים:</h3>
            <p className="subtitle-small">[כל נושא הוא קישור לדף ייעודי ממוקד]</p>

            <div className="topics-table">
              <div className="topic-row">
                <div className="topic-title">
                  <span className="topic-icon">❓</span>
                  <span className="topic-text">מה עובר עליי בעצם?</span>
                </div>
                <div className="topic-desc">סקירה ברורה של כל התסמינים האפשריים. מגלי חום ועד ערפל מוחי, יובש בנרתיק, דפיקות לב, כאבי מפרקים ועוד. למה זה קורה, ומתי כדאי לבדוק.</div>
              </div>
              <a href="/heat-waves" id="heat-waves" className="topic-row">
                <div className="topic-title">
                  <span className="topic-icon">🔥</span>
                  <span className="topic-text">גלי חום והזעות לילה</span>
                </div>
                <div className="topic-desc">העמקה על אחד התסמינים הכי מזוהים עם גיל המעבר, ואיזה פתרונות באמת עובדים (כולל טבעיים).</div>
              </a>
              <a href="/menopausal-sleep" id="menopausal-sleep" className="topic-row">
                <div className="topic-title">
                  <span className="topic-icon">💤</span>
                  <span className="topic-text">שינה בגיל המעבר</span>
                </div>
                <div className="topic-desc">מה קורה להורמונים בלילה, וטיפים אפקטיביים לשינה טובה.</div>
              </a>
              <a href="/weight-gain" id="weight-gain" className="topic-row">
                <div className="topic-title">
                  <span className="topic-icon">⚖️</span>
                  <span className="topic-text">עלייה במשקל ותזונה</span>
                </div>
                <div className="topic-desc">שומן בטני, איך זה קורה גם כשאת לא אוכלת יותר מבעבר, ואיך להתמודד בלי דיאטות קיצון ובלי ייסורי מצפון.</div>
              </a>
              <div className="topic-row">
                <div className="topic-title">
                  <span className="topic-icon">💗</span>
                  <span className="topic-text">ירידה בחשק ובמיניות</span>
                </div>
                <div className="topic-desc">על הגוף המשתנה, תקשורת זוגית, ומה אפשר לעשות.</div>
              </div>
              <div className="topic-row">
                <div className="topic-title">
                  <span className="topic-icon">💊</span>
                  <span className="topic-text">הורמונים - כן או לא?</span>
                </div>
                <div className="topic-desc">הסבר ידידותי על טיפולים הורמונליים, תחליפים טבעיים והחלטות מושכלות.</div>
              </div>
              <a href="/physical-activity" style={{textDecoration: 'none', color: 'inherit'}}>
                <div className="topic-row">
                  <div className="topic-title">
                    <span className="topic-icon">🧘</span>
                    <span className="topic-text">פעילות גופנית</span>
                  </div>
                  <div className="topic-desc">מה עוזר לשמור על אנרגיה ואיזון, איך להרגיש חיה שוב, ואיך להתחיל גם אם מעולם לא התאמנת.</div>
                </div>
              </a>
            </div>

            <p className="note">💡 לכל נושא תמצאי דף ידע ממוקד עם סיכום + טיפים + המלצות באהבה.</p>
          </div>

          {/* Tools Section */}
          <div className="content-card fade-in tools-card">
            <h2><span className="emoji-icon">🧰</span><span className="text-content">ארגז הכלים שלך</span></h2>
            <p>כלים שיכולים לחולל שינוי אמיתי - גם אם תתחילי ממש בקטן:</p>
            
            <div className="tool-item">
              <div className="tool-icon">🧘</div>
              <div className="tool-content">
                <h4>נשימת 4-4-8</h4>
                <p>שאיפה 4 שניות, החזקת אוויר 4 שניות, נשיפה איטית 8 שניות. מאזנת את מערכת העצבים הסימפתטית. תרגול יומי לפני השינה.</p>
              </div>
            </div>

            <div className="tool-item">
              <div className="tool-icon">🥗</div>
              <div className="tool-content">
                <h4>חזרה על מנטרה תוך כדי אכילה</h4>
                <p>&quot;אני מזינה את עצמי באהבה&quot;. עוזר להכניס תודעה חיובית בזמן הכי גופני שיש.</p>
              </div>
            </div>

            <div className="tool-item">
              <div className="tool-icon">✍️</div>
              <div className="tool-content">
                <h4>מיפוי תחושות הגוף</h4>
                <p>בכל ערב, חשבי על 3 מקומות בגוף שדרשו תשומת לב ומה הן ניסו להגיד לך.</p>
              </div>
            </div>

            <div className="tool-item">
              <div className="tool-icon">💤</div>
              <div className="tool-content">
                <h4>הרגלי שינה מדויקים</h4>
                <p>שעות קבועות, שעת סיום אוכל, אור עמום. להחזיר את הגוף לטבע.</p>
              </div>
            </div>

            <div className="cta-box">
              <p>💡 בחרי כלי אחד שמדבר אליך.<br />
              נסי אותו במשך שבוע, וכתבי ביומן שלך: <strong>מה השתנה לי בגוף?</strong></p>
            </div>
          </div>

          {/* Self Awareness Exercises */}
          <div className="content-card fade-in exercises-card">
            <div className="image-container">
              <img src="https://i.imghippo.com/files/INO9454WNk.jpg" alt="תרגילי מודעות עצמית" />
              <p className="image-caption">
                &quot;אני מקשיבה באהבה למסרים של גופי&quot;
              </p>
            </div>

            <h2><span className="emoji-icon">💡</span><span className="text-content">תרגילי מודעות עצמית:</span></h2>

            <div className="exercise">
              <h3><span className="emoji-icon">✨</span><span className="text-content">יומן אישי</span></h3>
              <p>נסי לכתוב במשך שבוע כל ערב <strong>3 תחושות פיזיות</strong> שחווית באותו יום.</p>
              <p>לא לנתח, לא לשפוט. רק לתעד.</p>
              <p>בסוף השבוע, התבונני על מה חוזר על עצמו. זה הרמז שלך להתחלה חדשה.</p>
              <p><em>רצוי לנהל יומן תסמינים שישמש אותך בביקורייך במרפאה.</em></p>
              <div className="journal-link">
                📔 <strong>יומן המנופאוזית המתחילה</strong> - יומן אישי להדפסה שילווה אותך לאורך כל התחנות במסע שלך <span className="coming-soon">**נעלה את היומן בהמשך</span>
              </div>
            </div>

            <div className="exercise">
              <h3><span className="emoji-icon">✨</span><span className="text-content">מכתב פיוס לגוף</span></h3>
              <p>כתבי מכתב לגוף שלך. כתבי לו סליחה. תודה. הכרה.</p>
              <p>אל תתייפיפי. תהי כנה. כמו לחברה הכי טובה שלא הערכת מספיק.</p>
              
              <div className="example-box">
                <p className="example-label">✍️ דוגמה לפתיחה:</p>
                <blockquote>
                  &quot;גוף יקר שלי,<br />
                  שנים נלחמתי בך.<br />
                  משכתי, כיווצתי, הסתרתי, שפטתי.<br />
                  אבל אתה נשאת אותי באהבה.<br />
                  מעכשיו, אני רוצה שנשתף פעולה. לא אהיה אויבת שלך יותר.&quot;
                </blockquote>
              </div>
            </div>

            <div className="exercise">
              <h3><span className="emoji-icon">✨</span><span className="text-content">סטיילינג בגיל המעבר – לבוש ככלי טיפולי</span></h3>
              <p className="intro">👗 <strong>לבוש הוא שפה.</strong><br />
              לא מדובר ב &quot;להחמיא לגוף&quot; אלא להביע את מי שאת עכשיו.</p>
              
              <ul className="styled-list">
                <li><strong>הגדרה עצמית מחדש</strong> – עשי לעצמך לוח השראה (פינטרסט, מגזין, גזירות) עם דמויות נשיות שאת אוהבת את האנרגיה שהן משדרות. שימי לב: לא הגוף שלהן – האנרגיה!</li>
                <li>בחרי <strong>3 מילים</strong> שאת רוצה שהסגנון שלך יביע (למשל: קלילה, אותנטית, שובבה / רגועה, נשית, מתוחכמת)</li>
                <li><strong>בגדי חופש בקיץ</strong>: בדים טבעיים, גזרות נושמות, צבעים שמרימים לך את מצב הרוח. נוחות זה לא ויתור – זו הכרזה על שלום.</li>
                <li>התייעצי עם נשים שאת סומכת על הטעם שלהן – אבל תשאירי את המילה האחרונה לעצמך. כולל בנותייך המתבגרות… לפעמים יש להן עין חדה אבל הן לא יודעות מה מרגיש לך נכון.</li>
              </ul>
            </div>

            <div className="exercise">
              <h3>✨ להתחיל לזוז – מתוך אהבה, לא מתוך מלחמה</h3>
              <p>תנועה יכולה להיות הדרך שבה אנחנו שומעות את הנשמה דרך הגוף.</p>
              <p><strong>אל תתחילי עם &quot;כושר&quot;. תתחילי עם &quot;תנועה&quot;.</strong></p>
              <p>תנועה שאת אוהבת. שאת זוכרת. כמו ריקוד.</p>
              <p>אם תמיד אהבת לרקוד - ריקדי.<br />
              בחדר, לבד, עם מוזיקה שמזיזה לך את הלב.<br />
              לא כדי לרדת במשקל. כדי לעלות בתדר.</p>
            </div>

            <div className="wisdom-box">
              <p>
                ✨ <strong>בכל תא בגופך יש תודעה שמקשיבה למה שאת אומרת עליו.</strong><br />
                אז תדברי אליו יפה.<br />
                לא כי הוא מושלם, אלא כי הוא שותף למסע הזה.<br />
                כי הוא אוהב אותך גם כשאת לא אוהבת אותו.<br />
                וכי הוא לא יישאר כאן לנצח.<br />
                <strong>אז אולי כדאי שנתיידד לפני שיהיה מאוחר.</strong>
              </p>
            </div>
          </div>

          {/* Video Section */}
          <div className="content-card fade-in video-card">
            <h2>🎧 רוצה רגע לצחוק על זה ביחד?</h2>
            <p>לחצי כאן לסרטון קצר של עליזה שנקין. <span className="coming-soon">**ניצור בהמשך סרטון - &quot;מה לעזאזל קורה לי בגוף??&quot;</span></p>
            <p className="video-subtitle">🎥 מתוך סדרת &quot;המנופאוזית מדברת&quot; - ליווי נשי בגובה העיניים לכל שלב במפת הדרכים.</p>
            
            <div className="quote-box">
              <p className="quote-title">🎭 עליזה שנקין מספרת:</p>
              <blockquote>
                &quot;הגוף שלי התחיל לדבר איתי.<br />
                בהתחלה זה היה רמזים.<br />
                אחר כך לחישות.<br />
                ואז הוא התחיל לצעוק:<br />
                &apos;הלו? מישהי בבית?<br />
                חם לי!! תכבו ת&apos;תנור!!!&apos;&quot;
              </blockquote>
            </div>

            <p className="humor-text">
              כמו שאת רואה, <strong>האסטרטגיה המובילה בעיני היא צחוק.</strong><br />
              הומור הוא המפתח! זכרי, כולנו באותה סירה (או יותר נכון, באותו תנור). אז במקום להילחץ, בואי ניקח נשימה עמוקה, נחייך, ואולי אפילו נצחק על המצב.
            </p>
            <p>
              גיל המעבר הוא לא סוף העולם, הוא רק תקופה חמה (תרתי משמע) בחיים שלנו. עם קצת הומור, תמיכה, ואולי מאוורר נייד קטן, נעבור את זה בשלום ונצא מחוזקות לשלב הבא!
            </p>
          </div>

          {/* Wisdom Card */}
          <div className="content-card fade-in wisdom-card">
            <p className="lead-text">
              זה לא שהגוף בוגד בך. הוא פשוט משתנה. והוא מבקש שתשתני יחד איתו.
            </p>
            <p>
              שתהיי החברה הטובה שלא שופטת, לא נוזפת.<br />
              פשוט מקשיבה.
            </p>
            
            <div className="personal-story">
              <h3>מה גיליתי על עצמי מאז שהתחלתי להקשיב?</h3>
              <p>
                גיליתי שהגוף שלי הרבה יותר חכם ממה שחשבתי.<br />
                שהוא מסמן לי בדיוק מה הוא צריך.<br />
                רק הייתי צריכה ללמוד להקשיב, להבין, ולהפסיק להתנגד.
              </p>
            </div>
          </div>

          {/* Resources Section */}
          <div className="content-card fade-in resources-card">
            <h2>רוצה להעמיק?</h2>
            <p>קראי עוד מאמרים באתר.</p>
            
            <ul className="resources-list">
              <li>צפי בסרטון: &quot;10 סימנים שאת בפרי-מנופאוזה – ואיך לזהות אותם בגוף שלך&quot; <span className="coming-soon">**ניצור בהמשך</span></li>
              <li>[להוסיף איור של גוף אישה שכל איבר - mouse over יפתח תווית עם הסבר לסימפטום אופייני לאיבר…]</li>
              <li>[להוסיף קישור למאמר רלוונטי באתר שלי שכבר כתבתי] <span className="coming-soon">**נוסיף בהמשך</span></li>
            </ul>
          </div>

          {/* Downloads Section */}
          <div className="content-card fade-in downloads-card">
            <h2>📦 קישורים לדברים טובים:</h2>
            <p className="coming-soon-note">**הדפים עוד לא נבנו, נקשר אותם בהמשך</p>
            
            <ul className="download-list">
              <li>📝 טבלת מעקב סימפטומים (PDF) להורדה</li>
              <li>🔄 יומן מעקב יומי למנופאוזית המתחילה</li>
              <li>🎧 פרק פודקאסט מומלץ: &quot;הגוף שלי ואני - הסכם שלום&quot; (מגיע בקרוב…)</li>
              <li>📔 יומן המנופאוזית המתחילה - יומן אישי להדפסה שילווה אותך לאורך כל התחנות במסע שלך</li>
            </ul>
          </div>

          {/* Next Steps */}
          <div className="content-card fade-in next-steps-card">
            <h2>👣 מה השלב הבא במפת הדרכים?</h2>
            <p>
              כשהגוף מתחיל ללחוש, לפעמים הנפש לוחשת גם.<br />
              אם את כבר שואלת שאלות על יציבות, ביטחון ותמיכה, אולי הגיע הזמן לעלות לשלב הבא במפת הדרכים.
            </p>
            <p className="highlight">וודאות, שקט, ביטחון - בואי נבין מה את צריכה באמת.</p>
            
            <div className="button-group">
              <a href="/certainty-peace-security" className="cta-button">
                שלב 2 במפת דרכים
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
