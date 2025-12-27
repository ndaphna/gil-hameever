'use client';

import Link from "next/link";
import { useState, FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import "./home.css";
import "../app/(public)/inspiration-waves/inspiration-waves.css";

export default function Home() {
  const { user, profile, loading } = useAuth();
  
  // Check if user is logged in and has active subscription
  const hasActiveSubscription = user && profile && profile.subscription_status === 'active';
  
  // Form state for inspiration waves subscription
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [consent, setConsent] = useState(false);

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!consent) {
      setError('יש לאשר את תנאי ההרשמה');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/inspiration-waves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'שגיאה בשליחת הטופס');
      }

      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Form submission error:', err);
      setError(err.message || 'שגיאה בשליחת הטופס. נסי שוב מאוחר יותר.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            המקום שמראה לך איך לפרוח באמצע החיים ומֵעֵבֶר.
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

      {/* Inspiration Waves Form Section */}
      <section className="inspiration-form-section">
        <div className="inspiration-form-container">
          <div className="inspiration-form-wrapper">
            <h2 className="form-title">הזמנה אישית לרשימת תפוצה של גלי ההשראה:</h2>
            <p className="form-subtitle">הכניסי את הפרטים כאן למטה והצטרפי לגלי ההשראה</p>
            
            {isSubmitted ? (
              <div className="form-success">
                <p className="success-icon">✨</p>
                <h3>ברוכה הבאה לגלי ההשראה!</h3>
                <p>תודה שהצטרפת. בקרוב תקבלי את הגל הראשון שלך.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="inspiration-form">
                {error && (
                  <div className="form-error">
                    {error}
                  </div>
                )}

                <div className="form-group">
                  <input
                    type="text"
                    id="homepage-firstName"
                    name="firstName"
                    placeholder="שם"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    disabled={isSubmitting}
                    autoComplete="given-name"
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    id="homepage-lastName"
                    name="lastName"
                    placeholder="שם משפחה"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    disabled={isSubmitting}
                    autoComplete="family-name"
                  />
                </div>

                <div className="form-group">
                  <input
                    type="email"
                    id="homepage-email"
                    name="email"
                    placeholder="אימייל"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isSubmitting}
                    autoComplete="email"
                  />
                </div>

                <div className="form-consent">
                  <label className="consent-label">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      required
                      disabled={isSubmitting}
                    />
                    <span className="consent-text">
                      אני מאשרת להצטרף לגלי ההשראה ולקבל עדכונים, כלים מעשיים ומסרים מעצימים.
                    </span>
                  </label>
                </div>

                <button 
                  type="submit" 
                  className="form-submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'מצטרפת...' : 'אני רוצה להצטרף לגלי ההשראה'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">הבית לנשים בגיל המעבר</h3>
            <p className="footer-description">
              המקום שלך לצמוח, להתחזק ולפרוח באמצע החיים ומֵעֵבֶר
            </p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h4>קישורים מהירים</h4>
              <Link href="/about">אודות</Link>
              <Link href="/articles">מאמרים</Link>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-social">
            <a 
              href="https://www.facebook.com/profile.php?id=61560682721423&locale=he_IL" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="עקוב אחרינו בפייסבוק"
            >
              <svg className="footer-social-icon" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a 
              href="https://www.instagram.com/inbal_daphna/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="עקוב אחרינו באינסטגרם"
            >
              <svg className="footer-social-icon" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
          <p>© 2025 הבית לנשים בגיל המעבר. כל הזכויות שמורות.</p>
          <Link href="/privacy-policy" className="privacy-policy-link">
            מדיניות פרטיות
          </Link>
        </div>
      </footer>
    </div>
  );
}
