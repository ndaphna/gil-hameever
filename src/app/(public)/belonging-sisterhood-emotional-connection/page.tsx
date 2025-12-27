'use client';

import { useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';

export default function BelongingSisterhoodEmotionalConnectionPage() {
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
    <div className="belonging-sisterhood-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="decoration-circle"></div>
        <div className="decoration-circle"></div>
        <div className="container">
          <div className="hero-content">
            <div className="stage-badge">שלב 3 במפה</div>
            <h1>שייכות, אחוות נשים, חיבור רגשי</h1>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          
          {/* Introduction */}
          <div className="content-card fade-in">
            <p className="intro-text">
              <strong>הגוף דיבר. הנפש לחשה. ועכשיו, הלב מבקש חיבוק.</strong>
            </p>
            <p>
              אחרי שהצלחת לייצר קצת שקט וביטחון, קורה משהו מפתיע:<br />
              הופך להיות חלל ריק שהיה מלא קודם בהתרוצצות, תפקוד, רעש, ילדים, עבודה…<br />
              ובחלל הזה – עולה געגוע.
            </p>
            <p>
              לקרבה. לאינטימיות. לשיחה בלי מסכות.<br />
              לזה שמישהי תראה אותך באמת, ותגיד: &quot;גם אני.&quot;
            </p>
            <p className="highlight-text">
              השלב הזה עוסק בצורך הכי עמוק של הלב – להרגיש שייכת.
            </p>
          </div>

          {/* What's Happening */}
          <div className="content-card fade-in">
            <h3><span className="emoji-icon">🌀</span><span className="text-content">מה קורה בשלב הזה?</span></h3>
            <ul className="styled-list">
              <li>תחושת בדידות או ריחוק – גם כשיש אנשים סביבך.</li>
              <li>צורך גובר בקשר משמעותי – פחות small talk, יותר אמת.</li>
              <li>געגוע לקשר נשי מחבר – מישהי שתהיי את לידה בלי להתאמץ.</li>
              <li>רצון לחדש קשרים ישנים, או להתרחק ממי שלא רואה אותך.</li>
              <li>חיפוש אחר קהילה, חממה רגשית, קבוצת שיח או חיבוק.</li>
            </ul>
          </div>

          {/* What To Do */}
          <div className="content-card fade-in">
            <h3><span className="emoji-icon">🛠️</span><span className="text-content">אז מה את עושה עם זה?</span></h3>
            <ul className="styled-list">
              <li><strong>מתחילה בקטן</strong> – את לא חייבת להיחשף עד הסוף. מספיק לחזור להרים טלפון.</li>
              <li><strong>מזהה מה חסר</strong> – אינטימיות? שותפות? הומור? ומי יכול למלא את זה.</li>
              <li><strong>מבינה</strong>: זה לא חולשה לרצות קרבה – זה כוח להרגיש ולבקש.</li>
              <li><strong>משחררת קשרים</strong> שכבר לא משרתים את הצמיחה שלך. כן, מותר.</li>
            </ul>
          </div>

          {/* Knowledge */}
          <div className="content-card fade-in knowledge-card">
            <h2><span className="emoji-icon">🔬</span><span className="text-content">ידע בגובה העיניים – על חיבור, חברות ונשיות בגיל המעבר</span></h2>
            
            <div className="topics-table">
              <a href="/what-is-belonging" className="topic-row">
                <div className="topic-title">
                  <span className="topic-icon">🤝</span>
                  <span className="topic-text">מה זאת בכלל שייכות בגיל הזה?</span>
                </div>
                <div className="topic-desc">לא קבוצת הורים, אלא תחושת &quot;יש לי שבט משלי&quot;.</div>
              </a>
              <a href="/female-friendship-healing-space" className="topic-row">
                <div className="topic-title">
                  <span className="topic-icon">🧑‍🤝‍🧑</span>
                  <span className="topic-text">חברות נשית כמרחב ריפוי</span>
                </div>
                <div className="topic-desc">למה נשים מרפאות נשים, ואיך מוצאים את אלה שמדברות את השפה שלך.</div>
              </a>
              <a href="/letting-go-toxic-relationships" className="topic-row">
                <div className="topic-title">
                  <span className="topic-icon">🙅‍♀️</span>
                  <span className="topic-text">להרפות מקשרים רעילים</span>
                </div>
                <div className="topic-desc">מתי פרידה היא דווקא אהבה עצמית, ולא ניתוק.</div>
              </a>
              <a href="/honest-communication" className="topic-row">
                <div className="topic-title">
                  <span className="topic-icon">💬</span>
                  <span className="topic-text">תקשורת כנה ולא מתנצלת</span>
                </div>
                <div className="topic-desc">איך לדבר אמת מבלי לחשוש שיאשימו אותך בדרמטיות.</div>
              </a>
              <a href="/community-new-connections" className="topic-row">
                <div className="topic-title">
                  <span className="topic-icon">🧡</span>
                  <span className="topic-text">קבוצה, קהילה, חיבורים חדשים</span>
                </div>
                <div className="topic-desc">מרחבים שיאפשרו לך להיות בדיוק מי שאת, גם בלי מסקרה.</div>
              </a>
            </div>
          </div>

          {/* Tools */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🧰</span><span className="text-content">ארגז הכלים שלך</span></h2>
            <ul className="styled-list">
              <li><strong>רשימת קשרים:</strong> כתבי את שמות האנשים שאת מרגישה בטוחה לידם. אלו מקומות לנוח בהם.</li>
              <li><strong>כתבי ביומן:</strong> איפה הרגשתי שייכת השבוע? ואיפה הרגשתי לבד?</li>
              <li><strong>כתבי הודעה פשוטה</strong> למישהי שאת מתגעגעת אליה. לא חייב &quot;מה שלומך&quot; מנומס, פשוט &quot;התגעגעתי אלייך, רציתי לדעת איך את.&quot;. לפעמים זה כל מה שצריך כדי לפתוח לב.</li>
            </ul>
          </div>

          {/* Self-Awareness Exercise */}
          <div className="content-card exercise fade-in">
            <h2><span className="emoji-icon">💡</span><span className="text-content">תרגיל מודעות עצמית</span></h2>
            <div className="exercise-box">
              <h4>טקס שבועי קטן: בחרי יום קבוע בשבוע – &quot;יום חברות&quot;.</h4>
              <p>
                נסי ליצור מפגש אחד בשבוע עם אישה אחת שאת סומכת עליה – חברה, בת משפחה, קולגה.<br />
                מפגש שבו את פשוט נוכחת.
              </p>
              <ul>
                <li>בלי טלפון, רק הקשבה.</li>
                <li>בלי לייעץ, בלי להשוות, בלי לשפוט.</li>
                <li>רק להיות.</li>
              </ul>
              <p className="highlight-text">
                וכתבי לעצמך איך הרגשת אחר כך.
              </p>
              <p>
                השגרה הזו בונה רשת רגשית תומכת לאורך זמן.
              </p>
            </div>
          </div>

          {/* Aliza's Story */}
          <div className="content-card story-card fade-in">
            <h2><span className="emoji-icon">🎭</span><span className="text-content">עליזה שנקין משתפת</span></h2>
            <blockquote className="quote-box">
              &quot;הבנתי שחברות אמיתית זה לא מי שתראה לי את הפילטר החדש באינסטגרם,
              אלא מי שתזכיר לי מי אני גם כשאני שוכחת.&quot;
            </blockquote>
          </div>

          {/* Insights */}
          <div className="content-card insights-card fade-in">
            <h2><span className="emoji-icon">🌱</span><span className="text-content">תובנות</span></h2>
            <p className="wisdom-box">
              כשנשים יושבות יחד, משהו מתרחש מתחת למילים.<br />
              הן מחזירות זו לזו את הקול, את הכוח, ואת האמונה שהן לא לבד.
            </p>
          </div>

          {/* Science */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">👩🏻‍🔬</span><span className="text-content">המדע מאחורי אחוות נשים</span></h2>
            <div className="science-box">
              <p>
                🧪 <strong>מחקרים מראים</strong> שנשים שמקיפות את עצמן בחברות תומכות חוות פחות סטרס, פחות דיכאון, ורמות קורטיזול נמוכות יותר.
              </p>
              <p>
                שיחה רגועה עם חברה תורמת לוויסות מערכת העצבים ולהפרשת אוקסיטוצין – הורמון הרוגע והחיבור.
              </p>
              <div className="highlight-box">
                <h4>🧪 הורמון האחווה – אוקסיטוצין</h4>
                <p>
                  חיבוק, מבט עיניים, או אפילו הודעה מחממת לב מחברה – משפיעים ביולוגית על הגוף ומחזקים ביטחון, חוסן רגשי ואופטימיות.
                </p>
              </div>
            </div>
          </div>

          {/* Gift Guide */}
          <div className="content-card downloads-card fade-in">
            <h2><span className="emoji-icon">🎁</span><span className="text-content">מדריך מתנה להורדה</span></h2>
            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
              <a 
                href="https://drive.google.com/file/d/1GfB5dIXsuCkDzn__sog1Konxuv2PftSx/view?usp=sharing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="cta-button"
              >
                💌 מדריך: &quot;איך לבנות קהילה קטנה משלך – גם אם את ביישנית&quot;
              </a>
            </div>
          </div>

          {/* Aliza's Reflection */}
          <div className="content-card story-card fade-in">
            <h2><span className="emoji-icon">💬</span><span className="text-content">עליזה שנקין על אחוות נשים</span></h2>
            <blockquote className="quote-box">
              <p>
                &quot;פעם הייתי בטוחה שחברות זה לקנות חולצות ביחד.<br />
                היום אני יודעת שחברות אמיתית זה כשאת מתקשרת למישהי ואומרת:<br />
                &apos;אין לי כוח לעולם&apos;, והיא עונה – &apos;מעולה, גם לי. בואי לקפה ונשתוק ביחד&apos;. ☕
              </p>
              <p>
                אז כן, אני לא תמיד זמינה, לא תמיד רגועה,<br />
                אבל אני תמיד שם בשביל הנשים שבאמת רואות אותי.
              </p>
              <p>
                ובסוף – אנחנו ביחד בזה.<br />
                עם הפילטרים, בלי הפילטרים,<br />
                עם הצחוק, עם הדמעות,<br />
                ועם הידיעה שכשאנחנו יחד –<br />
                שום דבר לא באמת שובר אותנו.&quot; 💞
              </p>
            </blockquote>
            <div className="image-container">
              <img src="https://i.imghippo.com/files/gTIY9308kRo.jpg" alt="טיפול קבוצתי – בגרסת הקפאין" />
              <p className="image-caption">
                &quot;טיפול קבוצתי – בגרסת הקפאין.&quot; ☕😅 - עליזה שנקין
              </p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="content-card next-steps-card fade-in">
            <h2><span className="emoji-icon">👣</span><span className="text-content">מה השלב הבא במפת הדרכים?</span></h2>
            <p className="celebration-text">
              🎉 סיימת את שלב השייכות במסע שלך!
            </p>
            <p>
              בנית מרחב רגשי, חיברת קשרים, והזכרת לעצמך – שאת חלק ממשהו גדול יותר.
            </p>
            <p>
              כשאת מרגישה שוב מחוברת, לאחרות ולעצמך,<br />
              יכול להתחיל שלב חדש: הגשמה, משמעות, ביטוי עצמי.
            </p>
            <p className="next-step-text">זה הזמן שלך לעלות לשלב הבא במפת הדרכים.</p>
            <p><strong>רוצה להמשיך לשלב 4?</strong></p>
            <p>👉 ערך עצמי, משמעות, התעוררות – את לא רק אמא, בת זוג, עובדת. את את!</p>
            
            <div className="button-group">
              <a href="/self-worth" className="cta-button">שלב 4 במפת דרכים</a>
              <a href="/menopause-roadmap" className="cta-button secondary">🗺️ חזרה למפת הדרכים</a>
            </div>
          </div>

        </div>
      </section>
    </div>
    </DashboardLayout>
  );
}

