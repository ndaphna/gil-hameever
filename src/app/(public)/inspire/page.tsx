'use client';
import { useEffect } from 'react';
import './inspire.css';

export default function InspirePage() {
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
    <div className="inspire-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="decoration-circle"></div>
        <div className="decoration-circle"></div>
        <div className="container">
          <div className="hero-content">
            <div className="stage-badge">✨ קבלי השראה</div>
            <h1>שישי של חוכמה נשית</h1>
            <p className="subtitle">סדרת פוסטים המיועדת במיוחד לנו, נשים בגיל המעבר!</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          
          {/* Introduction */}
          <div className="content-card fade-in">
            <p className="intro-text" style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '24px' }}>
              כיצד המסורת והחוכמה היהודית מתייחסות לתקופה הייחודית והמאתגרת שאנו חוות? ביהדות יש אוצרות של תובנות ועצות שרלוונטיות באופן מפתיע לחיינו היום ומאירות את גיל המעבר באור חדש ומעצים.
            </p>
          </div>

          {/* What You'll Find */}
          <div className="content-card fade-in">
            <h2><span className="emoji-icon">📚</span><span className="text-content">מה תמצאו בפוסטים?</span></h2>
            <ul className="styled-list">
              <li>✨ <strong>תובנות יהודיות עתיקות</strong> על השינויים הגופניים והרגשיים שאנו חוות</li>
              <li>🔧 <strong>כלים מעשיים</strong> מהחסידות והקבלה להתמודדות עם אתגרי גיל המעבר</li>
              <li>👑 <strong>סיפורי השראה</strong> של נשים מהמקורות שהתמודדו עם שינויים בגיל מבוגר</li>
              <li>🔬 <strong>דרכים לחבר</strong> בין החוכמה היהודית לבין הידע המדעי העכשווי על גיל המעבר</li>
              <li>💫 <strong>תרגילים ורעיונות</strong> למציאת משמעות ותכלית חדשה בשלב זה של החיים</li>
            </ul>
          </div>

          {/* About the Series */}
          <div className="content-card fade-in">
            <p style={{ fontSize: '1.1rem', lineHeight: '1.9', marginBottom: '20px' }}>
              הסדרה הזו נוצרה מתוך הבנה עמוקה של האתגרים הייחודיים שלנו – התנודות ההורמונליות, השינויים במשפחה, החיפוש אחר זהות מחודשת. ליהדות יש הרבה מה לומר על כל אלה!
            </p>
            <p className="highlight-text" style={{ 
              fontSize: '1.2rem', 
              lineHeight: '1.9', 
              color: '#E91E8C', 
              fontWeight: '600',
              textAlign: 'center',
              padding: '24px',
              background: 'linear-gradient(135deg, rgba(255,0,128,0.05) 0%, rgba(157,78,221,0.05) 100%)',
              borderRadius: '16px',
              marginTop: '24px'
            }}>
              מוזמנות לקרוא ולהצטרף אליי למסע הזה של גילוי וצמיחה בתקופה מאתגרת ומרתקת זו של חיינו.
            </p>
          </div>

          {/* Future Links Section */}
          <div className="content-card fade-in" style={{ 
            background: 'linear-gradient(135deg, rgba(255,0,128,0.03) 0%, rgba(157,78,221,0.03) 100%)',
            border: '2px dashed rgba(233, 30, 140, 0.3)',
            textAlign: 'center',
            padding: '40px 24px'
          }}>
            <p style={{ fontSize: '1rem', color: '#666', fontStyle: 'italic' }}>
              בהמשך נוסיף קישורים למאמרי השראה של שישי של חוכמה נשית
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}

