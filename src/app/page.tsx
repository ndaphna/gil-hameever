'use client';

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import "./home.css";

export default function Home() {
  const { user, profile, loading } = useAuth();
  
  // Check if user is logged in and has active subscription
  const hasActiveSubscription = user && profile && profile.subscription_status === 'active';
  const scrollToFeatures = () => {
    const featuresSection = document.querySelector('.features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="hero-content-wrapper">
          <h1 className="hero-title">
            <span className="title-text">
              <span className="title-line">ברוכה הבאה</span>
              <span className="title-line">לגיל הַמֵעֵבֶר</span>
            </span>
            <span className="flower-icon">🌺</span>
          </h1>
          
          <p className="hero-subtitle">
            המקום שמראה לך איך לפרוח באמצע החיים ומֵעֵבֶר לו.
          </p>
          
          <button 
            className="scroll-indicator" 
            onClick={scrollToFeatures}
            aria-label="גלול למטה לראות עוד"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M20 10L20 30M20 30L12 22M20 30L28 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="section-title">מה מחכה לך כאן?</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💪</div>
              <h3 className="feature-title">כלים מעשיים</h3>
              <p className="feature-description">
                טכניקות מוכחות לניהול תסמינים, שיפור איכות חיים והתמודדות עם שינויים הורמונליים
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🧘‍♀️</div>
              <h3 className="feature-title">איזון פנימי</h3>
              <p className="feature-description">
                תרגילים למיינדפולנס, מדיטציה וטכניקות להפחתת מתח ושיפור מצב הרוח
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💝</div>
              <h3 className="feature-title">קהילה תומכת</h3>
              <p className="feature-description">
                חברות עם נשים שעוברות את אותו המסע, שיתוף ותמיכה בסביבה בטוחה ומכילה
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">מעקב אישי</h3>
              <p className="feature-description">
                מערכת מתקדמת למעקב אחר תסמינים, מצב רוח ודפוסים אישיים להבנה מעמיקה
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3 className="feature-title">ידע מקצועי</h3>
              <p className="feature-description">
                מדריכים, מאמרים ותכנים איכותיים מבוססי מחקר על כל היבטי גיל המעבר
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3 className="feature-title">צמיחה אישית</h3>
              <p className="feature-description">
                כלים להתפתחות אישית, חיזוק הביטחון העצמי וגילוי הכוח הפנימי שלך
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <h2 className="section-title">מה אומרות חברות הקהילה</h2>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="quote-mark">"</div>
              <p className="testimonial-text">
                הפלטפורמה הזו שינתה לי את החיים. סוף סוף מצאתי מקום שבו אני מבינה מה קורה לי ויש לי כלים להתמודד.
              </p>
              <div className="testimonial-author">
                <strong>רחל, 51</strong>
                <span>חברת קהילה</span>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="quote-mark">"</div>
              <p className="testimonial-text">
                הרגשתי לבד במסע הזה עד שהצטרפתי לכאן. הקהילה והתכנים עזרו לי להרגיש מועצמת ולא בודדה.
              </p>
              <div className="testimonial-author">
                <strong>מירי, 48</strong>
                <span>חברת קהילה</span>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="quote-mark">"</div>
              <p className="testimonial-text">
                המעקב האישי עזר לי להבין את הדפוסים שלי ולשפר משמעותית את איכות החיים. ממליצה בחום!
              </p>
              <div className="testimonial-author">
                <strong>שרה, 53</strong>
                <span>חברת קהילה</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">מוכנה להתחיל את המסע?</h2>
            <p className="cta-description">
              הצטרפי לאלפי נשים שכבר גילו כיצד לחיות את גיל המעבר בביטחון, בשלווה ובכוח
            </p>
            <div className="cta-links">
              <Link href="/articles" className="cta-link articles-link">
                <span className="cta-link-text">התחילי כאן, קבלי מידע חשוב שלא מעיזים לדבר עליו...</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <a 
                href="https://www.instagram.com/inbal_daphna/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="cta-link instagram-link"
              >
                <span className="cta-link-text">עקבי אחרי באינסטגרם לעדכונים "חמים" 🔥</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">הבית לנשים בגיל המעבר</h3>
            <p className="footer-description">
              המקום שלך לצמוח, להתחזק ולפרוח באמצע החיים ומעבר
            </p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h4>קישורים מהירים</h4>
              <Link href="/about">אודות</Link>
              <Link href="/pricing">מחירים</Link>
              <Link href="/hormones">הורמונים</Link>
            </div>
            
            <div className="footer-column">
              <h4>חשבון</h4>
              <Link href="/login">התחברות</Link>
              <Link href="/signup">הרשמה</Link>
              {hasActiveSubscription && (
                <Link href="/dashboard">לוח בקרה</Link>
              )}
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2025 הבית לנשים בגיל המעבר. כל הזכויות שמורות.</p>
          <Link href="/privacy-policy" className="privacy-policy-link">
            מדיניות פרטיות
          </Link>
        </div>
      </footer>
    </div>
  );
}
