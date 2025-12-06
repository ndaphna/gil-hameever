'use client';

import { useState, FormEvent } from 'react';
import './inspiration-waves.css';

export default function InspirationWavesPage() {
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
    <div className="inspiration-waves-container">
      {/* Hero Section */}
      <section className="inspiration-waves-hero">
        <div className="hero-content-wrapper">
          <p className="hero-badge">🌸 הצטרפי לגלי הַהשראה</p>
          <h1 className="hero-title">
            <span className="title-text">
              <span className="title-line">המקום שבו כל אישה בגיל המעבר</span>
              <span className="title-line">מרגישה פתאום:</span>
            </span>
          </h1>
          
          <div className="hero-quote">
            <p className="hero-quote-text">
              "זה בדיוק מה שהייתי צריכה עכשיו."
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="preview-content-section">
        <div className="preview-container">
          <div className="content-card">
            <p className="intro-text">
              ברוכה הבאה למרחב הקטן־גדול שבו אני שולחת אחת לשבוע (ולפעמים פעמיים, כשיש משהו חשוב באמת)
            </p>
            <p className="intro-text">
              גל של השראה, ידע, הומור ותמיכה אמיתית לנשים בגיל המעבר.
            </p>
            
            <p className="intro-text" style={{ marginTop: '30px' }}>
              אם את מרגישה לפעמים שאת לא מזהה את עצמך, מוצפת, עייפה, מבולבלת…
            </p>
            <p className="intro-text">
              או להיפך - מתעוררת, משתנה, מחפשת כיוונים חדשים ורוצה להרגיש מחוברת לעצמך
            </p>
            <p className="intro-text">
              המיילים של גלי השראה הם המקום שלך לעצור רגע, לנשום, ולהיזכר:
            </p>
            <p className="highlight-text-large" style={{ margin: '24px auto' }}>
              את לא לבד. ואת לא רק תעברי את זה, את תתחזקי, ותפרחי דווקא עכשיו.
            </p>
          </div>
        </div>
      </section>

      {/* What You'll Get Section */}
      <section className="preview-content-section bg-light">
        <div className="preview-container">
          <h2 className="section-title">בכל גל תקבלי:</h2>
          
          <div className="preview-grid">
            <div className="preview-card">
              <div className="preview-icon">💗</div>
              <h3 className="preview-title">מחשבות מהלב</h3>
              <p className="preview-description">
                מחשבות מהלב שמרגישות כאילו חברה טובה כתבה לך
              </p>
            </div>
            
            <div className="preview-card">
              <div className="preview-icon">🌙</div>
              <h3 className="preview-title">כלים קטנים</h3>
              <p className="preview-description">
                כלים קטנים שמשנים ימים עמוסים ולילות בלי שינה
              </p>
            </div>
            
            <div className="preview-card">
              <div className="preview-icon">📘</div>
              <h3 className="preview-title">הצצה לתכנים חדשים</h3>
              <p className="preview-description">
                הצצה לתכנים חדשים מהספר ומ"המפה למנופאוזית המתחילה"
              </p>
            </div>
            
            <div className="preview-card">
              <div className="preview-icon">😂</div>
              <h3 className="preview-title">משפטי עליזה שנקין</h3>
              <p className="preview-description">
                משפטי עליזה שנקין שיגרמו לך לחייך גם באמצע גל חום
              </p>
            </div>
            
            <div className="preview-card">
              <div className="preview-icon">🧭</div>
              <h3 className="preview-title">תובנות חשובות</h3>
              <p className="preview-description">
                תובנות שיעזרו לך לבחור נכון לעצמך בתקופה הזו
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Not Newsletter Section */}
      <section className="preview-content-section">
        <div className="preview-container">
          <div className="content-card highlight-box">
            <p className="intro-text" style={{ textAlign: 'center', fontSize: '1.3rem', lineHeight: '1.9', fontWeight: '600' }}>
              זה לא "ניוזלטר".
            </p>
            <p className="intro-text" style={{ textAlign: 'center', fontSize: '1.3rem', lineHeight: '1.9', fontWeight: '600' }}>
              זו תמיכה שבועית לנשמה.
            </p>
            <p className="intro-text" style={{ textAlign: 'center', fontSize: '1.3rem', lineHeight: '1.9', fontWeight: '600' }}>
              זו קהילה שמתחילה במייל - ונוגעת עמוק בלב.
            </p>
            <p className="highlight-text-large" style={{ margin: '30px auto', fontSize: '1.5rem' }}>
              ✨ מזמינה אותך להצטרף
            </p>
            <p className="intro-text" style={{ textAlign: 'center', fontSize: '1.2rem', lineHeight: '1.9' }}>
              ולהתחיל לקבל ממני גלים קטנים של כוח, השראה ושקט פנימי.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
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
              <form onSubmit={handleSubmit} className="inspiration-form">
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
                  {isSubmitting ? 'מצטרפת...' : 'אני רוצה להצטרף לגלי ההשראה'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

