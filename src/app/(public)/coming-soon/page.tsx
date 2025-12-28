'use client';

import { useState, FormEvent } from 'react';
import './coming-soon.css';

export default function ComingSoonPage() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [consent, setConsent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
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

  return (
    <div className="coming-soon-container">
      {/* Content */}
      <div className="coming-soon-content">
        {/* Hero Section */}
        <section className="coming-soon-hero">
          <h1 className="coming-soon-main-title">
            משהו גדול עומד לקרות. 🌸
          </h1>
          <h2 className="coming-soon-subtitle">
            את כבר לא צריכה לנחש מה עובר עלייך. בקרוב, כל הידע, המעקב והתמיכה שאת צריכה יחכו לך במקום אחד – מותאם אישית בדיוק בשבילך.
          </h2>
        </section>

        {/* Main Content Section */}
        <section className="coming-soon-main-content">
          <div className="content-box">
            <p className="content-text">
              אנחנו בונים עבורך את המרחב האישי של גיל המעבר, פלטפורמה חכמה שתעזור לך להחזיר את השליטה לידיים:
            </p>
            
            <div className="features-list">
              <div className="feature-item">
                <div className="feature-text-content">
                  <span className="feature-icon">💬</span>
                  <div className="feature-content">
                    <strong className="feature-title">עליזה מחכה לך:</strong>
                    <span className="feature-text">צ'אט AI אישי שזמין לכל שאלה, תהייה או סתם כשאת צריכה אוזן קשבת.</span>
                  </div>
                </div>
                <div className="feature-image-wrapper">
                  <img 
                    src="https://i.imghippo.com/files/kGzU7207Vs.jpg" 
                    alt="צ'אט עם עליזה" 
                    className="feature-image"
                  />
                  <p className="feature-image-caption">צ'אט עם עליזה - AI אישי שזמין 24/7</p>
                </div>
              </div>
              
              <div className="feature-item feature-item-reverse">
                <div className="feature-text-content">
                  <span className="feature-icon">📊</span>
                  <div className="feature-content">
                    <strong className="feature-title">לוח בקרה חכם:</strong>
                    <span className="feature-text">מעקב יומי אחר תסמינים, איכות שינה, גלי חום ומצבי רוח – כדי שתראי את התמונה המלאה.</span>
                  </div>
                </div>
                <div className="feature-image-wrapper">
                  <img 
                    src="https://i.imghippo.com/files/jZ2559hZE.jpg" 
                    alt="לוח בקרה חכם" 
                    className="feature-image"
                  />
                  <p className="feature-image-caption">לוח בקרה - מעקב יומי אחר תסמינים ומצבי רוח</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-text-content">
                  <span className="feature-icon">🔮</span>
                  <div className="feature-content">
                    <strong className="feature-title">תובנות מבוססות דאטה:</strong>
                    <span className="feature-text">ניתוח חכם שיגיד לך מה משפיע עלייך ואיך לשפר את ההרגשה.</span>
                  </div>
                </div>
                <div className="feature-image-wrapper">
                  <img 
                    src="https://i.imghippo.com/files/iQbH9121Ck.jpg" 
                    alt="תובנות מבוססות דאטה" 
                    className="feature-image"
                  />
                  <p className="feature-image-caption">תובנות עליזה - ניתוח חכם של הנתונים שלך</p>
                </div>
              </div>
              
              <div className="feature-item feature-item-reverse">
                <div className="feature-text-content">
                  <span className="feature-icon">🗺️</span>
                  <div className="feature-content">
                    <strong className="feature-title">מפת הדרכים המלאה:</strong>
                    <span className="feature-text">ליווי צעד אחר צעד, מהגוף הלוחש ועד לאיזון ולצמיחה.</span>
                  </div>
                </div>
                <div className="feature-image-wrapper">
                  <img 
                    src="https://i.imghippo.com/files/Fpch1126oF.jpg" 
                    alt="מפת הדרכים" 
                    className="feature-image"
                  />
                  <p className="feature-image-caption">מפת הדרכים - ליווי צעד אחר צעד בגיל המעבר</p>
                </div>
              </div>
            </div>
            
            {/* Additional Screenshots Section */}
            <div className="additional-screenshots">
              <div className="screenshot-item">
                <img 
                  src="https://i.imghippo.com/files/vpm9499ikk.jpg" 
                  alt="מסך נוסף מהמערכת" 
                  className="screenshot-image"
                />
                <p className="screenshot-caption">יומן אישי - מעקב יומי אחר התחושות והתסמינים</p>
              </div>
              <div className="screenshot-item">
                <img 
                  src="https://i.imghippo.com/files/lca9140Cr.jpg" 
                  alt="מסך נוסף מהמערכת" 
                  className="screenshot-image"
                />
                <p className="screenshot-caption">פרופיל אישי - ניהול המידע וההעדפות שלך</p>
              </div>
            </div>
          </div>
        </section>

        {/* Before Everyone Section */}
        <section className="coming-soon-before-section">
          <div className="content-box highlight-box">
            <h3 className="section-title">רגע לפני שכולן נכנסות...</h3>
            <p className="content-text">
              הפלטפורמה נמצאת כרגע בשלבי בנייה אחרונים. ממש עכשיו, קבוצת פיילוט נבחרת כבר מנסה, בודקת ועוזרת לנו לדייק את המערכת כדי שהיא תהיה מושלמת עבורך.
            </p>
            <p className="content-text">
              אנחנו עובדים במרץ כדי לפתוח את השערים לכולן בקרוב מאוד.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="coming-soon-cta-section">
          <div className="cta-content-box">
            <h3 className="cta-title">רוצה להיות הראשונה לדעת כשזה קורה?</h3>
            <p className="cta-text">
              הצטרפי עכשיו לקהילת "גלי השראה". שם אעדכן באופן אישי על התקדמות המערכת, אשלח טיפים בלעדיים ואודיע ברגע שההרשמה למנויות חדשות תיפתח.
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section className="coming-soon-form-section">
          <div className="form-container">
            <div className="form-wrapper">
              {isSubmitted ? (
                <div className="form-success">
                  <p className="success-icon">✨</p>
                  <h3>ברוכה הבאה לגלי ההשראה!</h3>
                  <p>תודה שהצטרפת. בקרוב תקבלי את הגל הראשון שלך.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="coming-soon-form">
                  {error && (
                    <div className="form-error">
                      {error}
                    </div>
                  )}

                  <div className="form-group">
                    <input
                      type="text"
                      id="firstName"
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
                      id="lastName"
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
                      id="email"
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
                    {isSubmitting ? 'מצטרפת...' : 'אני רוצה לקבל עדכון כשזה מוכן!'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

