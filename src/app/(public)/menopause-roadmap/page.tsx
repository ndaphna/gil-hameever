'use client';

import { useEffect } from 'react';
import './menopause-roadmap.css';

export default function MenopauseRoadmapPage() {
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

    // Pyramid level interactions
    document.querySelectorAll('.pyramid-level').forEach(level => {
      level.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const href = target.getAttribute('href');
        
        // If it's an external link (not starting with #), let it navigate normally
        if (href && !href.startsWith('#')) {
          return; // Don't prevent default, allow navigation
        }
        
        // For internal anchors (#level1, etc), prevent default and scroll
        e.preventDefault();
        const row = target.closest('.pyramid-row');
        const levelInfo = row?.querySelector('.level-info');
        let levelNumber;
        
        if (levelInfo && window.innerWidth >= 768) {
          // Desktop - get from row info
          const numberEl = levelInfo.querySelector('.level-number');
          levelNumber = numberEl?.textContent || '';
        } else {
          // Mobile - get from pyramid level class
          const classList = Array.from(target.classList);
          const levelClass = classList.find(c => c.startsWith('level-'));
          const levelNum = levelClass ? levelClass.split('-')[1] : '1';
          levelNumber = `שלב ${levelNum}`;
        }
        
        const h3 = target.querySelector('h3');
        const levelTitle = h3?.textContent || '';
        
        // Visual feedback
        target.style.transform = 'scale(0.95)';
        setTimeout(() => {
          target.style.transform = '';
        }, 200);
        
        console.log(`נבחר ${levelNumber}: ${levelTitle}`);
        
        // Smooth scroll to content
        const contentSection = document.querySelector('.content-section');
        if (contentSection) {
          contentSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // CTA button ripple effect
    document.querySelectorAll('.cta-button').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        const target = e.currentTarget as HTMLElement;
        const ripple = document.createElement('span');
        const rect = target.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const clientX = (e as MouseEvent).clientX;
        const clientY = (e as MouseEvent).clientY;
        const x = clientX - rect.left - size / 2;
        const y = clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.7)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple-animation 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        target.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });

    // Parallax effect for decoration circles
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.decoration-circle');
      
      parallaxElements.forEach(element => {
        const speed = (element as HTMLElement).dataset.speed || '0.5';
        (element as HTMLElement).style.transform = `translateY(${scrolled * parseFloat(speed)}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);

    // Enhance mobile interactions
    if ('ontouchstart' in window) {
      document.querySelectorAll('.pyramid-level, .cta-button').forEach(element => {
        element.addEventListener('touchstart', (e) => {
          const target = e.currentTarget as HTMLElement;
          target.classList.add('touch-active');
        });
        
        element.addEventListener('touchend', (e) => {
          const target = e.currentTarget as HTMLElement;
          setTimeout(() => {
            target.classList.remove('touch-active');
          }, 300);
        });
      });
    }

    // Ensure pyramid loads smoothly
    const pyramid = document.querySelector('.pyramid');
    if (pyramid) {
      (pyramid as HTMLElement).style.opacity = '0';
      (pyramid as HTMLElement).style.transform = 'scale(0.95)';
      
      setTimeout(() => {
        (pyramid as HTMLElement).style.transition = 'all 0.8s ease-out';
        (pyramid as HTMLElement).style.opacity = '1';
        (pyramid as HTMLElement).style.transform = 'scale(1)';
      }, 300);
    }

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="menopause-roadmap-page">
      <section className="hero" id="main-content">
        <div className="decoration-circle"></div>
        <div className="decoration-circle"></div>
        <div className="container">
          <div className="hero-content">
      <h1>מפת הדרכים למנופאוזית המתחילה</h1>
            <div className="questions-container">
              <p className="hero-question">&quot;למה אני לא מזהה את עצמי יותר?&quot;</p>
              <p className="hero-question">&quot;איך הגוף שלי משתגע – בלי שליטה?&quot;</p>
              <p className="hero-question">&quot;האם זהו? זה הסוף של מי שהייתי?&quot;</p>
            </div>
            <p className="subtitle">אם השאלות האלו רצות לך בראש, את לא לבד.<br />
            ברוכה הבאה לשלב בחיים שאף אחד לא הכין אותך אליו באמת: <span className="highlight">גיל המעבר</span>.</p>
            <button className="cta-button">גלי את המפה שלך</button>
          </div>
      </div>
      </section>

      <section className="content-section">
        <div className="container">
          <div className="content-card fade-in">
            <h2>זה לא חייב להיות סבל</h2>
            <p>
              אבל בניגוד למה שאמרו לך, <span className="highlight">זה לא חייב להיות סבל</span>. 
              ובטח שלא הסוף של הנשיות, החיוניות או השלווה שלך. 
              זה יכול להיות דווקא <span className="emphasis">תחילתו של פרק חדש, עוצמתי ומדויק יותר מתמיד</span>.
            </p>
            <p>
              <strong>גיל המעבר הוא לא רק שלב ביולוגי. הוא מסע שלם, פנימי וחיצוני.</strong>
        </p>
      </div>

          <div className="content-card fade-in">
            <h2>סולם הצרכים שלך בגיל המעבר</h2>
            <p>
              בהשראת סולם הצרכים של מסלו, המודל שמתאר את השלבים שכל אדם עובר בדרך להגשמה עצמית, 
              יצרתי <span className="highlight">מפת דרכים לנשים בגיל המעבר</span>.
        </p>
        <p>
              בכל שלב בסולם מופיע צורך אחר: מהגוף שצועק לשינה ולשוקולד, דרך הצורך בביטחון ובשייכות, 
              ועד לתחושת ערך ומשמעות. לכל צורך כזה, תמצאי כאן: 
              <span className="emphasis">כלים, טיפים, מידע רפואי, תרגולים, המלצות, ועוד</span>.
            </p>
            <p className="important-message">
              את לא חייבת לעבור הכל. רק לדעת שהמפה קיימת. שיש דרך. <span className="highlight">שאת לא לבד</span>.
        </p>
      </div>

          <div className="content-card fade-in">
            <h2>מה תגלי במפה הזו?</h2>
            <div className="benefits-list">
              <div className="benefit-item">
                <span className="benefit-icon">✨</span>
                <p><strong>מה באמת קורה בגוף שלך</strong> – בצורה ברורה, בלי מונחים מסובכים.</p>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">💪</span>
                <p><strong>איך להתמודד עם תסמינים</strong> כמו גלי חום, שינויים במצב הרוח, עייפות וירידה בחשק – בלי לאבד את עצמך.</p>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">🌿</span>
                <p><strong>כלים פשוטים וטבעיים</strong> שיעזרו לך להחזיר שליטה, שלווה וביטחון לגוף ולנפש.</p>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">❤️</span>
                <p><strong>והכי חשוב</strong> – תקבלי אישור להרגיש. להישבר. ואז – לקום חזקה מתמיד, ולהמשיך להגשים את הגרסה החדשה שלך.</p>
              </div>
            </div>
          </div>

          <div className="content-card fade-in closing-card">
            <h2>זו לא רק מפת דרכים</h2>
            <p className="closing-message">
              זו יד מושטת – מאישה שכבר הייתה שם, ועברה לצד השני - לגיל הַמֵעֵבֶר.
            </p>
            <p className="subtitle">
              המפה מראה לך איפה את עומדת, ולאן את עוד יכולה לעלות.<br />
          זו התחלה של טיפוס חדש במעלה הסולם האישי שלך.
        </p>
            <button className="cta-button">אני רוצה את המפה שלי</button>
          </div>
        </div>
      </section>

      {/* Pyramid Section */}
      <section className="pyramid-section">
        <div className="container">
          <div className="content-card pyramid-card fade-in">
            <h2>סולם הצרכים למנופאוזית בשינוי</h2>
            <div className="pyramid-intro">
              <p className="pyramid-description">
                בכניסה לגיל המעבר, אף אחת לא מקבלת מפה. אין שלט שמכוון ל<span className="emphasis">&quot;שביל גלי החום&quot;</span>, 
                אין פנייה שמובילה ל<span className="emphasis">&quot;רחוב אין-לי-חשק&quot;</span>, 
                ואין וייז שמתריע: <span className="emphasis">&quot;בעוד 200 מטר - התפרצות רגשית!&quot;</span>
              </p>
              <p className="pyramid-description">
                אז החלטתי להכין אחת, שתיקח אותך יד ביד דרך התחנות שכולנו עוברות, אבל לא תמיד מדברות עליהן.
              </p>
            </div>
            
            <div className="pyramid-container">
            <div className="pyramid">
              <div className="pyramid-row">
                <div className="level-info">
                  <div className="level-number">שלב 5</div>
                  <p className="level-subtitle">המסע הרוחני - התעוררות, שלווה, חיבור פנימי</p>
                </div>
                <a href="/wisdom-giving" className="pyramid-level level-5">
                  <div className="level-content">
                    <h3>חכמה ונתינה</h3>
                  </div>
                </a>
              </div>
              
              <div className="pyramid-row">
                <div className="level-info">
                  <div className="level-number">שלב 4</div>
                  <p className="level-subtitle">צרכים של הערכה עצמית - הגשמה, שינוי קריירה, תחושת ערך</p>
                </div>
                <a href="/self-worth" className="pyramid-level level-4">
                  <div className="level-content">
                    <h3>ערך עצמי, משמעות, השפעה והערכה</h3>
                  </div>
                </a>
              </div>
              
              <div className="pyramid-row">
                <div className="level-info">
                  <div className="level-number">שלב 3</div>
                  <p className="level-subtitle">צרכים רגשיים - ביטוי עצמי, חמלה, מערכות יחסים - הורים, ילדים, זוגיות</p>
                </div>
                <a href="/belonging-sisterhood-emotional-connection" className="pyramid-level level-3">
                  <div className="level-content">
                    <h3>שייכות, אחווה וחיבור רגשי</h3>
                  </div>
                </a>
              </div>
              
              <div className="pyramid-row">
                <div className="level-info">
                  <div className="level-number">שלב 2</div>
                  <p className="level-subtitle">צרכי ביטחון - שקט כלכלי וכסף, רפואה מונעת, שגרה חדשה</p>
                </div>
                <a href="/certainty-peace-security" className="pyramid-level level-2">
                  <div className="level-content">
                    <h3>וודאות, שקט, ביטחון</h3>
                  </div>
                </a>
              </div>
              
              <div className="pyramid-row">
                <div className="level-info">
                  <div className="level-number">שלב 1</div>
                  <p className="level-subtitle">צרכים פיזיים - תזונה, שינה, תנועה, הסמפטומים, הורמונים</p>
                </div>
                <a href="/the-body-whispers" className="pyramid-level level-1">
                  <div className="level-content">
                    <h3>הגוף לוחש - אז בואי נקשיב</h3>
                  </div>
                </a>
              </div>
            </div>
            
            {/* Mobile Labels Below Pyramid */}
            <div className="pyramid-labels-mobile">
              <div className="level-info">
                <div className="level-number">שלב 1</div>
                <p className="level-subtitle">צרכים פיזיים - תזונה, שינה, תנועה, הסמפטומים, הורמונים</p>
              </div>
              <div className="level-info">
                <div className="level-number">שלב 2</div>
                <p className="level-subtitle">צרכי ביטחון - שקט כלכלי וכסף, רפואה מונעת, שגרה חדשה</p>
              </div>
              <div className="level-info">
                <div className="level-number">שלב 3</div>
                <p className="level-subtitle">צרכים רגשיים - ביטוי עצמי, חמלה, מערכות יחסים - הורים, ילדים, זוגיות</p>
              </div>
              <div className="level-info">
                <div className="level-number">שלב 4</div>
                <p className="level-subtitle">צרכים של הערכה עצמית - הגשמה, שינוי קריירה, תחושת ערך</p>
              </div>
              <div className="level-info">
                <div className="level-number">שלב 5</div>
                <p className="level-subtitle">המסע הרוחני - התעוררות, שלווה, חיבור פנימי</p>
              </div>
            </div>
            
            <div className="pyramid-cta">
              <button className="cta-button pulse-button">
                <span className="button-text">בואי נתחיל במסע שלך</span>
                <span className="button-subtext">לחצי על השלב שמתאים לך ברגע זה</span>
        </button>
      </div>
          </div>
          </div>
        </div>
      </section>
    </div>
  );
}
