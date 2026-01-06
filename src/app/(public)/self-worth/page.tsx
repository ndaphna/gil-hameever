'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '../../components/DashboardLayout';

export default function SelfWorthPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status
  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsLoggedIn(!!session);
      } catch (error) {
        console.warn('Auth check failed:', error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  // Show loading state briefly to prevent flash
  if (isLoading) {
    return (
      <div className="self-worth-page">
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>טוען...</p>
        </div>
      </div>
    );
  }

  const content = (
    <div className="self-worth-page">
      <section className="hero">
        <div className="decoration-circle"></div>
        <div className="decoration-circle"></div>
        <div className="container">
          <div className="hero-content">
            <div className="stage-badge">🌟 שלב 4 במפה</div>
            <h1>ערך עצמי, משמעות, התעוררות</h1>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          
          {/* Introduction */}
          <div className="content-card fade-in">
            <p className="intro-text">
              <strong>את לא רק מה שעשית עד עכשיו – את כל מה שעדיין אפשר</strong>
            </p>
            <p>
              ברוכה הבאה לשלב שבו כבר יש לך קרקע – ועכשיו את שואלת: &quot;מה בא לי לגדל עליה?&quot;<br />
              הקמת משפחה, בנית קריירה, החזקת בית, דאגת לכולם.<br />
              והנה את מתעוררת לבוקר שקט יותר – אולי הילדים כבר עזבו, אולי הראש מתפנה לראשונה...
            </p>
            <p>
              ופתאום עולה השאלה:<br />
              &quot;רגע, ומה איתי?&quot;
            </p>
            <p>
              לא &quot;מה נשאר לי&quot; – אלא מה עוד מחכה לי.<br />
              לא &quot;מה אני חייבת לעשות&quot; – אלא מה בא לי להגשים.
            </p>
            <p className="highlight-text">
              זה לא קל. לפעמים זה מפחיד.<br />
              אבל זה גם מרגש – וזה שלך.
            </p>
          </div>

          {/* What's Happening */}
          <div className="content-card fade-in">
            <h3><span className="emoji-icon">🌀</span><span className="text-content">מה קורה בשלב הזה?</span></h3>
            <ul className="styled-list">
              <li>מתעוררת כמיהה לביטוי אישי, עשייה, תרומה, יצירה – אבל לא ברור מאיפה להתחיל.</li>
              <li>לפעמים את מרגישה &quot;עבר זמני&quot; – כאילו פספסת משהו.</li>
              <li>לפעמים את מרגישה אשמה על זה שבא לך לעשות משהו רק בשביל עצמך.</li>
              <li>ולעיתים – את פשוט מרגישה מוכנה. אבל רק צריכה שמישהי תזכיר לך שזה לא מאוחר.</li>
            </ul>
          </div>

          {/* What To Do */}
          <div className="content-card fade-in">
            <h3><span className="emoji-icon">🛠️</span><span className="text-content">אז מה את עושה עם זה?</span></h3>
            <ul className="styled-list">
              <li><strong>מתחילה בקטן</strong> – ברעיון, ברשימה, בשיחה עם מישהי שכבר עשתה שינוי.</li>
              <li><strong>מזהה מה מדליק אותך</strong> – ומה מרוקן.</li>
              <li><strong>לא פוחדת לרשום פנטזיות</strong> – גם אם הן נראות &quot;לא מציאותיות&quot;.</li>
              <li><strong>מבררת מה את רוצה להרגיש</strong> – לא רק מה את רוצה לעשות.</li>
            </ul>
          </div>

          {/* Knowledge */}
          <div className="content-card fade-in knowledge-card">
            <h2><span className="emoji-icon">🔬</span><span className="text-content">ידע בגובה העיניים – על הגשמה, ייעוד, ושינוי בגיל הזה</span></h2>
            
            <div className="topics-table">
              <a href="/what-is-self-fulfillment" className="topic-row">
                <div className="topic-title">
                  <span className="topic-icon">🔍</span>
                  <span className="topic-text">מה זה בכלל הגשמה עצמית בגיל המעבר?</span>
                </div>
                <div className="topic-desc">ולמה היא נראית אחרת ממה שחשבת</div>
              </a>
              <a href="/how-to-discover-what-i-want" className="topic-row">
                <div className="topic-title">
                  <span className="topic-icon">💡</span>
                  <span className="topic-text">איך מגלים מה בא לי עכשיו?</span>
                </div>
                <div className="topic-desc">כלים פשוטים לחיבור בין &quot;מה אני טובה בו&quot; ל&quot;מה עושה לי חשק&quot;</div>
              </a>
              <a href="/making-change-50-plus" className="topic-row">
                <div className="topic-title">
                  <span className="topic-icon">🧭</span>
                  <span className="topic-text">לעשות שינוי – גם בגיל 50+</span>
                </div>
                <div className="topic-desc">סיפורים של נשים שהתחילו מחדש – וגם את יכולה</div>
              </a>
              <a href="/how-to-build-practical-dream" className="topic-row">
                <div className="topic-title">
                  <span className="topic-icon">🌈</span>
                  <span className="topic-text">איך בונים חלום מעשי</span>
                </div>
                <div className="topic-desc">מדריך לאיך לוקחים רעיון ומתחילים לזוז</div>
              </a>
              <a href="/fears-guilt-self-doubt" className="topic-row">
                <div className="topic-title">
                  <span className="topic-icon">😲</span>
                  <span className="topic-text">פחדים, אשמה וספק עצמי</span>
                </div>
                <div className="topic-desc">כל הקולות שמעכבים אותך – ואיך מתמודדים איתם</div>
              </a>
            </div>
          </div>

          {/* Tools */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">🧰</span><span className="text-content">ארגז הכלים שלך</span></h2>
            <ul className="styled-list">
              <li><strong>&quot;בוקר טוב, חלום&quot;:</strong> כתבי כל בוקר 3 עמודים של כתיבה בזרימה חופשית. בלי לחשוב יותר מדי, פשוט להעביר מחשבות לדף. החלומות מסתננים פנימה לאט לאט.</li>
              <li><strong>כתבי מונולוג פנימי מול הפחד:</strong> &quot;פחד יקר, אתה יכול להצטרף לנסיעה, אבל אתה לא נוהג.&quot;</li>
              <li><strong>שנני הצהרת הגשמה יומית:</strong> &quot;אני פתוחה לאפשרות שהשלב הבא שלי יהיה הטוב מכולם.&quot;</li>
              <li><strong>בחרי כלי אחד וכתבי ביומן שלך:</strong> מה מתחיל להיפתח בי היום?</li>
            </ul>
          </div>

          {/* Self-Awareness Exercise */}
          <div className="content-card exercise fade-in">
            <h2><span className="emoji-icon">💡</span><span className="text-content">תרגיל מודעות עצמית</span></h2>
            <div className="exercise-box">
              <p>
                <strong>פתחי מחברת וכתבי רשימה:</strong>
              </p>
              <p>
                &quot;מה הייתי עושה אם לא היה סיכוי שאכשל?&quot;<br />
                ואחר כך – &quot;מה הייתי עושה גם אם כן?&quot;
              </p>
              <p className="highlight-text">
                זו לא משימה לוגיסטית – זו דלת ללב.
              </p>
            </div>
          </div>

          {/* Aliza's Story */}
          <div className="content-card story-card fade-in">
            <h2><span className="emoji-icon">🎭</span><span className="text-content">עליזה שנקין משתפת</span></h2>
            <blockquote className="quote-box">
              &quot;בעלי שאל אותי השבוע אם אני משתעממת בפנסיה...<br />
              אמרתי לו – &apos;פנסיה?! אני רק עכשיו קיבלתי רשות להיות מי שאני!&apos;&quot;
            </blockquote>
          </div>

          {/* Aliza's Reflection */}
          <div className="content-card story-card fade-in">
            <h2><span className="emoji-icon">🌱</span><span className="text-content">עליזה שנקין על הגשמה עצמית</span></h2>
            <blockquote className="quote-box">
              <p>
                &quot;תקשיבי, אני עברתי שלבים בחיים כמו אפליקציה עם יותר מדי עדכונים:<br />
                שלב האמא, שלב העובדת, שלב המטפלת של כולם...<br />
                ועכשיו אני בשלב הכי מרגש – שלב ה-אני.
              </p>
              <p>
                פעם חלמתי על קריירה, על הצלחות, על לרצות את כולם.<br />
                היום אני חולמת על לקום בבוקר עם חיוך,<br />
                על לעשות משהו שעושה לי דופק של התרגשות – לא רק דופק מהורמונים 😅
              </p>
              <p>
                גיליתי שהגשמה זה לא בהכרח לפתוח עסק או לטוס להודו.<br />
                לפעמים זה פשוט ללמוד משהו חדש,<br />
                לצייר, לרקוד, לכתוב, או להגיד סוף סוף: &apos;זה מה שאני רוצה&apos;.
              </p>
              <p>
                ובסוף – אנחנו ביחד בזה.<br />
                לא מאחרות לשום דבר,<br />
                לא צריכות אישור מאף אחד,<br />
                ופשוט מתחילות לחיות את הפרק החדש של הסדרה שנקראת – אני. 💫&quot;
              </p>
            </blockquote>
            <div className="image-container">
              <img src="https://i.imghippo.com/files/JQyH6107kA.jpg" alt="זה לא מאוחר – זה בדיוק הזמן שלי" />
              <p className="image-caption">
                &quot;זה לא מאוחר – זה בדיוק הזמן שלי.&quot; ☀️🎨- עליזה שנקין
              </p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="content-card next-steps-card fade-in">
            <h2><span className="emoji-icon">👣</span><span className="text-content">מה השלב הבא במפת הדרכים?</span></h2>
            <p className="celebration-text">
              🎉 סיימת את שלב 4 במסע שלך!
            </p>
            <p>
              בחרת להקשיב לרצונות שלך, לזהות כיוונים, ולזוז – גם אם לאט, גם אם בחשש.
            </p>
            <p className="celebration-text">
              כל הכבוד לך!
            </p>
            <p>
              עברת דרך ארוכה, ועכשיו אנחנו מגיעות לשלב החמישי והאחרון במפת הדרכים.<br />
              שלב שמוקדש למה שצברת – ולמה שאת מוכנה לחלוק עם העולם.
            </p>
            <p className="highlight">רוצה להמשיך לשלב 5?</p>
            <p>👉 תבונה ונתינה - השלב שבו את כבר מלאה יותר, ויכולה להשפיע על העולם בדרך שלך.</p>
            
            <div className="button-group">
              <a href="/wisdom-giving" className="cta-button">שלב 5 במפת דרכים</a>
              <a href="/menopause-roadmap" className="cta-button secondary">🗺️ חזרה למפת הדרכים</a>
            </div>
          </div>

        </div>
      </section>
    </div>
  );

  // If logged in, show with DashboardLayout (includes sidebar)
  if (isLoggedIn) {
    return <DashboardLayout>{content}</DashboardLayout>;
  }

  // If not logged in, show without DashboardLayout (no sidebar)
  return content;
}

