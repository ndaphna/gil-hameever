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
          
          {/* Introduction - Placeholder */}
          <div className="content-card fade-in">
            <p className="intro-text">
              <strong>[כאן יבוא התוכן שתעביר]</strong>
            </p>
          </div>

          {/* Main Content - Placeholder */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">📝</span><span className="text-content">תוכן ראשי</span></h2>
            <p>[כאן יבוא התוכן]</p>
          </div>

          {/* Additional Content - Placeholder */}
          <div className="content-card fade-in">
            <h3><span className="emoji-icon">💡</span><span className="text-content">מידע נוסף</span></h3>
            <p>[כאן יבוא התוכן]</p>
          </div>

          {/* Aliza's Story - Placeholder */}
          <div className="content-card story-card fade-in">
            <h2><span className="emoji-icon">💊</span><span className="text-content">עליזה שנקין על הורמונים</span></h2>
            <blockquote className="quote-box">
              <p>[כאן יבוא ציטוט מעליזה]</p>
            </blockquote>
          </div>

          {/* Exercise - Placeholder */}
          <div className="content-card exercise fade-in">
            <h3><span className="emoji-icon">✍️</span><span className="text-content">תרגול</span></h3>
            <p>[כאן יבוא תרגול]</p>
          </div>

          {/* Downloads - Placeholder */}
          <div className="content-card downloads-card fade-in">
            <h2><span className="emoji-icon">📥</span><span className="text-content">בונוסים שמחכים לך:</span></h2>
            <ul className="download-list">
              <li>[כאן יבואו קישורים להורדה]</li>
            </ul>
          </div>

          {/* Back Links */}
          <div className="next-steps-card fade-in">
            <div className="button-group">
              <a href="/the-body-whispers#key-topics" className="cta-button">
                🧏🏻‍♀️ חזרה לשלב 1
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

