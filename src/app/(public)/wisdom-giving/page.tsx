'use client';

import { useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';

export default function WisdomGivingPage() {
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
    <DashboardLayout>
    <div className="wisdom-giving-page">
      <section className="hero">
        <div className="decoration-circle"></div>
        <div className="decoration-circle"></div>
        <div className="container">
          <div className="hero-content">
            <div className="stage-badge">✨ שלב 5 במפה</div>
            <h1>תבונה ונתינה</h1>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          
          {/* Introduction */}
          <div className="content-card fade-in">
            <p className="intro-text">
              <strong>את כבר לא רק שואלת &quot;מי אני&quot; – את גם עונה, ומשפיעה</strong>
            </p>
            <p>
              בשלבים הקודמים שאלת, הרגשת, חיפשת, חיברת…<br />
              וכשהתשובות מתחילות להגיע – קורה דבר מפתיע:<br />
              את כבר לא עסוקה רק בעצמך.
            </p>
            <p>את מגלה שאת רוצה:</p>
            <ul className="simple-list">
              <li>להעניק מהידע והניסיון שלך</li>
              <li>להשפיע על מישהי אחרת</li>
              <li>להרים אישה שנמצאת איפה שאת היית לפני שנה</li>
              <li>להפוך את מה שעברת – למתנה</li>
            </ul>
            <p className="highlight-text">
              בשלב הזה את כבר לא &quot;רק בתהליך&quot;.<br />
              את מורת דרך בעשייה שלך, בחמלה שלך, בעצם הנוכחות שלך.
            </p>
          </div>

          {/* What's Happening */}
          <div className="content-card fade-in">
            <h3><span className="emoji-icon">🌀</span><span className="text-content">מה קורה בשלב הזה?</span></h3>
            <ul className="styled-list">
              <li>מתבהרת התחושה שצברת תבונה – ושמגיע לה מקום בעולם.</li>
              <li>עולות שאלות כמו: איפה אני יכולה לתרום? למי אני יכולה להעביר את זה הלאה?</li>
              <li>התחושה האישית הופכת לצורך בהשפעה – גם בקנה מידה קטן.</li>
              <li>נולדת מחדש המשמעות – דרך העיניים של אחרות.</li>
            </ul>
          </div>

          {/* What To Do */}
          <div className="content-card fade-in">
            <h3><span className="emoji-icon">🛠️</span><span className="text-content">אז מה את עושה עם זה?</span></h3>
            <ul className="styled-list">
              <li><strong>מתבוננת</strong> – מה צברתי? איפה אני כבר יודעת?</li>
              <li><strong>מזהה</strong> – למי אני יכולה להקל על הדרך?</li>
              <li><strong>משתפת</strong> – בלי יומרה. רק מתוך אותנטיות.</li>
              <li><strong>יוצרת</strong> – הזדמנויות לתת. מתוך בחירה, ולא מתוך מחויבות.</li>
            </ul>
          </div>

          {/* Knowledge */}
          <div className="content-card fade-in knowledge-card">
            <h2><span className="emoji-icon">🔬</span><span className="text-content">ידע בגובה העיניים – על תבונה נשית, נתינה וערך עצמי</span></h2>
            
            <div className="topics-table">
              <a href="/what-is-feminine-wisdom" className="topic-row">
                <div className="topic-title">
                  <span className="topic-icon">🌿</span>
                  <span className="topic-text">מהי תבונה נשית בגיל המעבר?</span>
                </div>
                <div className="topic-desc">ואיך לזהות אותה בתוכך – גם בלי תעודה</div>
              </a>
              <a href="/giving-from-fullness" className="topic-row">
                <div className="topic-title">
                  <span className="topic-icon">🎁</span>
                  <span className="topic-text">נתינה מתוך מלאות</span>
                </div>
                <div className="topic-desc">לא לתת כדי לרצות – אלא כדי להתחבר לעצמך עוד יותר</div>
              </a>
              <a href="/passing-it-on" className="topic-row">
                <div className="topic-title">
                  <span className="topic-icon">👩‍🏫</span>
                  <span className="topic-text">להעביר את זה הלאה</span>
                </div>
                <div className="topic-desc">כל הדרכים להשפיע, לשתף, ללוות – בלי להיות &quot;גורו&quot;</div>
              </a>
              <a href="/sense-of-meaning" className="topic-row">
                <div className="topic-title">
                  <span className="topic-icon">🎯</span>
                  <span className="topic-text">תחושת משמעות</span>
                </div>
                <div className="topic-desc">איך לדעת שאת חיה עם תכלית – גם בלי להפוך את העולם</div>
              </a>
              <a href="/what-did-i-leave-here" className="topic-row">
                <div className="topic-title">
                  <span className="topic-icon">👣</span>
                  <span className="topic-text">מה השארתי כאן?</span>
                </div>
                <div className="topic-desc">מבט אישי על מורשת, נוכחות והשפעה גם דרך פעולות יומיומיות</div>
              </a>
            </div>
          </div>

          {/* Tools */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🧰</span><span className="text-content">ארגז הכלים שלך</span></h2>
            <ul className="styled-list">
              <li><strong>&quot;אנשים לא צריכים שתהיי מושלמת. הם צריכים שתהיי אמיתית.&quot;</strong></li>
              <li><strong>מעגל התבונה:</strong> &quot;מה שלמדתי – אני מעבירה הלאה. זה לא מפחית ממני – זה מחזק אותי.&quot;</li>
              <li><strong>&quot;כשנשים אמיצות מספרות את סיפוריהן, הן נותנות רשות לעוד נשים לדבר.&quot;</strong></li>
              <li><strong>בחרי השראה אחת והתחילי לשאול:</strong> &quot;איך אני יכולה להשמיע את הקול שלי – גם אם הוא עדיין חלש?&quot;</li>
            </ul>
          </div>

          {/* Aliza's Story */}
          <div className="content-card story-card fade-in">
            <h2><span className="emoji-icon">🎭</span><span className="text-content">עליזה שנקין משתפת</span></h2>
            <blockquote className="quote-box">
              &quot;אני לא מנטורית. אני פשוט אישה שהבינה כמה רחוק הגעתי – ורוצה שמישהי אחרת תגיע קצת יותר בקלות.&quot;
            </blockquote>
          </div>

          {/* Self-Awareness Exercise */}
          <div className="content-card exercise fade-in">
            <h2><span className="emoji-icon">📝</span><span className="text-content">תרגיל מודעות עצמית</span></h2>
            <div className="exercise-box">
              <p><strong>כתבי:</strong></p>
              <ul>
                <li>מה עברתי בעשור האחרון של חיי?</li>
                <li>מה למדתי על עצמי?</li>
                <li>אילו משפטים הייתי רוצה לומר לאישה צעירה ממני – או לעצמי של פעם?</li>
              </ul>
            </div>
          </div>

          {/* Aliza's Reflection */}
          <div className="content-card story-card fade-in">
            <h2><span className="emoji-icon">🎁</span><span className="text-content">עליזה שנקין על תבונה ונתינה</span></h2>
            <blockquote className="quote-box">
              <p>
                &quot;יש רגע כזה, שבו את קולטת שאת כבר לא באימון – את על המגרש.<br />
                שכל מה שעברת, כל הטעויות, כל ה&apos;לא ידעתי אז&apos;,<br />
                היו בעצם שיעורים במסלול ההכשרה הכי יקר – החיים עצמם.
              </p>
              <p>
                ופתאום, מישהי שואלת אותך משהו קטן – ואת עונה,<br />
                והיא אומרת לך &apos;וואו, זה עזר לי&apos;…<br />
                ושם את מבינה – אה. זה הרגע שבו אני כבר לא רק מחפשת אור. אני מאירה.
              </p>
              <p>
                וזה לא אומר להפוך למנטורית או לגורו,<br />
                זה פשוט להיות את – קצת יותר רכה, קצת יותר חכמה,<br />
                וקצת יותר נדיבה עם מה שלמדת בדרך.
              </p>
              <p>
                אז אם את שואלת אותי – איך לדעת שהגעת לשלב הזה?<br />
                כשאת מפסיקה לשמור את כל מה שלמדת לעצמך,<br />
                ומתחילה לשתף – גם אם זה רק משפט, חיבוק, או מבט שאומר:<br />
                &apos;אני רואה אותך. את תעברי את זה. גם אני עברתי.&apos;&quot; ✨
              </p>
            </blockquote>
            <div className="image-container">
              <img src="https://i.imghippo.com/files/ySkx1033hu.jpg" alt="האור שלי לא קטן כשאני מדליקה איתו אור של מישהי אחרת" />
              <p className="image-caption">
                🕯 &quot;האור שלי לא קטן כשאני מדליקה איתו אור של מישהי אחרת.&quot; ✨- עליזה שנקין
              </p>
            </div>
          </div>

          {/* Completion */}
          <div className="content-card completion-card fade-in">
            <h2><span className="emoji-icon">👣</span><span className="text-content">מה הלאה?</span></h2>
            <p className="celebration-text">
              🎉 סיימת את השלב החמישי והאחרון במסע שלך – תבונה ונתינה.
            </p>
            <p>
              יכול להיות שזה סוף המפה – אבל רק ההתחלה של השליחות שלך בעולם.<br />
              זה לא סוף הסיפור – זה הרגע שבו את רואה את כל הדרך שעברת, ומבינה:
            </p>
            <p className="highlight-text">
              עברתי. התבוננתי. השתנתי. צמחתי. נתתי. אני כאן.
            </p>
            
            <h3>🎓 סיום המסע – את כבר לא מנופאוזית מתחילה. את בוגרת הדרך שלך.</h3>
            <p>
              עברת שלב אחרי שלב.<br />
              הקשבת לגוף שלוחש, מצאת שקט פנימי וביטחון, חיברת קשרים של לב, גילית תשוקות חדשות, והבנת שיש בך תבונה שקטה שלא צריכה אישור.
            </p>
            <p>
              את לא רק מבינה מה קורה לך – את מנהלת את זה.<br />
              את לא רק מתמודדת – את מעבירה את זה הלאה.
            </p>
            <p>
              המסע הזה לא נתן לך תשובות מוכנות.<br />
              הוא החזיר לך את עצמך – בקול שלך, בקצב שלך, בעוצמה שלך.
            </p>
            <p className="final-message">
              את כבר לא רק אישה בגיל המעבר.<br />
              את אישה בגיל המֵעֵבֶר –<br />
              גיל של בהירות, של עוצמה שקטה, של חירות חדשה, של חכמה שמביאה חיים לאחרות.
            </p>

            <div className="image-container">
              <img src="https://i.imghippo.com/files/MHrZ5100fE.jpg" alt="סיום המסע" />
            </div>

            <div className="button-group">
              <a 
                href="https://drive.google.com/file/d/1Zde2y88MQ3U7LwNts-LTdVWBPNTA1boy/view?usp=sharing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="cta-button certificate"
              >
                🎓 הורדת תעודת סיום
              </a>
              <a href="/menopause-roadmap" className="cta-button secondary">🗺️ חזרה למפת הדרכים</a>
            </div>
          </div>

        </div>
      </section>
    </div>
    </DashboardLayout>
  );
}

