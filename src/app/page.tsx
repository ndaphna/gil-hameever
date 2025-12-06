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
              המקום שלך לצמוח, להתחזק ולפרוח באמצע החיים ומעבר
            </p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h4>קישורים מהירים</h4>
              <Link href="/about">אודות</Link>
              <Link href="/hormones">הורמונים</Link>
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
